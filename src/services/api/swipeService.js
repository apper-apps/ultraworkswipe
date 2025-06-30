import { matches } from "@/services/mockData/matches.json";
import { users } from "@/services/mockData/users.json";
import { swipes } from "@/services/mockData/swipes.json";

// Simulated delay for realistic API behavior
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Store data in memory (in a real app, this would be a database)
const swipeData = [...swipes]
const matchData = [...matches]
const userData = [...users]

export async function getSwipeableProfiles(userId, userRole, options = {}) {
  try {
    // Support for abort signal
    if (options.signal?.aborted) {
      throw new Error('Request aborted')
    }

    await delay(800)

    // Validate inputs
    if (!userId || !userRole) {
      throw new Error('Missing required parameters: userId and userRole')
    }

    // Check if request was aborted during delay
    if (options.signal?.aborted) {
      throw new Error('Request aborted')
    }

    // Get user's existing swipes
    const userSwipes = swipeData.filter(swipe => swipe?.userId === userId)
    const swipedUserIds = userSwipes.map(swipe => swipe?.targetUserId).filter(Boolean)

    // Filter profiles based on user role
    const targetRole = userRole === 'company' ? 'candidate' : 'company'
    const availableProfiles = userData.filter(user => 
      user && 
      user.role === targetRole && 
      user.Id !== userId &&
      !swipedUserIds.includes(user.Id) &&
      user.Id // Ensure user has valid ID
    )

    // Shuffle profiles for variety
    const shuffled = availableProfiles.sort(() => Math.random() - 0.5)
    
    return shuffled.slice(0, 10) // Return up to 10 profiles
  } catch (error) {
    console.error('Error in getSwipeableProfiles:', error)
    throw error
  }
}

export async function createSwipe(swipeRequest) {
  try {
    await delay(500)

    // Validate required fields
    if (!swipeRequest?.userId || !swipeRequest?.targetUserId || !swipeRequest?.direction) {
      throw new Error('Missing required swipe data')
    }

    const newSwipe = {
      id: Date.now(),
      userId: swipeRequest.userId,
      targetUserId: swipeRequest.targetUserId,
      direction: swipeRequest.direction,
      userRole: swipeRequest.userRole,
      timestamp: new Date().toISOString()
    }

    // Add to swipes array
    swipeData.push(newSwipe)

    // Check for match (both users swiped right on each other)
    const targetSwipe = swipeData.find(swipe => 
      swipe?.userId === newSwipe.targetUserId &&
      swipe?.targetUserId === newSwipe.userId &&
      swipe?.direction === 'right'
    )

    let isMatch = false
    if (newSwipe.direction === 'right' && targetSwipe) {
      isMatch = true
      
      // Create match record
      const newMatch = {
        id: Date.now(),
        user1Id: newSwipe.userId,
        user2Id: newSwipe.targetUserId,
        timestamp: new Date().toISOString(),
        status: 'active'
      }

      matchData.push(newMatch)
    }

    return {
      success: true,
      isMatch,
      swipe: newSwipe
    }
  } catch (error) {
    console.error('Error in createSwipe:', error)
    throw error
  }
}

export async function getSwipes(userId) {
  try {
    await delay(300)
    
    if (!userId) {
      throw new Error('Missing userId parameter')
    }
    
    return swipeData.filter(swipe => swipe?.userId === userId)
  } catch (error) {
console.error('Error in getSwipes:', error)
    throw error
  }
}