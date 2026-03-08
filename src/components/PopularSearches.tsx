import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function PopularSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("query_text")
        .not("query_text", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!data) return;

      // Extract common words
      const wordFreq: Record<string, number> = {};
      const stopWords = new Set(["bir", "ve", "ile", "bu", "da", "de", "den", "için", "olan", "olarak", "gibi"]);
      
      data.forEach((d) => {
        const words = (d.query_text || "")
          .toLowerCase()
          .replace(/[^\wçğıöşüÇĞİÖŞÜ\s]/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 4 && !stopWords.has(w));
        words.forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
      });

      const top = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word]) => word);

      setSearches(top);
    };
    fetch();
  }, []);

  if (searches.length === 0) return null;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Hash className="h-3.5 w-3.5" /> Popüler Konular
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {searches.map((s) => (
          <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
            #{s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
