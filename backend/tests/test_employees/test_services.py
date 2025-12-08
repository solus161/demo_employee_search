import pytest
import pytest_asyncio

# from auth.models import User, Department
from employees.models import Employee as EmployeeModel
from employees.schemas import Employee as EmployeeSchema
from employees.services import *
from exceptions.employees import *

@pytest.mark.asyncio
async def test_mask_columns():
    employee = EmployeeModel(
        id = '00',
        first_name = 'Obiwan',
        last_name = 'Kenobi',
        jobtitle = 'Jedi Master'
    )
    authorized_columns = ['id', 'first_name', 'last_name']
    employee_schema = mask_columns(employee, authorized_columns)
    assert employee_schema.jobtitle is None

@pytest.mark.asyncio
async def test_get_employees(async_session, mock_db_employees):
    _ = mock_db_employees

    # Found employee
    search_params = {
        'search_str': 'kimmy   walczynski',
        'department': 'Engineering',
        'location': 'Headquarters',
        'location_city': 'Cleveland',
        'location_state': 'Ohio'
    }

    authorized_columns = ['id', 'first_name', 'last_name', 'department', 'location', 'location_state']
    employees, total_count, total_page = await get_employees(
        async_session, authorized_columns, search_params, 1, 10)
    assert len(employees)
    assert employees[0].first_name == 'Kimmy'
    assert total_count == 1
    assert total_page == 1
    
    # Assert mask
    assert employees[0].location_city is None
