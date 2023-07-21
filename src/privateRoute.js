import { useSelector } from 'react-redux'; // or your state management library
import { Navigate, useRoutes, Outlet } from 'react-router-dom';


// Private Route
function PrivateRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth); // replace with your actual selector
  return userInfo ? <Outlet/> : <Navigate to="/login" replace />;
}

export default PrivateRoute;