"""
Fixtures for seeding test database with mock data
"""
import pytest
import pytest_asyncio
from auth.models import User, Department
from auth.services import create_hashed_password


@pytest_asyncio.fixture
async def seed_users(async_session):
    """Insert mock users into test database"""
    users = [
        User(
            username="testuser1",
            email="user1@example.com",
            password=create_hashed_password("Password123!"),
            department="HR"
        ),
        User(
            username="testuser2",
            email="user2@example.com",
            password=create_hashed_password("Password456!"),
            department="Sales"
        ),
        User(
            username="admin",
            email="admin@example.com",
            password=create_hashed_password("Admin123!"),
            department="IT"
        ),
    ]

    for user in users:
        async_session.add(user)

    await async_session.commit()

    # Refresh to get IDs
    for user in users:
        await async_session.refresh(user)

    return users


@pytest_asyncio.fixture
async def seed_departments(async_session):
    """Insert mock departments into test database"""
    departments = [
        Department(
            name="HR",
            authorized_columns="*"  # Full access
        ),
        Department(
            name="Sales",
            authorized_columns="name,department,location"  # Limited access
        ),
        Department(
            name="IT",
            authorized_columns="*"
        ),
    ]

    for dept in departments:
        async_session.add(dept)

    await async_session.commit()

    for dept in departments:
        await async_session.refresh(dept)

    return departments


@pytest_asyncio.fixture
async def seed_all_data(seed_departments, seed_users):
    """
    Seed both departments and users
    Dependencies are automatically resolved by pytest
    """
    return {
        "departments": seed_departments,
        "users": seed_users
    }
