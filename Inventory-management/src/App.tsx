import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import { RequireRole } from './components/RequireRole';
import { Container } from '@mui/material';

function App() {
  const { isAuthenticated, isLoading, roles } = useAuth();
  const isAdmin = roles.includes('Admin')
  console.log('roles', roles, isAdmin)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <NavBar />}

      <Container maxWidth="xl" sx={{ mt: isAuthenticated ? 0 : 8 }}>
        <Routes>
          {/* <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} /> */}
          <Route
            path="/login"
            element={
              !isAuthenticated
                ? <LoginPage />
                : isAdmin
                  ? <Navigate to="/admin" />
                  : <Navigate to="/" />
            }
          />

          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />

          {/* Protected Dashboard */}
          <Route
            path="/"
            element={
              <RequireRole allowedRoles={['InventoryManager']}>
                <Home />
              </RequireRole>
            }
          />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <RequireRole allowedRoles={['Admin']}>
                <AdminPanel />
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import { RequireRole } from './components/RequireRole';
// import AdminPanel from './pages/AdminPanel';
// import Home from './pages/Home';

// function App() {
//   const { isAuthenticated, isLoading, roles } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
//         <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />

//         {/* Inventory Dashboard - accessible to Admin and User */}
//         <Route
//           path="/"
//           element={
//             <RequireRole allowedRoles={['Admin', 'User']}>
//               <Home/>
//             </RequireRole>
//           }
//         />

//         {/* Admin Panel - only Admin */}
//         <Route
//           path="/admin"
//           element={
//             <RequireRole allowedRoles={['Admin']}>
//               <AdminPanel />
//             </RequireRole>
//           }
//         />

//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;