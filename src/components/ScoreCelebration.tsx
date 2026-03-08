import { motion } from "framer-motion";
import { Sparkles, PartyPopper, AlertTriangle } from "lucide-react";

interface ScoreCelebrationProps {
  score: number;
}

export function ScoreCelebration({ score }: ScoreCelebrationProps) {
  if (score >= 70) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium"
      >
        <PartyPopper className="h-4 w-4" />
        Bu haber büyük olasılıkla güvenilir!
        <Sparkles className="h-4 w-4" />
      </motion.div>
    );
  }

  if (score >= 40) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-warning/10 border border-warning/20 text-warning text-sm font-medium"
      >
        <AlertTriangle className="h-4 w-4" />
        Bu habere dikkatli yaklaşın
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-danger/10 border border-danger/20 text-danger text-sm font-medium animate-pulse"
    >
      <AlertTriangle className="h-4 w-4" />
      Bu haber güvenilir görünmüyor!
    </motion.div>
  );
}
