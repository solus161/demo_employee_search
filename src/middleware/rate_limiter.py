import asyncio

class RateLimiter:
    limit = 100  # max requests
    period = 60  # per period in seconds

    users = {}

    @classmethod
    def reset_limit(cls):
        for k in cls.users.keys():
            cls.users[k] = 0

    @classmethod
    async def check_limit(cls, username: str):
        # logging.debug(f'Request count for user {username}: {cls.users.get(username, 0)}')
        if cls.limit == -1:  # Unlimited
            return True
        if username not in cls.users:
            cls.users[username] = 1
            return True
        else:
            if cls.users[username] < cls.limit:
                RateLimiter.users[username] += 1
                return True
            else:
                return False
    @classmethod
    async def sleep(cls):
        while True:
            await asyncio.sleep(cls.period)
            cls.reset_limit()

    @classmethod
    def get_request_count(cls, username: str):
        return cls.users.get(username, 0)