import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface Props { result: FactCheckResult; }

export function RelatedNews({ result }: Props) {
  const [related, setRelated] = useState<{ text: string; score: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("query_text, score")
        .not("query_text", "is", null)
        .not("score", "is", null)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) {
        const category = result.category?.toLowerCase() || "";
        const filtered = data
          .filter(d => d.query_text && d.query_text.toLowerCase().includes(category) && d.query_text !== result.summary)
          .slice(0, 3)
          .map(d => ({ text: d.query_text!.substring(0, 60), score: d.score! }));
        setRelated(filtered);
      }
    };
    if (result.category) fetch();
  }, [result]);

  if (related.length === 0) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Newspaper className="h-3.5 w-3.5" /> İlgili Doğrulamalar
      </h4>
      {related.map((r, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className={`font-bold ${r.score >= 70 ? "text-success" : r.score >= 40 ? "text-warning" : "text-danger"}`}>%{r.score}</span>
          <span className="text-muted-foreground truncate">{r.text}</span>
        </div>
      ))}
    </motion.div>
  );
}
