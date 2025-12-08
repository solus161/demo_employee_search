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