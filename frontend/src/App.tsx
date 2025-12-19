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
            onLogin={AuthService.login} 
            onSignup={AuthService.signup}
            onLoginSucceeds={() => navigate('/employee')}
            getDepartments={AuthService.getDepartments}
            />}
            />
      <Route
        path="/search"
        element={
          <SearchPage 
            onSearch={DbService.searchEmployees}
            onAddEmployee={() => {}}
            onImport={() => {}}
            onExport={() => {}}
            getFilterOptions={DbService.getFilterOptions}
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