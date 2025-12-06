import pytest
import pytest_asyncio
from sqlalchemy import StaticPool
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from auth.models import Base, User, Department
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