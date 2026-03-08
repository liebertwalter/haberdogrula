import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function FactCheckStats() {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, highCount: 0, lowCount: 0 });

  useEffect(() => {
    const fetch = async () => {
      const { data, count } = await supabase
        .from("search_history")
        .select("score", { count: "exact" })
        .not("score", "is", null)
        .limit(200);
      if (data && data.length > 0) {
        const scores = data.map(d => d.score!);
        setStats({
          total: count || data.length,
          avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          highCount: scores.filter(s => s >= 70).length,
          lowCount: scores.filter(s => s < 40).length,
        });
      }
    };
    fetch();
  }, []);

  if (stats.total === 0) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <BarChart3 className="h-3.5 w-3.5" /> Platform İstatistikleri
      </h4>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div><p className="text-lg font-bold text-primary">{stats.total}</p><p className="text-[10px] text-muted-foreground">Toplam</p></div>
        <div><p className="text-lg font-bold text-foreground">%{stats.avgScore}</p><p className="text-[10px] text-muted-foreground">Ortalama</p></div>
        <div><p className="text-lg font-bold text-success">{stats.highCount}</p><p className="text-[10px] text-muted-foreground">Güvenilir</p></div>
        <div><p className="text-lg font-bold text-danger">{stats.lowCount}</p><p className="text-[10px] text-muted-foreground">Şüpheli</p></div>
      </div>
    </motion.div>
  );
}
