import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import api from '../services/api';
import React from 'react';

interface AppUser {
  id: string;
  email: string;
  roles: string[];
}

interface Role {
  name: string;
}

export default function AdminPanel() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/api/Admin/users'),
        api.get('/api/Admin/roles')
      ]);
      // Filter out the main admin user (you can change the email if needed)
      const filteredUsers = usersRes.data.filter((u: AppUser) => u.email !== 'admin@gmail.com');
      setUsers(filteredUsers);
      setRoles(rolesRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      // Note: You'd need a new endpoint POST /api/Admin/roles to create role
      // For now, we'll just refresh (or implement it later)
      toast.info('Role creation endpoint not implemented yet');
      setNewRoleName('');
    } catch (err) {
      toast.error('Failed to add role');
    }
  };

  const handleAssignRole = async (userId: string, role: string) => {
    try {
      await api.post('/api/Admin/assign-role', { userId, role });
      toast.success('Role assigned successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to assign role');
    }
  };

  const handleAccordionChange = (userId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedUserId(isExpanded ? userId : false);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="admin tabs">
          <Tab label="Users" />
          <Tab label="Roles" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>

            {users.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', mt: 4, bgcolor: 'background.default' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No users yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Register a new user from the Login page, then assign them a role here.
                </Typography>
              </Paper>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <React.Fragment key={user.id}>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              onClick={() => handleAccordionChange(user.id)({} as any, expandedUserId !== user.id)}
                            >
                              <ExpandMoreIcon
                                sx={{
                                  transition: 'transform 0.2s',
                                  transform: expandedUserId === user.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel>Add Role</InputLabel>
                              <Select
                                label="Add Role"
                                defaultValue=""
                                onChange={(e) => handleAssignRole(user.id, e.target.value as string)}
                              >
                                <MenuItem value="" disabled>
                                  Select role
                                </MenuItem>
                                {roles.map((role) => (
                                  <MenuItem key={role} value={role} disabled={user.roles.includes(role)}>
                                    {role}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={3} sx={{ py: 0 }}>
                            <Accordion expanded={expandedUserId === user.id} square>
                              <AccordionSummary sx={{ display: 'none' }} />
                              <AccordionDetails>
                                <Typography variant="subtitle2" gutterBottom>
                                  Current Roles:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                      <Chip key={role} label={role} color="primary" size="small" />
                                    ))
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      No roles assigned
                                    </Typography>
                                  )}
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Role Management
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'end' }}>
              <TextField
                label="New Role Name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                size="small"
              />
              <Button variant="contained" onClick={handleAddRole}>
                Add Role
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {roles.map((role) => (
                <Chip key={role} label={role} color="secondary" />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}