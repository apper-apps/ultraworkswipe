import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { getMatches } from '@/services/api/matchService';

const Matches = ({ userRole, currentUser }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMatches(currentUser.Id);
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (match) => {
    navigate(`/chat/${match.Id}`);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMatches} />;
  if (matches.length === 0) {
    return (
      <Empty 
        title="No matches yet"
        message="Start swiping to find your perfect matches! Your connections will appear here."
        actionText="Start Swiping"
        onAction={() => navigate('/discover')}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display gradient-text">
              Matches
            </h1>
            <p className="text-gray-400 text-sm">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </p>
          </div>
          <button
            onClick={loadMatches}
            className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <ApperIcon name="RotateCcw" size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {matches.map((match, index) => {
            const otherUser = match.otherUser;
            const hasUnread = match.unreadCount > 0;
            
            return (
              <motion.div
                key={match.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMatchClick(match)}
                className="swipe-card p-4 cursor-pointer group hover:border-primary-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                      <ApperIcon 
                        name={userRole === 'applicant' ? 'Building2' : 'User'} 
                        size={24} 
                        className="text-white" 
                      />
                    </div>
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{match.unreadCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:gradient-text transition-all duration-200">
                          {otherUser.name}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {userRole === 'applicant' ? 
                            otherUser.profile?.companyInfo?.name || 'Company' :
                            otherUser.profile?.title || 'Job Seeker'
                          }
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(match.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Last Message */}
                    {match.lastMessage ? (
                      <div className="mt-2">
                        <p className={`text-sm truncate ${hasUnread ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {match.lastMessage.senderId === currentUser.Id ? 'You: ' : ''}
                          {match.lastMessage.content}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-primary-400 font-medium">
                          Start the conversation! 👋
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <ApperIcon 
                    name="ChevronRight" 
                    size={20} 
                    className="text-gray-400 group-hover:text-primary-400 transition-colors"
                  />
                </div>

                {/* Match indicator */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800/30 px-3 py-1 rounded-full">
                    <ApperIcon name="Heart" size={12} className="text-accent-500" />
                    <span>Matched {formatTimeAgo(match.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Matches;