import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import { AuthContainer } from './components/AuthForms/AuthContainer'
import { SearchPage } from './components/SearchPage/SearchPage'
import AuthService from './api/authService'
import DbService from './api/dbService'

function AppRoutes() {
  const navigate = useNavigate()
  
  return (
    <Routes>
      <Route
        path="/user" 
        element={
          <AuthContainer 
            onLogin={(params) => AuthService.login(params)} 
            onSignup={(params) => AuthService.signup(params)}
            onLoginSucceeds={() => {navigate('/employee')}}
            getDepartments={() => AuthService.getDepartments()}
            />}
            />
      <Route
        path="/employee"
        element={
          <SearchPage
            onSearch={(params) => DbService.searchEmployees(params)}
            onAddEmployee={() => {}}
            onImport={() => {}}
            onExport={() => {}}
            getFilterOptions={() => DbService.getFilterOptions()}
            />
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App