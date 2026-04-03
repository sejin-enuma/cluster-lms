import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import ClusterListPage from './pages/ClusterListPage';
import AccountManagementPage from './pages/AccountManagementPage';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/enuma-admin" element={<AppLayout />}>
            <Route path="clusters" element={<ClusterListPage />} />
            <Route path="accounts" element={<AccountManagementPage />} />
            <Route path="downloads" element={<div className="text-gray-500 text-center py-20">Downloads - Coming Soon</div>} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
