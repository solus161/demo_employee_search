interface SearchStatsProps {
  totalCount: number;
  pageSize: number;
  currentPage: number
}

interface EmployeeTableProps {
  columns: string[];
  data: object[];
}

export const SearchStats = ({ totalCount, pageSize, currentPage }: SearchStatsProps) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div>
          <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
          <p className="text-sm text-gray-600 mt-1">Showing <span className="font-medium">{(currentPage-1)*pageSize + 1}-{currentPage*pageSize}</span> of <span className="font-medium">{totalCount}</span> employees</p>
      </div>
      <div className="flex gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Grid view">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
        </button>
        <button className="p-2 bg-blue-50 rounded-lg transition-colors" title="Table view">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
        </button>
      </div>
    </div>
  )
}

export const EmployeeTable = ({ columns, data }: EmployeeTableProps) => {
  if (data === undefined || data.length === 0) {
    return (
      <div className='p-6 text-center text-gray-500'>
        No employee data found.
      </div>
    )
  }

  const colIndex = Object.keys(data[0])
  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
      <thead className='bg-gray-50 border-b border-gray-200'>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900'>
        {data.map((item) => (
          <tr key={item.id} className='bg-white border-b light:bg-gray-800 light:border-gray-700 hover:bg-gray-50 light:hover:bg-gray-600'>
            {colIndex.map((i) => (
              <td key={i} className='px-4 py-4 text-sm font-medium whitespace-nowrap">'>
                {item[i]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}