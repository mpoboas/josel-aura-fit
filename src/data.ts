import { UserProfile, Workout, Challenge, BossChallenge, LeaderboardEntry, Badge, SocialWorkout } from "./types";

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Miguel Póvoas",
  level: 12,
  xp: 3100,
  xpToNextLevel: 5000,
  rank: "Silver",
  streak: 14,
  streakShields: 1,
  globalRank: 48,
  workoutsCompleted: 48,
  onboardingComplete: true,
  playerType: "Explorer",
  octalysisScores: {
    meaning: 50,
    accomplishment: 80,
    creativity: 70,
    ownership: 65,
    influence: 75,
    scarcity: 55,
    curiosity: 60,
    avoidance: 70
  }
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: "streak_14",
    name: "14-day streak",
    description: "Maintained a consecutive workout behavior for 14 straight days. True discipline!",
    icon: "Flame",
    type: "gold",
    unlockedAt: "2026-05-20"
  },
  {
    id: "pr_hunter",
    name: "PR hunter",
    description: "Shattered pre-existing limitations by logging a brand new Personal Record.",
    icon: "Barbell",
    type: "blue",
    unlockedAt: "2026-05-25"
  },
  {
    id: "cardio_start",
    name: "Cardio start",
    description: "Balanced strength conditioning splits with high-impact cardiovascular endurance logs.",
    icon: "Activity",
    type: "green",
    unlockedAt: "2026-05-27"
  },
  {
    id: "streak_30",
    name: "30-day streak",
    description: "An elite tier display of ultimate fitness habit execution over 30 days.",
    icon: "Lock",
    type: "gray"
  },
  {
    id: "iron_boss",
    name: "Iron Conqueror",
    description: "Fell the monthly Boss Challenge under your heavy lifting gauntlet.",
    icon: "Trophy",
    type: "blue"
  },
  {
    id: "squad_lead",
    name: "Squad General",
    description: "Supported a group effort by carrying over 50% of a group's combined target.",
    icon: "Users",
    type: "green"
  }
];

export const INITIAL_WORKOUT_HISTORY: Workout[] = [
  {
    id: "w_1",
    title: "Upper Body Hypertrophy",
    date: "12 May",
    rawDate: "2026-05-12T10:00:00.000Z",
    duration: 45,
    xpEarned: 600,
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        category: "Chest",
        sets: [
          { id: "s1", weight: 75, reps: 10 },
          { id: "s2", weight: 80, reps: 8 },
          { id: "s3", weight: 80, reps: 8 }
        ]
      }
    ]
  },
  {
    id: "w_2",
    title: "Quad Focused Push",
    date: "15 May",
    rawDate: "2026-05-15T11:00:00.000Z",
    duration: 50,
    xpEarned: 720,
    exercises: [
      {
        id: "e2",
        name: "Squats",
        category: "Legs",
        sets: [
          { id: "s4", weight: 100, reps: 8 },
          { id: "s5", weight: 110, reps: 6 }
        ]
      }
    ]
  },
  {
    id: "w_3",
    title: "Back and Core Strength",
    date: "19 May",
    rawDate: "2026-05-19T09:30:00.000Z",
    duration: 40,
    xpEarned: 580,
    exercises: [
      {
        id: "e3",
        name: "Deadlifts",
        category: "Back",
        sets: [{ id: "s6", weight: 140, reps: 5 }]
      }
    ]
  },
  {
    id: "w_4",
    title: "Shoulder Intensity Split",
    date: "22 May",
    rawDate: "2026-05-22T17:15:00.000Z",
    duration: 35,
    xpEarned: 500,
    exercises: [
      {
        id: "e4",
        name: "Overhead Press",
        category: "Shoulders",
        sets: [
          { id: "s7", weight: 55, reps: 8 },
          { id: "s8", weight: 60, reps: 6 }
        ]
      }
    ]
  },
  {
    id: "w_5",
    title: "High-Intensity Functional Interval",
    date: "25 May",
    rawDate: "2026-05-25T08:00:00.000Z",
    duration: 45,
    xpEarned: 840,
    exercises: [
      {
        id: "e5",
        name: "Treadmill Run",
        category: "Cardio",
        sets: [{ id: "s9", weight: 0, reps: 20 }] // 20 minutes
      }
    ]
  },
  {
    id: "w_6",
    title: "Chest Day Powerhouse",
    date: "Today",
    rawDate: "2026-05-28T09:41:00.000Z",
    duration: 42,
    xpEarned: 840,
    exercises: [
      {
        id: "ex_bp",
        name: "Bench Press",
        category: "Chest",
        sets: [
          { id: "s10", weight: 80, reps: 8 },
          { id: "s11", weight: 85, reps: 6 },
          { id: "s12", weight: 90, reps: 5, isPR: true }
        ]
      },
      {
        id: "ex_ohp",
        name: "Overhead Press",
        category: "Shoulders",
        sets: [
          { id: "s13", weight: 60, reps: 8 },
          { id: "s14", weight: 62.5, reps: 7 }
        ]
      }
    ]
  }
];

