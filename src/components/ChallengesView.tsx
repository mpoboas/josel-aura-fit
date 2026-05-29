import { Challenge, BossChallenge } from "../types";
import { Shield, Trophy, Target, Star, ChevronRight } from "lucide-react";

interface Props {
  bossChallenge: BossChallenge;
  activeChallenges: Challenge[];
  onCompleteChallenge: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function ChallengesView({ bossChallenge, activeChallenges, onCompleteChallenge }: Props) {
  const bossProgress = Math.round((bossChallenge.workoutsCurrent / bossChallenge.workoutsGoal) * 100);

  return (
    <div className="h-full min-h-0 bg-[#050505] text-slate-100 flex flex-col overflow-y-auto scroll-container">
      <div className="bg-zinc-900/50 px-4 py-3 flex justify-between items-center border-b border-white/5 safe-top shrink-0">
        <div>
          <span className="text-xs text-cyan-400 font-semibold">Monthly Event</span>
          <h2 className="text-base font-bold text-white mt-0.5 font-serif italic">{bossChallenge.title}</h2>
        </div>
        <div className="text-right">
          <span className="text-sm text-rose-400 font-bold">3 days left</span>
        </div>
      </div>

      <div className="p-4 shrink-0">
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Boss Challenge</span>
              <h3 className="text-lg font-extrabold text-white mt-1 font-serif italic">Slay the Gauntlet</h3>
            </div>
            <span className="text-2xl">👹</span>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-4">{bossChallenge.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-cyan-400 font-bold">
                {bossChallenge.workoutsCurrent}/{bossChallenge.workoutsGoal} ({bossProgress}%)
              </span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${bossProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
              <Star className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-cyan-300">+{bossChallenge.xpReward} XP</span>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
              <Shield className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-blue-300">+{bossChallenge.shieldReward} Shield</span>
            </div>
            <div className="bg-zinc-800/50 border border-white/5 rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-zinc-300">Elite Badge</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-400">Active Quests</h3>
          <Target className="w-4 h-4 text-slate-600" />
        </div>

        <div className="space-y-3">
          {activeChallenges.map((chall) => (
            <div
              key={chall.id}
              className={`bg-zinc-900/50 border rounded-2xl p-4 ${
                chall.completed ? "border-emerald-500/25 bg-emerald-500/[0.02]" : "border-white/5"
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                    {chall.title}
                    {chall.completed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                        Done
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{chall.description}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full border shrink-0 ${
                    chall.type === "Group"
                      ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/20"
                      : "bg-white/5 text-slate-400 border-white/5"
                  }`}
                >
                  {chall.type}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{chall.goalText}</span>
                  <span>{chall.progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${chall.completed ? "bg-emerald-500" : "bg-cyan-400"}`}
                    style={{ width: `${chall.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-cyan-400 font-semibold">+{chall.xpReward} XP</span>
                {!chall.completed && (
                  <button
                    onClick={() => onCompleteChallenge(chall.id)}
                    className="text-xs text-slate-400 active:text-white flex items-center gap-1 touch-target"
                  >
                    Mark complete
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
