import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography } from '@mui/material';
import type { JSX } from 'react';

interface RequireRoleProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export const RequireRole = ({ children, allowedRoles }: RequireRoleProps) => {
  const { isAuthenticated, roles, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;
  console.log("roles", roles)
  const hasRole = roles.some(role => allowedRoles.includes(role));

  if (!hasRole) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Typography variant="h5">Access Denied</Typography>
        <Typography>Your account is pending approval or does not have required permissions.</Typography>
      </div>
    );
  }

  return children;
};