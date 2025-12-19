from fastapi import APIRouter, Depends, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession

from auth.schemas import Token, User, CreateUserForm
from auth.services import authenticate, create_access_token, create_user, get_all_departments
from database.database import get_db_session
# from middleware import global_rate_limiter

ROUTER_PREFIX = '/api/v1/user'
router = APIRouter(
    prefix = ROUTER_PREFIX, tags = ['Authentication'])

# @router.post('/create', status_code = status.HTTP_200_OK)
# async def create_user(data: Annotated[User, Form()], db_session = Depends(get_db_session)):
    # Check for duplicated username
    

@router.post('/token', status_code = status.HTTP_200_OK, response_model = Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db_session: AsyncSession = Depends(get_db_session)):
    """
    User logins using `username` and `password`.
    After successful login, an access token is granted to client
    """
    user = await authenticate(db_session, form_data.username, form_data.password)
    
    # Provice token
    token = create_access_token(data = {'sub': user.username})
    return Token(access_token = token, token_type = 'bearer')

def get_create_user_info(
    username: Annotated[str, Form()],
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    department: Annotated[str | None, Form()]
) -> CreateUserForm:
    return CreateUserForm(
        username = username, email = email,
        password = password, department = department)

@router.post('/create', status_code = status.HTTP_200_OK, response_model = None)
async def auth_create_user(
    form_data: Annotated[CreateUserForm, Depends(get_create_user_info)],
    db_session = Depends(get_db_session)):
    user = await create_user(
        db_session, **form_data.model_dump())
    
@router.get('/departments', status_code = status.HTTP_200_OK, response_model = None)
async def get_departments(db_session = Depends(get_db_session)):
    departments = await get_all_departments(db_session)
    return departments