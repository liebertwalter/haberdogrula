import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function RecentHighlights() {
  const [highlights, setHighlights] = useState<{ text: string; score: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("query_text, score")
        .not("score", "is", null)
        .not("query_text", "is", null)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        setHighlights(
          data
            .filter((d) => d.query_text)
            .map((d) => ({ text: d.query_text!.substring(0, 60), score: d.score || 0 }))
        );
      }
    };
    fetch();
  }, []);

  if (highlights.length === 0) return null;

  return (
    <motion.div
      className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" /> Son Doğrulamalar
      </h4>
      <div className="space-y-1">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className={`font-bold ${h.score >= 70 ? "text-success" : h.score >= 40 ? "text-warning" : "text-danger"}`}>
              %{h.score}
            </span>
            <span className="text-muted-foreground truncate">{h.text}...</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
