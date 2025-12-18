import React, { useEffect, useState, useCallback, useMemo, use } from 'react'
import { BttAddEmployee, BttExport, BttImport, BttFilter } from './ui/Buttons'
import { SearchInput } from "./ui/SearchEmployees"
import { SearchStats, EmployeeTable } from "./ui/TblEmployee"
import { PageSize, PageList } from './ui/Pagination'
import { FilterPanel } from './ui/FilterPanel'
import { SearchParams, EmployeeSearchResponse }  from '@/api/dbService'

const SearchTimeout = 1000 // wait 1000ms then search

interface SearchPageProps {
  onSearch?: (params: SearchParams)  => Promise<EmployeeSearchResponse>
  onAddEmployee?: () => void
  onImport?: () => void
  onExport?: () => void
}

// interface SearchStateParams {
//   searchStr: string
//   department: string | ''
//   location: string | ''
//   locationCity: string | ''
//   locationState: string | ''
//   pageSize?: number
//   currentPage?: number
// }

export const SearchPage = ({
  onSearch, onAddEmployee, onImport, onExport }: SearchPageProps)  => {
  // const {totalPage, totalCount, currentPage, pageSize, columns, pageSizeList, dataEmployee} = data
  const [searchStr, setSearchStr] = useState('')
  const [department, setDepartment] = useState('')
  const [location, setLocation] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [locationState, setLocationState] = useState('')
  const [totalPage, setTotalpage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(0)
  const [columns, setColumns] = useState([] as string[])
  // const [pageSizeList, setPageSizeList] = useState([] as number[])
  const pageSizeList = [10, 25, 50, 100]
  const [dataEmployee, setDataEmployee] = useState([] as any[])
  const [error, setError] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  // const [dataEmployee, setDataEmployee] = useState(mockData.dataEmployee)
  
  // Fix reference for handleSubmit, avoid re-create on each render
  const handleSubmit = useCallback(async (params: SearchParams) => {
    const response = await onSearch?.(params)
    if (response.success) {
      setTotalCount(response.detail.totalCount)
      setTotalpage(response.detail.totalPage)
      // setCurrentPage(response.detail.currentPage)
      // setPageSize(response.detail.pageSize)
      setColumns(response.detail.columns)
      // setPageSizeList(response.detail.pageSizeList)
      setDataEmployee(response.detail.dataEmployee)
      setError('')
    } else {
      setError(response.detail)
    }
  }, [onSearch])

  const handleImport = async () => {
    const response = await onImport?.()
  }

  const handleExport = async () => {
    const response = await onExport?.()
  }

  // Trigger only when inboundParams changed
  const useDebounce = (values: SearchParams, delay: number): SearchParams => {
    const [debouncedValue, setDebouncedValue] = useState(values)
    useEffect(() => {
      const wait = setTimeout(() => {
        setDebouncedValue(values)
      }, delay)
      return () => clearTimeout(wait)
    }, [values, delay])
    return debouncedValue
  }

  // Return new object when any param changed
  const inboundParams = useMemo(() => {
    return {
      searchStr: searchStr, department: department,  location: location,
      locationCity: locationCity, locationState: locationState,
      pageSize: pageSize, currentPage: currentPage}
  }, [searchStr, department, location, locationCity, locationState, pageSize, currentPage])

  const debouncedParams = useDebounce(inboundParams, SearchTimeout)

  // Triggered when debouncedParams changed
  // Full flow: user types/clicks -> states change -> inboundParams change -> 
  // debouncedParams change -> useEffect trigger -> handleSubmit
  useEffect(() => {
    handleSubmit?.(debouncedParams)
  }, [handleSubmit, debouncedParams])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Directory</h1>
          <p className="text-gray-600">Search and manage employee information</p>
      </div>

      {/* Buttons and Filter Panel Container */}
      <div className="relative mb-6">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Left side - Add Employee and Search */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <BttAddEmployee onClick={onAddEmployee}/>

            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <SearchInput onChange={(e) => {setSearchStr(e.target.value)}} />
            </div>
          </div>

          {/* Right side */}
          <div className='flex gap-3 w-full sm:w-auto'>
            <BttImport onClick={onImport}/>
            <BttExport onClick={onExport}/>
            <BttFilter onClick={() => setShowFilter(!showFilter)}/>
          </div>
        </div>

        {/* Filter panel - overlays content */}
        <FilterPanel
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onDepartmentChange={setDepartment}
          onLocationChange={setLocation}
          onLocationCityChange={setLocationCity}
          onLocationStateChange={setLocationState}
        />
      </div>

      {/* Main content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Detailed table, always display */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            {/* Details of search stats */}
            <SearchStats totalCount={totalCount} pageSize={pageSize} currentPage={currentPage} />            

            {/* Search results table */}
            <EmployeeTable columns={columns} data={dataEmployee}/>

          </div>
          
        </div>

        {/* Employee Details Panel (1/3 width on large screens), displayed for HR only */}
        <div className='lg:col-span-1'>

        </div>
      </div>

      {/* Pagination */}
      <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
        <PageSize sizeList={pageSizeList} onChange={setPageSize}/>
        <PageList totalPage={totalPage} currentPage={currentPage} 
          onClickPrevious={() => {setCurrentPage(currentPage - 1)}}
          onClickNext={() => {setCurrentPage(currentPage + 1)}}
          onClickPage={setCurrentPage}/>
      </div>
    </div>
  )
}