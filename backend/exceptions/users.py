from . import CustomException

class UsernameExistsError(CustomException):
    """
    Raised when an username already exists in the db.
    """
    def __init__(self, username: str):
        super().__init__(f'Username {username} already exists', 500)

class EmailExistsError(CustomException):
    def __init__(self, email: str):
        super().__init__(f'Email {{email}} already exists', 500)

class CreateUserError(CustomException):
    def __init__(self, username: str, details: str):
        super().__init__(f'Error while creating user {username}: {details}', 500)

class InvalidTokenError(CustomException):
    def __init__(self):
        super().__init__(f'Invalid access token', 401)

class ExpiredTokenError(CustomException):
    def __init__(self, username: str):
        super().__init__(f'Access token for user {username} has been expired', 401)

class UserNotFoundError(CustomException):
    def __init__(self, username: str):
        super().__init__(f'User named {username} does not exist', 404)

class WrongPasswordError(CustomException):
    def __init__(self):
        super().__init__('Wrong password', 401)

class RequestLimitError(CustomException):
    def __init__(self, username: str, try_again: int):
        super().__init__(f'User {username} reached request limit. Please try again in {try_again} secs', 429)

class NoDepartmentError(CustomException):
    def __init__(self, username: str):
        super().__init__(f'User {username} is assigned to no deparment', 401)

class NoAccessError(CustomException):
    def __init__(self, deparment):
        super().__init__(f'Deparment {deparment} has no access right', 403)