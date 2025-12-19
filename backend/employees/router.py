from fastapi import APIRouter, Query, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
import traceback

from auth.services import get_current_user, is_within_rate_limit, get_authorized_columns
from auth.router import ROUTER_PREFIX as ROUTER_AUTH
from employees.models import Employee as EmployeeModel, build_query
from employees.schemas import EmployeeSearchQuery, PaginatedEmployeeResponse
from employees.services import get_employees
from database import get_db_session
from middleware import global_rate_limiter


ROUTER_PREFIX = '/api/v1/employee'
router = APIRouter(prefix = ROUTER_PREFIX, tags = ['Employees'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = ROUTER_AUTH + '/token')
PAGINATION_LIMIT = 50

async def auth_process(
    db_session: AsyncSession = Depends(get_db_session),
    token = Depends(oauth2_scheme)):
    user = await get_current_user(db_session, token)
    await is_within_rate_limit(global_rate_limiter, user.username)
    authorized_columns = await get_authorized_columns(db_session, user)
    return authorized_columns

@router.get(
    '/search', response_model = PaginatedEmployeeResponse,
    response_model_exclude_unset = True,
    status_code = status.HTTP_200_OK,
    description = "Search and filter employees with pagination")
async def search_employees(
    employee_search_params: Annotated[EmployeeSearchQuery, Query()],
    db_session: AsyncSession = Depends(get_db_session),     # Replace your own DB session here
    authorized_columns: List = Depends(auth_process)
):
    
    search_params = {
        'search_str': employee_search_params.search_str,
        'department': employee_search_params.department,
        'location': employee_search_params.location,
        'location_city': employee_search_params.location_city,
        'location_state': employee_search_params.location_state}
    
    employees, total_count, total_page = await get_employees(
        db_session, authorized_columns, search_params,
        employee_search_params.page, employee_search_params.page_size)
    
    return PaginatedEmployeeResponse(
        total_count = total_count,
        total_page = total_page,
        current_page = employee_search_params.page,
        page_size = employee_search_params.page_size,
        columns = authorized_columns,
        data_employee = employees
    )