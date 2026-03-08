import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { BookOpen } from "lucide-react";

interface ReadabilityScoreProps {
  text: string;
}

export function ReadabilityScore({ text }: ReadabilityScoreProps) {
  if (!text || text.length < 50) return null;

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce((sum, word) => {
    const vowels = word.match(/[aeıioöuüAEIİOÖUÜ]/gi);
    return sum + (vowels ? vowels.length : 1);
  }, 0);

  const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
  const avgSyllablesPerWord = words.length > 0 ? syllables / words.length : 0;

  // Modified Flesch for Turkish
  const score = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)));

  const getLevel = (s: number) => {
    if (s >= 80) return { label: "Çok Kolay", color: "text-success", emoji: "📗" };
    if (s >= 60) return { label: "Kolay", color: "text-success", emoji: "📘" };
    if (s >= 40) return { label: "Orta", color: "text-warning", emoji: "📙" };
    if (s >= 20) return { label: "Zor", color: "text-danger", emoji: "📕" };
    return { label: "Çok Zor", color: "text-danger", emoji: "📓" };
  };

  const level = getLevel(score);

  return (
    <motion.div
      className="flex items-center gap-2 text-xs text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <BookOpen className="h-3.5 w-3.5" />
      <span>Okunabilirlik: {level.emoji}</span>
      <span className={level.color}>{level.label}</span>
    </motion.div>
  );
}
