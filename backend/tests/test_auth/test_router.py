from fastapi.security import OAuth2PasswordRequestForm
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
import pytest
import pytest_asyncio
import asyncio
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from unittest.mock import MagicMock
from logging import getLogger

# from auth.models import User, Department
from main import app
from auth.router import ROUTER_PREFIX
from auth.services import *
from exceptions.users import *
from middleware.rate_limiter import RateLimiter
from database import get_db_session

logger = getLogger(__name__)

@pytest_asyncio.fixture(scope = 'function')
async def setup_override_db(async_session):
    async def override_get_db_session():
        yield async_session
    app.dependency_overrides[get_db_session] = override_get_db_session
    yield
    print('Override cleared')
    app.dependency_overrides.clear()

@pytest_asyncio.fixture(scope = 'function')
async def async_test_client():
    async with AsyncClient(
        transport = ASGITransport(app = app), base_url = 'http://test') as test_client:
        yield test_client

@pytest.mark.asyncio
async def test_login(async_test_client, mock_db_users, setup_override_db):
    _ = mock_db_users
    _ = setup_override_db

    ## Normaly the override goes there, but moved to fixture
    # async def override_get_db_session():
    #     yield async_session
    # app.dependency_overrides[get_db_session] = override_get_db_session

    response = await async_test_client.post(
        ROUTER_PREFIX + '/token', 
        data = {'username': 'user01', 'password': 'Minhh@m1'})
    assert response.status_code == 200
    assert 'access_token' in response.json()

    # Failed login
    response = await async_test_client.post(
        ROUTER_PREFIX + '/token', 
        data = {'username': 'user01', 'password': 'Minhh@m123'})
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_create_user(async_test_client, mock_db_users, setup_override_db):
    _ = mock_db_users
    _ = setup_override_db

    # Successfully create user
    response = await async_test_client.post(
        ROUTER_PREFIX + '/create',
        data = {
            'username': 'user04',
            'email': 'user04@gmail.com',
            'password': 'Minhh@m1',
            'department': None})
    assert response.status_code == 200

    # Error: duplicated username
    response = await async_test_client.post(
        ROUTER_PREFIX + '/create',
        data = {
            'username': 'user04',
            'email': 'user04@gmail.com',
            'password': 'Minhh@m1',
            'department': None})
    # assert exc_info.value.status_code == 500
    assert response.status_code == 500
    assert 'user04' in response.json()['detail']

    # Error duplicated email
    response = await async_test_client.post(
        ROUTER_PREFIX + '/create',
        data = {
            'username': 'user05',
            'email': 'user04@gmail.com',
            'password': 'Minhh@m1',
            'department': None})
    # assert exc_info.value.status_code == 500
    assert response.status_code == 500
    assert 'user04@gmail.com' in response.json()['detail']
