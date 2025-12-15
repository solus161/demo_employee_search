import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import ClsSearchPage from './components/SearchPage/Layout'
import { AuthContainer } from './components/AuthForms'

function App() {
  const [count, setCount] = useState(0)

  const handleLogin = (username: string, password: string) => {
    console.log('Login:', { username, password })
  }

  const handleSignup = (username: string, email: string, department: string, password: string) => {
    console.log('Signup:', { username, email, department, password })
  }
  
  // console.log(mockData)
  useEffect(() => {
    document.body.className = 'bg-gray-50 min-h-screen'
    return () => {
      document.body.className = ''
    }
  }, [])
  // Body styling
  

  return (
    <AuthContainer 
      onLogin={handleLogin} 
      onSignup={handleSignup}
      departments={['Engineering', 'HR', 'Sales']} // Optional: customize departments
    />
    // <ClsSearchPage/>
    // <div className="min-h-screen flex items-center justify-center bg-black text-white text-4xl font-bold">
    //   Tailwind is working!
    // </div>
  )
}

export default App