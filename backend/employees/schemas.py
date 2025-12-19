from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List

class EmployeeSearchQuery(BaseModel):
    search_str: str = Field(validation_alias = 'searchStr')
    department: str = Field(validation_alias = 'department')
    location: str = Field(validation_alias = 'location')
    location_city: str = Field(validation_alias = 'locationCity')
    location_state: str = Field(validation_alias = 'locationState')
    page_size: int = Field(validation_alias = 'pageSize')
    page: int = Field(validation_alias = 'currentPage')

class Employee(BaseModel):
    # Field set to optional could be ommited
    # by using response_model_exclude_unset = True in route decorator
    id: str
    first_name: str
    last_name: str
    birthdate: Optional[str] = None
    gender: Optional[str] = None
    race: Optional[str] = None
    department: Optional[str] = None
    jobtitle: Optional[str] = None
    location: Optional[str] = None
    hire_date: Optional[str] = None
    termdate: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None

    model_config = ConfigDict(from_attributes = True)

class PaginatedEmployeeResponse(BaseModel):
    total_count: int = Field(serialization_alias = 'totalCount')
    total_page: int = Field(serialization_alias = 'totalPage')
    current_page: int = Field(serialization_alias = 'currentPage')
    page_size: int = Field(serialization_alias = 'pageSize')
    columns: List[str]
    data_employee: List[Employee] = Field(serialization_alias = 'dataEmployee')

    """
    totalPage: 4,
    totalCount: 150,
    currentPage: 3,
    pageSize: 50,
    columns: ['id', 'a', 'b'],
    pageSizeList: [10, 25, 50, 100],
    dataEmployee
    """