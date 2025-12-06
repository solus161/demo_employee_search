from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base

from database.database import engine

Base = declarative_base()

class User(Base):
    __tablename__ = 'tbl_user'

    id = Column(Integer, primary_key = True)
    username = Column(String, unique = True, nullable = False)
    email = Column(String, unique = True, nullable = False)
    department = Column(String)
    password = Column(String, nullable = False) # Hashed

    def __repr__(self):
        print(f'<User instance username={self.username}>')

class Department(Base):
    __tablename__ = 'tbl_department'

    id = Column(Integer, primary_key = True)
    name = Column(String, unique = True, nullable = False)
    authorized_columns = Column(String, nullable = True)