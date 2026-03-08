import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Globe, Newspaper, Twitter, MessageCircle } from "lucide-react";

interface URLPreviewProps {
  url: string;
}

const platformIcons: Record<string, { icon: typeof Globe; label: string; color: string }> = {
  "twitter.com": { icon: Twitter, label: "X (Twitter)", color: "text-primary" },
  "x.com": { icon: Twitter, label: "X (Twitter)", color: "text-primary" },
  "t.me": { icon: MessageCircle, label: "Telegram", color: "text-[hsl(200,80%,50%)]" },
  "tiktok.com": { icon: Globe, label: "TikTok", color: "text-foreground" },
  "instagram.com": { icon: Globe, label: "Instagram", color: "text-[hsl(330,70%,50%)]" },
  "facebook.com": { icon: Globe, label: "Facebook", color: "text-[hsl(220,70%,50%)]" },
  "youtube.com": { icon: Globe, label: "YouTube", color: "text-danger" },
};

export function URLPreview({ url }: URLPreviewProps) {
  if (!url) return null;

  let domain = "";
  try {
    domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch {
    return null;
  }

  const platform = Object.entries(platformIcons).find(([key]) => domain.includes(key));
  const info = platform ? platform[1] : { icon: Newspaper, label: domain, color: "text-muted-foreground" };
  const Icon = info.icon;

  return (
    <motion.div
      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Icon className={`h-4 w-4 ${info.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{info.label}</p>
        <p className="text-[10px] text-muted-foreground truncate">{url}</p>
      </div>
      <Link2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
    </motion.div>
  );
}
