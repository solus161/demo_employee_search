from . import CustomException
from middleware.messages import get_message, MessageCode

class UsernameExistsError(CustomException):
    """
    Raised when an username already exists in the db.
    """
    def __init__(self, username: str):
        super().__init__(
            get_message(MessageCode.USER_USERNAME_EXISTS, username = username),
            500)

class EmailExistsError(CustomException):
    def __init__(self, email: str):
        super().__init__(
            get_message(MessageCode.USER_EMAIL_EXISTS, email = email),
            500)

class CreateUserError(CustomException):
    def __init__(self, username: str, detail: str):
        super().__init__(
            get_message(MessageCode.USER_CREATION_FAILED, username = username, detail = detail),
            500)

class InvalidTokenError(CustomException):
    def __init__(self):
        super().__init__(
            get_message(MessageCode.AUTH_TOKEN_INVALID), 401)

class ExpiredTokenError(CustomException):
    def __init__(self):
        super().__init__(
            get_message(MessageCode.AUTH_TOKEN_EXPIRED), 401)

class UserNotFoundError(CustomException):
    def __init__(self):
        super().__init__(
            get_message(MessageCode.AUTH_INVALID_CREDENTIALS), 404)

class WrongPasswordError(CustomException):
    def __init__(self):
        super().__init__(
            get_message(MessageCode.AUTH_INVALID_CREDENTIALS), 401)

class RequestLimitError(CustomException):
    def __init__(self, retry_after: int):
        super().__init__(
            get_message(MessageCode.RATE_LIMIT_EXCEEDED, retry_after = retry_after), 429)

class NoDepartmentError(CustomException):
    def __init__(self):
        super().__init__(
            get_message(MessageCode.AUTHZ_NO_DEPARTMENT), 401)

class NoAccessError(CustomException):
    def __init__(self):
        super().__init__(
            get_message(MessageCode.AUTHZ_NO_ACCESS), 403)