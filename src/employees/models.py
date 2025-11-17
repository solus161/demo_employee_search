from sqlalchemy import Column, Integer, String, Boolean, select
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Employee(Base):
    __tablename__ = 'tbl_employees'

    id = Column(Integer, primary_key = True, index = True)
    first_name = Column(String(64), nullable = False)
    last_name = Column(String(64), nullable = False)
    contact_info = Column(String(64), nullable = True)
    location = Column(String(64), index = True)
    company = Column(String(64), index = True)
    department = Column(String(64), index = True)
    position = Column(String(64), index = True)
    status_active = Column(Boolean, default = True)
    status_not_started = Column(Boolean, default = False)
    status_terminated = Column(Boolean, default = False)
    full_name = Column(String(128), index = True, nullable = False)

    def __repr__(self):
        return f"<Employee(id={self.id}, name={self.first_name} {self.last_name}, \
            location={self.location}, company={self.company}, department={self.department})>"

def build_query(employee: Employee, columns: list, search_params: dict):
    query = select(*[getattr(employee, col) for col in columns]).select_from(employee)

    # full_name is always required
    query = query.where(employee.full_name.like(f"%{search_params.get('search_str').lower()}%"))

    for k, v in search_params.items():
        if k in columns and v is not None:
            query = query.where(getattr(employee, k) == v)
    return query