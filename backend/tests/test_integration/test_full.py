import pytest

from auth.router import ROUTER_PREFIX as ROUTER_AUTH
from employees.router import ROUTER_PREFIX as ROUTER_EMPLOYEE

@pytest.mark.asyncio
@pytest.mark.integration
@pytest.mark.slow
async def test_full(
    async_test_client, async_session, setup_override_db,
    mock_db_users, mock_db_departments, mock_db_employees):
    _ = async_session
    _ = setup_override_db
    _ = mock_db_users
    _ = mock_db_departments
    _ = mock_db_employees

    # Create user
    response = await async_test_client.post(
        ROUTER_AUTH + '/create',
        data = {
            'username': 'solus161',
            'email': 'sol@gmail.com',
            'password': 'Minhh@m1',
            'department': 'Business Development'})
    assert response.status_code == 200

    # Login
    response = await async_test_client.post(
        ROUTER_AUTH + '/token',
        data = {'username': 'solus161', 'password': 'Minhh@m1'}
    )
    assert response.status_code == 200
    access_token = response.json()['access_token']
    
    # Search, using access token
    headers = {'Authorization': f'Bearer {access_token}'}
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
        ROUTER_EMPLOYEE + '/search',
        headers = headers,
        params = search_params
    )
    assert response.status_code == 200
    assert 'Kimmy' in response.json()['dataEmployee'][0]['first_name']

    # Login failed
    response = await async_test_client.post(
        ROUTER_AUTH + '/token',
        data = {'username': 'solus162', 'password': 'Minhh@m1'}
    )
    assert response.status_code == 404
    assert 'AUTH_1001' in response.json()['detail']
    # access_token = response.json()['access_token']