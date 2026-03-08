import { motion } from "framer-motion";
import { Info, ArrowRight } from "lucide-react";

const tips = [
  "Haberin kaynağını kontrol edin - Resmi haber ajansları daha güvenilirdir",
  "Tarihlere dikkat edin - Eski haberler yeni gibi paylaşılabilir",
  "Fotoğrafları ters görsel arama ile kontrol edin",
  "Sansasyonel başlıklara şüpheyle yaklaşın",
  "Birden fazla kaynaktan doğrulama yapın",
  "Sosyal medya paylaşımları haber kaynağı değildir",
  "Uzman görüşlerini doğrudan kaynağından kontrol edin",
  "İstatistiklerin bağlamını araştırın",
];

export function MediaLiteracyTips() {
  const randomTips = tips.sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <motion.div
      className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5" /> Medya Okuryazarlığı
      </h4>
      {randomTips.map((tip, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
          <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
          <span>{tip}</span>
        </div>
      ))}
    </motion.div>
  );
}
