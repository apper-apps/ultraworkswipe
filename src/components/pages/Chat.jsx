import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getMessages, sendMessage, getMatchById } from '@/services/api/messageService';
import { toast } from 'react-toastify';

const Chat = ({ userRole, currentUser }) => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [matchData, messagesData] = await Promise.all([
        getMatchById(matchId),
        getMessages(matchId)
      ]);
      
      setMatch(matchData);
      setMessages(messagesData);
    } catch (err) {
      setError('Failed to load conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const message = await sendMessage({
        matchId: matchId,
        senderId: currentUser.Id,
        content: messageText
      });
      
      setMessages(prev => [...prev, message]);
    } catch (err) {
      toast.error('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!match) return <Error message="Conversation not found" onRetry={() => navigate('/matches')} />;

  const otherUser = match.otherUser;

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-gray-900 to-gray-800">
      {/* Header */}
      <div className="glass-effect border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/messages')}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} className="text-gray-300" />
        </button>
        
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
          <ApperIcon 
            name={userRole === 'applicant' ? 'Building2' : 'User'} 
            size={16} 
            className="text-white" 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white truncate">{otherUser.name}</h2>
          <p className="text-sm text-gray-400 truncate">
            {userRole === 'applicant' ? 
              otherUser.profile?.companyInfo?.name || 'Company' :
              otherUser.profile?.title || 'Job Seeker'
            }
          </p>
        </div>
        
        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <ApperIcon name="MoreVertical" size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-gray-800/50 px-3 py-1 rounded-full">
                  <span className="text-xs text-gray-400">{date}</span>
                </div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUser.Id;
                const showAvatar = index === 0 || dateMessages[index - 1].senderId !== message.senderId;
                
                return (
                  <motion.div
                    key={message.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwnMessage && (
                      <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                          <ApperIcon 
                            name={userRole === 'applicant' ? 'Building2' : 'User'} 
                            size={14} 
                            className="text-white" 
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : ''}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
                            : 'bg-gray-800/80 text-gray-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <ApperIcon name="MessageCircle" size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start the conversation!</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                You matched with {otherUser.name}. Say hello and start building your professional connection.
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="glass-effect border-t border-white/10 p-4">
        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="w-11 h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ApperIcon name="Send" size={18} className="text-white" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;