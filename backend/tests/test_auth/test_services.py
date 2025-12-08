import pytest
import pytest_asyncio
import asyncio
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession

# from auth.models import User, Department
from auth.services import *
from exceptions.users import *
from middleware.rate_limiter import RateLimiter

@pytest.mark.asyncio
async def test_create_user(async_session):
    """
    To test `auth.service.create_user`
    """
    try:
        user04 = await create_user(
            username = 'user04',
            email = 'user04@gmail.com',
            department = 'Headquarters',
            password = 'Minhh@m1',
            db_session = async_session
        )
        
        user05 = await create_user(
            username = 'user05',
            email = 'user05@gmail.com',
            department = 'None',
            password = 'Minhh@m1',
            db_session = async_session
        )

        assert user04 is not None
        assert user05 is not None
    finally:
        await async_session.delete(user04)
        await async_session.delete(user05)
        await async_session.commit()

@pytest.mark.asyncio
async def test_create_user_exception(async_session, mock_db_users):
    """
    Test for exceptions raised by `create_user`
    """
    _ = mock_db_users

    # user with duplicated username
    with pytest.raises(CreateUserError) as exc_info:  # ← Changed to CreateUserError
        user05 = await create_user(
            username = 'user01',  # Same username as user01
            email = 'user05@gmail.com',
            department = None,
            password = 'Minhh@m1',
            db_session = async_session
        )

    # Assert after the with block
    assert exc_info.value.status_code == 500
    assert 'user01' in exc_info.value.message
    
    # for user in users:
    #     print(user)
    with pytest.raises(CreateUserError) as exc_info:
        user06 = await create_user(
            username = 'user06',
            email = 'user02@gmail.com',  # Same email as user02
            department = None,
            password = 'Minhh@m1',
            db_session = async_session
        )

    # Assert after the with block
    assert exc_info.value.status_code == 500
    assert 'user06' in exc_info.value.message

@pytest.mark.asyncio
async def test_create_decode_access_token():
    data = {'sub': 'user01'}
    secret_key = 'helloo there'

    # Valid access token
    access_token = create_access_token(data, secret_key, 'HS256', 30)
    username = decode_access_token(access_token, secret_key, 'HS256')
    assert username == 'user01'

    # No username found in token
    access_token = create_access_token({'sub1': None}, secret_key, 'HS256', 30)
    with pytest.raises(InvalidTokenError) as exc_info:
        username = decode_access_token(access_token, secret_key, 'HS256')
    assert exc_info.value.status_code == 401

    # Expired token error
    access_token = create_access_token(data, secret_key, 'HS256', -1)
    with pytest.raises(ExpiredTokenError) as exc_info:
        username = decode_access_token(access_token, secret_key, 'HS256')
    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_create_verify_password():
    password = 'Minhh@am1'
    hashed_password = create_hashed_password(password)
    assert verify_password(password, hashed_password)

    # Test for wrong password
    with pytest.raises(WrongPasswordError) as exc_info:
        verify_password('1', hashed_password)
    
    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_user(async_session, mock_db_users):
    """
    Test that mock_db_users fixture inserted users into database
    NOTE: Adding mock_db_users parameter will trigger the fixture!
    """
    _ = mock_db_users  # This fixture seeds the database, no return value needed

    # Found user
    user = await get_user(async_session, 'user01')
    assert user is not None

    # No user found exception
    with pytest.raises(UserNotFoundError) as exc_info:
        user = await get_user(async_session, 'user04')
    assert exc_info.value.status_code == 404

@pytest.mark.asyncio
async def test_is_valid_username(async_session, mock_db_users):
    """
    The function must raise exception when provided an existing username
    """
    _ = mock_db_users
    with pytest.raises(UsernameExistsError) as exc_info:
        await is_valid_username(async_session, 'user01')
    
    assert exc_info.value.status_code == 500

@pytest.mark.asyncio
async def test_is_valid_email(async_session, mock_db_users):
    _ = mock_db_users
    with pytest.raises(EmailExistsError) as exc_info:
        await is_valid_email(async_session, 'user01@gmail.com')
    
    assert exc_info.value.status_code == 500

@pytest.mark.asyncio
async def test_authenticate(async_session, mock_db_users):
    _ = mock_db_users
    user = await authenticate(async_session, 'user01', 'Minhh@m1')
    assert user is not None
    assert user.username == 'user01'

    # No need for exception testing as theses must be cover by:
    # - `test_create_verify_password`
    # - `test_get_user`

@pytest.mark.asyncio
async def test_get_current_user(async_session, mock_db_users):
    _ = mock_db_users
    
    # Create an access token for user01
    access_token = create_access_token({'sub': 'user01'})

    user = await get_current_user(async_session, access_token)
    assert user.username == 'user01'


# For testing rate limiter
@pytest_asyncio.fixture(scope = 'function')
def rate_limiter():
    # A rate limiter with period of 1 and request limit of 1
    rate_limiter = RateLimiter(1, 1)
    yield rate_limiter

@pytest.mark.asyncio
async def test_is_within_rate_limite(rate_limiter):
    # First request, reaches limit of 1, not exception
    await is_within_rate_limit(rate_limiter, 'user01')

    print(rate_limiter.users)
    # Second request, limit exceeded
    with pytest.raises(RequestLimitError) as exc_info:
        await is_within_rate_limit(rate_limiter, 'user01')
    
    assert exc_info.value.status_code == 429

    # Sleep 2 secs, then call request again
    await asyncio.sleep(2)
    assert await is_within_rate_limit(rate_limiter, 'user01')

@pytest.mark.asyncio
async def test_get_department(async_session, mock_db_users, mock_db_departments):
    _ = mock_db_users
    _ = mock_db_departments
    
    # An user with assigned department
    user = await get_user(async_session, 'user01')
    department = await get_department(async_session, user)
    assert department.name == 'Headquarters'

    # An user with no deparment
    user = await get_user(async_session, 'user03a')
    with pytest.raises(NoDepartmentError) as exc_info:
        department = await get_department(async_session, user)

    assert exc_info.value.status_code == 401

    # An user with nondeclared deparment, Sales
    user = await get_user(async_session, 'user03b')
    with pytest.raises(NoDepartmentError) as exc_info:
        department = await get_department(async_session, user)

    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_authorized_columns(async_session, mock_db_users, mock_db_departments):
    _ = mock_db_users
    _ = mock_db_departments

    # An user with access
    user01 = await get_user(async_session, 'user01')
    authorized_columns = await get_authorized_columns(async_session, user01)
    assert len(authorized_columns)

    # An user with no access
    user03 = await get_user(async_session, 'user03')
    with pytest.raises(NoAccessError) as exc_info:
        authorized_columns = await get_authorized_columns(async_session, user03)
    assert exc_info.value.status_code == 403