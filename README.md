# Mini project: Employee Search API

A FastAPI-based REST API for searching and filtering employee records with role-based access control, pagination, and rate limiting.

**Note**: Some modules, such as database connection, are written as mock to simplify the development. However, they could be easily replaced by real database connection for integration test.

## Features

- **Employee Search**: Full-text and partial text search across employee records based on full name;
- **Advanced Filtering**: Filter by location, company, department, position, and several status;
- **Pagination**: `Offset` and `limit` pagination with configurable page size
- **Role-Based Access Control**: Different departments see different columns, ensuring no data leakage. Configuration is stored on 
- **Rate Limiting**: Per-user/IP rate limiting to prevent abuse
- **Authentication**: HTTP Basic Auth with department-based authorization
- **Async Processing**: Built on FastAPI with async SQLAlchemy for high concurrency
- **OpenAPI Documentation**: Auto-generated interactive API docs at `/docs`

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with asyncpg async driver
- **ORM**: SQLAlchemy 2.0 with async support
- **Testing**: pytest with pytest-asyncio
- **Server**: Uvicorn

## Project Structure

```
demo_employee_search/
├── src/
│   ├── main.py                 # FastAPI app entry point
│   ├── conftest.py             # pytest configuration
│   ├── test_main.py            # unit tests
│   ├── database/
│   │   └── database.py         # DB connection, session management
│   ├── employees/
│   │   ├── router.py           # Employee search endpoints
│   │   ├── models.py           # SQLAlchemy ORM models
│   │   └── schemas.py          # Pydantic request/response schemas
│   ├── auth/
│   │   ├── router.py           # Authentication endpoints
│   │   ├── utils.py            # Auth logic (authenticate, authorize)
│   │   └── service.py          # DB user lookup
│   └── middleware/
│       └── rate_limiter.py     # Rate limiting implementation
├── tests/
│   ├── fake_db.py              # Sample data generator
│   ├── models.sql              # Database schema
│   ├── locustfile.py           # Load testing scenarios
│   └── test_*.py               # Unit/integration tests
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Installation
The python version for this project is 3.10.

1. **Clone the repository**:
   ```bash
   git clone git@github.com:solus161/demo_employee_search.git
   cd demo_employee_search
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**:

    Given that there is an postgres server on local:
   ```bash
   psql -U postgres -d learning -f tests/models.sql
   ```
   The script in `models.sql` does the followings:
   - Create a table `tbl_employees` with all required columns and a calculated column `full_name` which `lower` then `concat` `first_name` and `last_name`;
   - Create indices for fast lookup. For `full_name` columns `pg_trgm` extension and GIN indexes are used for fast partial text search;

5. **Load sample data** (optional):
   
   This script insert ~ 20 million records into the table.`tbl_employees`
   ```bash
   python tests/fake_db.py
   ```

## Configuration and modules

### Authentication
The authentication step is the entry point of many other features. Therefore, all routers must depend on this modules.

#### Route
For this demo project, the authentication method is Basic Auth and is implemented in `src/auth/router.login`.

**For production**:
 - The auth route must be written more sofisticated auth process such as OAuth2 and require managing JWT;
 - There should be a dedicated server for managing user session;

#### Mock client data
Mock client data is stored in `src/auth/service/DBUser` as `dict`. To simulate async queries of user data, `await asyncio.sleep(0.001)` is used before getting the dict value. The mock data includes 3 users belong to different departments. `user03` has no `department` attribute, meaning the user is not allowed to access the data.

**For production**:
 - Replace `src/auth/service.get_user_session` by an context management block similar to `src/database/database.get_db_session`.

### Database connection
The connection is point to an actual PostgreSQL database for the purpose of stress testing. The sample connection configs are stored at `src/database/database`.

**For production**:
 - Move the connection configs to another config file.

### Rate limiter
The module is implemented in `src/middeware/rate_limiter.RateLimiter`. The default configs are 100 requests per user per 60 secs. After 60 secs, the request count is reset for all users. The reset is handled by async loop `RateLimiter.sleep` which is started as an asyncio task in `src/main.lifespan` before the loading of the app.

**For production**:
 - Use a 3rd library for this feature

## Main features

### Employee search
This is the main feature of the project. The request sent to `/api/v1/employees` included several query params:
 - `search_str`: must have;
 - `location`: optional filtered value;
 - `company`: optional filtered value;
 - `department`: optional filtered value;
 - `position`: optional filtered value;
 - `status_active`: optional filtered value;
 - `status_not_started`: optional filtered value;
 - `status_terminated`: optional filtered value;
 - `page`: must have, integer, default is 1;

The route returns a `json` with structure defined in `src/employees/schemas.PaginatedEmployeeResponse`:
 - `total`: total number of records found;
 - `page`: the page number sent to server;
 - `page_size`: defined in `src/employees/router.PAGINATION_LIMIT`;
 - `data`: a list of records found for current page;


## Running the Application

**Development**:
```bash
uvicorn src.main:app --reload --host localhost --port 8000
```

**Production**:
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Access the API at `http://localhost:8000` and interactive docs at `http://localhost:8000/docs`.

## API Endpoints

### Authentication

**Login**:
```http
GET /api/v1/login
Authorization: Basic <base64(username:password)>
```

Response:
```json
{
  "message": "Login successful"
}
```

### Employee Search

**Search employees**:
```http
GET /api/v1/employees?search_str=John&department=Sales&page=1&page_size=50
Authorization: Basic <base64(username:password)>
```

Parameters:
- `search_str` (required): Name search string (1-100 chars)
- `location` (optional): Filter by location
- `company` (optional): Filter by company
- `department` (optional): Filter by department
- `position` (optional): Filter by position
- `status_active` (optional): Filter by active status (true/false)
- `status_not_started` (optional): Filter by not started status
- `status_terminated` (optional): Filter by terminated status
- `page` (optional): Page number, default 1
- `page_size` (optional): Items per page, max 100, default 50

Response:
```json
{
  "total": 15420,
  "page": 1,
  "page_size": 50,
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "location": "Ohio",
      "company": "Cleveland Corp",
      "department": "Sales",
      "position": "Manager",
      "status_active": true,
      "status_not_started": true
      "status_terminated": false
    }
  ]
}
```

## Testing

### Run all unit tests:
```bash
cd src
python -m pytest -v
```

### Stress testing with Locust:
Run the server
```bash
cd src
uvicorn src.main:app --reload --host localhost --port 8000
```

Run locust server
```bash
cd tests
locust
```

Open `http://localhost:8089` to configure and run load test defined in `tests/locustfile.py`.