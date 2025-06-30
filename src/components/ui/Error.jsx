import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </motion.div>

        {/* Error Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-white mb-2"
        >
          Oops! Something went wrong
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          {message}
        </motion.p>

        {/* Retry Button */}
        {onRetry && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="btn-primary bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center gap-2 mx-auto"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </motion.button>
        )}

        {/* Decorative Elements */}
        <div className="mt-8 opacity-30">
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-600 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Error;