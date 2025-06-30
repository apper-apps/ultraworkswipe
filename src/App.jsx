import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import RoleSelector from '@/components/organisms/RoleSelector'
import Discover from '@/components/pages/Discover'
import Matches from '@/components/pages/Matches'
import Messages from '@/components/pages/Messages'
import Profile from '@/components/pages/Profile'
import Chat from '@/components/pages/Chat'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center text-white max-w-md">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-6">We're sorry, but something unexpected happened. Please refresh the page to try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('userRole');
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedRole && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Validate parsed user data
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.Id) {
          setUserRole(savedRole);
          setCurrentUser(parsedUser);
        } else {
          console.warn('Invalid user data in localStorage, clearing...');
          localStorage.removeItem('userRole');
          localStorage.removeItem('currentUser');
        }
      }
    } catch (error) {
      console.error('Error loading saved user data:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
}
  }, []);

  const handleRoleSelect = (role, user) => {
    if (!role || !user || !user.Id) {
      console.error('Invalid role or user data provided');
      return;
    }
    
    try {
      setUserRole(role);
      setCurrentUser(user);
      localStorage.setItem('userRole', role);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleResetRole = () => {
    try {
      setUserRole(null);
      setCurrentUser(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!userRole || !currentUser) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <ErrorBoundary>
      <Router>
<Routes>
          <Route path="/" element={<Layout userRole={userRole} currentUser={currentUser} onResetRole={handleResetRole} />}>
            <Route index element={<Navigate to="/discover" replace />} />
            <Route path="discover" element={<Discover userRole={userRole} currentUser={currentUser} />} />
            <Route path="matches" element={<Matches userRole={userRole} currentUser={currentUser} />} />
            <Route path="messages" element={<Messages userRole={userRole} currentUser={currentUser} />} />
            <Route path="profile" element={<Profile userRole={userRole} currentUser={currentUser} />} />
            <Route path="chat/:matchId" element={<Chat userRole={userRole} currentUser={currentUser} />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-white/10 backdrop-blur-lg border border-white/20"
          bodyClassName="text-white"
          progressClassName="bg-gradient-to-r from-purple-500 to-blue-500"
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;