from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Employee as EmployeeModel, build_query
from .schemas import Employee as EmployeeSchema
from typing import List
import re

def mask_columns(employee: EmployeeModel, authorized_columns: list) -> EmployeeSchema:
    # EmployeeModel must match db
    employee_schema = EmployeeSchema.model_validate(employee)
    masked_attr_list = []
    for k, v in employee_schema.model_dump().items():
        if k not in authorized_columns:
            masked_attr_list.append(k)
    
    for k in masked_attr_list:
        setattr(employee_schema, k, None)
    return employee_schema


async def get_employees(
    db_session, authorized_columns: list, search_params: dict, page: int, page_size: int) -> List[EmployeeSchema]:
    # Replace extra spaces in search_str
    search_params['search_str'] = re.sub('\\s+', ' ', search_params['search_str'])
    
    query = build_query(authorized_columns, search_params)
    query_count = select(func.count()).select_from(query.subquery())

    # Get total count for pagination
    total_count = await db_session.execute(query_count)
    total_count = total_count.scalar()
    total_page = total_count // page_size + 1
    
    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    # Query
    employees = await db_session.execute(query)
    employees = employees.scalars().all()
    
    # Mask
    output = []
    for employee in employees:
        output.append(mask_columns(employee, authorized_columns))
    
    return output, total_count, total_page

async def get_filter_options(db_session: AsyncSession):
    # These raw queries are not good
    query_template = 'select distinct {} from tbl_employee order by {} asc'

    columns = ['department', 'location', 'location_city', 'location_state']
    output = {}
    for col in columns:
        query = text(query_template.format(col, col))
        query_results = await db_session.execute(query)
        query_results = query_results.scalars().all()
        output[col] = query_results
    return output