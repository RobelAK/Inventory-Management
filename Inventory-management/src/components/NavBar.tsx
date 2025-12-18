import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const { isAuthenticated, roles, logout } = useAuth();
  const navigate = useNavigate();

  // Get username from JWT or fallback to email from localStorage (optional)
  // For simplicity, we'll use email from localStorage if needed
  let userEmail = localStorage.getItem('userEmail') || 'User';

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory management
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {roles.includes('Admin') && (
            <Button color="inherit" onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
          )}

          <Typography variant="body1" color="inherit">
            {userEmail}
          </Typography>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}