import { API_CONFIG, API_ENDPOINTS } from "./configs";
import AuthService from "./authService";

export interface SearchParams {
  searchStr: string | ''
  department?: string | '' | null
  location?: string | '' | null
  locationCity?: string | '' | null
  locationState?: string | '' | null
  pageSize: number
  currentPage: number
}

export type EmployeeSearchResponse =
  {
    success: true,
    detail: {
      totalCount: number
      totalPage: number
      currentPage: number
      pageSize: number
      columns: string[]
      dataEmployee: Array<Record<string, any>>
    }
  }
  | { success: false, detail: string }

export type FilterOptionsResponse = {
  success: true,
  detail: {
    department: string[]
    location: string[]
    locationCity: string[]
    locationState: string[]
  }
} | { success: false, detail: string }

export default class DbService {
  private static getAuthHeaders(): HeadersInit  {
    const token = AuthService.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && {'Authorization': `Bearer ${token}`})
    }
  }
  
  static async searchEmployees({ 
    searchStr, department, location, locationCity, locationState, 
    pageSize, currentPage}: SearchParams): Promise<EmployeeSearchResponse> {
      const params: Record<string, string> = {
        searchStr: searchStr.toString(),
        department: department?.toString() || '',
        location: location?.toString() || '',
        locationCity: locationCity?.toString() || '',
        locationState: locationState?.toString() || '',
        pageSize: pageSize.toString(),
        currentPage: currentPage.toString(),
      }
      const queryString = new URLSearchParams(params).toString()
      
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/${API_ENDPOINTS.EMPLOYEES_SEARCH}?${queryString}`,
          {method: 'GET', headers: this.getAuthHeaders()}
        )

        if (response.ok) {
          const data = await response.json().catch(() => ({success: false, detail: 'Invalid response from server'}))
          return { success: true, detail: data }
        } else {
          const error = await response.json().catch(() => ({ detail: 'Employee search failed' }))
          return {
            success: false,
            detail: error.detail
          }
        }
      } catch (err) {
        return {
          success: false,
          detail: err instanceof Error ? err.message : 'Network error'
        }
      }
    }
  static async getFilterOptions(): Promise<FilterOptionsResponse> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/${API_ENDPOINTS.EMPLOYEE_FILTER_OPTIONS}`,
        {method: 'GET', headers: this.getAuthHeaders()})
      
      if (response.ok) {
        const data = await response.json().catch(() => ({success: false, detail: 'Invalid response from server'}))
        console.log(data)
        return { success: true, detail: data }
      } else {
        const error = await response.json().catch(() => ({ detail: 'Failed to fetch filter options' }))
        return {
          success: false,
          detail: error.detail
        }
      }
    } catch (err) {
      return {
        success: false,
        detail: err instanceof Error ? err.message : 'Network error'
      }
    }
  }
}