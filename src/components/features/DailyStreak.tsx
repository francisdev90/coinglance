"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Trophy, Calendar, TrendingUp } from "lucide-react";

interface StreakData {
  lastVisitDate: string;
  currentStreak: number;
  longestStreak: number;
  totalVisits: number;
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem("ct_streak");
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {
    // corrupted data — start fresh
  }
  return { lastVisitDate: "", currentStreak: 0, longestStreak: 0, totalVisits: 0 };
}

function saveStreak(data: StreakData) {
  try {
    localStorage.setItem("ct_streak", JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

function computeStreak(saved: StreakData): StreakData {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  if (!saved.lastVisitDate) {
    // First ever visit
    const fresh = {
      lastVisitDate: today,
      currentStreak: 1,
      longestStreak: 1,
      totalVisits: 1,
    };
    return fresh;
  }

  if (saved.lastVisitDate === today) {
    // Already counted today
    return saved;
  }

  if (saved.lastVisitDate === yesterday) {
    // Consecutive day — extend streak
    const next = {
      lastVisitDate: today,
      currentStreak: saved.currentStreak + 1,
      longestStreak: Math.max(saved.longestStreak, saved.currentStreak + 1),
      totalVisits: saved.totalVisits + 1,
    };
    return next;
  }

  // Missed one or more days — reset
  return {
    lastVisitDate: today,
    currentStreak: 1,
    longestStreak: saved.longestStreak,
    totalVisits: saved.totalVisits + 1,
  };
}

function FlameIcon({ streak }: { streak: number }) {
  const big = streak >= 30;
  const med = streak >= 7;
  return (
    <Flame
      className={`w-5 h-5 flex-shrink-0 ${
        big ? "text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]" :
        med ? "text-orange-500" :
        "text-orange-400"
      }`}
    />
  );
}

export default function DailyStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isMilestone, setIsMilestone] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = loadStreak();
    const updated = computeStreak(saved);
    setStreak(updated);

    const wasNew = !saved.lastVisitDate;
    const wasYesterday = saved.lastVisitDate === getYesterdayStr();
    setIsNew(wasNew);

    if (updated.currentStreak === 7 || updated.currentStreak === 30) {
      if (wasYesterday || wasNew) setIsMilestone(true);
    }

    saveStreak(updated);
  }, []);

  if (!mounted || !streak) return null;

  const isFirstVisit = streak.totalVisits === 1;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-64 sm:w-72 rounded-2xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark shadow-2xl shadow-black/30 p-5 relative"
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <FlameIcon streak={streak.currentStreak} />
              <div>
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">
                  {isFirstVisit
                    ? "Welcome to CoinGlance!"
                    : `${streak.currentStreak} Day Streak!`}
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {isFirstVisit
                    ? "Visit daily to build your streak"
                    : streak.currentStreak === 1
                    ? "Come back tomorrow to start a streak"
                    : "Keep it going!"}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-black/[0.04] dark:bg-white/[0.04] p-3 text-center">
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                <p className="font-bold text-lg font-mono text-text-primary-light dark:text-text-primary-dark leading-none">
                  {streak.currentStreak}
                </p>
                <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Current</p>
              </div>
              <div className="rounded-xl bg-black/[0.04] dark:bg-white/[0.04] p-3 text-center">
                <Trophy className="w-4 h-4 text-accent-gold mx-auto mb-1" />
                <p className="font-bold text-lg font-mono text-text-primary-light dark:text-text-primary-dark leading-none">
                  {streak.longestStreak}
                </p>
                <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Best</p>
              </div>
              <div className="rounded-xl bg-black/[0.04] dark:bg-white/[0.04] p-3 text-center">
                <Calendar className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="font-bold text-lg font-mono text-text-primary-light dark:text-text-primary-dark leading-none">
                  {streak.totalVisits}
                </p>
                <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Total</p>
              </div>
            </div>

            {/* Milestone banner */}
            {isMilestone && (
              <div className="mb-4 p-3 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <p className="text-xs font-semibold text-accent-gold">
                  {streak.currentStreak >= 30
                    ? "Incredible! 30-day streak! 🏆"
                    : "Amazing! 7-day streak! 🔥"}
                </p>
              </div>
            )}

            {/* Progress bar toward next milestone */}
            {streak.currentStreak < 7 && (
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  <span>Progress to 7-day streak</span>
                  <span>{streak.currentStreak}/7</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-400 transition-all duration-500"
                    style={{ width: `${(streak.currentStreak / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {streak.currentStreak >= 7 && streak.currentStreak < 30 && (
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  <span>Progress to 30-day streak</span>
                  <span>{streak.currentStreak}/30</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-gold transition-all duration-500"
                    style={{ width: `${(streak.currentStreak / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark text-center leading-relaxed">
              Visit daily for the latest market insights
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg shadow-black/20 border transition-all duration-200 ${
          isMilestone
            ? "bg-accent-gold text-bg-dark border-accent-gold/80 milestone-pop"
            : "bg-bg-card-light dark:bg-bg-card-dark border-border-light dark:border-border-dark hover:border-orange-400/40"
        }`}
        aria-label="Daily streak"
      >
        <FlameIcon streak={streak.currentStreak} />
        <span className={`text-sm font-bold font-mono ${isMilestone ? "text-bg-dark" : "text-text-primary-light dark:text-text-primary-dark"}`}>
          {streak.currentStreak}
        </span>
        {streak.currentStreak > 1 && (
          <span className={`text-xs ${isMilestone ? "text-bg-dark/70" : "text-text-secondary-light dark:text-text-secondary-dark"}`}>
            day{streak.currentStreak !== 1 ? "s" : ""}
          </span>
        )}
        {isNew && !expanded && (
          <span className="ml-1 text-xs text-text-secondary-light dark:text-text-secondary-dark hidden sm:inline">
            Welcome!
          </span>
        )}
        <TrendingUp className={`w-3.5 h-3.5 ${isMilestone ? "text-bg-dark/70" : "text-text-secondary-light dark:text-text-secondary-dark"}`} />
      </motion.button>
    </div>
  );
}