export const INITIAL_BOSS_CHALLENGE: BossChallenge = {
  title: "May Iron Gauntlet",
  description: "Log 16 workouts & hit a PR in squat, bench, or deadlift to overcome the monthly beast.",
  workoutsGoal: 16,
  workoutsCurrent: 6,
  prGoalCount: 1,
  prCurrentCount: 1, // hit 90kg bench today
  xpReward: 2500,
  shieldReward: 1,
  badgeReward: "iron_boss",
  completed: false
};

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "ch_pr_sprint",
    title: "Weekly PR Sprint",
    description: "Hit 3 PRs this week to claim bonus points",
    type: "Weekly",
    progress: 66,
    goalText: "2/3 PRs hit",
    xpReward: 500,
    completed: false
  },
  {
    id: "ch_cardio",
    title: "Cardio Balance",
    description: "1 high-energy cardio session per week to ensure dynamic conditioning",
    type: "Weekly",
    progress: 100,
    goalText: "1/1 session",
    xpReward: 350,
    completed: true
  },
  {
    id: "ch_push_perfectionist",
    title: "Push Day Perfectionist",
    description: "Complete a full push session containing 3+ distinct compound exercises",
    type: "Daily",
    progress: 100,
    goalText: "3/3 exercises logged",
    xpReward: 150,
    completed: true
  },
  {
    id: "ch_sprint_lead",
    title: "Sprint Leaderboard",
    description: "Maintain the top weekly XP earner ranking among friends",
    type: "Weekly",
    progress: 55,
    goalText: "Currently Rank #4",
    xpReward: 400,
    completed: false
  },
  {
    id: "ch_squad_leg",
    title: "Group: Leg Day Pact",
    description: "Your squad combines strength indicators to log 10 total leg exercises this week",
    type: "Group",
    progress: 70,
    goalText: "7/10 joint sessions completed",
    xpReward: 600,
    completed: false
  }
];

export const INITIAL_FRIENDS_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Ana S.", avatar: "AS", xp: 6100, tier: "Gold" },
  { rank: 2, name: "João R.", avatar: "JR", xp: 4200, tier: "Silver" },
  { rank: 3, name: "Tiago F.", avatar: "TF", xp: 3850, tier: "Silver" },
  { rank: 4, name: "Miguel P.", avatar: "MP", xp: 3100, tier: "Silver", isMe: true },
  { rank: 5, name: "Carlos F.", avatar: "CF", xp: 2760, tier: "Bronze" },
  { rank: 6, name: "Maria G.", avatar: "MG", xp: 2430, tier: "Bronze" },
  { rank: 7, name: "Rui L.", avatar: "RL", xp: 1980, tier: "Bronze" }
];

export const INITIAL_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Alex Mercer", avatar: "AM", xp: 24800, tier: "Elite" },
  { rank: 2, name: "Sarah Connor", avatar: "SC", xp: 19500, tier: "Elite" },
  { rank: 3, name: "Dmitry Klokov", avatar: "DK", xp: 18200, tier: "Platinum" },
  { rank: 45, name: "John Doe", avatar: "JD", xp: 3450, tier: "Silver" },
  { rank: 46, name: "Jane Foster", avatar: "JF", xp: 3310, tier: "Silver" },
  { rank: 47, name: "Peter Parker", avatar: "PP", xp: 3200, tier: "Silver" },
  { rank: 48, name: "Miguel P.", avatar: "MP", xp: 3100, tier: "Silver", isMe: true },
  { rank: 49, name: "Bruce Wayne", avatar: "BW", xp: 3050, tier: "Silver" },
  { rank: 50, name: "Clark Kent", avatar: "CK", xp: 2980, tier: "Silver" }
];

