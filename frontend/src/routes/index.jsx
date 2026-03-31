import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Loading from '../components/Loading';

// Lazy loading komponen halaman
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

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
    element: React.createElement(Loadable(Home)),
  },
  {
    path: '/login',
    element: React.createElement(Loadable(Login)),
  },
  {
    path: '/register',
    element: React.createElement(Loadable(Register)),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);


export default router;
