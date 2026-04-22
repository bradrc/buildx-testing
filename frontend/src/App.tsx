import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CustomerManagement from './pages/CustomerManagement';
import CustomerRegistration from './pages/CustomerRegistration';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      
      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/customers/new" element={<CustomerRegistration />} />
        <Route path="/customers/edit/:id" element={<CustomerRegistration />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
