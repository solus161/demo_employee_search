from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
import asyncio
import logging

from employees.router import router as employees_router
from auth.router import router as auth_router
# from middleware.rate_limiter import RateLimiter
from exceptions import CustomException

logger = logging.getLogger(__name__)

app = FastAPI()

# Allow connection from frontend only
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
        '127.0.0.1:5173'],  # Specific origins only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Accept-Language",
        "Content-Language"]
)


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