import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GNB from './GNB';
import LNB from './LNB';
import Footer from './Footer';

export default function AppLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'enuma_admin') {
    return <Navigate to={`/clusters/${user?.clusterId}/student-dashboard`} replace />;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <LNB />
      <div className="flex flex-col flex-1">
        <GNB />
        <main className="flex-1 p-[30px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
