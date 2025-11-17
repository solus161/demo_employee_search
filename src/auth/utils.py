from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from auth.service import get_user_session
from middleware.rate_limiter import RateLimiter
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBasic()

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

async def authenticate(
    credentials: HTTPBasicCredentials = Depends(security),
    user_session = Depends(get_user_session)):
    """
    Authenticate user using HTTP Basic Auth. Could be replaced by OAuth2 or JWT.
    
    Args:
        credentials: Username and password from Authorization header
        
    Returns:
        Authenticated user dict
        
    Raises:
        HTTPException: 401 if credentials invalid
    """
    username = credentials.username
    password = credentials.password
    user = await user_session.get_user(username, password)
    if not user:
        raise InvalidCredentialsException
    return user

async def check_rate_limit(user = Depends(authenticate)):
    """
    Check if user has exceeded rate limit.
    
    Args:
        user: Authenticated user from authenticate()
        
    Returns:
        User dict if within limit
        
    Raises:
        HTTPException: 429 if rate limit exceeded
    """
    if not await RateLimiter.check_limit(user['username']):
        logger.warning(f"Rate limit exceeded for user: {user['username']}")
        raise TooManyRequestsException
    return user

async def get_department(user = Depends(check_rate_limit)):
    """
    Extract department from authenticated user.
    
    Args:
        user: Authenticated user
        
    Returns:
        User's department string
    """
    if 'department' not in user:
        return None
    return user.get('department')

async def get_authorized_schema(
        department: str = Depends(get_department),
        user_session = Depends(get_user_session)):
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
    
    output = await user_session.get_authorized_columns(department)
    if not output:
        logger.warning(f"No authorized columns for department: {department}")
        raise NoAccessException
    return output

