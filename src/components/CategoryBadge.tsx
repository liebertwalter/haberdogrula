import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Stethoscope, Cpu, Landmark, Flame, Globe2 } from "lucide-react";

interface CategoryBadgeProps {
  text: string;
}

const categories = [
  { keywords: ["siyaset", "cumhurbaşkan", "meclis", "parti", "seçim", "hükümet", "bakan", "yasa"], label: "Siyaset", icon: Landmark, color: "bg-primary/10 text-primary border-primary/20" },
  { keywords: ["sağlık", "hastane", "doktor", "ilaç", "tedavi", "kanser", "virüs", "aşı", "WHO"], label: "Sağlık", icon: Stethoscope, color: "bg-success/10 text-success border-success/20" },
  { keywords: ["teknoloji", "apple", "google", "yazılım", "yapay zeka", "AI", "robot", "dijital", "uygulama"], label: "Teknoloji", icon: Cpu, color: "bg-warning/10 text-warning border-warning/20" },
  { keywords: ["ekonomi", "dolar", "euro", "borsa", "enflasyon", "faiz", "merkez bankası", "piyasa"], label: "Ekonomi", icon: TrendingUp, color: "bg-danger/10 text-danger border-danger/20" },
  { keywords: ["dünya", "ABD", "Avrupa", "NATO", "BM", "uluslararası", "savaş", "diplomatik"], label: "Dünya", icon: Globe2, color: "bg-accent text-accent-foreground border-border" },
  { keywords: ["son dakika", "flaş", "acil", "breaking"], label: "Son Dakika", icon: Flame, color: "bg-danger/10 text-danger border-danger/20" },
];

function detectCategory(text: string) {
  const lower = text.toLowerCase();
  const matched = categories.filter(c => c.keywords.some(k => lower.includes(k)));
  return matched.length > 0 ? matched : [{ keywords: [], label: "Genel", icon: Newspaper, color: "bg-muted text-muted-foreground border-border" }];
}

export function CategoryBadge({ text }: CategoryBadgeProps) {
  const detected = detectCategory(text);

  return (
    <div className="flex flex-wrap gap-1.5">
      {detected.map((cat) => {
        const Icon = cat.icon;
        return (
          <motion.span
            key={cat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${cat.color}`}
          >
            <Icon className="h-3 w-3" />
            {cat.label}
          </motion.span>
        );
      })}
    </div>
  );
}
