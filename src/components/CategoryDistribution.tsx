import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

export function CategoryDistribution() {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data: history } = await supabase
        .from("search_history")
        .select("score")
        .not("score", "is", null)
        .limit(100);

      if (!history) return;

      const ranges = [
        { name: "0-20", min: 0, max: 20, count: 0 },
        { name: "21-40", min: 21, max: 40, count: 0 },
        { name: "41-60", min: 41, max: 60, count: 0 },
        { name: "61-80", min: 61, max: 80, count: 0 },
        { name: "81-100", min: 81, max: 100, count: 0 },
      ];

      history.forEach((item) => {
        const score = item.score || 0;
        const range = ranges.find((r) => score >= r.min && score <= r.max);
        if (range) range.count++;
      });

      setData(ranges.map((r) => ({ name: r.name, count: r.count })));
    };
    fetch();
  }, []);

  if (data.length === 0 || data.every((d) => d.count === 0)) return null;

  const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#16a34a"];

  return (
    <motion.div
      className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <PieChartIcon className="h-3.5 w-3.5" /> Skor Dağılımı
      </h4>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={20} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
