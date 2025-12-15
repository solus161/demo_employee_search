import React, { useState } from 'react'
import { BttAddEmployee, BttExport, BttImport, BttFilter } from './ui/Buttons'
import { SearchInput } from "./ui/SearchEmployees"
import { SearchStats, EmployeeTable } from "./ui/TblEmployee"
import { PageSize, PageList } from './ui/Pagination'
import { SearchQuery, EmployeeSearchResponse }  from '@/api/dbService'

const SearchTimeout = 500 // wait 500ms then search

const mockCallback = () => {
  alert('This')
}

const mockData = {
  totalPage: 4,
  totalCount: 150,
  currentPage: 3,
  pageSize: 50,
  columns: ['id', 'a', 'b'],
  pageSizeList: [10, 25, 50, 100],
  dataEmployee: [
    {id: '1', a: '1', b: '2'},
    {id: '2', a: '1', b: '2'}]
  }

interface SearchPageProps {
  onSearch?: (params: SearchQuery)  => Promise<EmployeeSearchResponse>
  onAddEmployee?: () => void
  onImport?: () => void
  onExport?: () => void
}

export const SearchPage = ({ onSearch, onAddEmployee }): SearchPageProps => {
  // const {totalPage, totalCount, currentPage, pageSize, columns, pageSizeList, dataEmployee} = data
  const [searchStr, setSearchStr] = useState('')
  const [department, setDepartment] = useState('')
  const [location, setLocation] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [locationState, setLocationState] = useState('')
  const [totalPage, setTotalpage] = useState(mockData.totalPage)
  const [totalCount, setTotalCount] = useState(mockData.totalCount)
  const [currentPage, setCurrentPage] = useState(mockData.currentPage)
  const [pageSize, setPageSize] = useState(mockData.pageSize)
  const [columns, setColumns] = useState(mockData.columns)
  const [pageSizeList, setPageSizeList] = useState(mockData.pageSizeList)
  const [error, setError] = useState('')
  const [lastInputTime, setLastInputTime] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  // const [dataEmployee, setDataEmployee] = useState(mockData.dataEmployee)

  const handleSubmit = async () => {
    const searchParams = {
      searchStr: searchStr,
      department: department,
      location: location,
      locationCity: locationCity,
      locationState: locationState,
      pageSize: pageSize,
      page: currentPage
    }
    const response = await onSearch?.(searchParams)
    if (response.success) {
      return null
    } else {
      setError(response.detail)
    }
  }

  const onSearchStrChange = async (e) => {
      const lastMessage = e.target.value
      const wait = new Promise((resolve) =>   
        setTimeout(resolve, 1000))
      wait.then(() => {
        if (lastMessage == e.target.value) {
          console.log('Searching for:', lastMessage)
        }
      })
    }

  const handlePagePrevious = async () => {
    // When clicking on page Previous button
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      await handleSubmit()
    }
  }

  const handlePageNext = async () => {
    // When clicking on page Next button
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1)
      await handleSubmit()
    }
  }

  const handleSetCurrentpage = async (targetPage: number) => {
    if (targetPage != currentPage) {
      setCurrentPage(targetPage)
      await handleSubmit()
    }
  }

  const handlePageSizeChange = async (newPageSize: number) => {
    // When change page size
    if (newPageSize != pageSize) {
      setPageSize(newPageSize)
      await handleSubmit()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Directory</h1>
          <p className="text-gray-600">Search and manage employee information</p>
      </div>

      {/* Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Left side - Add Employee and Search */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">           
          <BttAddEmployee onClick={onAddEmployee}/>
          
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <SearchInput onChange={onSearchStrChange} />
          </div>
        </div>

        {/* Right side */}
        <div className='flex gap-3 w-full sm:w-auto'>
          <BttImport onClick={mockCallback}/>
          <BttExport onClick={mockCallback}/>
          <BttFilter onClick={mockCallback}/>
        </div>

        {/* Filter panel, hidden */}
        <div id="filterPanel" className="hidden mb-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">

        </div>
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
        <PageSize sizeList={pageSizeList} onChange={handlePageSizeChange}/>
        <PageList totalPage={totalPage} currentPage={currentPage} 
          onClickPrevious={handlePagePrevious} onClickNext={handlePageNext} onClickPage={handleSetCurrentpage}/>
      </div>
    </div>
  )
}