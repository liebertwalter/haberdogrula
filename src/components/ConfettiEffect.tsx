import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  score: number;
  trigger: boolean;
}

export function ConfettiEffect({ score, trigger }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger || score < 80) return;

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
  }, [trigger, score]);

  return null;
}
