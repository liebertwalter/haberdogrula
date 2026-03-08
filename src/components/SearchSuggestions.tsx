import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface Props { onSelect: (text: string) => void; }

const suggestions = [
  "Türkiye'de son seçim sonuçları",
  "COVID-19 yeni varyant haberleri",
  "Deprem erken uyarı sistemi",
  "Yapay zeka düzenlemeleri",
  "Merkez Bankası faiz kararı",
  "İklim değişikliği raporları",
];

export function SearchSuggestions({ onSelect }: Props) {
  return (
    <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Lightbulb className="h-3.5 w-3.5" /> Arama Önerileri
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onSelect(s)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
