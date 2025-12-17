import { Box, Container, Typography, Button } from '@mui/material';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
// import Dashboard from './pages/Dashboard'; // We'll create this next

function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return isAuthenticated ? <Home onLogout={logout} /> : <LoginPage />;
}

export default App;