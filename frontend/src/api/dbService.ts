import { API_CONFIG, API_ENDPOINTS } from "./configs";

export interface SearchQuery {
  searchStr: string
  department?: string
  location?: string
  locationCity?: string
  locationState?: string
  pageSize: number
  page: number
}

export type EmployeeSearchResponse =
  {
    success: true,
    detail: {
      totalCount: number
      totalPage: number
      page: number
      pageSize: number
      columns: string[]
      dataEmployee: Array<Record<string, any>>
    }
  }
  | { success: false, detail: string }

export default class DbService {
  static async EmployeeSearch({ 
    searchStr, department, location, locationCity, locationState, 
    pageSize, page}: SearchQuery): Promise<EmployeeSearchResponse> {
      const params: Record<string, string> = {
        searchStr: searchStr.toString(),
        department: department?.toString() || '',
        location: location?.toString() || '',
        locationCity: locationCity?.toString() || '',
        locationState: locationState?.toString() || '',
        pageSize: pageSize.toString(),
        page: page.toString(),
      }
      const queryString = new URLSearchParams(params).toString()
      
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.EMPLOYEES_SEARCH}?${queryString}`
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

 }
