import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const facts = [
  "Sahte haberlerin %70'i başlıktan paylaşılır, içerik okunmaz.",
  "Bir haber ne kadar duygusal dil kullanıyorsa, o kadar şüpheli olabilir.",
  "Kaynak çeşitliliği olan haberler daha güvenilir kabul edilir.",
  "Sosyal medyada viral olan haberlerin %60'ı bağlamından koparılmıştır.",
  "Resmi kaynaklar genellikle doğrulama için en güvenilir referanstır.",
  "Bir haberin tarihi, doğruluğu kadar önemlidir — eski haberler güncelmiş gibi paylaşılabilir.",
  "Fotoğraflar farklı bağlamda tekrar kullanılarak yanıltıcı olabilir.",
  "Uzman görüşü içeren haberler genellikle daha dengeli ve doğrudur.",
  "Başlıkta ünlem işareti kullanan haberler genellikle clickbait olma eğilimindedir.",
  "Haberleri en az 3 farklı kaynaktan doğrulamak en iyi pratiktir.",
];

export function DidYouKnow() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * facts.length));

  const next = () => {
    setIndex((prev) => (prev + 1) % facts.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-warning/5 border border-warning/20 rounded-xl p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-warning" />
          <span className="text-xs font-semibold text-warning">Biliyor muydunuz?</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={next}>
          <RefreshCw className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="text-sm text-muted-foreground"
        >
          {facts[index]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
