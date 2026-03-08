import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { RadarIcon } from "lucide-react";

interface PropagandaDetectorProps {
  result: FactCheckResult;
}

const techniques = [
  { name: "Duygusal Manipülasyon", keywords: ["korku", "panik", "dehşet", "felaket", "yıkım", "trajedi", "ölüm", "saldırı"] },
  { name: "Genelleme", keywords: ["herkes", "hiçbir zaman", "her zaman", "hepsi", "tamamen", "kesinlikle"] },
  { name: "Otorite Referansı", keywords: ["uzmanlar", "bilim insanları", "doktorlar", "araştırmacılar", "yetkililer"] },
  { name: "Düşman Yaratma", keywords: ["tehdit", "düşman", "saldırı", "ihanet", "hain", "komplo"] },
  { name: "Seçici Bilgi", keywords: ["gizlenen", "saklanıyor", "söylenmeyen", "gerçekler", "ortaya çıktı"] },
  { name: "Bandwagon", keywords: ["milyonlarca", "herkes biliyor", "toplum", "halk", "çoğunluk"] },
];

export function PropagandaDetector({ result }: PropagandaDetectorProps) {
  const allText = [result.summary, ...result.warnings, ...result.debunked].join(" ").toLowerCase();
  
  const detected = techniques.filter((t) =>
    t.keywords.some((k) => allText.includes(k))
  );

  if (detected.length === 0) return null;

  return (
    <motion.div
      className="p-3 rounded-xl bg-danger/5 border border-danger/20 space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <RadarIcon className="h-4 w-4 text-danger" />
        <span className="text-xs font-semibold text-danger">Propaganda Teknikleri Tespit Edildi</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {detected.map((t) => (
          <span key={t.name} className="text-[10px] px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20">
            {t.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
