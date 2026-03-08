import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalChecks: number;
  avgScore: number;
  todayChecks: number;
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats>({ totalChecks: 0, avgScore: 0, todayChecks: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { data, count } = await supabase
        .from("search_history")
        .select("score, created_at", { count: "exact" });

      if (data && count) {
        const scores = data.filter(d => d.score !== null).map(d => d.score as number);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const today = new Date().toDateString();
        const todayCount = data.filter(d => new Date(d.created_at).toDateString() === today).length;

        setStats({ totalChecks: count, avgScore: avg, todayChecks: todayCount });
      }
    }
    fetchStats();
  }, []);

  if (stats.totalChecks === 0) return null;

  const items = [
    { icon: Hash, label: "Toplam Doğrulama", value: stats.totalChecks.toString() },
    { icon: TrendingUp, label: "Ort. Güvenilirlik", value: `%${stats.avgScore}` },
    { icon: BarChart3, label: "Bugün", value: stats.todayChecks.toString() },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-3"
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
          <item.icon className="h-4 w-4 text-primary mb-1" />
          <span className="text-lg font-bold">{item.value}</span>
          <span className="text-[10px] text-muted-foreground text-center">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
