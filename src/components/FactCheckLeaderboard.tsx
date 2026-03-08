import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function FactCheckLeaderboard() {
  const [topScores, setTopScores] = useState<{ score: number; text: string }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("score, query_text")
        .not("score", "is", null)
        .order("score", { ascending: false })
        .limit(5);
      if (data) setTopScores(data.filter(d => d.query_text).map(d => ({ score: d.score!, text: d.query_text!.substring(0, 50) })));
    };
    fetch();
  }, []);

  if (topScores.length === 0) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Crown className="h-3.5 w-3.5 text-warning" /> En Güvenilir Haberler
      </h4>
      <div className="space-y-1.5">
        {topScores.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="font-bold text-warning w-4">{i + 1}.</span>
            <span className="text-success font-bold">%{s.score}</span>
            <span className="text-muted-foreground truncate">{s.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
