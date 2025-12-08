from httpx import AsyncClient, ASGITransport
import pytest
import pytest_asyncio
from logging import getLogger

# from auth.models import User, Department
from main import app
from employees.router import ROUTER_PREFIX, auth_process
from exceptions.users import *
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
async def setup_override_auth_process():
    async def override_auth_process():
        return ['id','first_name','last_name','birthdate','gender',
            'race','department','jobtitle','location','hire_date','termdate']
    app.dependency_overrides[auth_process] = override_auth_process
    yield
    print('Override cleared')
    app.dependency_overrides.clear()

@pytest_asyncio.fixture(scope = 'function')
async def async_test_client():
    async with AsyncClient(
        transport = ASGITransport(app = app), base_url = 'http://test') as test_client:
        yield test_client

@pytest.mark.asyncio
async def test_search_employee(
    setup_override_db, async_test_client, mock_db_employees, setup_override_auth_process):
    _ = setup_override_db
    _ = mock_db_employees
    _ = setup_override_auth_process

    search_params = {
        'search_str': 'kimmy   walczynski',
        'department': 'Engineering',
        'location': 'Headquarters',
        'location_city': 'Cleveland',
        'location_state': 'Ohio',
        'page_size': 10,
        'page': 1
    }
    response = await async_test_client.get(
        ROUTER_PREFIX + '/search', 
        params = search_params)
    assert response.status_code == 200
    assert 'Kimmy' in response.json()['dataEmployee'][0]['first_name']