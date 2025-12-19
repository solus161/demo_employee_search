from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from passlib.context import CryptContext
from typing import List

from auth.models import User, Department
from middleware.rate_limiter import RateLimiter
from exceptions.users import *
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

# Setup cryptcontext
pwd_context = CryptContext(schemes = ['bcrypt'])

# Auth token configs
SECRET_KEY = 'the force is strong with this one'    # must be loaded from config
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE = 30                            # minutes
DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'

async def create_user(
    db_session,
    username: str, email: str, department: str | None, password: str,
    ) -> User:
    """
    To create a new `user` then insert into db

    Args:
    - `data`: a `dict` of new user info
    - `db_session`: a connection session managed by a db service

    Returns:
    - `user`

    Raises:
    - `CreateUserError` with detailed message

    """
    password = create_hashed_password(password)
    try:
        user = User(
            username = username,
            email = email,
            department = department,
            password = password
        )

        # First round of integrity check
        await is_valid_username(db_session, username)
        await is_valid_email(db_session, email)

        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        return user
    except (IntegrityError, SQLAlchemyError, Exception) as e:
        await db_session.rollback()
        raise CreateUserError(username, repr(e))

def create_access_token(
        data: dict, key: str = SECRET_KEY, algorithm: str = ALGORITHM,
        expire_min: int = ACCESS_TOKEN_EXPIRE) -> str:
    """
    To create an access token by encrypting a data

    Arg:
    - `data`: provided by the client, must have a `sub` key with value could be `username`
    - `key`: the secret key
    - `algorithm`: default `HS256`

    Returns:
    - `str` of encoded data
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes = expire_min)
    expire = datetime.strftime(expire, DATETIME_FORMAT)
    to_encode.update({'expire': expire})
    return jwt.encode(to_encode, key = key, algorithm = algorithm)

def decode_access_token(
    token: str, secret_key: str = SECRET_KEY, algorithm: str = ALGORITHM) -> str:
    """
    To decode an access token and get value of `sub` key

    Args:
    - `token`: string of token provided

    Returns:
    - `username` value of `sub` key

    Raises:
    - `ExpireTokenError`
    - `InvalidTokenError`
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms = [algorithm])
        username = payload.get('sub')     # one of the practices
        if username is not None:
            expire_datetime = payload.get('expire')
            expire_datetime = datetime.strptime(expire_datetime, DATETIME_FORMAT)
            expire_datetime = expire_datetime.replace(tzinfo = timezone.utc)
            datetime_now = datetime.now(timezone.utc)

            if datetime_now > expire_datetime:
                raise ExpiredTokenError
            
            return username
        raise InvalidTokenError
    except JWTError:
        raise InvalidTokenError

def create_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    if pwd_context.verify(secret = password, hash = hashed_password):
        return True
    raise WrongPasswordError

async def get_user(db_session, username: str) -> User:
    """
    Get user from db based on `username`

    Args:
        - `username` of the entity being searched
        - `db_session`: a session managed by an db service
    
    Returns:
        - `User` object
    
    Raises:
        - Raise UserNotFoundError if user does not exists
    """
    query = select(User).where(User.username == username)
    user = await db_session.execute(query)
    user = user.scalars().first()
    if user is not None:
        return user
    raise UserNotFoundError

async def is_valid_username(db_session, username: str) -> bool:
    """
    To check whether an username is already created.
    This serves as the first integrity projection, before the db's method
    """
    query = select(User).where(User.username == username)
    user = await db_session.execute(query)
    user = user.scalars().first()
    
    if user is not None:
        raise UsernameExistsError(username)
    return True

async def is_valid_email(db_session, email: str) -> bool:
    """
    To check whether email is already taken
    This serves as the first integrity projection, before the db's method
    """
    query = select(User).where(User.email == email)
    user = await db_session.execute(query)
    user = user.scalars().first()
    if user is not None:
        raise EmailExistsError(email)
    return True

async def authenticate(db_session, username: str, password: str) -> User:
    """
    To check whether the user is in db and the password is right

    Args:
    - `db_session`: database session object, must be async
    - `username`:
    - `password`

    Returns:
    - `User` object

    Raises:
    - Handled by services functions
    """
    
    user: User = await get_user(db_session, username)
    if verify_password(password, user.password):
        return user

async def get_current_user(db_session, token: str) -> User:
    """
    Return current active user extract from token

    Args:
    - `db_session`
    - `token`, dependency handled by router, for FastAPi is `oauth2_scheme`
    """
    username = decode_access_token(token)
    user = await get_user(db_session, username)
    return user
        
async def is_within_rate_limit(rate_limiter: RateLimiter, username: str):
    """
    Check if user has exceeded rate limit.
    
    Args:
        user: Authenticated user from authenticate()
        
    Returns:
        User dict if within limit
        
    Raises:
        HTTPException: 429 if rate limit exceeded
    """
    return rate_limiter.is_within_limit(username)

async def get_department(db_session, user: User) -> Department:
    """
    Extract department from authenticated user.
    
    Args:
        user: Authenticated user
        
    Returns:
        User's department string
    """
    if user.department is None or user.department == '':
        raise NoDepartmentError
    
    query = select(Department).where(Department.name == user.department)
    department = await db_session.execute(query)
    department = department.scalars().first()
    if department is None:
        raise NoDepartmentError

    return department

async def get_authorized_columns(db_session, user: User) -> List[str]:
    """
    Get authorized columns based on user's department.
    
    HR department: Full access to all columns
    Sales department: Limited to location, company, department
    
    Args:
        department: User's department
        
    Returns:
        List of authorized columns for this department
        
    Raises:
        HTTPException: 403 if department not authorized
    """
    
    department = await get_department(db_session, user)

    if department.authorized_columns is None or department.authorized_columns == '':
        raise NoAccessError
    
    return department.authorized_columns.split(',')

async def get_all_departments(db_session) -> List[str]:
    """
    Get all departments from db
    
    Args:
        db_session: database session object, must be async
        
    Returns:
        List of department names
    """

    # Sr for the raw query, this is bad practice
    query = text('select distinct department from tbl_employee order by department asc')
    result = await db_session.execute(query)
    departments = result.scalars().all()
    return departments