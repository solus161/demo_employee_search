from datetime import datetime, timedelta, timezone

from exceptions.users import RequestLimitError

class RateLimiter:
    def __init__(self, period: int, limit: int):
        self.period = period
        self.limit = limit
        self.users = {}

    def reset_limit(self):
        for k in self.users.keys():
            self.users[k] = []

    def is_within_limit(self, username: str):
        # logging.debug(f'Request count for user {username}: {cls.users.get(username, 0)}')
        if self.limit == -1:  # Unlimited
            return True
        
        current_timestamp = datetime.now(timezone.utc)
        cutoff_timestamp = current_timestamp - timedelta(seconds = self.period)

        if username not in self.users:
            self.users[username] = [current_timestamp]
            
        # Clean up old requests for current user
        self.users[username] = [
            timestamp for timestamp in self.users[username] if timestamp >= cutoff_timestamp]

        # Check limit
        if len(self.users[username]) <= self.limit:
            self.users[username].append(current_timestamp)
            return True
        else:
            raise RequestLimitError(username, self.period)