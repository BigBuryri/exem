import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ConfigProvider } from './contexts/ConfigContext'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import HomeRedirect from './components/HomeRedirect'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ApplicationForm from './pages/ApplicationForm'
import Applications from './pages/Applications'
import AdminDashboard from './pages/AdminDashboard'
import AdminApplications from './pages/AdminApplications'

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFDD0',
                color: '#000000',
                border: '1px solid #DAA520',
                fontFamily: 'Oswald, sans-serif',
              },
              success: {
                style: {
                  background: '#FFFDD0',
                  color: '#006400',
                  border: '1px solid #006400',
                },
              },
              error: {
                style: {
                  background: '#FFFDD0',
                  color: '#DC143C',
                  border: '1px solid #DC143C',
                },
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<ApplicationForm />} />
                
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/applications" element={<AdminApplications />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
