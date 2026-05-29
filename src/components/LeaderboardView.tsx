import { useState } from "react";
import { LeaderboardEntry, UserProfile } from "../types";
import { Trophy, Calendar } from "lucide-react";

interface Props {
  userProfile: UserProfile;
  friendsLeaderboard: LeaderboardEntry[];
  globalLeaderboard: LeaderboardEntry[];
  onChangeLeaderboards: (friends: LeaderboardEntry[], global: LeaderboardEntry[]) => void;
}

export default function LeaderboardView({
  userProfile,
  friendsLeaderboard,
  globalLeaderboard,
  onChangeLeaderboards
}: Props) {
  const [activeTab, setActiveTab] = useState<"Friends" | "Global">("Friends");
  const [notification, setNotification] = useState<string | null>(null);

  const sendHighFive = (entry: LeaderboardEntry) => {
    setNotification(`High five sent to ${entry.name.split(" ")[0]}!`);
    setTimeout(() => setNotification(null), 3000);

    const updateEntry = (list: LeaderboardEntry[]) =>
      list.map((item) => (item.name === entry.name ? { ...item, highFived: true } : item));

    onChangeLeaderboards(updateEntry(friendsLeaderboard), updateEntry(globalLeaderboard));
  };

  const currentRoster = activeTab === "Friends" ? friendsLeaderboard : globalLeaderboard;

  const podiumSpots = {
    second: currentRoster.find((item) => item.rank === 2) || { rank: 2, name: "João R.", avatar: "JR", xp: 4200, tier: "Silver" as const },
    first: currentRoster.find((item) => item.rank === 1) || { rank: 1, name: "Ana S.", avatar: "AS", xp: 6100, tier: "Gold" as const },
    third: currentRoster.find((item) => item.rank === 3) || { rank: 3, name: "Tiago F.", avatar: "TF", xp: 3850, tier: "Silver" as const }
  };

  const remainingList = currentRoster.filter((item) => item.rank > 3);

  return (
    <div className="h-full min-h-0 bg-[#050505] text-slate-100 flex flex-col overflow-y-auto scroll-container">
      {notification && (
        <div className="fixed top-0 left-0 right-0 z-50 safe-top safe-x px-4 pt-3">
          <div className="bg-zinc-900 border border-cyan-500/30 text-cyan-100 px-4 py-3 rounded-2xl text-sm">
            👋 {notification}
          </div>
        </div>
      )}

      <div className="bg-zinc-900/50 border-b border-white/5 safe-top shrink-0">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-bold text-white">Leaderboard</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Resets Mon</span>
          </div>
        </div>

        <div className="flex px-4 pb-0">
          {(["Friends", "Global"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                activeTab === tab ? "text-cyan-400" : "text-slate-500"
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-zinc-900/40 to-[#050505] px-4 pt-6 pb-4 shrink-0 border-b border-white/5">
        <div className="flex items-end justify-center gap-2 max-w-sm mx-auto">
          <div className="flex flex-col items-center flex-1">
            <div className="w-14 h-14 rounded-full border-2 border-slate-500 bg-zinc-900 flex items-center justify-center font-bold text-sm relative">
              {podiumSpots.second.avatar}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2 truncate w-full text-center">{podiumSpots.second.name}</span>
            <span className="text-[10px] text-slate-500">{podiumSpots.second.xp.toLocaleString()} XP</span>
            <div className="w-full bg-zinc-900/80 border-t border-white/10 rounded-t-xl h-10 mt-2" />
          </div>

          <div className="flex flex-col items-center flex-1 -translate-y-1">
            <div className="w-[4.5rem] h-[4.5rem] rounded-full border-[3px] border-cyan-400 bg-zinc-950 flex items-center justify-center font-bold relative">
              {podiumSpots.first.avatar}
              <span className="absolute -top-3 text-lg">👑</span>
            </div>
            <span className="text-sm font-extrabold text-cyan-400 mt-2 truncate w-full text-center font-serif italic">
              {podiumSpots.first.name}
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">{podiumSpots.first.xp.toLocaleString()} XP</span>
            <div className="w-full bg-zinc-900 border-t-2 border-cyan-400/30 rounded-t-xl h-14 mt-2" />
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="w-14 h-14 rounded-full border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center font-bold text-sm relative">
              {podiumSpots.third.avatar}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-700 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
            </div>
            <span className="text-xs font-bold text-slate-400 mt-2 truncate w-full text-center">{podiumSpots.third.name}</span>
            <span className="text-[10px] text-slate-500">{podiumSpots.third.xp.toLocaleString()} XP</span>
            <div className="w-full bg-zinc-900/60 border-t border-white/10 rounded-t-xl h-7 mt-2" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 pt-4">
        <div className="space-y-2">
          {remainingList.map((entry) => {
            const isUserMe = entry.isMe || entry.name.includes(userProfile.name.split(" ")[0]);

            return (
              <div
                key={entry.rank + entry.name}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  isUserMe ? "bg-cyan-500/10 border-cyan-500/30" : "bg-zinc-900/50 border-white/5"
                }`}
              >
                <span className={`w-6 text-center text-sm font-bold shrink-0 ${isUserMe ? "text-cyan-400" : "text-slate-500"}`}>
                  {entry.rank}
                </span>

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isUserMe ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30" : "bg-zinc-800 text-slate-300 border border-white/5"
                  }`}
                >
                  {entry.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    {entry.name}
                    {isUserMe && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-400 font-bold shrink-0">You</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{entry.tier || "Bronze"}</span>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-cyan-400">{entry.xp.toLocaleString()}</div>
                  {!isUserMe && entry.rank <= 7 && (
                    <button
                      onClick={() => sendHighFive(entry)}
                      disabled={entry.highFived}
                      className={`mt-1 text-xs px-2.5 py-1.5 rounded-full font-semibold active:scale-95 transition-transform touch-target ${
                        entry.highFived ? "bg-white/5 text-slate-500" : "bg-cyan-500/10 text-cyan-300 active:bg-cyan-500/20"
                      }`}
                    >
                      {entry.highFived ? "Sent ✓" : "👋 High five"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
