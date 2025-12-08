from enum import Enum

class MessageCode(str, Enum):
    # Authentication errors (1xxx)
    AUTH_INVALID_CREDENTIALS = "AUTH_1001"
    AUTH_TOKEN_EXPIRED = "AUTH_1002"
    AUTH_TOKEN_INVALID = "AUTH_1003"
    AUTH_TOKEN_MISSING = "AUTH_1004"
    
    # User errors (2xxx)
    USER_NOT_FOUND = "USER_2001"
    USER_USERNAME_EXISTS = "USER_2002"
    USER_EMAIL_EXISTS = "USER_2003"
    USER_CREATION_FAILED = "USER_2004"
    
    # Validation errors (3xxx)
    VALIDATION_PASSWORD_WEAK = "VALIDATION_3001"
    VALIDATION_USERNAME_INVALID = "VALIDATION_3002"
    VALIDATION_EMAIL_INVALID = "VALIDATION_3003"
    
    # Authorization errors (4xxx)
    AUTHZ_NO_DEPARTMENT = "AUTHZ_4001"
    AUTHZ_NO_ACCESS = "AUTHZ_4002"
    AUTHZ_DEPARTMENT_NOT_FOUND = "AUTHZ_4003"
    
    # Rate limiting (5xxx)
    RATE_LIMIT_EXCEEDED = "RATE_5001"
    
    # Internal errors (9xxx)
    INTERNAL_ERROR = "INTERNAL_9001"
    DATABASE_ERROR = "INTERNAL_9002"

# Map codes to default messages
ERROR_MESSAGES = {
    MessageCode.AUTH_INVALID_CREDENTIALS: "Invalid username or password",
    MessageCode.AUTH_TOKEN_EXPIRED: "Access token has expired",
    MessageCode.AUTH_TOKEN_INVALID: "Invalid access token",
    
    MessageCode.USER_NOT_FOUND: "User '{username}' not found",
    MessageCode.USER_USERNAME_EXISTS: "Username '{username}' already exists",
    MessageCode.USER_EMAIL_EXISTS: "Email '{email}' already exists",
    MessageCode.USER_CREATION_FAILED: "An error occured while creating user '{username}', detail: {detail}",
    
    MessageCode.VALIDATION_PASSWORD_WEAK: "Password does not meet complexity requirements",
    MessageCode.VALIDATION_USERNAME_INVALID: "Username must contain only letters, numbers, and underscores",
    
    MessageCode.AUTHZ_NO_DEPARTMENT: "User has no assigned department",
    MessageCode.AUTHZ_NO_ACCESS: "Your department is not authorized for this resource",
    
    MessageCode.RATE_LIMIT_EXCEEDED: "Too many requests. Try again in {retry_after} seconds",
}

def get_message(code: MessageCode, **kwargs) -> str:
    """Get formatted error message for a code"""
    message = ERROR_MESSAGES.get(code, "An error occurred")
    return message.format(**kwargs) if kwargs else message