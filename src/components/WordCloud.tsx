import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface WordCloudProps {
  result: FactCheckResult;
}

export function WordCloud({ result }: WordCloudProps) {
  const allText = [result.summary, ...result.verified, ...result.debunked, ...result.warnings].join(" ");
  const stopWords = new Set(["bir", "ve", "ile", "bu", "da", "de", "den", "dan", "için", "olan", "olarak", "gibi", "ise", "ya", "veya", "ancak", "ama", "hem", "daha", "çok", "en", "her", "ne", "ki", "mi", "mu", "mı", "değil"]);

  const words = allText
    .toLowerCase()
    .replace(/[^\wçğıöşüÇĞİÖŞÜ\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const freq: Record<string, number> = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (sorted.length === 0) return null;
  const maxCount = sorted[0][1];

  const colors = ["text-primary", "text-success", "text-warning", "text-danger", "text-muted-foreground"];

  return (
    <motion.div
      className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anahtar Kelimeler</h4>
      <div className="flex flex-wrap gap-1.5 justify-center items-baseline">
        {sorted.map(([word, count], i) => {
          const size = 10 + (count / maxCount) * 14;
          return (
            <motion.span
              key={word}
              className={`font-medium ${colors[i % colors.length]} opacity-80 hover:opacity-100 transition-opacity cursor-default`}
              style={{ fontSize: `${size}px` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: i * 0.05 }}
              title={`${count} kez geçiyor`}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}
