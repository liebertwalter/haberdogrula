import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CredibilityHistory() {
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");
  const [recentAvg, setRecentAvg] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("score")
        .not("score", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data && data.length >= 4) {
        const recent = data.slice(0, 5).map(d => d.score!);
        const older = data.slice(5).map(d => d.score!);
        const rAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const oAvg = older.reduce((a, b) => a + b, 0) / older.length;
        setRecentAvg(Math.round(rAvg));
        setTrend(rAvg > oAvg + 5 ? "up" : rAvg < oAvg - 5 ? "down" : "stable");
      }
    };
    fetch();
  }, []);

  if (recentAvg === 0) return null;

  const config = {
    up: { label: "Yükselen Trend", color: "text-success", emoji: "📈" },
    down: { label: "Düşen Trend", color: "text-danger", emoji: "📉" },
    stable: { label: "Stabil", color: "text-primary", emoji: "➡️" },
  };
  const c = config[trend];

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" /> Güvenilirlik Trendi
        </span>
        <span className={`text-xs font-bold ${c.color}`}>{c.emoji} {c.label} (Ort: %{recentAvg})</span>
      </div>
    </motion.div>
  );
}
