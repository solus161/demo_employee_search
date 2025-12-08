from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager
import asyncio
import logging

from employees.router import router as employees_router
from auth.router import router as auth_router
from middleware.rate_limiter import RateLimiter
from exceptions import CustomException

logger = logging.getLogger(__name__)

app = FastAPI()

@app.exception_handler(CustomException)
async def business_exception_handler(request: Request, exc: CustomException):
    logger.error(exc)
    return JSONResponse(
        status_code = exc.status_code,
        content = {'detail': exc.message}
    )

# app = FastAPI()
app.include_router(employees_router)
app.include_router(auth_router)

if __name__ == '__main__':   
    uvicorn.run(app, host = 'localhost', port = 8000, access_log = False)