export const INITIAL_SOCIAL_FEED: SocialWorkout[] = [
  {
    id: "sw_1",
    authorName: "Ana S.",
    authorAvatar: "AS",
    authorTier: "Gold",
    highFiveCount: 3,
    workout: {
      id: "fw_1",
      title: "Morning Leg Destroyer",
      date: "2h ago",
      rawDate: "2026-05-29T06:30:00.000Z",
      duration: 55,
      xpEarned: 920,
      exercises: [
        {
          id: "fe1",
          name: "Squats",
          category: "Legs",
          sets: [
            { id: "fs1", weight: 100, reps: 8 },
            { id: "fs2", weight: 110, reps: 6, isPR: true }
          ]
        },
        {
          id: "fe2",
          name: "Leg Press",
          category: "Legs",
          sets: [{ id: "fs3", weight: 180, reps: 10 }]
        }
      ]
    }
  },
  {
    id: "sw_2",
    authorName: "Miguel P.",
    authorAvatar: "MP",
    authorTier: "Silver",
    isMe: true,
    highFiveCount: 2,
    workout: {
      id: "w_6",
      title: "Chest Day Powerhouse",
      date: "Yesterday",
      rawDate: "2026-05-28T09:41:00.000Z",
      duration: 42,
      xpEarned: 840,
      exercises: [
        {
          id: "ex_bp",
          name: "Bench Press",
          category: "Chest",
          sets: [
            { id: "s10", weight: 80, reps: 8 },
            { id: "s11", weight: 85, reps: 6 },
            { id: "s12", weight: 90, reps: 5, isPR: true }
          ]
        },
        {
          id: "ex_ohp",
          name: "Overhead Press",
          category: "Shoulders",
          sets: [
            { id: "s13", weight: 60, reps: 8 },
            { id: "s14", weight: 62.5, reps: 7 }
          ]
        }
      ]
    }
  },
  {
    id: "sw_3",
    authorName: "João R.",
    authorAvatar: "JR",
    authorTier: "Silver",
    highFiveCount: 5,
    workout: {
      id: "fw_2",
      title: "Pull Day Volume",
      date: "Yesterday",
      rawDate: "2026-05-28T18:00:00.000Z",
      duration: 48,
      xpEarned: 780,
      exercises: [
        {
          id: "fe3",
          name: "Deadlifts",
          category: "Back",
          sets: [
            { id: "fs4", weight: 130, reps: 5 },
            { id: "fs5", weight: 140, reps: 3, isPR: true }
          ]
        },
        {
          id: "fe4",
          name: "Barbell Rows",
          category: "Back",
          sets: [{ id: "fs6", weight: 70, reps: 10 }]
        }
      ]
    }
  },
  {
    id: "sw_4",
    authorName: "Tiago F.",
    authorAvatar: "TF",
    authorTier: "Silver",
    highFiveCount: 1,
    workout: {
      id: "fw_3",
      title: "HIIT Cardio Blast",
      date: "2 days ago",
      rawDate: "2026-05-27T07:15:00.000Z",
      duration: 30,
      xpEarned: 450,
      exercises: [
        {
          id: "fe5",
          name: "Treadmill Run",
          category: "Cardio",
          sets: [{ id: "fs7", weight: 0, reps: 30 }]
        }
      ]
    }
  },
  {
    id: "sw_5",
    authorName: "Carlos F.",
    authorAvatar: "CF",
    authorTier: "Bronze",
    highFiveCount: 4,
    workout: {
      id: "fw_4",
      title: "Push Split Session",
      date: "2 days ago",
      rawDate: "2026-05-27T17:30:00.000Z",
      duration: 40,
      xpEarned: 620,
      exercises: [
        {
          id: "fe6",
          name: "Incline Dumbbell Press",
          category: "Chest",
          sets: [{ id: "fs8", weight: 32, reps: 10 }]
        },
        {
          id: "fe7",
          name: "Lateral Raises",
          category: "Shoulders",
          sets: [{ id: "fs9", weight: 12, reps: 15 }]
        }
      ]
    }
  },
  {
    id: "sw_6",
    authorName: "Maria G.",
    authorAvatar: "MG",
    authorTier: "Bronze",
    highFiveCount: 2,
    workout: {
      id: "fw_5",
      title: "Core & Conditioning",
      date: "3 days ago",
      rawDate: "2026-05-26T08:00:00.000Z",
      duration: 35,
      xpEarned: 380,
      exercises: [
        {
          id: "fe8",
          name: "Plank",
          category: "Core",
          sets: [{ id: "fs10", weight: 0, reps: 3 }]
        },
        {
          id: "fe9",
          name: "Stationary Bike",
          category: "Cardio",
          sets: [{ id: "fs11", weight: 0, reps: 20 }]
        }
      ]
    }
  }
];

export const PRESET_EXERCISES = [
  { name: "Bench Press", category: "Chest" },
  { name: "Incline Dumbbell Press", category: "Chest" },
  { name: "Squats", category: "Legs" },
  { name: "Leg Press", category: "Legs" },
  { name: "Deadlifts", category: "Back" },
  { name: "Barbell Rows", category: "Back" },
  { name: "Lat Pulldowns", category: "Back" },
  { name: "Overhead Press", category: "Shoulders" },
  { name: "Lateral Raises", category: "Shoulders" },
  { name: "Bicep Curls", category: "Arms" },
  { name: "Tricep Pushdowns", category: "Arms" },
  { name: "Treadmill Run", category: "Cardio" },
  { name: "Stationary Bike", category: "Cardio" },
  { name: "Plank", category: "Core" },
  { name: "Leg Raises", category: "Core" }
];
