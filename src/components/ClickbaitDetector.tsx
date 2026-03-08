import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { AlertOctagon, Eye, Megaphone, HeartHandshake, Skull } from "lucide-react";

interface ClickbaitDetectorProps {
  result: FactCheckResult;
}

const clickbaitPatterns = [
  "inanılmaz", "şok", "bomba", "son dakika", "gizli", "yasak", 
  "kimse bilmiyor", "herkes şaştı", "bakın ne oldu", "meğer",
  "skandal", "olay", "flaş", "müthiş", "dehşet", "korkunç",
  "inanamayacaksınız", "gördüğünüze inanamayacaksınız",
];

export function ClickbaitDetector({ result }: ClickbaitDetectorProps) {
  const text = (result.summary + " " + result.warnings.join(" ")).toLowerCase();
  const found = clickbaitPatterns.filter((p) => text.includes(p));
  
  if (found.length === 0) return null;

  const level = found.length >= 3 ? "high" : found.length >= 1 ? "medium" : "low";

  return (
    <motion.div
      className={`p-3 rounded-xl border space-y-2 ${
        level === "high"
          ? "bg-danger/5 border-danger/20"
          : "bg-warning/5 border-warning/20"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <AlertOctagon className={`h-4 w-4 ${level === "high" ? "text-danger" : "text-warning"}`} />
        <span className="text-xs font-semibold">
          Clickbait {level === "high" ? "Yüksek" : "Orta"} Seviye Tespit Edildi
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Bu haberde sansasyonel ifadeler kullanılmış: {found.slice(0, 3).map((f) => `"${f}"`).join(", ")}
      </p>
    </motion.div>
  );
}
