from fastapi import APIRouter, Depends,  HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from auth.schemas import Token, User
from backend.auth.services import authenticate, create_access_token, get_user, is_valid_email
from database.database import get_db_session
from middleware.rate_limiter import RateLimiter

router = APIRouter(
    prefix="/api/v1/user", tags = ['Authentication'])

InvalidCredentialsException = HTTPException(
    status_code = status.HTTP_401_UNAUTHORIZED,
    detail = 'Invalid credentials',
    headers = {'WWW-Authenticate': 'Bearer'})

TooManyRequestsException = HTTPException(
    status_code = status.HTTP_429_TOO_MANY_REQUESTS,
    detail = f'Too many requests, the limit is {RateLimiter.limit} requests per {RateLimiter.period} seconds.')

NoAccessException = HTTPException(
    status_code = status.HTTP_403_FORBIDDEN,
    detail="Your department is not authorized for this resource")

# @router.post('/create', status_code = status.HTTP_200_OK)
# async def create_user(data: Annotated[User, Form()], db_session = Depends(get_db_session)):
    # Check for duplicated username
    

@router.post('/token', status_code = status.HTTP_200_OK)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db_session = Depends(get_db_session)):
    """
    User logins using `username` and `password`.
    After successful login, an access token is granted to client
    """
    user = authenticate(form_data.username, form_data.password, db_session)
    if user:
        # Provice token
        token = create_access_token(data = {'sub': user.username})
        return Token(access_token = token, token_type = 'bearer')