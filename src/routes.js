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

// ------------------------------------------- 
export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element:<PrivateRoute>
          <DashboardAppPage />
        </PrivateRoute>  
           },
        { path: 'user', element: 
        <PrivateRoute>
          <UserPage />
        </PrivateRoute>
       },
        { path: 'products', element:
        <PrivateRoute>    
          <ProductsPage />
        </PrivateRoute>
       },
        { path: 'blog', element:
      <PrivateRoute>
        <BlogPage />
      </PrivateRoute>  
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
