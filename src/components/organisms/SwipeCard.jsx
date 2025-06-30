import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SwipeCard = ({ profile, userRole }) => {
  const isCompanyCard = userRole === 'applicant';

  return (
    <div className="swipe-card h-[600px] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
          <ApperIcon 
            name={isCompanyCard ? 'Building2' : 'User'} 
            size={24} 
            className="text-white" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white mb-1 truncate">
            {profile.name}
          </h2>
          <p className="text-gray-400 text-sm">
            {isCompanyCard ? 
              profile.profile?.companyInfo?.name || 'Company' :
              profile.profile?.title || 'Job Seeker'
            }
          </p>
          {profile.profile?.location && (
            <div className="flex items-center gap-1 mt-1">
              <ApperIcon name="MapPin" size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500">{profile.profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.profile?.bio && (
        <div className="mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            {profile.profile.bio}
          </p>
        </div>
      )}

      {/* Skills (for applicants) */}
      {!isCompanyCard && profile.profile?.skills && profile.profile.skills.length > 0 && (
        <div className="mb-6">
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
        <div className="mb-6">
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
        <div className="mb-6">
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
        <div className="mb-6">
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
      <div className="mt-auto">
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
  );
};

export default SwipeCard;