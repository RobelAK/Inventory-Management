import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/Auth/login', { email, password });
      login(response.data.token);
      toast.success('Login successful!');
    } catch (err: any) {
      toast.error(err.response?.data || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Inventory Management
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            Sign in to manage inventory
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Typography align="center">
              Demo credentials: <strong>admin@example.com</strong> / <strong>Password123!</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}