import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function HomeRedirect() {
  const { user } = useAuth()
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return <Navigate to="/dashboard" replace />
}
