import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { getRecentChats } from '@/services/api/messageService';

const Messages = ({ userRole, currentUser }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getRecentChats(currentUser.Id);
      setChats(data);
    } catch (err) {
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    navigate(`/chat/${chat.matchId}`);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadChats} />;
  if (chats.length === 0) {
    return (
      <Empty 
        title="No conversations yet"
        message="Your matched conversations will appear here. Start by finding some matches!"
        actionText="Find Matches"
        onAction={() => navigate('/matches')}
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
              Messages
            </h1>
            <p className="text-gray-400 text-sm">
              {chats.length} active {chats.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
          <button
            onClick={loadChats}
            className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <ApperIcon name="RotateCcw" size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="px-4 pb-8">
        <div className="space-y-3 max-w-2xl mx-auto">
          {chats.map((chat, index) => {
            const hasUnread = chat.unreadCount > 0;
            
            return (
              <motion.div
                key={chat.matchId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChatClick(chat)}
                className="swipe-card p-4 cursor-pointer group hover:border-primary-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <ApperIcon 
                        name={userRole === 'applicant' ? 'Building2' : 'User'} 
                        size={20} 
                        className="text-white" 
                      />
                    </div>
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate group-hover:gradient-text transition-all duration-200 ${hasUnread ? 'text-white' : 'text-gray-200'}`}>
                        {chat.otherUser.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTimeAgo(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 truncate">
                      {userRole === 'applicant' ? 
                        chat.otherUser.profile?.companyInfo?.name || 'Company' :
                        chat.otherUser.profile?.title || 'Job Seeker'
                      }
                    </p>

                    {chat.lastMessage && (
                      <div className="mt-2 flex items-center gap-2">
                        {chat.lastMessage.senderId === currentUser.Id && (
                          <ApperIcon name="ArrowRight" size={12} className="text-gray-500 flex-shrink-0" />
                        )}
                        <p className={`text-sm truncate ${hasUnread && chat.lastMessage.senderId !== currentUser.Id ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {chat.lastMessage.content.length > 50 
                            ? `${chat.lastMessage.content.substring(0, 50)}...`
                            : chat.lastMessage.content
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <ApperIcon 
                    name="ChevronRight" 
                    size={18} 
                    className="text-gray-400 group-hover:text-primary-400 transition-colors flex-shrink-0"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;