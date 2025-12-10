from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
# from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# A sample connection config
# configs = {
#     'user': 'postgres',
#     'password': '1',
#     'host': 'localhost',
#     'port': 5432,
#     'database': 'learning'
# }

# db_url = 'postgresql+psycopg://{user}:{password}@{host}:{port}/{database}'.format(**configs)
# engine = create_async_engine(db_url, pool_size = 10, max_overflow = 20)
# AsyncSession = async_sessionmaker(autocommit = False, autoflush = False, bind = engine)

# For ease of use, use a simple sqlite
engine = create_engine('sqlite+aiosqlite:///database.db')
AsyncSession = async_sessionmaker(bind = engine)

async def get_db_session():
    """Dependency to get DB session"""
    async with AsyncSession() as session:
        yield session