import { useState, useEffect } from "react";
import { UserProfile, Workout, Challenge, BossChallenge, LeaderboardEntry, Badge, SocialWorkout } from "./types";
import {
  DEFAULT_USER_PROFILE,
  INITIAL_CHALLENGES,
  INITIAL_BOSS_CHALLENGE,
  INITIAL_FRIENDS_LEADERBOARD,
  INITIAL_GLOBAL_LEADERBOARD,
  INITIAL_BADGES,
  INITIAL_WORKOUT_HISTORY,
  INITIAL_SOCIAL_FEED
} from "./data";

import HomeView from "./components/HomeView";
import WorkoutLogView from "./components/WorkoutLogView";
import LeaderboardView from "./components/LeaderboardView";
import ChallengesView from "./components/ChallengesView";
import ProfileView from "./components/ProfileView";
import OnboardingSurvey from "./components/OnboardingSurvey";
import MainQuizOverlay from "./components/MainQuizOverlay";

import { Home, Plus, Trophy, Target, User } from "lucide-react";

type Tab = "Home" | "Log" | "Rank" | "Goals" | "Profile";

const NAV_ITEMS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "Home", label: "Home", icon: Home },
  { id: "Rank", label: "Rank", icon: Trophy },
  { id: "Log", label: "Log", icon: Plus },
  { id: "Goals", label: "Goals", icon: Target },
  { id: "Profile", label: "Profile", icon: User },
];

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("fq_profile_v2");
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>(() => {
    const saved = localStorage.getItem("fq_workouts_v2");
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_HISTORY;
  });

  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("fq_challenges_v2");
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [bossChallenge, setBossChallenge] = useState<BossChallenge>(() => {
    const saved = localStorage.getItem("fq_boss_v2");
    return saved ? JSON.parse(saved) : INITIAL_BOSS_CHALLENGE;
  });

  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem("fq_friends_v2");
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS_LEADERBOARD;
  });

  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem("fq_global_v2");
    return saved ? JSON.parse(saved) : INITIAL_GLOBAL_LEADERBOARD;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem("fq_badges_v2");
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [socialFeed, setSocialFeed] = useState<SocialWorkout[]>(() => {
    const saved = localStorage.getItem("fq_social_feed_v2");
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_FEED;
  });

  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [showDrivesQuiz, setShowDrivesQuiz] = useState(false);

  useEffect(() => {
    localStorage.setItem("fq_profile_v2", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("fq_workouts_v2", JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem("fq_challenges_v2", JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  useEffect(() => {
    localStorage.setItem("fq_boss_v2", JSON.stringify(bossChallenge));
  }, [bossChallenge]);

  useEffect(() => {
    localStorage.setItem("fq_friends_v2", JSON.stringify(friendsLeaderboard));
  }, [friendsLeaderboard]);

  useEffect(() => {
    localStorage.setItem("fq_global_v2", JSON.stringify(globalLeaderboard));
  }, [globalLeaderboard]);

  useEffect(() => {
    localStorage.setItem("fq_badges_v2", JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem("fq_social_feed_v2", JSON.stringify(socialFeed));
  }, [socialFeed]);

  const handleOnboardingComplete = (surveyProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...surveyProfile,
      onboardingComplete: true
    }));
  };

  const handleUpdateScores = (newScores: UserProfile["octalysisScores"]) => {
    setUserProfile((prev) => ({
      ...prev,
      octalysisScores: newScores
    }));
    setShowDrivesQuiz(false);
  };

  const handleCompleteChallenge = (id: string) => {
    let xpCollected = 0;
    setActiveChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id && !ch.completed) {
          xpCollected = ch.xpReward;
          return { ...ch, completed: true, progress: 100 };
        }
        return ch;
      })
    );

    if (xpCollected > 0) {
      handleIncrementXP(xpCollected);
    }
  };

  const handleIncrementXP = (amount: number) => {
    setUserProfile((prev) => {
      let currentXp = prev.xp + amount;
      let currentLevel = prev.level;
      let newXpGoal = prev.xpToNextLevel;

      while (currentXp >= newXpGoal) {
        currentXp -= newXpGoal;
        currentLevel += 1;
        newXpGoal = Math.round(newXpGoal * 1.15);
      }

      return {
        ...prev,
        level: currentLevel,
        xp: currentXp,
        xpToNextLevel: newXpGoal
      };
    });
  };

  const handleFinishWorkout = (workout: Workout) => {
    setWorkoutHistory((prev) => [workout, ...prev]);

    setUserProfile((prev) => {
      const activeStreak = prev.streak + 1;
      const totalCount = prev.workoutsCompleted + 1;
      const nextGlobalPos = Math.max(10, prev.globalRank - (workout.xpEarned > 500 ? 1 : 0));

      return {
        ...prev,
        streak: activeStreak,
        workoutsCompleted: totalCount,
        globalRank: nextGlobalPos
      };
    });

    const hasPR = workout.exercises.some((e) => e.sets.some((s) => s.isPR));
    if (hasPR) {
      setBadges((prev) =>
        prev.map((b) => (b.id === "pr_hunter" ? { ...b, unlockedAt: new Date().toISOString() } : b))
      );
    }

    setBossChallenge((prev) => {
      const updatedCount = prev.workoutsCurrent + 1;
      const isCompleteNow = updatedCount >= prev.workoutsGoal;

      if (isCompleteNow && !prev.completed) {
        setBadges((prevBadges) =>
          prevBadges.map((b) => (b.id === prev.badgeReward ? { ...b, unlockedAt: new Date().toISOString() } : b))
        );
        handleIncrementXP(prev.xpReward);
        return {
          ...prev,
          workoutsCurrent: updatedCount,
          completed: true
        };
      }

      return {
        ...prev,
        workoutsCurrent: Math.min(prev.workoutsGoal, updatedCount)
      };
    });

    handleIncrementXP(workout.xpEarned);

    setFriendsLeaderboard((prev) =>
      prev
        .map((friend) => {
          if (friend.isMe) {
            return { ...friend, xp: friend.xp + workout.xpEarned };
          }
          return { ...friend, xp: friend.xp + Math.round(Math.random() * 80 + 30) };
        })
        .sort((a, b) => b.xp - a.xp)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
    );

    setSocialFeed((prev) => {
      const me = friendsLeaderboard.find((f) => f.isMe);
      const feedEntry: SocialWorkout = {
        id: `sw_${Date.now()}`,
        authorName: me?.name || userProfile.name,
        authorAvatar: me?.avatar || userProfile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        authorTier: userProfile.rank,
        isMe: true,
        highFiveCount: 0,
        workout: { ...workout, date: "Just now" }
      };
      return [feedEntry, ...prev];
    });
  };

  const handleHighFiveFeed = (id: string) => {
    setSocialFeed((prev) =>
      prev.map((item) =>
        item.id === id && !item.highFived && !item.isMe
          ? { ...item, highFived: true, highFiveCount: item.highFiveCount + 1 }
          : item
      )
    );
  };

  const handleUpdateLeaderboard = (friends: LeaderboardEntry[], global: LeaderboardEntry[]) => {
    setFriendsLeaderboard(friends);
    setGlobalLeaderboard(global);
  };

  const resetAllLocalState = () => {
    if (confirm("Reset FitQuest and wipe all progress?")) {
      localStorage.removeItem("fq_profile_v2");
      localStorage.removeItem("fq_workouts_v2");
      localStorage.removeItem("fq_challenges_v2");
      localStorage.removeItem("fq_boss_v2");
      localStorage.removeItem("fq_friends_v2");
      localStorage.removeItem("fq_global_v2");
      localStorage.removeItem("fq_badges_v2");
      localStorage.removeItem("fq_social_feed_v2");
      window.location.reload();
    }
  };

  return (
    <div className="h-dvh bg-[#050505] flex flex-col font-sans text-slate-100 safe-x overflow-hidden">
      {!userProfile.onboardingComplete && (
        <OnboardingSurvey onComplete={handleOnboardingComplete} />
      )}

      {showDrivesQuiz && (
        <MainQuizOverlay
          userProfile={userProfile}
          onUpdateScores={handleUpdateScores}
          onClose={() => setShowDrivesQuiz(false)}
        />
      )}

      <main className="flex-1 min-h-0 overflow-hidden main-with-nav">
        <div className="h-full min-h-0">
        {activeTab === "Home" && (
          <HomeView
            userProfile={userProfile}
            activeChallenges={activeChallenges}
            socialFeed={socialFeed}
            onChangeUserProfile={(updates) => setUserProfile((prev) => ({ ...prev, ...updates }))}
            onNavigateToTab={setActiveTab}
            onHighFiveFeed={handleHighFiveFeed}
          />
        )}
        {activeTab === "Log" && (
          <WorkoutLogView
            userProfile={userProfile}
            lastWorkout={workoutHistory[0]}
            onFinishWorkout={handleFinishWorkout}
            onNavigateToTab={setActiveTab}
          />
        )}
        {activeTab === "Rank" && (
          <LeaderboardView
            userProfile={userProfile}
            friendsLeaderboard={friendsLeaderboard}
            globalLeaderboard={globalLeaderboard}
            onChangeLeaderboards={handleUpdateLeaderboard}
          />
        )}
        {activeTab === "Goals" && (
          <ChallengesView
            bossChallenge={bossChallenge}
            activeChallenges={activeChallenges}
            onCompleteChallenge={handleCompleteChallenge}
            onNavigateToTab={setActiveTab}
          />
        )}
        {activeTab === "Profile" && (
          <ProfileView
            userProfile={userProfile}
            workoutHistory={workoutHistory}
            badges={badges}
            onChangeUserProfile={(updates) => setUserProfile((prev) => ({ ...prev, ...updates }))}
            onNavigateToTab={setActiveTab}
            onOpenDrivesQuiz={() => setShowDrivesQuiz(true)}
            onResetApp={resetAllLocalState}
          />
        )}
        </div>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-[#050505]/95 backdrop-blur-lg border-t border-white/10 safe-bottom safe-x"
        aria-label="Main navigation"
      >
        <div className="flex items-end justify-around px-1 pt-2 pb-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const isLog = id === "Log";

            if (isLog) {
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                  className="flex flex-col items-center -mt-5 touch-target"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                      isActive
                        ? "bg-cyan-400 text-black shadow-cyan-400/30"
                        : "bg-white text-black shadow-white/10"
                    }`}
                  >
                    <Icon className="w-7 h-7 stroke-[2.5px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 ${
                      isActive ? "text-cyan-400" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-1 flex-1 py-1 touch-target transition-colors active:scale-95 ${
                  isActive ? "text-cyan-400" : "text-slate-500"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : ""}`} />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
