
export const SearchInput = () => {
  return (
    <div className='relative flex grow items-center mt-4 md:mt-0'>
      <input type='text'
        className='block w-full py-1.5 pr-5 text-gray-950 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-700/70 pl-11 rtl:pr-11 rtl:pl-5 light:bg-gray-900 light:text-gray-300 light:border-gray-600 focus:border-blue-400 light:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40'
        placeholder='Search for employee'/>  
    </div>
    
  )
}