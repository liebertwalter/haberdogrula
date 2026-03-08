import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export function UserTrustScore() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const checks = parseInt(localStorage.getItem("fc_total_checks") || "0");
    const high = parseInt(localStorage.getItem("fc_high_scores") || "0");
    const low = parseInt(localStorage.getItem("fc_low_scores") || "0");
    const s = Math.min(100, checks * 5 + high * 10 - low * 3);
    setScore(Math.max(0, s));
  }, []);

  if (score === 0) return null;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5" /> Kullanıcı Güven Puanı
        </span>
        <span className={`text-xs font-bold ${score >= 50 ? "text-success" : "text-warning"}`}>
          {score} puan
        </span>
      </div>
    </motion.div>
  );
}
