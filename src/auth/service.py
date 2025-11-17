import asyncio

class DBUser():
    """
    Represents a db session for user.
    """
    # A mock table for users, password must be hashed instead of plain text
    users = {
        'user01': {
            'username': 'user01',
            'department': 'HR',
            'password': '1'
        },
        'user02': {
            'username': 'user02',
            'department': 'Sales',
            'password': '1'
        },
        'user03': {
            'username': 'user02',
            'password': '1'
        }
    }
    departments = {
        'HR': {
            'authorized_columns': [
                'id', 'first_name', 'last_name', 'location', 'company', 'department', 'position',
                'status_active', 'status_not_started', 'status_terminated']
        },
        'Sales': {
            'authorized_columns': [
                'id', 'first_name', 'last_name', 'location', 'company', 'department', 'position']
        }
    }

    @classmethod
    async def get_user(cls, username: str, password: str = None):
        """
        Get user dict based on username and password.
        Args:
            username (str): The username of the user.
            password (str, optional): The password of the user. Defaults to None.
        Return None if the user or password does not match.
        """
        await asyncio.sleep(0.001)
        if username not in cls.users:
            return None
        if cls.users[username]['password'] != password:
            return None
        
        # This also return the password, must be removed in prod
        return cls.users.get(username)
    
    @classmethod
    async def get_authorized_columns(cls, department: str):
        # print("Getting authorized columns for department:", department)
        await asyncio.sleep(0.001)
        if department not in cls.departments:
            return False
        # print("Authorized columns:", cls.departments[department]['authorized_columns'])
        return cls.departments[department]['authorized_columns']
    
async def get_user_session():
    """
    For simplicity
    In production, must return a real db session object
    """
    return DBUser