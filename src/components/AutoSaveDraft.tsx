import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Check } from "lucide-react";

interface AutoSaveDraftProps {
  text: string;
  url: string;
}

export function AutoSaveDraft({ text, url }: AutoSaveDraftProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!text && !url) return;
    const timer = setTimeout(() => {
      localStorage.setItem("fc_draft_text", text);
      localStorage.setItem("fc_draft_url", url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [text, url]);

  if (!text && !url) return null;

  return (
    <motion.div
      className="flex items-center gap-1 text-[10px] text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {saved ? (
        <>
          <Check className="h-3 w-3 text-success" />
          <span className="text-success">Taslak kaydedildi</span>
        </>
      ) : (
        <>
          <Save className="h-3 w-3" />
          <span>Otomatik kayıt aktif</span>
        </>
      )}
    </motion.div>
  );
}

export function loadDraft(): { text: string; url: string } {
  return {
    text: localStorage.getItem("fc_draft_text") || "",
    url: localStorage.getItem("fc_draft_url") || "",
  };
}

export function clearDraft() {
  localStorage.removeItem("fc_draft_text");
  localStorage.removeItem("fc_draft_url");
}
