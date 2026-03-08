import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";

interface QuickFactsProps {
  text: string;
}

export function QuickFacts({ text }: QuickFactsProps) {
  if (!text || text.length < 30) return null;

  const facts: string[] = [];

  // Detect numbers/stats
  const numbers = text.match(/\d+[.,]?\d*/g);
  if (numbers && numbers.length > 0) {
    facts.push(`📊 ${numbers.length} sayısal veri içeriyor`);
  }

  // Detect quotes
  const quotes = text.match(/[""][^""]+[""]/g);
  if (quotes && quotes.length > 0) {
    facts.push(`💬 ${quotes.length} alıntı içeriyor`);
  }

  // Detect names (capitalized words)
  const names = text.match(/[A-ZÇĞİÖŞÜ][a-zçğıöşü]+\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+/g);
  if (names && names.length > 0) {
    facts.push(`👤 ${new Set(names).size} isim tespit edildi`);
  }

  // Detect URLs
  const urls = text.match(/https?:\/\/[^\s]+/g);
  if (urls && urls.length > 0) {
    facts.push(`🔗 ${urls.length} bağlantı içeriyor`);
  }

  // Detect dates
  const dates = text.match(/\d{1,2}[./]\d{1,2}[./]\d{2,4}/g);
  if (dates && dates.length > 0) {
    facts.push(`📅 ${dates.length} tarih bilgisi var`);
  }

  if (facts.length === 0) return null;

  return (
    <motion.div
      className="flex flex-wrap gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {facts.map((f, i) => (
        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {f}
        </span>
      ))}
    </motion.div>
  );
}
