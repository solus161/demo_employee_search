from pydantic import BaseModel, Field
import re

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    email: str
    password: str
    department: str

class CreateUserForm(BaseModel):
    username: str
    email: str
    password: str
    department: str | None