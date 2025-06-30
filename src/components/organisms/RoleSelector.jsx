import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { createUser } from '@/services/api/userService';
import { toast } from 'react-toastify';

const RoleSelector = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: '',
    bio: ''
  });

  const roles = [
    {
      type: 'applicant',
      title: 'Job Seeker',
      subtitle: 'Find your dream job',
      description: 'Swipe through amazing job opportunities and connect with top companies',
      icon: 'User',
      gradient: 'from-primary-500 to-secondary-500',
      benefits: ['Access to exclusive jobs', 'Direct company contact', 'Personalized matches']
    },
    {
      type: 'company',
      title: 'Employer',
      subtitle: 'Discover top talent',
      description: 'Find the perfect candidates for your open positions',
      icon: 'Building2',
      gradient: 'from-secondary-500 to-accent-500',
      benefits: ['Quality candidates', 'Efficient hiring', 'Perfect matches']
    }
  ];

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        type: selectedRole.type,
        name: formData.name,
        email: formData.email,
        profile: {
          bio: formData.bio,
          ...(selectedRole.type === 'company' ? {
            companyInfo: {
              name: formData.company,
              industry: 'Technology'
            }
          } : {
            title: formData.title
          })
        }
      };

      const newUser = await createUser(userData);
      toast.success(`Welcome to WorkSwipe, ${formData.name}!`);
      onRoleSelect(selectedRole.type, newUser);
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="swipe-card rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${selectedRole.gradient} flex items-center justify-center`}>
                <ApperIcon name={selectedRole.icon} size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold font-display gradient-text mb-2">
                Complete Your Profile
              </h2>
              <p className="text-gray-400">
                {selectedRole.type === 'applicant' ? 'Let companies discover you' : 'Attract top talent'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>

              {selectedRole.type === 'company' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                    placeholder="Your company name"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                  placeholder={selectedRole.type === 'applicant' ? 'Tell companies about yourself...' : 'Describe your company culture...'}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 btn-primary bg-gradient-to-r ${selectedRole.gradient}`}
                >
                  Get Started
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-display gradient-text mb-4">
            WorkSwipe
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The future of job matching. Swipe your way to the perfect career opportunity.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.type}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleClick(role)}
              className="swipe-card rounded-3xl p-8 cursor-pointer group overflow-hidden relative"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${role.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={role.icon} size={40} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold font-display text-center mb-2 group-hover:gradient-text transition-all duration-300">
                  {role.title}
                </h3>
                
                <p className="text-lg text-center text-gray-400 mb-4">
                  {role.subtitle}
                </p>
                
                <p className="text-gray-300 text-center mb-6">
                  {role.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {role.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <ApperIcon name="Check" size={16} className="text-accent-500 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className={`w-full btn-primary bg-gradient-to-r ${role.gradient} text-center`}>
                  Continue as {role.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: 'Zap', title: 'Instant Matches', desc: 'Get matched with relevant opportunities instantly' },
              { icon: 'Shield', title: 'Verified Profiles', desc: 'All profiles are verified for authenticity' },
              { icon: 'MessageSquare', title: 'Direct Messaging', desc: 'Chat directly with matches without barriers' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <ApperIcon name={feature.icon} size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelector;