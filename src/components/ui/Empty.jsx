import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing here yet", 
  message = "It looks like there's nothing to show right now.",
  actionText = "Get Started",
  onAction 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Empty State Illustration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Search" size={24} className="text-white" />
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-8 -left-4 w-6 h-6 bg-accent-500/30 rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-16 -right-6 w-4 h-4 bg-secondary-500/30 rounded-full"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-8 left-2 w-3 h-3 bg-primary-500/30 rounded-full"
            animate={{ y: [-5, 15, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Empty State Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold font-display gradient-text mb-4"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8 leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Action Button */}
        {onAction && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="btn-primary bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center gap-2 mx-auto"
          >
            <ApperIcon name="Plus" size={16} />
            {actionText}
          </motion.button>
        )}

        {/* Subtle animation */}
        <motion.div
          className="mt-12 flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-gray-600 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Empty;