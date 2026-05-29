import { useState, useEffect } from "react";
import { Workout, Exercise, Set, UserProfile } from "../types";
import { PRESET_EXERCISES } from "../data";
import { Plus, Trash2, Trophy, Clock, Check, Award, X } from "lucide-react";

interface Props {
  userProfile: UserProfile;
  lastWorkout?: Workout;
  onFinishWorkout: (workout: Workout) => void;
  onNavigateToTab: (tab: string) => void;
}

function formatToday() {
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
}

export default function WorkoutLogView({ userProfile, onFinishWorkout, onNavigateToTab }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "ex_1",
      name: "Bench Press",
      category: "Chest",
      sets: [
        { id: "s_1", weight: 80, reps: 8 },
        { id: "s_2", weight: 85, reps: 6 },
        { id: "s_3", weight: 90, reps: 5, isPR: true }
      ]
    },
    {
      id: "ex_2",
      name: "Overhead Press",
      category: "Shoulders",
      sets: [
        { id: "s_4", weight: 60, reps: 8 },
        { id: "s_5", weight: 62, reps: 7 }
      ]
    }
  ]);

  const [duration, setDuration] = useState(42);
  const [showAddExModal, setShowAddExModal] = useState(false);
  const [celebration, setCelebration] = useState<{ xp: number; newLevel?: number } | null>(null);
  const [estimatedXp, setEstimatedXp] = useState(840);

  useEffect(() => {
    let totalVolume = 0;
    let containsPR = false;

    exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (ex.category === "Cardio") {
          totalVolume += set.reps * 1500;
        } else {
          totalVolume += (set.weight || 0) * (set.reps || 0);
        }
        if (set.isPR) containsPR = true;
      });
    });

    let calcXp = Math.round(totalVolume * 0.15) || 50;
    if (containsPR) calcXp = Math.round(calcXp * 1.5);
    const streakMultiplier = 1 + Math.min(0.3, userProfile.streak * 0.02);
    calcXp = Math.round(calcXp * streakMultiplier);
    setEstimatedXp(Math.max(100, Math.min(2500, calcXp)));
  }, [exercises, userProfile.streak]);

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: Set = {
            id: `s_${Date.now()}_${Math.random()}`,
            weight: lastSet ? lastSet.weight : 50,
            reps: lastSet ? lastSet.reps : 10,
            isPR: false
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: "weight" | "reps" | "isPR", value: number | boolean) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set))
          };
        }
        return ex;
      })
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
        }
        return ex;
      })
    );
  };

  const handleAddPresetExercise = (preset: { name: string; category: string }) => {
    const newEx: Exercise = {
      id: `ex_${Date.now()}`,
      name: preset.name,
      category: preset.category,
      sets: [{ id: `s_${Date.now()}`, weight: 40, reps: 10 }]
    };
    setExercises([...exercises, newEx]);
    setShowAddExModal(false);
  };

  const handleComplete = () => {
    const today = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

    const newWorkout: Workout = {
      id: `w_${Date.now()}`,
      title: exercises.map((e) => e.name).slice(0, 2).join(" & ") + (exercises.length > 2 ? " Split" : " Session"),
      date: formattedDate,
      rawDate: today.toISOString(),
      duration,
      exercises,
      xpEarned: estimatedXp
    };

    onFinishWorkout(newWorkout);
    setCelebration({
      xp: estimatedXp,
      newLevel: Math.floor((userProfile.xp + estimatedXp) / userProfile.xpToNextLevel) > 0 ? userProfile.level + 1 : undefined
    });
  };

  return (
    <div className="h-full min-h-0 bg-[#050505] text-slate-100 flex flex-col">
      {celebration && (
        <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center safe-top safe-bottom safe-x">
          <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif italic text-white">Workout Complete!</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xs">
            Great session. Your XP and streak have been updated.
          </p>

          <div className="my-8 bg-zinc-900/90 border border-white/10 rounded-2xl p-6 min-w-[200px]">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Experience</div>
            <div className="text-4xl font-serif italic text-cyan-400 mt-1">+{celebration.xp} XP</div>
            {celebration.newLevel && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs text-cyan-400 font-bold">
                <Award className="w-3.5 h-3.5" />
                Level {celebration.newLevel}!
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setCelebration(null);
              onNavigateToTab("Home");
            }}
            className="w-full max-w-xs py-4 rounded-2xl bg-white text-black font-bold text-sm active:scale-[0.98] transition-transform"
          >
            Back to Home
          </button>
        </div>
      )}

      <div className="bg-zinc-900/50 px-4 py-3 flex items-center justify-between border-b border-white/5 safe-top shrink-0">
        <div>
          <div className="text-xs text-slate-500">Today's workout</div>
          <div className="text-base font-bold text-white mt-0.5">{formatToday()}</div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-cyan-400">
          <Clock className="w-4 h-4 shrink-0" />
          <input
            type="number"
            inputMode="numeric"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-10 bg-transparent text-center focus:outline-none font-bold"
          />
          <span className="text-slate-400">min</span>
        </div>
      </div>

      <div className="px-4 py-3 shrink-0">
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-300">Estimated XP</span>
          <strong className="text-xl font-serif italic text-cyan-400">+{estimatedXp}</strong>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-container px-4 pb-4 space-y-4">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-bold text-white">{ex.name}</h4>
                <span className="inline-block text-xs text-cyan-400 mt-0.5">{ex.category}</span>
              </div>
              <button
                onClick={() => setExercises(exercises.filter((item) => item.id !== ex.id))}
                className="p-2 -mr-1 rounded-xl text-slate-500 active:bg-red-500/10 active:text-red-400 touch-target"
                aria-label={`Remove ${ex.name}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {ex.sets.map((set, idx) => (
                <div
                  key={set.id}
                  className={`flex items-center gap-2 p-3 rounded-xl border ${
                    set.isPR ? "bg-cyan-500/5 border-cyan-500/20" : "bg-white/[0.03] border-white/5"
                  }`}
                >
                  <span className="w-7 text-center text-sm font-bold text-slate-500 shrink-0">{idx + 1}</span>

                  {ex.category !== "Cardio" && (
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">kg</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={set.weight}
                        onChange={(e) => updateSet(ex.id, set.id, "weight", Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-center text-base font-semibold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      {ex.category === "Cardio" ? "min" : "reps"}
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(e) => updateSet(ex.id, set.id, "reps", Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-center text-base font-semibold focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => updateSet(ex.id, set.id, "isPR", !set.isPR)}
                    className={`shrink-0 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors touch-target ${
                      set.isPR
                        ? "bg-cyan-500 text-black"
                        : "bg-white/5 text-slate-500 border border-white/10"
                    }`}
                  >
                    PR
                  </button>

                  <button
                    onClick={() => removeSet(ex.id, set.id)}
                    className="p-2 text-slate-500 active:text-red-400 touch-target shrink-0"
                    aria-label="Remove set"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(ex.id)}
              className="mt-3 w-full border border-dashed border-white/10 active:border-cyan-500/30 rounded-xl py-3 text-sm font-semibold text-cyan-400 active:bg-cyan-500/5 transition-colors"
            >
              + Add Set
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowAddExModal(true)}
          className="w-full border border-dashed border-white/10 active:border-cyan-500/40 rounded-2xl py-4 flex items-center justify-center gap-2 text-slate-400 active:text-cyan-300 active:bg-cyan-500/5 transition-colors"
        >
          <Plus className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-semibold">Add Exercise</span>
        </button>
      </div>

      <div className="shrink-0 px-4 py-3 border-t border-white/10 bg-[#050505]/95 backdrop-blur-lg safe-bottom">
        <button
          type="button"
          onClick={handleComplete}
          disabled={exercises.length === 0}
          className="w-full py-4 rounded-2xl bg-white active:bg-cyan-400 text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          <Check className="w-5 h-5 stroke-[3px]" />
          Finish Workout · +{estimatedXp} XP
        </button>
      </div>

      {showAddExModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col safe-top safe-bottom safe-x">
          <div className="flex-1 flex flex-col bg-zinc-900 mt-auto rounded-t-3xl border-t border-white/10 max-h-[85dvh]">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5 shrink-0">
              <h3 className="text-base font-bold text-white">Add Exercise</h3>
              <button
                onClick={() => setShowAddExModal(false)}
                className="p-2 rounded-xl text-slate-400 active:bg-white/5 touch-target"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto scroll-container flex-1 divide-y divide-white/5">
              {PRESET_EXERCISES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleAddPresetExercise(preset)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center active:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{preset.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
