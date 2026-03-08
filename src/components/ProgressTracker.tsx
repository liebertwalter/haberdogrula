import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function ProgressTracker() {
  const [checks, setChecks] = useState(0);
  const goal = 50;

  useEffect(() => {
    const c = parseInt(localStorage.getItem("fc_total_checks") || "0");
    setChecks(c);
  }, []);

  const progress = Math.min(100, (checks / goal) * 100);

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-1.5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" /> Hedef İlerlemesi
        </span>
        <span className="text-xs font-bold">{checks}/{goal}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
      </div>
      <p className="text-[10px] text-muted-foreground">{goal - checks > 0 ? `${goal - checks} doğrulama daha yaparak hedefine ulaş!` : "🎉 Hedefe ulaştın!"}</p>
    </motion.div>
  );
}
