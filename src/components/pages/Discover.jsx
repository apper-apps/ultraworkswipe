import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import SwipeCard from '@/components/organisms/SwipeCard';
import MatchModal from '@/components/organisms/MatchModal';
import { getSwipeableProfiles, createSwipe } from '@/services/api/swipeService';
import { toast } from 'react-toastify';

const Discover = ({ userRole, currentUser }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [isSwipeDisabled, setIsSwipeDisabled] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSwipeableProfiles(currentUser.Id, userRole);
      setProfiles(data);
      setCurrentIndex(0);
    } catch (err) {
      setError('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (isSwipeDisabled || currentIndex >= profiles.length) return;

    setIsSwipeDisabled(true);
    const currentProfile = profiles[currentIndex];

    try {
      const result = await createSwipe({
        fromUserId: currentUser.Id,
        toUserId: currentProfile.Id,
        direction: direction
      });

      if (direction === 'right') {
        if (result.isMatch) {
          setMatchedProfile(currentProfile);
          setShowMatch(true);
          toast.success('🎉 It\'s a match!');
        } else {
          toast.success('Profile liked!');
        }
      }

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        x.set(0);
        setIsSwipeDisabled(false);
      }, 300);

    } catch (err) {
      toast.error('Failed to process swipe');
      setIsSwipeDisabled(false);
    }
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfiles} />;
  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <Empty 
        title="No more profiles"
        message="You've seen all available profiles! Check back later for more matches."
        actionText="Refresh"
        onAction={loadProfiles}
      />
    );
  }

  const currentProfile = profiles[currentIndex];
  const remainingCount = profiles.length - currentIndex;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display gradient-text">
              Discover
            </h1>
            <p className="text-gray-400 text-sm">
              {remainingCount} {userRole === 'applicant' ? 'companies' : 'candidates'} remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadProfiles}
              className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <ApperIcon name="RotateCcw" size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="relative w-full max-w-sm">
          {/* Next cards (for depth) */}
          {profiles.slice(currentIndex + 1, currentIndex + 3).map((profile, index) => (
            <div
              key={profile.Id}
              className="absolute inset-0 swipe-card rounded-3xl"
              style={{
                transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
                opacity: 1 - (index + 1) * 0.3,
                zIndex: -(index + 1)
              }}
            />
          ))}

          {/* Current card */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            style={{ x, rotate, opacity }}
            className="relative z-10 cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.05 }}
            animate={{ scale: isSwipeDisabled ? 0.95 : 1 }}
          >
            <SwipeCard profile={currentProfile} userRole={userRole} />
            
            {/* Swipe indicators */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-accent-500/20 rounded-3xl border-4 border-accent-500"
              style={{ opacity: useTransform(x, [50, 200], [0, 1]) }}
            >
              <div className="bg-accent-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                LIKE
              </div>
            </motion.div>
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-3xl border-4 border-red-500"
              style={{ opacity: useTransform(x, [-200, -50], [1, 0]) }}
            >
              <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                PASS
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8">
        <div className="flex justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            disabled={isSwipeDisabled}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="X" size={24} className="text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            disabled={isSwipeDisabled}
            className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Heart" size={24} className="text-white" />
          </motion.button>
        </div>
      </div>

      {/* Match Modal */}
      {showMatch && matchedProfile && (
        <MatchModal
          profile={matchedProfile}
          userRole={userRole}
          onClose={() => {
            setShowMatch(false);
            setMatchedProfile(null);
          }}
        />
      )}
    </div>
  );
};

export default Discover;