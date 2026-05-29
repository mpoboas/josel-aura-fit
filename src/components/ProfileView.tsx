import { useState, useMemo } from "react";
import { UserProfile, Workout, Badge } from "../types";
import { Flame, Trophy, Activity, Award, Settings, Dumbbell, RotateCcw, ChevronRight } from "lucide-react";

interface Props {
  userProfile: UserProfile;
  workoutHistory: Workout[];
  badges: Badge[];
  onChangeUserProfile: (profile: Partial<UserProfile>) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenDrivesQuiz: () => void;
  onResetApp: () => void;
}

export default function ProfileView({
  userProfile,
  workoutHistory,
  badges,
  onOpenDrivesQuiz,
  onResetApp
}: Props) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const computedStats = useMemo(() => {
    let totalKgsLifted = 0;
    let prCount = 0;
    const categoryCount: Record<string, number> = {};

    workoutHistory.forEach((wk) => {
      wk.exercises.forEach((ex) => {
        categoryCount[ex.category] = (categoryCount[ex.category] || 0) + 1;
        ex.sets.forEach((set) => {
          totalKgsLifted += (set.weight || 0) * (set.reps || 0);
          if (set.isPR) prCount++;
        });
      });
    });

    return { totalKgsLifted, prCount, distribution: categoryCount };
  }, [workoutHistory]);

  const weeklyVolume = [
    { label: "W1", volume: 3200, isCurrent: false },
    { label: "W2", volume: 4400, isCurrent: false },
    { label: "W3", volume: 5100, isCurrent: false },
    { label: "W4", volume: 3800, isCurrent: false },
    { label: "W5", volume: 6200, isCurrent: false },
    { label: "W6", volume: 7500, isCurrent: false },
    { label: "Now", volume: Math.max(8200, computedStats.totalKgsLifted), isCurrent: true }
  ];

  const maxVolumeVal = Math.max(...weeklyVolume.map((v) => v.volume)) || 10000;
  const initials = userProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const topDrives = Object.entries(userProfile.octalysisScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="h-full min-h-0 bg-[#050505] text-slate-100 flex flex-col overflow-y-auto scroll-container">
      <div className="bg-zinc-900/50 px-4 py-3 flex items-center justify-between border-b border-white/5 safe-top shrink-0">
        <span className="text-sm font-semibold text-white">Profile</span>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 -mr-1 rounded-xl active:bg-white/5 text-slate-400 touch-target"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-gradient-to-b from-cyan-950/15 to-[#050505] p-6 text-center shrink-0 border-b border-white/10">
        <div className="w-20 h-20 rounded-full bg-cyan-400/10 border-2 border-cyan-400/20 flex items-center justify-center font-bold text-2xl text-cyan-300 mx-auto relative">
          {initials}
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#050505]" />
        </div>

        <h2 className="text-xl font-bold mt-3 text-white font-serif italic">{userProfile.name}</h2>
        <div className="flex items-center justify-center gap-1.5 text-sm text-cyan-400 mt-1">
          <Award className="w-4 h-4" />
          <span>{userProfile.rank} · Level {userProfile.level}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
          {userProfile.playerType} player
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-white">{workoutHistory.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">Workouts</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />
              {userProfile.streak}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Day Streak</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-cyan-400">{badges.filter((b) => b.unlockedAt).length}</div>
            <div className="text-xs text-slate-400 mt-0.5">Badges</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-400">Motivation Profile</h3>
          <button
            onClick={onOpenDrivesQuiz}
            className="text-xs text-cyan-400 font-medium active:underline"
          >
            Retake quiz
          </button>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 space-y-3">
          {topDrives.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                <span className="text-cyan-400 font-semibold">{value}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 shrink-0">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt;
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`flex flex-col items-center p-3 rounded-2xl border active:scale-[0.97] transition-transform touch-target ${
                  isUnlocked ? "bg-zinc-900/50 border-white/10" : "bg-zinc-950/40 border-white/5 opacity-50"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isUnlocked
                      ? badge.type === "gold"
                        ? "bg-amber-500/10 border border-amber-500/25 text-amber-400"
                        : badge.type === "green"
                          ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                          : "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400"
                      : "bg-zinc-950 text-slate-600 border border-white/5"
                  }`}
                >
                  {badge.icon === "Flame" && <Flame className="w-5 h-5" />}
                  {badge.icon === "Barbell" && <Dumbbell className="w-5 h-5" />}
                  {badge.icon === "Activity" && <Activity className="w-5 h-5" />}
                  {badge.icon === "Lock" && <span className="text-sm">🔒</span>}
                  {badge.icon === "Trophy" && <Trophy className="w-5 h-5" />}
                  {badge.icon === "Users" && <span className="text-sm">👥</span>}
                </div>
                <span className="text-xs font-semibold text-slate-300 mt-2 truncate w-full text-center">{badge.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4 pb-8 shrink-0">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Volume Progress</h3>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400">Weekly total (kg)</span>
            <span className="text-sm font-bold text-cyan-400">{computedStats.totalKgsLifted.toLocaleString()} kg</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {weeklyVolume.map((w) => {
              const heightPct = Math.max(12, Math.min(100, (w.volume / maxVolumeVal) * 100));
              return (
                <div key={w.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      w.isCurrent ? "bg-gradient-to-t from-cyan-500 to-cyan-400" : "bg-zinc-800 border border-white/5"
                    }`}
                    style={{ height: `${heightPct}px` }}
                  />
                  <span className="text-[10px] text-slate-500">{w.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedBadge && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-end safe-x safe-bottom">
          <div className="bg-zinc-900 w-full rounded-t-3xl border-t border-white/10 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center mx-auto mb-4">
              {selectedBadge.icon === "Flame" && <Flame className="w-7 h-7 text-orange-500" />}
              {selectedBadge.icon === "Barbell" && <Dumbbell className="w-7 h-7 text-cyan-400" />}
              {selectedBadge.icon === "Activity" && <Activity className="w-7 h-7 text-emerald-400" />}
              {selectedBadge.icon === "Lock" && "🔒"}
              {selectedBadge.icon === "Trophy" && <Trophy className="w-7 h-7 text-amber-500" />}
              {selectedBadge.icon === "Users" && "👥"}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{selectedBadge.name}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{selectedBadge.description}</p>
            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-6 w-full py-4 bg-white text-black rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-end safe-x safe-bottom">
          <div className="bg-zinc-900 w-full rounded-t-3xl border-t border-white/10">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-sm text-slate-400 px-3 py-1 active:bg-white/5 rounded-lg"
              >
                Done
              </button>
            </div>
            <div className="divide-y divide-white/5">
              <button
                onClick={() => {
                  setShowSettings(false);
                  onOpenDrivesQuiz();
                }}
                className="w-full px-5 py-4 flex items-center justify-between active:bg-white/5"
              >
                <span className="text-sm text-white">Motivation Quiz</span>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  onResetApp();
                }}
                className="w-full px-5 py-4 flex items-center gap-3 active:bg-red-500/5 text-red-400"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm font-medium">Reset all progress</span>
              </button>
            </div>
            <div className="h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
