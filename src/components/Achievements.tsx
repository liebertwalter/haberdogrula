import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Star, Shield, Flame, Crown, Gem, Target, Zap, BookOpen, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: typeof Award;
  condition: (stats: AchievementStats) => boolean;
  color: string;
}

interface AchievementStats {
  totalChecks: number;
  streak: number;
  highScoreCount: number;
  lowScoreCount: number;
}

const achievements: Achievement[] = [
  { id: "first", title: "İlk Adım", desc: "İlk doğrulamanızı yaptınız", icon: Star, condition: (s) => s.totalChecks >= 1, color: "text-primary" },
  { id: "five", title: "Meraklı", desc: "5 haber doğruladınız", icon: BookOpen, condition: (s) => s.totalChecks >= 5, color: "text-success" },
  { id: "ten", title: "Araştırmacı", desc: "10 haber doğruladınız", icon: Brain, condition: (s) => s.totalChecks >= 10, color: "text-warning" },
  { id: "twenty", title: "Uzman", desc: "20 haber doğruladınız", icon: Shield, condition: (s) => s.totalChecks >= 20, color: "text-primary" },
  { id: "fifty", title: "Profesyonel", desc: "50 haber doğruladınız", icon: Crown, condition: (s) => s.totalChecks >= 50, color: "text-warning" },
  { id: "hundred", title: "Efsane", desc: "100 haber doğruladınız", icon: Gem, condition: (s) => s.totalChecks >= 100, color: "text-danger" },
  { id: "streak3", title: "Seri Başlangıcı", desc: "3 gün üst üste doğrulama", icon: Flame, condition: (s) => s.streak >= 3, color: "text-warning" },
  { id: "streak7", title: "Haftalık Seri", desc: "7 gün üst üste doğrulama", icon: Zap, condition: (s) => s.streak >= 7, color: "text-success" },
  { id: "debunker", title: "Yalan Avcısı", desc: "5 sahte haber tespit ettiniz", icon: Target, condition: (s) => s.lowScoreCount >= 5, color: "text-danger" },
  { id: "trustfinder", title: "Güven Bulucu", desc: "10 doğru haber buldunuz", icon: Award, condition: (s) => s.highScoreCount >= 10, color: "text-success" },
];

export function Achievements({ totalChecks }: { totalChecks: number }) {
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("fc_achievements") || "[]");
    const streak = parseInt(localStorage.getItem("fc_streak") || "0");
    const highScoreCount = parseInt(localStorage.getItem("fc_high_scores") || "0");
    const lowScoreCount = parseInt(localStorage.getItem("fc_low_scores") || "0");

    const stats: AchievementStats = { totalChecks, streak, highScoreCount, lowScoreCount };
    const newEarned = achievements.filter((a) => a.condition(stats)).map((a) => a.id);
    setEarned(newEarned);
    localStorage.setItem("fc_achievements", JSON.stringify(newEarned));
  }, [totalChecks]);

  if (earned.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Award className="h-3.5 w-3.5" /> Başarılar ({earned.length}/{achievements.length})
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {achievements.map((a) => {
          const isEarned = earned.includes(a.id);
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] border ${
                isEarned
                  ? `${a.color} bg-card border-current/20`
                  : "text-muted-foreground/30 bg-muted/30 border-transparent"
              }`}
              title={a.desc}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className="h-3 w-3" />
              <span className="font-medium">{a.title}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
