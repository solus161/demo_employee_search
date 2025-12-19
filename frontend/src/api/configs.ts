export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000
}

export const API_ENDPOINTS = {
    SIGNUP: 'api/v1/user/create',
    LOGIN: 'api/v1/user/token',
    DEPT_LIST: 'api/v1/user/departments',
    EMPLOYEES_SEARCH: 'api/v1/employee/search',
    EMPLOYEE_FILTER_OPTIONS: 'api/v1/employee/filter-options'
}