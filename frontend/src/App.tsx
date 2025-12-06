import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import ClsSearchPage from './components/Layout'

function App() {
  const [count, setCount] = useState(0)
  
  // console.log(mockData)
  useEffect(() => {
    document.body.className = 'bg-gray-50 min-h-screen'
    return () => {
      document.body.className = ''
    }
  }, [])
  // Body styling
  

  return (
    <ClsSearchPage/>
    // <div className="min-h-screen flex items-center justify-center bg-black text-white text-4xl font-bold">
    //   Tailwind is working!
    // </div>
  )
}

export default App