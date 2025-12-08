from fastapi.security import OAuth2PasswordRequestForm
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
import pytest
import pytest_asyncio
import asyncio
from sqlalchemy import StaticPool, select
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession, create_async_engine
from unittest.mock import MagicMock
from logging import getLogger

# from auth.models import User, Department
from main import app
from auth.models import Base as AuthBase, User, Department
from auth.services import create_hashed_password
from employees.models import Base as EmployeeBase, Employee
from employees.router import ROUTER_PREFIX, auth_process
from exceptions.users import *
from middleware.rate_limiter import RateLimiter
from database import get_db_session

logger = getLogger(__name__)

# Test database URL (in-memory SQLite for fast tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture(scope = 'module')
async def async_engine():
    """
    Create an async engine for in-memory sqlite db.
    By default, when using an in-memory db, sqlite set `check_same_thread` to `True`
    meaning thread A cannot use connection created by thread B.
    This is not needed as we are doing async test.
    https://docs.sqlalchemy.org/en/20/dialects/sqlite.html
    """
    async_engine = create_async_engine(
        url = TEST_DATABASE_URL,
        echo = False,                                   # No log executed SQL
        poolclass = StaticPool,                         # A pool of one connection, save resources
        connect_args = {'check_same_thread': False}     
    )

    # Setup tables
    async with async_engine.begin() as conn:
        await conn.run_sync(AuthBase.metadata.create_all)
        await conn.run_sync(EmployeeBase.metadata.create_all)
    print('Tables setup done')

    yield async_engine

    # Clean up
    async with async_engine.begin() as conn:
        await conn.run_sync(AuthBase.metadata.drop_all)
        await conn.run_sync(EmployeeBase.metadata.drop_all)
    
    await async_engine.dispose()

@pytest_asyncio.fixture(scope = 'module')
async def async_session(async_engine):
    """
    Create an sqlaslchemy async session maker
    """
    async_session_maker = async_sessionmaker(
        bind = async_engine,
        class_ = AsyncSession,
        expire_on_commit = False,   # Maintain object after commit, avoid reselect query
    )

    async with async_session_maker() as async_session:
        yield async_session
        await async_session.rollback()


@pytest_asyncio.fixture(scope = 'module')
async def setup_override_db(async_session):
    async def override_get_db_session():
        yield async_session
    app.dependency_overrides[get_db_session] = override_get_db_session
    yield
    print('Override cleared')
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope = 'module')
async def async_test_client():
    async with AsyncClient(
        transport = ASGITransport(app = app), base_url = 'http://test') as test_client:
        yield test_client

# Prepare some data to test
@pytest_asyncio.fixture(scope = 'module')
async def mock_db_users(async_session):
    """
    Add some mock db user for testing
    """
    users = [
        User(
          username = 'user01',
          email = 'user01@gmail.com',
          department = 'Headquarters',
          password = create_hashed_password('Minhh@m1')
        ),
        User(
          username = 'user02',
          email = 'user02@gmail.com',
          department = 'Business Development',
          password = create_hashed_password('Minhh@m1')
        ),
        User(
          username = 'user03',
          email = 'user03@gmail.com',
          department = 'IT',
          password = create_hashed_password('Minhh@m1')
        ),
        User(
          username = 'user03a',
          email = 'user03a@gmail.com',
          department = None,
          password = create_hashed_password('Minhh@m1')
        ),
        User(
          username = 'user03b',
          email = 'user03b@gmail.com',
          department = 'Sales',
          password = create_hashed_password('Minhh@m1')
        )
    ]

    # Insert users
    for user in users:
        async_session.add(user)
    await async_session.commit()

    # Refresh
    for user in users:
        await async_session.refresh(user)

    # No cleanup needed - parent async_session fixture handles rollback

@pytest_asyncio.fixture(scope = 'module')
async def mock_db_departments(async_session):
    """
    Add some mock departments
    """
    departments = [
        Department(
            name = 'Headquarters',
            authorized_columns = 'id,first_name,last_name,birthdate,gender,race,department,jobtitle,location,hire_date,termdate,location_city,location_state'
        ),
        Department(
            name = 'Business Development',
            authorized_columns = 'id,first_name,last_name,birthdate,gender,race,department,jobtitle'
        ),
        Department(
            name = 'IT',
            authorized_columns = None
        )
    ]

    for department in departments:
        async_session.add(department)  # add() is NOT async
    await async_session.commit()  # commit() IS async - need await!

    for department in departments:
        await async_session.refresh(department)  # refresh() IS async - need await!

@pytest_asyncio.fixture(scope = 'module')
async def mock_db_employees(async_session):
    """
    Add some mock db employee for testing
    """
    columns = [
        'id','first_name','last_name','birthdate','gender',
        'race','department','jobtitle','location','hire_date','termdate',
        'location_city','location_state']
    data_raw = [
        '00-0037846,Kimmy,Walczynski,6/4/1991,Male,Hispanic or Latino,Engineering,Programmer Analyst I,Headquarters,1/20/2002,,Cleveland,Ohio',
        '00-0041533,Ignatius,Springett,6/29/1984,Male,White,Business Development,Business Analyst,Headquarters,4/8/2019,,Cleveland,Ohio',
        '00-0045747,Corbie,Bittlestone,7/29/1989,Male,Black or African American,Sales,Solutions Engineer Manager,Headquarters,10/12/2010,,Cleveland,Ohio',
        '00-0055274,Baxy,Matton,9/14/1982,Female,White,Services,Service Tech,Headquarters,4/10/2005,,Cleveland,Ohio',
        '00-0076100,Terrell,Suff,4/11/1994,Female,Two or More Races,Product Management,Business Analyst,Remote,9/29/2010,2029-10-29 06:09:38 UTC,Flint,Michigan']
    
    for i in data_raw:
        data = [(k, v) for k, v in zip(columns, i.split(','))]
        employee_dict = {}
        for j in data:
            employee_dict[j[0]] = j[1]
        async_session.add(Employee(**employee_dict))
    await async_session.commit()

    query = select(Employee).where(Employee.first_name == 'Kimmy')
    e = await async_session.execute(query)
    e = e.scalars().first()