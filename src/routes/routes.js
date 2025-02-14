import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';  // Import Navigate for redirection
import persistedStore from '../persistedStore';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const Chat = React.lazy(() => import('../pages/Chat'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const ChatDashboard = React.lazy(() => import('../pages/ChatDashboard'));
const Header = React.lazy(() => import('../components/Header'));

// Protected route component to check for authentication
const ProtectedRoute = ({ children }) => {
  const token = persistedStore.token(); 
  console.log("Token:", token);
  // if (!token) {
  //   // If no token, redirect to login using Navigate
  //   return <Navigate to="/login" />;
  // }
  return children; // Render the children if the user is authenticated
};

// Define routes
const Routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/header',
    element: (<ProtectedRoute>
      <Header />
    </ProtectedRoute>)
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),  // Apply ProtectedRoute to wrap the chat page
  },
  {
    path: '/dashboard',
    element: (<ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>),
  },
  {
    path: '/chatDashboard',
    element: (<ProtectedRoute>
      <ChatDashboard />
    </ProtectedRoute>),
  }
];

export default Routes;
