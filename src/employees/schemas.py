from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class Employee(BaseModel):
    # Field set to optional could be ommited
    # by using response_model_exclude_unset = True in route decorator
    id: int
    first_name: str
    last_name: str
    location: Optional[str] = None
    company: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    status_active: Optional[bool] = None
    status_not_started: Optional[bool] = None
    status_terminated: Optional[bool] = None

    model_config = ConfigDict(from_attributes = True)

class PaginatedEmployeeResponse(BaseModel):
    total: int
    page: int
    page_size: int
    data: List[Employee]