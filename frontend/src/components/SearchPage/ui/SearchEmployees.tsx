export const SearchInput = ({ onChange }) => {
  return (
    <div className='relative flex grow items-center mt-4 md:mt-0'>
      <input type='text'
        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
        placeholder='Search for employee'
        onChange = {onChange}/>  
    </div>
    
  )
}