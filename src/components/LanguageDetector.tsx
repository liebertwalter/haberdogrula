import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageDetector({ text }: { text: string }) {
  if (!text || text.length < 20) return null;

  const turkishChars = (text.match(/[çğıöşüÇĞİÖŞÜ]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  const turkishRatio = totalChars > 0 ? turkishChars / totalChars : 0;

  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasCyrillic = /[\u0400-\u04FF]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  let lang = "Türkçe";
  let flag = "🇹🇷";
  if (hasArabic) { lang = "Arapça"; flag = "🌍"; }
  else if (hasCyrillic) { lang = "Rusça"; flag = "🇷🇺"; }
  else if (turkishRatio < 0.01 && hasLatin) { lang = "İngilizce"; flag = "🇬🇧"; }

  return (
    <motion.span
      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Languages className="h-3 w-3" />
      {flag} {lang}
    </motion.span>
  );
}
