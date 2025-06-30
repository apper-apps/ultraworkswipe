import { matches } from '@/services/mockData/matches.json';
import { users } from '@/services/mockData/users.json';
import { messages } from '@/services/mockData/messages.json';

let matchData = [...matches];
let userData = [...users];
let messageData = [...messages];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getMatches = async (userId) => {
  await delay(350);
  
  const userMatches = matchData
    .filter(match => match.users.includes(userId))
    .map(match => {
      const otherUserId = match.users.find(id => id !== userId);
      const otherUser = userData.find(u => u.Id === otherUserId);
      
      // Get last message for this match
      const matchMessages = messageData.filter(m => m.matchId === match.Id);
      const lastMessage = matchMessages.length > 0 
        ? matchMessages[matchMessages.length - 1] 
        : null;
      
      // Count unread messages
      const unreadCount = matchMessages.filter(m => 
        m.senderId !== userId && !m.read
      ).length;
      
      return {
        ...match,
        otherUser: { ...otherUser },
        lastMessage: lastMessage ? { ...lastMessage } : null,
        unreadCount
      };
    })
    .sort((a, b) => {
      // Sort by last message time, then by match creation time
      const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(a.createdAt);
      const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(b.createdAt);
      return bTime - aTime;
    });
  
  return userMatches;
};

export const getMatchById = async (matchId) => {
  await delay(200);
  const match = matchData.find(m => m.Id === parseInt(matchId));
  if (!match) throw new Error('Match not found');
  
  const users = match.users.map(userId => 
    userData.find(u => u.Id === userId)
  );
  
  return {
    ...match,
    users: users.map(u => ({ ...u }))
  };
};

export const createMatch = async (matchData) => {
  await delay(300);
  const newMatch = {
    ...matchData,
    Id: Math.max(...matchData.map(m => m.Id), 0) + 1,
    createdAt: new Date().toISOString(),
    lastMessage: null,
    unreadCount: 0
  };
  matchData.push(newMatch);
  return { ...newMatch };
};