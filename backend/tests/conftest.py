import pytest
import pytest_asyncio
from sqlalchemy import StaticPool
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from auth.models import Base, User, Department
from auth.services import create_hashed_password
from employees.models import Employee

# Test database URL (in-memory SQLite for fast tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture(scope = 'function')
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
        await conn.run_sync(Base.metadata.create_all)
    print('Tables setup done')

    yield async_engine

    # Clean up
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await async_engine.dispose()

@pytest_asyncio.fixture(scope = 'function')
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

# Prepare some data to test
@pytest_asyncio.fixture(scope = 'function')
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

@pytest_asyncio.fixture(scope = 'function')
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
