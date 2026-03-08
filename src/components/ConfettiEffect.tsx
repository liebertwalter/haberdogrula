import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  score: number;
  summary?: string;
  trigger: boolean;
}

const sadKeywords = ["ölüm", "öldü", "hayatını kaybetti", "kaza", "deprem", "sel", "yangın", "savaş", "çatışma", "trajedi", "facia", "cenaze", "terör", "saldırı", "patlama", "şehit", "yaralı", "can kaybı", "felaket", "intihar", "cinayet"];

export function ConfettiEffect({ score, summary = "", trigger }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger || score < 80) return;

    // Don't show confetti for sad/tragic news
    const lower = summary.toLowerCase();
    const isSad = sadKeywords.some(k => lower.includes(k));
    if (isSad) return;

    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#22c55e", "#3b82f6", "#f59e0b"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#22c55e", "#3b82f6", "#f59e0b"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger, score, summary]);

  return null;
}
