import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";

interface CharacterProgressProps {
  current: number;
  max: number;
}

export function CharacterProgress({ current, max }: CharacterProgressProps) {
  const percent = (current / max) * 100;
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const getColor = () => {
    if (percent >= 90) return "hsl(var(--danger))";
    if (percent >= 70) return "hsl(var(--warning))";
    return "hsl(var(--primary))";
  };

  return (
    <div className="relative w-8 h-8" title={`${current}/${max} karakter`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
        <motion.circle
          cx="16" cy="16" r={radius} fill="none" stroke={getColor()}
          strokeWidth="2" strokeLinecap="round" strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-muted-foreground">
        {percent >= 100 ? "!" : `${Math.round(percent)}%`}
      </span>
    </div>
  );
}
