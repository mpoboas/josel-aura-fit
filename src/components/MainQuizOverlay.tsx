import { useState } from "react";
import { UserProfile } from "../types";
import { ChevronRight, Check, X } from "lucide-react";

interface Props {
  userProfile: UserProfile;
  onUpdateScores: (scores: UserProfile["octalysisScores"]) => void;
  onClose: () => void;
}

export default function MainQuizOverlay({ userProfile, onUpdateScores, onClose }: Props) {
  const [scores, setScores] = useState({ ...userProfile.octalysisScores });
  const [activeQuestion, setActiveQuestion] = useState(0);

  const drives = [
    {
      key: "meaning" as const,
      name: "Epic Meaning",
      desc: "Being part of something bigger — a fitness community or mentorship.",
      icon: "🌟"
    },
    {
      key: "accomplishment" as const,
      name: "Accomplishment",
      desc: "Hitting PRs, leveling up, and seeing measurable progress.",
      icon: "🏆"
    },
    {
      key: "creativity" as const,
      name: "Creativity",
      desc: "Designing your own splits and exploring new exercises.",
      icon: "🎨"
    },
    {
      key: "ownership" as const,
      name: "Ownership",
      desc: "Collecting badges, stats, and streak protection items.",
      icon: "🎒"
    },
    {
      key: "influence" as const,
      name: "Social Influence",
      desc: "Competing with friends and sending high-fives on the leaderboard.",
      icon: "👥"
    },
    {
      key: "scarcity" as const,
      name: "Scarcity",
      desc: "Time-limited boss challenges and exclusive rewards.",
      icon: "⏳"
    },
    {
      key: "curiosity" as const,
      name: "Curiosity",
      desc: "Surprise milestones and unexpected rewards.",
      icon: "🧩"
    },
    {
      key: "avoidance" as const,
      name: "Loss Avoidance",
      desc: "Protecting your streak and avoiding rank drops.",
      icon: "🛡️"
    }
  ];

  const handleSliderChange = (key: keyof UserProfile["octalysisScores"], value: number) => {
    setScores({ ...scores, [key]: value });
  };

  const handleNext = () => {
    if (activeQuestion < drives.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      onUpdateScores(scores);
    }
  };

  const currentDrive = drives[activeQuestion];

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md z-40 flex flex-col safe-top safe-bottom safe-x">
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 shrink-0">
        <span className="text-sm font-semibold text-white">Motivation Quiz</span>
        <button onClick={onClose} className="p-2 rounded-xl active:bg-white/5 touch-target" aria-label="Close">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="px-4 py-3 shrink-0">
        <div className="flex justify-between text-xs text-cyan-400 mb-2">
          <span>{activeQuestion + 1} of {drives.length}</span>
          <span>{Math.round(((activeQuestion + 1) / drives.length) * 100)}%</span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-cyan-400 h-full rounded-full transition-all"
            style={{ width: `${((activeQuestion + 1) / drives.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-container px-4 flex flex-col justify-center">
        <div className="text-5xl text-center mb-4">{currentDrive.icon}</div>
        <h3 className="text-lg font-bold text-white text-center mb-2 font-serif italic">{currentDrive.name}</h3>
        <p className="text-sm text-slate-400 text-center leading-relaxed mb-8 px-2">{currentDrive.desc}</p>

        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
          <div className="flex justify-between text-xs text-slate-500 mb-4">
            <span>Not important</span>
            <span className="text-cyan-400 font-bold text-base">{scores[currentDrive.key]}%</span>
            <span>Very important</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scores[currentDrive.key]}
            onChange={(e) => handleSliderChange(currentDrive.key, parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 border-t border-white/5 shrink-0 safe-bottom">
        <button
          onClick={onClose}
          className="py-4 rounded-2xl border border-white/10 text-slate-400 text-sm font-semibold active:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="py-4 rounded-2xl bg-white text-black text-sm font-bold active:bg-cyan-400 flex items-center justify-center gap-1.5"
        >
          <span>{activeQuestion < drives.length - 1 ? "Next" : "Save"}</span>
          {activeQuestion < drives.length - 1 ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4 stroke-[3px]" />
          )}
        </button>
      </div>
    </div>
  );
}
