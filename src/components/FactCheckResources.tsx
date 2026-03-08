import { motion } from "framer-motion";
import { Lightbulb, ExternalLink } from "lucide-react";

const resources = [
  { title: "Teyit.org", url: "https://teyit.org", desc: "Türkiye'nin doğrulama platformu" },
  { title: "Doğruluk Payı", url: "https://dogrulukpayi.com", desc: "Siyasi söylem doğrulama" },
  { title: "Malumatfuruş", url: "https://malumatfurus.org", desc: "Yanlış bilgi takibi" },
  { title: "FactCheck.org", url: "https://factcheck.org", desc: "Uluslararası doğrulama" },
  { title: "Snopes", url: "https://snopes.com", desc: "Söylenti doğrulama" },
];

export function FactCheckResources() {
  return (
    <motion.div
      className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Lightbulb className="h-3.5 w-3.5" /> Doğrulama Kaynakları
      </h4>
      <div className="grid grid-cols-1 gap-1.5">
        {resources.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-1">
              <p className="text-xs font-medium text-primary group-hover:underline">{r.title}</p>
              <p className="text-[10px] text-muted-foreground">{r.desc}</p>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </motion.div>
  );
}
