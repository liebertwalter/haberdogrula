import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Share2 } from "lucide-react";

interface Props { result: FactCheckResult; }

export function SocialMediaTracker({ result }: Props) {
  const platforms = result.sources.map(s => {
    try {
      const host = new URL(s.url).hostname;
      if (host.includes("twitter") || host.includes("x.com")) return "X/Twitter";
      if (host.includes("facebook")) return "Facebook";
      if (host.includes("instagram")) return "Instagram";
      if (host.includes("tiktok")) return "TikTok";
      if (host.includes("t.me") || host.includes("telegram")) return "Telegram";
      if (host.includes("youtube")) return "YouTube";
      return null;
    } catch { return null; }
  }).filter(Boolean);

  const unique = [...new Set(platforms)];
  if (unique.length === 0) return null;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Sosyal Medya:</span>
        <div className="flex gap-1.5">
          {unique.map((p, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{p}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
