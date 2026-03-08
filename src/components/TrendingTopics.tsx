import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrendItem {
  text: string;
  count: number;
}

export function TrendingTopics() {
  const [trends, setTrends] = useState<TrendItem[]>([]);

  useEffect(() => {
    async function fetchTrends() {
      const { data } = await supabase
        .from("search_history")
        .select("query_text")
        .not("query_text", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!data) return;

      // Extract keywords and count frequency
      const wordMap = new Map<string, number>();
      data.forEach((item) => {
        const text = item.query_text || "";
        const words = text.split(/\s+/).filter((w: string) => w.length > 4);
        const uniqueWords = new Set(words.map((w: string) => w.toLowerCase()));
        uniqueWords.forEach((word) => {
          wordMap.set(word, (wordMap.get(word) || 0) + 1);
        });
      });

      const sorted = Array.from(wordMap.entries())
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, count]) => ({ text, count }));

      setTrends(sorted);
    }
    fetchTrends();
  }, []);

  if (trends.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Flame className="h-3.5 w-3.5 text-danger" />
        Trend Konular:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {trends.map((t) => (
          <span
            key={t.text}
            className="px-2.5 py-1 text-[10px] rounded-full bg-danger/5 border border-danger/10 text-muted-foreground"
          >
            {t.text} <span className="text-danger font-medium">({t.count})</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
