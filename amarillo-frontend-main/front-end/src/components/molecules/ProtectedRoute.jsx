/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/errorpage" replace />;
  }

  return children;
};

export default ProtectedRoute;
