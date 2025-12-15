from sqlalchemy import Column, String, select, func
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property

Base = declarative_base()

class Employee(Base):
    __tablename__ = 'tbl_employee'
    # id,first_name,last_name,birthdate,gender,race,department,jobtitle,location,hire_date,termdate,location_city,location_state

    id = Column(String(64), primary_key = True, index = True)
    first_name = Column(String(64), nullable = False)
    last_name = Column(String(64), nullable = False)
    birthdate = Column(String(16), nullable = True)
    gender = Column(String(8), index = True)
    race = Column(String(64), index = True)
    department = Column(String(64), index = True)
    jobtitle = Column(String(64), index = True)
    location = Column(String(64), index = True)
    hire_date = Column(String(16), index = True)
    termdate = Column(String(16), index = True)
    location_city = Column(String(64), index = True)
    location_state = Column(String(64), index = True)

    @hybrid_property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    @full_name.expression
    def full_name(cls):
        return func.concat(cls.first_name, ' ', cls.last_name)

    def __repr__(self):
        return f"<Employee(id={self.id}, name={self.first_name} {self.last_name}>"

def build_query(authorized_columns: list, search_params: dict):
    """
    Build query that return `Employee` based on search params

    Args:
    - `authorized_columns`: list of columns that the user could access
    - `search_params`:  dict of query params, must include a `search_str` for fullname search
    """
    # query = select(*[getattr(employee, col) for col in columns]).select_from(employee)
    query = select(Employee).where(Employee.full_name.ilike(f"%{search_params.get('search_str')}%"))

    # Other params
    for k, v in search_params.items():
        if k in authorized_columns and (v is not None and v != ''):
            query = query.where(getattr(Employee, k) == v)
    return query