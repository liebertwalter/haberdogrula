import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Award, Star, Zap, Trophy } from "lucide-react";

export function DailyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("fc_streak");
    const lastDate = localStorage.getItem("fc_last_check_date");
    const today = new Date().toISOString().split("T")[0];

    if (lastDate === today) {
      setStreak(parseInt(stored || "0"));
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (lastDate === yesterday) {
        const newStreak = (parseInt(stored || "0")) + 1;
        setStreak(newStreak);
        localStorage.setItem("fc_streak", String(newStreak));
      } else {
        setStreak(1);
        localStorage.setItem("fc_streak", "1");
      }
      localStorage.setItem("fc_last_check_date", today);
    }
  }, []);

  if (streak <= 0) return null;

  const getIcon = () => {
    if (streak >= 30) return <Trophy className="h-4 w-4" />;
    if (streak >= 14) return <Award className="h-4 w-4" />;
    if (streak >= 7) return <Star className="h-4 w-4" />;
    if (streak >= 3) return <Flame className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  return (
    <motion.div
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring" }}
    >
      {getIcon()}
      <span className="font-medium">{streak} gün seri!</span>
    </motion.div>
  );
}
