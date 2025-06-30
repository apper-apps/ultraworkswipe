// Service file - no React imports needed
import { matches } from "@/services/mockData/matches.json";
import { users } from "@/services/mockData/users.json";
import { swipes } from "@/services/mockData/swipes.json";

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
// Get profiles that haven't been swiped on
    const swipedProfileIds = swipeData
      .filter(swipe => swipe?.swiperId === userId)
      .map(swipe => swipe?.swipedId)
      .filter(Id => Id != null);
// Filter profiles based on role
    const availableProfiles = userData
      .filter(user => user?.Id !== userId) // Exclude self
      .filter(user => !swipedProfileIds.includes(user?.Id))
.filter(user => {
        if (!user?.type) return false; // Skip users without type
        
        if (userRole === 'applicant') {
          return user.type === 'company';
        } else {
          return user.type === 'applicant';
        }
      });

    return availableProfiles || [];
  } catch (error) {
    console.error('Error fetching swipeable profiles:', error);
    throw new Error('Failed to load profiles. Please try again.');
  }
}
export async function createSwipe({ fromUserId, toUserId, direction }) {
  // Validate input parameters
  if (!fromUserId || !toUserId || !direction) {
    throw new Error('From user ID, to user ID, and direction are required');
  }

  if (!['left', 'right'].includes(direction)) {
    throw new Error('Direction must be either "left" or "right"');
  }
  try {
    await delay(300);

const swipe = {
      id: Date.now(),
      swiperId: fromUserId,
      swipedId: toUserId,
      direction,
      timestamp: new Date().toISOString()
    };

    swipeData.push(swipe);

    // Check if it's a match (both users swiped right on each other)
    let isMatch = false;
if (direction === 'right') {
      const reciprocalSwipe = swipeData.find(s => 
        s?.swiperId === toUserId && 
        s?.swipedId === fromUserId && 
        s?.direction === 'right'
      );

if (reciprocalSwipe) {
        isMatch = true;
        const match = {
          id: Date.now() + 1,
          user1Id: fromUserId,
          user2Id: toUserId,
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
}