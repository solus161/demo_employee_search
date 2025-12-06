"""
Auth-specific pytest fixtures
"""
import pytest
import pytest_asyncio
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, MagicMock

from auth.models import User, Department
from employees.models import Employee
from auth.services import create_hashed_password


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
