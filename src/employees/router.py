from fastapi import APIRouter, Query, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
import time
import traceback

from employees.models import Employee as EmployeeModel, build_query
from employees.schemas import PaginatedEmployeeResponse
from database.database import get_db_session
from auth.utils import get_authorized_schema

router = APIRouter(prefix = '/api/v1', tags = ['Employees'])
PAGINATION_LIMIT = 50

@router.get(
    '/employees', response_model = PaginatedEmployeeResponse,
    response_model_exclude_unset = True,
    status_code=status.HTTP_200_OK,
    description="Search and filter employees with pagination")
async def get_employees(
    search_str: str,
    location: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    status_active: Optional[bool] = Query(None),
    status_not_started: Optional[bool] = Query(None),
    status_terminated: Optional[bool] = Query(None),
    page: int = Query(1, ge = 1),
    db_session: AsyncSession = Depends(get_db_session),     # Replace your own DB session here
    authorized_columns = Depends(get_authorized_schema)     # Done after authentication
    # return_schema = Depends(get_authorized_schema)
):
    """
    Search employees with optional filters.
    
    - **search_str**: Required name search (1-100 chars)
    - **location**: Optional location filter
    - **company**: Optional company filter
    - **department**: Optional department filter
    - **position**: Optional position filter
    - **page**: Page number (default 1)
    - **page_size**: Items per page (1-100, default 50)
    
    Returns paginated employee list with total count.
    """
    try:    
        search_params = {
            'search_str': search_str,
            'location': location,
            'company': company,
            'department': department,
            'position': position,
            'status_active': status_active,
            'status_not_started': status_not_started,
            'status_terminated': status_terminated}

        # Build and count query
        query = build_query(EmployeeModel, authorized_columns, search_params)
        query_count = select(func.count()).select_from(query.subquery())

        # Get total count for pagination
        total_count = await db_session.execute(query_count)
        total_count = total_count.scalar()
        
        # Apply pagination
        offset = (page - 1) * PAGINATION_LIMIT
        query = query.offset(offset).limit(PAGINATION_LIMIT)
        
        # Execute and extract ORM objects
        employees = await db_session.execute(query)
        employees = employees.all()

        return PaginatedEmployeeResponse(
            total = total_count,
            page = page,
            page_size = PAGINATION_LIMIT,
            data = employees
        )
    except Exception as e:
        print(traceback.print_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Internal error'
        )