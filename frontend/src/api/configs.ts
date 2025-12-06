export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
    TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT)
}

export const API_ENDPOINTS = {
    EMPLOYEES: 'api/v1/employees',
    LOGIN: 'api/v1/login',
}