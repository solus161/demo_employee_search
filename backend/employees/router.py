from fastapi import APIRouter, Query, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
import traceback

from auth.services import get_current_user, get_authorized_columns
from auth.router import ROUTER_PREFIX as ROUTER_AUTH
from employees.models import Employee as EmployeeModel, build_query
from employees.schemas import PaginatedEmployeeResponse
from employees.services import get_employees
from database import get_db_session


ROUTER_PREFIX = '/api/v1/employee'
router = APIRouter(prefix = ROUTER_PREFIX, tags = ['Employees'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = ROUTER_AUTH + '/token')
PAGINATION_LIMIT = 50

async def auth_process(
    db_session: AsyncSession = Depends(get_db_session),
    token = Depends(oauth2_scheme)):
    user = await get_current_user(db_session, token)
    authorized_columns = await get_authorized_columns(db_session, user)
    return authorized_columns

@router.get(
    '/search', response_model = PaginatedEmployeeResponse,
    response_model_exclude_unset = True,
    status_code = status.HTTP_200_OK,
    description = "Search and filter employees with pagination")
async def search_employees(
    search_str: str,
    department: Optional[str] = Query(None),
    location_city: Optional[str] = Query(None),
    location_state: Optional[str] = Query(None),
    page_size: int = Query(),
    page: int = Query(1, ge = 1),
    db_session: AsyncSession = Depends(get_db_session),     # Replace your own DB session here
    authorized_columns: List = Depends(auth_process)
):
    
    search_params = {
        'search_str': search_str,
        'department': department,
        'location_city': location_city,
        'location_state': location_state}

    employees, total_count, total_page = await get_employees(
        db_session, authorized_columns, search_params, page, page_size)

    return PaginatedEmployeeResponse(
        totalCount = total_count,
        totalPage = total_page,
        page = page,
        pageSize = page_size,
        columns = authorized_columns,
        dataEmployee = employees
    )