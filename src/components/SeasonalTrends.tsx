import { motion } from "framer-motion";
import { CalendarRange } from "lucide-react";

export function SeasonalTrends() {
  const month = new Date().getMonth();
  const tips: Record<number, string> = {
    0: "Yılbaşı döneminde sahte kampanya haberleri artış gösterir",
    1: "Sevgililer Günü dolandırıcılığına dikkat",
    2: "Seçim sezonu dezenformasyon artışı",
    3: "1 Nisan şakaları gerçek habermiş gibi yayılabilir",
    4: "Bahar alerjisi ile ilgili yanlış sağlık bilgileri",
    5: "Yaz tatili dolandırıcılık haberleri",
    6: "Turizm sezonu sahte fırsat haberleri",
    7: "Yangın haberleri manipülasyonu",
    8: "Okul dönemi yanlış eğitim bilgileri",
    9: "Ekonomik tahmin manipülasyonları",
    10: "Kara Cuma sahte indirim haberleri",
    11: "Yılsonu ekonomik tahminlerde yanlış bilgiler",
  };

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <CalendarRange className="h-3.5 w-3.5 text-warning" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-warning">Dönemsel Uyarı:</span> {tips[month]}
        </p>
      </div>
    </motion.div>
  );
}
