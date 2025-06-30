import { messages } from '@/services/mockData/messages.json';
import { matches } from '@/services/mockData/matches.json';
import { users } from '@/services/mockData/users.json';

let messageData = [...messages];
let matchData = [...matches];
let userData = [...users];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getMessages = async (matchId) => {
  await delay(300);
  const matchMessages = messageData
    .filter(m => m.matchId === parseInt(matchId))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return matchMessages.map(m => ({ ...m }));
};

export const sendMessage = async (messageData) => {
  await delay(250);
  const newMessage = {
    ...messageData,
    Id: Math.max(...messageData.map(m => m.Id), 0) + 1,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  messageData.push(newMessage);
  
  // Update match's last message
  const matchIndex = matchData.findIndex(m => m.Id === parseInt(messageData.matchId));
  if (matchIndex !== -1) {
    matchData[matchIndex].lastMessage = { ...newMessage };
  }
  
  return { ...newMessage };
};

export const getRecentChats = async (userId) => {
  await delay(400);
  
  const userMatches = matchData
    .filter(match => match.users.includes(userId))
    .map(match => {
      const otherUserId = match.users.find(id => id !== userId);
      const otherUser = userData.find(u => u.Id === otherUserId);
      
      // Get messages for this match
      const matchMessages = messageData.filter(m => m.matchId === match.Id);
      const lastMessage = matchMessages.length > 0 
        ? matchMessages[matchMessages.length - 1] 
        : null;
      
      const unreadCount = matchMessages.filter(m => 
        m.senderId !== userId && !m.read
      ).length;
      
      return {
        matchId: match.Id,
        otherUser: { ...otherUser },
        lastMessage: lastMessage ? { ...lastMessage } : null,
        lastMessageTime: lastMessage ? lastMessage.timestamp : match.createdAt,
        unreadCount
      };
    })
    .filter(chat => chat.lastMessage) // Only show chats with messages
    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  
  return userMatches;
};

export const getMatchById = async (matchId) => {
  await delay(200);
  const match = matchData.find(m => m.Id === parseInt(matchId));
  if (!match) throw new Error('Match not found');
  
  const otherUserId = match.users.find(id => id !== match.users[0]); // This is simplified
  const otherUser = userData.find(u => u.Id === otherUserId);
  
  return {
    ...match,
    otherUser: { ...otherUser }
  };
};

export const markMessagesAsRead = async (matchId, userId) => {
  await delay(150);
  messageData.forEach(message => {
    if (message.matchId === parseInt(matchId) && message.senderId !== userId) {
      message.read = true;
    }
  });
  return true;
};