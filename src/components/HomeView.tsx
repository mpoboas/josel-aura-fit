import { UserProfile, Challenge, SocialWorkout } from "../types";
import { Flame, Shield, Dumbbell, Activity, Award, Clock, Users, Zap } from "lucide-react";
import { useState } from "react";

interface Props {
  userProfile: UserProfile;
  activeChallenges: Challenge[];
  socialFeed: SocialWorkout[];
  onChangeUserProfile: (profile: Partial<UserProfile>) => void;
  onNavigateToTab: (tab: string) => void;
  onHighFiveFeed: (id: string) => void;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function summarizeExercises(entry: SocialWorkout) {
  const names = entry.workout.exercises.map((e) => e.name);
  if (names.length <= 2) return names.join(" · ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
}

function hasPR(entry: SocialWorkout) {
  return entry.workout.exercises.some((e) => e.sets.some((s) => s.isPR));
}

const TIER_COLORS: Record<string, string> = {
  Bronze: "text-amber-600",
  Silver: "text-slate-300",
  Gold: "text-yellow-400",
  Platinum: "text-cyan-300",
  Elite: "text-purple-400"
};

export default function HomeView({
  userProfile,
  activeChallenges,
  socialFeed,
  onChangeUserProfile,
  onNavigateToTab,
  onHighFiveFeed
}: Props) {
  const [notification, setNotification] = useState<string | null>(null);

  const buyShield = () => {
    if (userProfile.xp >= 500) {
      onChangeUserProfile({
        xp: userProfile.xp - 500,
        streakShields: userProfile.streakShields + 1
      });
      showNotification("Streak Shield purchased for 500 XP!");
    } else {
      showNotification("You need 500 XP for a Streak Shield.");
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleHighFive = (entry: SocialWorkout) => {
    if (entry.isMe || entry.highFived) return;
    onHighFiveFeed(entry.id);
    showNotification(`High five sent to ${entry.authorName.split(" ")[0]}!`);
  };

  const xpPercent = Math.min(100, (userProfile.xp / userProfile.xpToNextLevel) * 100);

  return (
    <div className="h-full min-h-0 bg-[#050505] text-slate-100 overflow-y-auto scroll-container">
      {notification && (
        <div className="fixed top-0 left-0 right-0 z-50 safe-top safe-x px-4 pt-3">
          <div className="bg-zinc-900 border border-cyan-500/30 text-cyan-100 px-4 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Header + stats — single block, never flex-shrinks */}
      <section className="px-4 pt-3 pb-4 safe-top">
        <div className="bg-gradient-to-b from-cyan-950/30 to-zinc-900/40 rounded-3xl border border-white/10 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="text-sm text-slate-500">{getGreeting()},</div>
            <h1 className="text-2xl font-serif italic text-white mt-0.5">{userProfile.name.split(" ")[0]}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white">
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="font-serif italic text-cyan-400 font-bold">{userProfile.rank}</span>
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300">
              {userProfile.playerType}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm text-slate-300">Level {userProfile.level}</span>
              <span className="text-xs text-cyan-400 font-medium">
                {userProfile.xp.toLocaleString()} / {userProfile.xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <div className="text-xl font-serif italic text-white">{userProfile.workoutsCompleted || 0}</div>
              <div className="text-xs text-slate-500 mt-0.5">Total</div>
            </div>
            <button
              onClick={() => onNavigateToTab("Profile")}
              className="bg-black/20 rounded-xl p-3 text-center active:bg-cyan-500/10 active:scale-[0.97] transition-all"
            >
              <div className="text-xl font-serif italic text-cyan-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" />
                {userProfile.streak}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Streak</div>
            </button>
            <button
              onClick={() => onNavigateToTab("Rank")}
              className="bg-black/20 rounded-xl p-3 text-center active:bg-cyan-500/10 active:scale-[0.97] transition-all"
            >
              <div className="text-xl font-serif italic text-white">#{userProfile.globalRank}</div>
              <div className="text-xs text-slate-500 mt-0.5">Rank</div>
            </button>
          </div>
        </div>
      </section>

      {/* Friend Activity Feed */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Friend Activity</h2>
          </div>
          <button onClick={() => onNavigateToTab("Rank")} className="text-xs text-cyan-400 font-medium">
            Leaderboard
          </button>
        </div>

        <div className="space-y-3">
          {socialFeed.map((entry) => (
            <article
              key={entry.id}
              className={`bg-zinc-900/50 border rounded-2xl p-4 ${
                entry.isMe ? "border-cyan-500/20" : "border-white/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                    entry.isMe
                      ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/30"
                      : "bg-zinc-800 text-slate-200 border-white/10"
                  }`}
                >
                  {entry.authorAvatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">
                      {entry.isMe ? "You" : entry.authorName}
                    </span>
                    {entry.isMe && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-400 font-semibold">
                        Your workout
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold ${TIER_COLORS[entry.authorTier] || "text-slate-400"}`}>
                      {entry.authorTier}
                    </span>
                    <span className="text-xs text-slate-500 ml-auto shrink-0">{entry.workout.date}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white mt-1 font-serif italic">{entry.workout.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{summarizeExercises(entry)}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.workout.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      +{entry.workout.xpEarned} XP
                    </span>
                    {hasPR(entry) && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">
                        🏆 PR
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-slate-500">
                  {entry.highFiveCount > 0
                    ? `${entry.highFiveCount} high five${entry.highFiveCount !== 1 ? "s" : ""}`
                    : "Be the first to react"}
                </span>
                {!entry.isMe && (
                  <button
                    onClick={() => handleHighFive(entry)}
                    disabled={entry.highFived}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold touch-target active:scale-95 transition-all ${
                      entry.highFived
                        ? "bg-white/5 text-slate-500"
                        : "bg-cyan-500/10 text-cyan-300 active:bg-cyan-500/20 border border-cyan-500/20"
                    }`}
                  >
                    <span>{entry.highFived ? "✓ Sent" : "👋 High five"}</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 shrink-0">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">Streak Protection</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {userProfile.streakShields > 0
                  ? `${userProfile.streakShields} shield${userProfile.streakShields > 1 ? "s" : ""} active`
                  : "Protect your streak for 500 XP"}
              </p>
            </div>
            {userProfile.streakShields > 0 ? (
              <div className="px-3 py-2 bg-cyan-500/15 border border-cyan-400/30 rounded-xl text-cyan-200 flex items-center gap-1 shrink-0">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-bold">×{userProfile.streakShields}</span>
              </div>
            ) : (
              <button
                onClick={buyShield}
                className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs active:bg-cyan-400 shrink-0 touch-target"
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-400">Active Challenges</h2>
          <button onClick={() => onNavigateToTab("Goals")} className="text-sm text-cyan-400 font-medium">
            See all
          </button>
        </div>

        <div className="space-y-3">
          {activeChallenges.slice(0, 2).map((chall) => (
            <button
              key={chall.id}
              onClick={() => onNavigateToTab("Goals")}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3 active:border-cyan-500/20 active:bg-zinc-900/80 text-left transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  chall.completed
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                }`}
              >
                {chall.type === "Weekly" ? <Dumbbell className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">{chall.title}</h4>
                  <span className="text-xs font-semibold text-cyan-400 shrink-0">+{chall.xpReward}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${chall.completed ? "bg-emerald-500" : "bg-cyan-500"}`}
                      style={{ width: `${chall.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{chall.progress}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateToTab("Log")}
          className="w-full mt-4 py-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-sm active:bg-cyan-500/20 transition-colors"
        >
          Log a Workout
        </button>
      </div>
    </div>
  );
}
