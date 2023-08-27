import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SignUpPage from './pages/SignUpPage';
import PrivateRoute from './privateRoute';
import Product from './pages/Product.tsx';
import ReccomendationPage from './pages/ReccomendationPage';

// -------------------------------------------
export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: 'app',
          element: (
            <PrivateRoute>
              <DashboardAppPage />
            </PrivateRoute>
          ),
        },
        {
          path: 'user',
          element: (
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          ),
        },
        {
          path: 'cars',
          element: (
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          ),
        },
        {
          path: 'car',
          element: (
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          ),
        },
        {
          path: 'reccomendations',
          element: (
            <PrivateRoute>
              <ReccomendationPage />
            </PrivateRoute>
          ),
        },
        {
          path: 'blog',
          element: (
            <PrivateRoute>
              <BlogPage />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignUpPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
