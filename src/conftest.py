import pytest
import pytest_asyncio
import asyncio
from httpx import AsyncClient, ASGITransport
# from fastapi.testclient import TestClient
import src.main as main_module
# from src.main import app

@pytest.fixture(scope = "session")
def anyio_backend():
    # Test session using asyncio only, no Trio
    return "asyncio"

@pytest.fixture(scope = 'session')
async def client():
    # Setup an async client for the whole test session
    async with AsyncClient(
        transport = ASGITransport(app = main_module.app), base_url= 'http://test'
    ) as client:
        yield client