import pytest
from httpx import AsyncClient
# from fastapi.testclient import TestClient
# from httpx import ASGITransport, Asy
from backend.main import app

@pytest.mark.anyio
async def test_auth_valid(client: AsyncClient):
    response = await client.get(
        auth = ('user01', '1'),
        url = '/api/v1/login'
    )
    assert response.status_code == 200

@pytest.mark.anyio
async def test_auth_invalid(client: AsyncClient):
    response = await client.get(
        auth = ('user01', '2'),
        url = '/api/v1/login'
    )
    assert response.status_code == 401

@pytest.mark.anyio
async def test_unauthorized_access(client: AsyncClient):
    response = await client.get(
        auth = ('user03', '1'),
        url = '/api/v1/employees',
        params = {
            'search_str': 'immy Walczy',
            'location': 'Ohio',
            'page': 1,
            'company': 'Cleveland'
        })
    print(response.text)
    assert response.status_code == 403

@pytest.mark.anyio
async def test_authorized_access(client: AsyncClient):
    response = await client.get(
        url = '/api/v1/employees',
        auth = ('user01', '1'),
        params = {
            'search_str': 'immy Walczy',
            'location': 'Ohio',
            'page': 1,
            'company': 'Cleveland',
            'status_active': True,
            'status_not_started': False
        })
    assert response.status_code == 200
    assert len(response.json().get('data')) >= 1

@pytest.mark.anyio
async def test_dynamic_columns(client: AsyncClient):
    params = {
        'search_str': 'immy Walczy',
        'location': 'Ohio',
        'page': 1,
        'company': 'Cleveland',
        'status_active': True,
        'status_not_started': False}
    
    # user01, HR full access
    response1 = await client.get(
        url = '/api/v1/employees',
        auth = ('user01', '1'),
        params = params)
    assert response1.status_code == 200
    data = response1.json()
    for emp in [data['data'][0]]:
        assert 'location' in emp
        assert 'company' in emp
        assert 'department' in emp
        assert 'position' in emp
        assert 'status_active' in emp
        assert 'status_not_started' in emp
        assert 'status_terminated' in emp

    # user01, Sales limited access
    response2 = await client.get(
        auth = ('user02', '1'),
        url = '/api/v1/employees',
        params = params)
    assert response2.status_code == 200
    data = response2.json()
    for emp in [data['data'][0]]:
        assert 'status_active' not in emp
        assert 'status_not_started' not in emp
        assert 'status_terminated' not in emp