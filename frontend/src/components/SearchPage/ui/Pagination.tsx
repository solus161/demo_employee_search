export const PageSize = ({ sizeList, onChange }) => { 
  return (
    <div className='flex items-center gap-2'>
        <label className='text-sm text-gray-700'>Rows per page:</label>
        <select 
          className='px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
          onChange={(e) => onChange(Number(e.target.value))}>
            {sizeList.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
    </div>
    )
  }


// Button for page select
// interface PageButtonProps {
//   pageNumber: number;
//   selected: boolean
//   onClick;
// }

const PageButton = ({ pageNumber, selected, onClick }) => {
  const buttonClass = selected ? 'px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium' : 
    'px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50'
  return (
    <button className={buttonClass} key={pageNumber} onClick={(e) => {onClick(pageNumber)}}>{pageNumber}</button>
  )
}

const SpanPage = () => {
  return (
    <span className='px-3 py-1 text-sm text-gray-700'>...</span>
  )
}

// interface PageListProps {
//     totalPage: number;
//     currentPage: number;
//     onClick;
// }

const PageButtons = ({ totalPage, currentPage, onClick}) => {
  const pageRange = 1 // 1 to each side of current page
  const lowerPage = Math.max(2, currentPage - pageRange)
  const upperPage = Math.min(totalPage - 1 , currentPage + pageRange)
  
  const allBlock = []
  if (totalPage > 0) {
    // Page 1
    allBlock.push(<PageButton pageNumber={1} selected={1 == currentPage} onClick={onClick}/>)
    
    if (lowerPage - 1 >= 2) {
      allBlock.push(<SpanPage/>)
    }

    // Middle block
    const pageMiddleList = []
    for (let i = lowerPage; i <= upperPage; i++) {
        pageMiddleList.push(i)
      }
    const pageBlockMiddle = pageMiddleList.map(
      (item) => <PageButton pageNumber={item} selected={item == currentPage} onClick={onClick}/>)
    allBlock.push(...pageBlockMiddle)

    // End block
    if (totalPage - upperPage >= 2) {
      allBlock.push(<SpanPage/>)
    }
    if (totalPage > 1) {
      allBlock.push(
        <PageButton pageNumber={totalPage} selected={totalPage == currentPage} onClick={onClick}/>)
    }
  }
  
  return (
    <div className='flex gap-1'>
      {allBlock}
    </div>
  )
}

export const PageList = ({ totalPage, currentPage, onClickPrevious, onClickNext, onClickPage }) => {
  // console.log('Btt Previous', currentPage == 1)
  // console.log('Btt Next', currentPage == totalPage)
  return (
    <div className="flex items-center gap-2 justify-end">
      <button 
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={() => {currentPage > 1 && onClickPrevious()}} disabled={currentPage == 1}>
        Previous
      </button>

      <PageButtons totalPage={totalPage} currentPage={currentPage} onClick={onClickPage}/>

      <button 
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {currentPage < totalPage && onClickNext()}} disabled={currentPage == totalPage}>
        Next
      </button>
    </div>
    )
}