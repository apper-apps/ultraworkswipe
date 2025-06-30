import { users } from '@/services/mockData/users.json'
import { swipes } from '@/services/mockData/swipes.json'
import { matches } from '@/services/mockData/matches.json'

const swipeData = [...swipes];
const matchData = [...matches];
const userData = [...users];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getSwipeableProfiles(userId, userRole) {
  // Validate input parameters
  if (!userId || !userRole) {
    throw new Error('User ID and role are required');
  }

  try {
    await delay(500);
    
    // Get profiles that haven't been swiped on
    const swipedProfileIds = swipeData
      .filter(swipe => swipe?.swiperId === userId)
      .map(swipe => swipe?.swipedId)
      .filter(id => id != null);
// Filter profiles based on role
    const availableProfiles = userData
      .filter(user => user?.id !== userId) // Exclude self
      .filter(user => !swipedProfileIds.includes(user?.id))
      .filter(user => {
        if (!user?.type) return false; // Skip users without type
        
        if (userRole === 'individual') {
          return user.type === 'company';
        } else {
          return user.type === 'individual';
        }
      });

    return availableProfiles || [];
  } catch (error) {
    console.error('Error fetching swipeable profiles:', error);
    throw new Error('Failed to load profiles. Please try again.');
  }
}
export async function createSwipe(swiperId, swipedId, direction) {
  // Validate input parameters
  if (!swiperId || !swipedId || !direction) {
    throw new Error('Swiper ID, swiped ID, and direction are required');
  }

  if (!['left', 'right'].includes(direction)) {
    throw new Error('Direction must be either "left" or "right"');
  }

  try {
    await delay(300);

    const swipe = {
      id: Date.now(),
      swiperId,
      swipedId,
      direction,
      timestamp: new Date().toISOString()
    };

    swipeData.push(swipe);

    // Check if it's a match (both users swiped right on each other)
    let isMatch = false;
if (direction === 'right') {
      const reciprocalSwipe = swipeData.find(s => 
        s?.swiperId === swipedId && 
        s?.swipedId === swiperId && 
        s?.direction === 'right'
      );

      if (reciprocalSwipe) {
        isMatch = true;
        const match = {
          id: Date.now() + 1,
          user1Id: swiperId,
          user2Id: swipedId,
          timestamp: new Date().toISOString()
        };
        matchData.push(match);
      }
    }

    return { swipe, isMatch };
  } catch (error) {
    console.error('Error creating swipe:', error);
    throw new Error('Failed to process swipe. Please try again.');
  }
}

export async function getSwipes(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    await delay(200);
    return swipeData.filter(swipe => swipe?.swiperId === userId) || [];
  } catch (error) {
    console.error('Error fetching swipes:', error);
    throw new Error('Failed to load swipes. Please try again.');
  }
  return swipeData.filter(s => s.fromUserId === userId).map(s => ({ ...s }));
};