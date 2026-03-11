import { useEffect, useState } from "react";
import { Search, Shield, Eye, Globe, Zap, Brain, CheckCircle, AlertTriangle, FileText, TrendingUp } from "lucide-react";

const icons = [Search, Shield, Eye, Globe, Zap, Brain, CheckCircle, AlertTriangle, FileText, TrendingUp];

interface FloatingIcon {
  id: number;
  Icon: typeof Search;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  opacity: number;
}

function generateIcons(count: number): FloatingIcon[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    Icon: icons[i % icons.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 16 + Math.random() * 20,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * -20,
    rotate: Math.random() * 360,
    opacity: 0.04 + Math.random() * 0.06,
  }));
}

export function FloatingIcons() {
  const [items] = useState(() => generateIcons(18));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-floating-icon text-primary"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            opacity: item.opacity,
            transform: `rotate(${item.rotate}deg)`,
          }}
        >
          <item.Icon size={item.size} strokeWidth={1.2} />
        </div>
      ))}
    </div>
  );
}
