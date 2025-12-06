# Test Suite Documentation

## Overview

This directory contains comprehensive test coverage for the backend application, organized by module with both unit and integration tests.

## Directory Structure

```
tests/
├── conftest.py                     # Shared fixtures across all tests
├── requirements-test.txt           # Testing dependencies
├── README.md                       # This file
├── test_auth/
│   ├── __init__.py
│   ├── conftest.py                 # Auth-specific fixtures
│   ├── test_services.py            # Unit tests for auth services
│   ├── test_router.py              # Integration tests for auth endpoints
│   └── test_integration.py         # End-to-end auth tests
└── fixtures/
    └── auth_fixtures.py            # Reusable auth test data
```

## Installation

Install test dependencies:

```bash
pip install -r tests/requirements-test.txt
```

## Running Tests

### Run all tests
```bash
pytest
```

### Run specific test file
```bash
pytest tests/test_auth/test_services.py
```

### Run specific test function
```bash
pytest tests/test_auth/test_services.py::test_create_user_success
```

### Run tests by marker
```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Run only auth tests
pytest -m auth
```

### Run with coverage
```bash
pytest --cov=auth --cov-report=html
```

### Run with verbose output
```bash
pytest -v
```

### Run and stop at first failure
```bash
pytest -x
```

### Run last failed tests
```bash
pytest --lf
```

## Test Organization

### Unit Tests (`test_services.py`)
- Fast, isolated tests
- Use mocking and monkeypatch
- No database dependencies
- Test individual functions

### Integration Tests (`test_router.py`)
- Test API endpoints
- Use test database
- Test request/response cycle

### End-to-End Tests (`test_integration.py`)
- Complete user flows
- Test multiple components together

## Writing Tests

### Test Naming Convention

```python
def test_<function_name>_<scenario>():
    """Test description"""
    # Arrange
    # Act
    # Assert
```

### Using Fixtures

```python
@pytest.mark.asyncio
async def test_example(mock_user, mock_db_session):
    """Example test using fixtures"""
    result = await some_function(mock_db_session)
    assert result.username == mock_user.username
```

### Using Monkeypatch

```python
def test_with_monkeypatch(monkeypatch):
    """Mock external dependencies"""
    # Mock a function
    monkeypatch.setattr("module.function", lambda: "mocked_value")

    # Mock an environment variable
    monkeypatch.setenv("SECRET_KEY", "test_key")

    # Mock an attribute
    monkeypatch.setattr("module.Class.attribute", "mocked_value")
```

### Async Tests

```python
@pytest.mark.asyncio
async def test_async_function():
    """Test async functions"""
    result = await async_function()
    assert result is not None
```

## Common Patterns

### Testing Exceptions

```python
def test_function_raises_error():
    with pytest.raises(CustomException) as exc_info:
        function_that_raises()

    assert "expected message" in str(exc_info.value)
```

### Parametrized Tests

```python
@pytest.mark.parametrize("input,expected", [
    ("test1", "expected1"),
    ("test2", "expected2"),
    ("test3", "expected3"),
])
def test_multiple_cases(input, expected):
    assert function(input) == expected
```

### Mocking Database Session

```python
@pytest.mark.asyncio
async def test_with_mock_db():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_session.execute.return_value = mock_result

    result = await function(mock_session)
    assert mock_session.execute.called
```

## Best Practices

1. **Arrange-Act-Assert (AAA) Pattern**
   - Arrange: Set up test data and mocks
   - Act: Call the function being tested
   - Assert: Verify the results

2. **Test Independence**
   - Each test should be independent
   - Use fixtures for setup/teardown
   - Don't rely on test execution order

3. **Mock External Dependencies**
   - Mock database calls
   - Mock external APIs
   - Mock file system operations

4. **Use Descriptive Names**
   - Test name should describe what's being tested
   - Include the scenario/condition
   - Make failures easy to understand

5. **Keep Tests Simple**
   - One assertion per test (when possible)
   - Test one thing at a time
   - Avoid complex logic in tests

6. **Use Fixtures Wisely**
   - Share common setup via fixtures
   - Keep fixtures focused and reusable
   - Document fixture purposes

## Coverage Goals

- **Unit Tests**: Aim for >90% coverage
- **Integration Tests**: Cover all API endpoints
- **Critical Paths**: 100% coverage for auth/security

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Scheduled daily runs

## Troubleshooting

### Common Issues

**Import errors:**
```bash
# Make sure you're in the backend directory
cd backend
pytest
```

**Async test errors:**
```bash
# Install pytest-asyncio
pip install pytest-asyncio
```

**Database errors:**
```bash
# Check that test database URL is correct in conftest.py
```

## Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Pytest-asyncio](https://pytest-asyncio.readthedocs.io/)
- [Coverage.py](https://coverage.readthedocs.io/)
