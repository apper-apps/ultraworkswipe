import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SwipeCard from "@/components/organisms/SwipeCard";
import MatchModal from "@/components/organisms/MatchModal";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { createSwipe, getSwipeableProfiles } from "@/services/api/swipeService";

function Discover({ userRole, currentUser }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  // Safe state setter that checks if component is still mounted
  const safeSetState = useCallback((setter) => {
    return (...args) => {
      if (isMountedRef.current) {
        setter(...args)
      }
    }
  }, [])

  const safeSetProfiles = safeSetState(setProfiles)
  const safeSetLoading = safeSetState(setLoading)
  const safeSetError = safeSetState(setError)

  // Load profiles with comprehensive error handling
  const loadProfiles = useCallback(async (isInitial = false) => {
    if (!currentUser?.Id) {
      const errorMsg = 'Missing user information. Please refresh the page.'
      console.error(errorMsg)
      safeSetError(errorMsg)
      safeSetLoading(false)
      return
    }

    try {
      if (isInitial) {
        safeSetLoading(true)
      }
      safeSetError(null)
      
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const dataPromise = getSwipeableProfiles(currentUser.Id, userRole, {
        signal: abortControllerRef.current.signal
      })
      
      const data = await Promise.race([dataPromise, timeoutPromise])
      
      if (isMountedRef.current && !abortControllerRef.current.signal.aborted) {
        safeSetProfiles(Array.isArray(data) ? data : [])
        safeSetLoading(false)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
      
      if (error.name === 'AbortError') {
        return // Request was cancelled, don't show error
      }
      
      if (isMountedRef.current) {
        const errorMessage = error.message || 'Failed to load profiles. Please try again.'
        safeSetError(errorMessage)
        safeSetLoading(false)
        
        if (!isInitial) {
          toast.error('Failed to load new profiles')
        }
      }
    }
  }, [currentUser?.Id, userRole, safeSetProfiles, safeSetLoading, safeSetError])

  // Initialize profiles when component mounts or user changes
  useEffect(() => {
    isMountedRef.current = true
    loadProfiles(true)

    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [loadProfiles])

  // Handle swipe action with comprehensive error handling
  const handleSwipe = useCallback(async (direction) => {
    if (!profiles.length || !currentUser?.Id || isProcessing) {
      return
    }
    
    const currentProfile = profiles[0]
    if (!currentProfile?.Id) {
      console.error('Invalid profile data')
      return
    }
    
    try {
      setIsProcessing(true)
      safeSetError(null)
      setSwipeDirection(direction)
      
      const result = await createSwipe({
        userId: currentUser.Id,
        targetUserId: currentProfile.Id,
        direction: direction,
        userRole: userRole
      })

      if (!isMountedRef.current) return

      // Remove the swiped profile
      safeSetProfiles(prev => prev.slice(1))

      // Check for match
      if (result?.isMatch && direction === 'right') {
        setMatchedProfile(currentProfile)
        setShowMatchModal(true)
      }

      // Load more profiles if running low
      if (profiles.length <= 2) {
        setTimeout(() => {
          if (isMountedRef.current) {
            loadProfiles(false)
          }
        }, 500)
      }
    } catch (error) {
      console.error('Error creating swipe:', error)
      
      if (isMountedRef.current) {
        const errorMessage = error.message || 'Failed to process swipe. Please try again.'
        toast.error(errorMessage)
        
        // Reset swipe direction on error
        setSwipeDirection(null)
      }
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false)
        // Reset swipe direction after animation
        setTimeout(() => {
          if (isMountedRef.current) {
            setSwipeDirection(null)
          }
        }, 300)
      }
    }
  }, [profiles, currentUser?.Id, userRole, isProcessing, loadProfiles, safeSetProfiles, safeSetError])

  const handleDragEnd = useCallback((event, info) => {
    const threshold = 100
    
    if (Math.abs(info.offset.x) > threshold && !isProcessing) {
      const direction = info.offset.x > 0 ? 'right' : 'left'
      handleSwipe(direction)
    } else {
      x.set(0)
    }
  }, [handleSwipe, isProcessing, x])

  // Retry function for error recovery
  const handleRetry = useCallback(() => {
    loadProfiles(true)
  }, [loadProfiles])

  // Loading state
  if (loading && profiles.length === 0) {
    return <Loading />
  }

  // Error state
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={handleRetry}
      />
    )
  }

  // Empty state
  if (!loading && profiles.length === 0) {
    return (
      <Empty 
        message="No more profiles to show" 
        onRefresh={handleRetry}
      />
    )
  }

  const currentProfile = profiles[0]
  const remainingCount = profiles.length - 1

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <ApperIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold gradient-text">Discover</h1>
        </div>
        <div className="text-sm text-gray-600">
          {remainingCount > 0 ? `${remainingCount} more` : 'Last one!'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="relative w-full max-w-sm">
          {/* Current Profile Card */}
          {currentProfile && (
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate, opacity }}
              onDragEnd={handleDragEnd}
              className="relative z-10"
              animate={swipeDirection ? {
                x: swipeDirection === 'right' ? 300 : -300,
                opacity: 0,
                transition: { duration: 0.3 }
              } : {}}
            >
              <SwipeCard 
                profile={currentProfile} 
                userRole={userRole}
              />
            </motion.div>
          )}

          {/* Next Profile Card (Preview) */}
          {profiles[1] && (
            <div className="absolute inset-0 z-0 transform scale-95 opacity-50">
              <SwipeCard 
                profile={profiles[1]} 
                userRole={userRole}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-8 p-6 bg-white">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          disabled={!currentProfile || isProcessing}
          className="btn-secondary w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-50"
        >
          <ApperIcon name="X" className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          disabled={!currentProfile || isProcessing}
          className="btn-primary w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-50"
        >
          <ApperIcon name="Heart" className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedProfile && (
        <MatchModal
          profile={matchedProfile}
          userRole={userRole}
          onClose={() => {
            setShowMatchModal(false)
            setMatchedProfile(null)
          }}
        />
      )}
    </div>
  )
}

export default Discover