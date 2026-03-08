import { useState } from "react";
import { motion } from "framer-motion";
import { StickyNote, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function UserNotes() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const notes = JSON.parse(localStorage.getItem("fc_notes") || "[]");
    notes.push({ text: note, date: new Date().toISOString() });
    localStorage.setItem("fc_notes", JSON.stringify(notes));
    setSaved(true);
    setTimeout(() => { setSaved(false); setNote(""); setIsOpen(false); }, 1500);
  };

  return (
    <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-7 gap-1 text-[11px]">
        <StickyNote className="h-3 w-3" /> Not Ekle
      </Button>
      {isOpen && (
        <motion.div className="space-y-2" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
          <Textarea placeholder="Bu doğrulama hakkında notunuz..." value={note} onChange={(e) => setNote(e.target.value)}
            className="min-h-[60px] text-xs bg-card/80" />
          <Button size="sm" onClick={handleSave} disabled={!note.trim()} className="h-7 gap-1 text-[11px]">
            {saved ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
            {saved ? "Kaydedildi!" : "Kaydet"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
