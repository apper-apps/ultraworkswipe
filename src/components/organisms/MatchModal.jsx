import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const MatchModal = ({ profile, userRole, onClose }) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    // In a real app, this would get the actual match ID
    const matchId = `match_${profile.Id}_${Date.now()}`;
    navigate(`/chat/${matchId}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-sm swipe-card p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-accent-400 to-secondary-400 rounded-full"
              initial={{
                x: Math.random() * 300,
                y: -10,
                opacity: 0,
                scale: 0
              }}
              animate={{
                y: 400,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Match Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Heart" size={32} className="text-white" />
        </motion.div>

        {/* Text */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold font-display gradient-text mb-2"
        >
          It's a Match!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          You and {profile.name} liked each other! Start a conversation now.
        </motion.p>

        {/* Profile Preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 bg-gray-800/50 rounded-2xl p-4 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <ApperIcon 
              name={userRole === 'applicant' ? 'Building2' : 'User'} 
              size={20} 
              className="text-white" 
            />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-white">{profile.name}</h3>
            <p className="text-sm text-gray-400">
              {userRole === 'applicant' ? 
                profile.profile?.companyInfo?.name || 'Company' :
                profile.profile?.title || 'Job Seeker'
              }
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
          >
            Keep Swiping
          </motion.button>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartChat}
            className="flex-1 btn-primary bg-gradient-to-r from-accent-500 to-secondary-500"
          >
            Say Hello 👋
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MatchModal;