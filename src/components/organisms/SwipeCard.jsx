import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

function SwipeCard({ profile, userRole }) {
  // Defensive check for required props
  if (!profile || !userRole) {
    return null;
  }

  const isCompanyCard = userRole === 'individual';

  return (
    <motion.div
      className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ApperIcon className="w-8 h-8" />
            <span className="text-sm opacity-75">
              {isCompanyCard ? 'Company' : 'Individual'}
            </span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{profile.name || 'Unknown'}</h2>
<p className="text-lg opacity-90">{profile.title || 'No title'}</p>
            <p className="text-sm opacity-75">{profile.location || 'Location not specified'}</p>
          </div>
          
          <div className="mt-6">
            <p className="text-sm opacity-90 mb-2">About:</p>
            <p className="text-sm leading-relaxed">{profile.bio || 'No bio available'}</p>
          </div>
          
<div className="mt-4 flex flex-wrap gap-2">
            {profile.skills && Array.isArray(profile.skills) && profile.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {skill || 'Skill'}
              </span>
            ))}
          </div>
        </div>
        
        {/* Bio section */}
        {profile.bio && (
          <div className="mt-6 p-6 bg-gray-900/50">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">About</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Skills (for applicants) */}
        {!isCompanyCard && profile.profile?.skills && profile.profile.skills.length > 0 && (
          <div className="mb-6 p-6 bg-gray-900/30">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.profile.skills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {profile.profile.skills.length > 8 && (
                <span className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs">
                  +{profile.profile.skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Experience (for applicants) */}
        {!isCompanyCard && profile.profile?.experience && profile.profile.experience.length > 0 && (
          <div className="mb-6 p-6 bg-gray-900/30">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Experience</h3>
            <div className="space-y-3">
              {profile.profile.experience.slice(0, 2).map((exp, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-3">
                  <h4 className="font-medium text-white text-sm">{exp.title}</h4>
                  <p className="text-gray-400 text-xs">{exp.company}</p>
                  <p className="text-gray-500 text-xs">{exp.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company Info (for companies) */}
        {isCompanyCard && profile.profile?.companyInfo && (
          <div className="mb-6 p-6 bg-gray-900/30">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Industry</h3>
                <span className="px-3 py-1 bg-secondary-500/20 text-secondary-400 rounded-full text-xs font-medium">
                  {profile.profile.companyInfo.industry || 'Technology'}
                </span>
              </div>
              
              {profile.profile.companyInfo.size && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Company Size</h3>
                  <p className="text-gray-400 text-sm">{profile.profile.companyInfo.size}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs (for companies) */}
        {isCompanyCard && profile.jobs && profile.jobs.length > 0 && (
          <div className="mb-6 p-6 bg-gray-900/30">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Open Positions</h3>
            <div className="space-y-2">
              {profile.jobs.slice(0, 3).map((job, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-3">
                  <h4 className="font-medium text-white text-sm">{job.title}</h4>
                  <p className="text-gray-400 text-xs">{job.department}</p>
                  {job.salary && (
                    <p className="text-accent-400 text-xs font-medium">{job.salary}</p>
                  )}
                </div>
              ))}
              {profile.jobs.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{profile.jobs.length - 3} more positions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-auto p-6">
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-800/20 rounded-lg p-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Eye" size={12} />
              <span>Active today</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="MapPin" size={12} />
              <span>2.5 km away</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SwipeCard;