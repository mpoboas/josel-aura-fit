export interface Set {
  id: string;
  weight: number; // in kg
  reps: number;
  isPR?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string; // "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Cardio" | "Core"
  sets: Set[];
}

export interface Workout {
  id: string;
  title: string;
  date: string; // readable e.g. "Thursday, 29 May"
  rawDate: string; // ISO format
  duration: number; // in minutes
  exercises: Exercise[];
  xpEarned: number;
}

export interface SocialWorkout {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTier: LeaderboardEntry["tier"];
  isMe?: boolean;
  workout: Workout;
  highFived?: boolean;
  highFiveCount: number;
}

export interface BossChallenge {
  title: string;
  description: string;
  workoutsGoal: number;
  workoutsCurrent: number;
  prGoalCount: number;
  prCurrentCount: number;
  xpReward: number;
  shieldReward: number;
  badgeReward: string;
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "Daily" | "Weekly" | "Group";
  progress: number; // 0 to 100
  goalText: string;
  xpReward: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Elite";
  isMe?: boolean;
  highFived?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide class or emoji representation
  type: "gold" | "blue" | "green" | "gray";
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Elite";
  streak: number;
  streakShields: number;
  globalRank: number;
  workoutsCompleted: number;
  onboardingComplete: boolean;
  playerType: "Achiever" | "Explorer" | "Socialiser" | "Killer" | "Undecided";
  octalysisScores: {
    meaning: number;
    accomplishment: number;
    creativity: number;
    ownership: number;
    influence: number;
    scarcity: number;
    curiosity: number;
    avoidance: number;
  };
}
