import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import App from '../App';

// Lazy loading komponen halaman
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Dompet = lazy(() => import('../pages/Dompet'));
const Transaksi = lazy(() => import('../pages/Transaksi'));
const DanaDarurat = lazy(() => import('../pages/DanaDarurat'));
const Goal = lazy(() => import('../pages/Goal'));
const Laporan = lazy(() => import('../pages/Laporan'));
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * GuestRoute - Mencegah user yang sudah login untuk kembali ke halaman login/register
 */
const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return !token ? children : <Navigate to="/dashboard" replace />;
};

/**
 * Wrapper untuk mendukung Lazy Loading dengan Suspense dan ProgressBar
 */
const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loading variant="progressbar" />}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        {React.createElement(Loadable(Login))}
      </GuestRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        {React.createElement(Loadable(Register))}
      </GuestRoute>
    ),
  },
  {
    // Dashboard Layout (App.jsx) menampung Sidebar yang Persistent
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: React.createElement(Loadable(Dashboard)),
      },
      {
        path: '/dompet',
        element: React.createElement(Loadable(Dompet)),
      },
      {
        path: '/transaksi',
        element: React.createElement(Loadable(Transaksi)),
      },
      {
        path: '/dana-darurat',
        element: React.createElement(Loadable(DanaDarurat)),
      },
      {
        path: '/laporan',
        element: React.createElement(Loadable(Laporan)),
      },
      {
        path: '/goal',
        element: React.createElement(Loadable(Goal)),
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);



export default router;
