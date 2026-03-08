import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CommunityStats() {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, today: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count } = await supabase.from("search_history").select("*", { count: "exact", head: true });
      
      const today = new Date().toISOString().split("T")[0];
      const { data: todayData } = await supabase
        .from("search_history")
        .select("score")
        .gte("created_at", today);

      const { data: allScores } = await supabase
        .from("search_history")
        .select("score")
        .not("score", "is", null)
        .limit(100);

      const avg = allScores && allScores.length > 0
        ? Math.round(allScores.reduce((sum, r) => sum + (r.score || 0), 0) / allScores.length)
        : 0;

      setStats({
        total: count || 0,
        avgScore: avg,
        today: todayData?.length || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <motion.div
      className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <UserCheck className="h-3.5 w-3.5" /> Topluluk İstatistikleri
      </h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-primary">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Toplam</p>
        </div>
        <div>
          <p className="text-lg font-bold text-warning">%{stats.avgScore}</p>
          <p className="text-[10px] text-muted-foreground">Ort. Skor</p>
        </div>
        <div>
          <p className="text-lg font-bold text-success">{stats.today}</p>
          <p className="text-[10px] text-muted-foreground">Bugün</p>
        </div>
      </div>
    </motion.div>
  );
}
