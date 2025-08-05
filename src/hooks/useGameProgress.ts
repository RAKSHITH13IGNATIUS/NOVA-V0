import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface GameProgress {
  level: number;
  searches: number;
  streak: number;
  badges: number;
  lastSearchDate: string | null;
}

const STORAGE_KEY = "nova-game-progress";
const STREAK_THRESHOLD = 86400000; // 24 hours in milliseconds

const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>({
    level: 1,
    searches: 0,
    streak: 0,
    badges: 0,
    lastSearchDate: null,
  });
  
  const { toast } = useToast();

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved);
        setProgress(parsedProgress);
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const incrementSearch = () => {
    setProgress((prev) => {
      const now = new Date().toISOString();
      const lastSearchTime = prev.lastSearchDate ? new Date(prev.lastSearchDate).getTime() : 0;
      const currentTime = new Date().getTime();
      
      // Check if it's been more than 24 hours since last search for streak
      let newStreak = prev.streak;
      if (lastSearchTime === 0) {
        // First search ever
        newStreak = 1;
      } else if (currentTime - lastSearchTime >= STREAK_THRESHOLD) {
        // More than 24 hours, increment streak
        newStreak = prev.streak + 1;
        
        toast({
          title: "🔥 Streak Increased!",
          description: `Amazing! You're on a ${newStreak}-day learning streak!`,
        });
      }

      const newSearches = prev.searches + 1;
      const newLevel = Math.floor(newSearches / 5) + 1;
      
      // Check for level up
      if (newLevel > prev.level) {
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You've reached Level ${newLevel}!`,
        });
      }

      // Check for badge milestones
      let newBadges = prev.badges;
      const badgeMilestones = [5, 10, 25, 50, 100];
      for (const milestone of badgeMilestones) {
        if (newSearches >= milestone && prev.searches < milestone) {
          newBadges++;
          toast({
            title: "🏅 New Badge Earned!",
            description: `You've earned the "${milestone} Searches" badge!`,
          });
        }
      }

      return {
        level: newLevel,
        searches: newSearches,
        streak: newStreak,
        badges: newBadges,
        lastSearchDate: now,
      };
    });
  };

  const resetProgress = () => {
    setProgress({
      level: 1,
      searches: 0,
      streak: 0,
      badges: 0,
      lastSearchDate: null,
    });
    toast({
      title: "Progress Reset",
      description: "Your learning journey starts fresh!",
    });
  };

  return {
    ...progress,
    incrementSearch,
    resetProgress,
  };
};

export default useGameProgress;