from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager
import asyncio
import logging

from employees.router import router as employees_router
from auth.router import router as auth_router
from middleware.rate_limiter import RateLimiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Starting up the application...")
    logging.info("Rate limiter deployed")
    task = asyncio.create_task(RateLimiter.sleep())
    yield
    task.cancel()

logger = logging.getLogger(__name__)

# app = FastAPI(lifespan = lifespan)
app = FastAPI()
app.include_router(employees_router)
app.include_router(auth_router)

if __name__ == '__main__':   
    uvicorn.run(app, host = 'localhost', port = 8000, access_log = False)