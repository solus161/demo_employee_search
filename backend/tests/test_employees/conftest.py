"""
Auth-specific pytest fixtures
"""
import pytest
import pytest_asyncio
import pandas as pd

import pytest
import pytest_asyncio
from sqlalchemy import StaticPool, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from employees.models import Base, Employee as EmployeeModel

# Test database URL (in-memory SQLite for fast tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture(scope = 'package')
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

@pytest_asyncio.fixture(scope = 'package')
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
@pytest_asyncio.fixture(scope = 'package')
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
        async_session.add(EmployeeModel(**employee_dict))
    await async_session.commit()

    # query = select(EmployeeModel).where(EmployeeModel.first_name == 'Kimmy')
    # e = await async_session.execute(query)
    # e = e.scalars().first()
    