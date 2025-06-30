import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import RoleSelector from '@/components/organisms/RoleSelector';
import Discover from '@/components/pages/Discover';
import Matches from '@/components/pages/Matches';
import Messages from '@/components/pages/Messages';
import Profile from '@/components/pages/Profile';
import Chat from '@/components/pages/Chat';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user has previously selected a role
    const savedRole = localStorage.getItem('workswipe_user_role');
    const savedUser = localStorage.getItem('workswipe_current_user');
    
    if (savedRole && savedUser) {
      setUserRole(savedRole);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleRoleSelect = (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
    localStorage.setItem('workswipe_user_role', role);
    localStorage.setItem('workswipe_current_user', JSON.stringify(user));
  };

  const handleResetRole = () => {
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem('workswipe_user_role');
    localStorage.removeItem('workswipe_current_user');
  };

  if (!userRole || !currentUser) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-gray-800">
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
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;