import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Profile = ({ userRole, currentUser, onResetRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    bio: currentUser.profile?.bio || '',
    title: currentUser.profile?.title || '',
    company: currentUser.profile?.companyInfo?.name || '',
    skills: currentUser.profile?.skills?.join(', ') || '',
    location: currentUser.profile?.location || ''
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      bio: currentUser.profile?.bio || '',
      title: currentUser.profile?.title || '',
      company: currentUser.profile?.companyInfo?.name || '',
      skills: currentUser.profile?.skills?.join(', ') || '',
      location: currentUser.profile?.location || ''
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Profile Views', value: '247', icon: 'Eye' },
    { label: 'Matches', value: '18', icon: 'Heart' },
    { label: 'Messages', value: '12', icon: 'MessageCircle' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display gradient-text">
            Profile
          </h1>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <ApperIcon name="Edit2" size={20} className="text-gray-400" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-400" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-xl transition-colors"
                >
                  <ApperIcon name="Check" size={20} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="swipe-card p-6"
          >
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <ApperIcon 
                  name={userRole === 'applicant' ? 'User' : 'Building2'} 
                  size={32} 
                  className="text-white" 
                />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-xl font-bold bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="Your name"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userRole === 'applicant' 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'bg-secondary-500/20 text-secondary-400'
                  }`}>
                    {userRole === 'applicant' ? 'Job Seeker' : 'Employer'}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className="text-gray-300">{currentUser.email}</p>
                )}
              </div>

              {userRole === 'applicant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      placeholder="e.g. Software Engineer"
                    />
                  ) : (
                    <p className="text-gray-300">{currentUser.profile?.title || 'Not specified'}</p>
                  )}
                </div>
              )}

              {userRole === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Company name"
                    />
                  ) : (
                    <p className="text-gray-300">{currentUser.profile?.companyInfo?.name || 'Not specified'}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                    placeholder="Tell others about yourself..."
                  />
                ) : (
                  <p className="text-gray-300">{currentUser.profile?.bio || 'No bio added yet'}</p>
                )}
              </div>

              {userRole === 'applicant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      placeholder="JavaScript, React, Node.js"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentUser.profile?.skills?.length > 0 ? (
                        currentUser.profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="swipe-card p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name={stat.icon} size={16} className="text-white" />
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="swipe-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Bell" size={20} className="text-gray-400" />
                  <span>Notifications</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Shield" size={20} className="text-gray-400" />
                  <span>Privacy</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <ApperIcon name="HelpCircle" size={20} className="text-gray-400" />
                  <span>Help & Support</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              </button>
            </div>
          </motion.div>

          {/* Switch Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="swipe-card p-6"
          >
            <button
              onClick={onResetRole}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl transition-all duration-200 text-white font-medium"
            >
              <ApperIcon name="RefreshCw" size={20} />
              Switch Role
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Switch between Job Seeker and Employer modes
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;