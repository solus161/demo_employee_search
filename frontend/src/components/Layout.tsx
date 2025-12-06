import React, { useState } from 'react'
import { BttAddEmployee, BttExport, BttImport, BttFilter } from './Buttons'
import { SearchInput } from "./SrcSearchEmployee"
import { SearchStats, EmployeeTable } from "./TblEmployee"
import { PageSize, PageList } from './Pagination'
import { mock } from 'node:test'

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

export default function ClsSearchPage() {
  // const {totalPage, totalCount, currentPage, pageSize, columns, pageSizeList, dataEmployee} = data
  
  const [totalPage, setTotalpage] = useState(mockData.totalPage)
  const [totalCount, setTotalCount] = useState(mockData.totalCount)
  const [currentPage, setCurrentPage] = useState(mockData.currentPage)
  const [pageSize, setPageSize] = useState(mockData.pageSize)
  const [columns, setColumns] = useState(mockData.columns)
  const [pageSizeList, setPageSizeList] = useState(mockData.pageSizeList)
  const [dataEmployee, setDataEmployee] = useState(mockData.dataEmployee)

  const handlePagePrevious = () => {
    // When clicking on page Previous button
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageNext = () => {
    // When clicking on page Next button
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleSetCurrentpage = (targetpage: number) => {
    setCurrentPage(targetpage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    // When change page size
    setPageSize(newPageSize)
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
          <BttAddEmployee callbackFn={mockCallback}/>
          
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <SearchInput />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {/* Right side */}
        <div className='flex gap-3 w-full sm:w-auto'>
          <BttImport callbackFn={mockCallback}/>
          <BttExport callbackFn={mockCallback}/>
          <BttFilter callbackFn={mockCallback}/>
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