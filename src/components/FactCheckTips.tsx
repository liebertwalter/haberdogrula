import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Lightbulb } from "lucide-react";

interface FactCheckTipsProps {
  result: FactCheckResult;
}

export function FactCheckTips({ result }: FactCheckTipsProps) {
  const tips: string[] = [];

  if (result.score < 40) {
    tips.push("Bu haberi sosyal medyada paylaşmadan önce farklı kaynaklardan doğrulamayı deneyin.");
    tips.push("Haber kaynağının güvenilirliğini kontrol edin - resmi haber ajanslarını tercih edin.");
  }
  if (result.score >= 40 && result.score < 70) {
    tips.push("Haber kısmen doğru olabilir ancak bazı bilgiler eksik veya yanıltıcı olabilir.");
    tips.push("Farklı haber kaynaklarından karşılaştırma yapmanızı öneririz.");
  }
  if (result.warnings.length > 2) {
    tips.push("Haberde birden fazla uyarı tespit edildi. İçeriği dikkatli değerlendirin.");
  }
  if (result.freshness === "eski") {
    tips.push("Bu haberdeki bilgiler güncel olmayabilir. Tarihleri kontrol edin.");
  }
  if (result.debunked.length > 0) {
    tips.push("Haberde yanlış bilgiler tespit edildi. Bu haberi paylaşmaktan kaçının.");
  }
  if (result.sentiment === "korkutucu") {
    tips.push("Korku uyandıran haberler genellikle manipülasyon amacı taşıyabilir.");
  }
  if (tips.length === 0) {
    tips.push("Doğrulanmış haberleri bile zaman zaman farklı kaynaklardan kontrol etmek iyi bir alışkanlıktır.");
  }

  return (
    <motion.div
      className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5">
        <Lightbulb className="h-4 w-4" />
        Öneriler
      </h4>
      <ul className="space-y-1.5">
        {tips.slice(0, 3).map((tip, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
            <span className="text-primary mt-0.5">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
