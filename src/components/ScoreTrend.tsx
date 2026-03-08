import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DailyScore {
  date: string;
  avgScore: number;
  count: number;
}

export function ScoreTrend() {
  const [data, setData] = useState<DailyScore[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: rows } = await supabase
        .from("search_history")
        .select("score, created_at")
        .not("score", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!rows) return;

      const dayMap = new Map<string, { total: number; count: number }>();
      rows.forEach((r) => {
        const day = new Date(r.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        const existing = dayMap.get(day) || { total: 0, count: 0 };
        dayMap.set(day, { total: existing.total + (r.score as number), count: existing.count + 1 });
      });

      const result = Array.from(dayMap.entries())
        .map(([date, { total, count }]) => ({ date, avgScore: Math.round(total / count), count }))
        .slice(0, 7)
        .reverse();

      setData(result);
    }
    fetchData();
  }, []);

  if (data.length < 2) return null;

  const latest = data[data.length - 1]?.avgScore ?? 0;
  const prev = data[data.length - 2]?.avgScore ?? 0;
  const diff = latest - prev;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Güvenilirlik Trendi</span>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${diff > 0 ? "text-success" : diff < 0 ? "text-danger" : "text-muted-foreground"}`}>
              {diff > 0 ? <TrendingUp className="h-3 w-3" /> : diff < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {diff > 0 ? "+" : ""}{diff}
            </span>
          </div>
          <div className="flex items-end gap-1 h-12">
            {data.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.avgScore / 100) * 40}px` }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-full rounded-sm ${d.avgScore >= 70 ? "bg-success/60" : d.avgScore >= 40 ? "bg-warning/60" : "bg-danger/60"}`}
                />
                <span className="text-[8px] text-muted-foreground">{d.date.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
