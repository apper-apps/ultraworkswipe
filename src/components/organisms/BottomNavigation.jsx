import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const BottomNavigation = ({ userRole, currentUser, onResetRole }) => {
  const location = useLocation();

  const navItems = [
    { path: '/discover', icon: 'Heart', label: 'Discover' },
    { path: '/matches', icon: 'Users', label: 'Matches' },
    { path: '/messages', icon: 'MessageCircle', label: 'Messages' },
    { path: '/profile', icon: 'User', label: 'Profile' },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="glass-effect border-t border-white/10 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30' 
                      : 'hover:bg-white/10'
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <ApperIcon
                    name={item.icon}
                    size={24}
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-primary-400' 
                        : 'text-gray-400'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -inset-2 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;