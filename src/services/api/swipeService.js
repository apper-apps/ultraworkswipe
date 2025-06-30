import { users } from '@/services/mockData/users.json';
import { swipes } from '@/services/mockData/swipes.json';
import { matches } from '@/services/mockData/matches.json';

let swipeData = [...swipes];
let matchData = [...matches];
let userData = [...users];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getSwipeableProfiles = async (userId, userRole) => {
  await delay(400);
  
  // Get user's existing swipes
  const userSwipes = swipeData.filter(s => s.fromUserId === userId);
  const swipedUserIds = userSwipes.map(s => s.toUserId);
  
  // Filter users of opposite type that haven't been swiped on
  const targetType = userRole === 'applicant' ? 'company' : 'applicant';
  const availableProfiles = userData.filter(user => 
    user.type === targetType && 
    user.Id !== userId && 
    !swipedUserIds.includes(user.Id)
  );

  // Add mock job data for companies
  return availableProfiles.map(profile => ({
    ...profile,
    jobs: profile.type === 'company' ? [
      { title: 'Senior Software Engineer', department: 'Engineering', salary: '$120k - $150k' },
      { title: 'Product Manager', department: 'Product', salary: '$110k - $140k' },
      { title: 'UX Designer', department: 'Design', salary: '$90k - $120k' }
    ] : undefined
  }));
};

export const createSwipe = async (swipeData) => {
  await delay(300);
  
  const newSwipe = {
    ...swipeData,
    Id: Math.max(...swipeData.map(s => s.Id), 0) + 1,
    timestamp: new Date().toISOString()
  };
  
  swipeData.push(newSwipe);
  
  // Check for match if it's a right swipe
  let isMatch = false;
  if (swipeData.direction === 'right') {
    const existingSwipe = swipeData.find(s => 
      s.fromUserId === swipeData.toUserId && 
      s.toUserId === swipeData.fromUserId && 
      s.direction === 'right'
    );
    
    if (existingSwipe) {
      // Create match
      const newMatch = {
        Id: Math.max(...matchData.map(m => m.Id), 0) + 1,
        users: [swipeData.fromUserId, swipeData.toUserId],
        createdAt: new Date().toISOString(),
        lastMessage: null,
        unreadCount: 0
      };
      matchData.push(newMatch);
      isMatch = true;
    }
  }
  
  return { ...newSwipe, isMatch };
};

export const getSwipes = async (userId) => {
  await delay(200);
  return swipeData.filter(s => s.fromUserId === userId).map(s => ({ ...s }));
};