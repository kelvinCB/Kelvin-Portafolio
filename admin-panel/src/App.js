import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import TestPage from './pages/TestPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Lazy loading of components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Messages = lazy(() => import('./pages/Messages'));
const MessageDetail = lazy(() => import('./pages/MessageDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const ExportPage = lazy(() => import('./pages/ExportPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component for React Router v6
const ProtectedLayout = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <AuthProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/test" element={<TestPage />} />
                  
                  {/* Protected routes - using Layout for all routes */}
                  <Route element={<ProtectedLayout />}>
                    {/* Main route redirects to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Messages */}
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/messages/:id" element={<MessageDetail />} />
                    
                    {/* Profile and settings */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/export" element={<ExportPage />} />
                    
                    {/* Not found page */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
