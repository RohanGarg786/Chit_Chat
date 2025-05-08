// components/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalStateContext } from '../ContextApi/GlobalStateProvide';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error("useGlobalState must be used within a GlobalStateProvider");

  const { isAuthenticated, loading } = context;

  if (loading) return <div>Loading...</div>; // You can show a spinner here

  if (!isAuthenticated) return <Navigate to="/api/v1/user/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;
