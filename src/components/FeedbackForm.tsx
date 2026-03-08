import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function FeedbackForm() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!text.trim()) return;
    // Store feedback locally
    const feedbacks = JSON.parse(localStorage.getItem("fc_feedbacks") || "[]");
    feedbacks.push({ text, date: new Date().toISOString() });
    localStorage.setItem("fc_feedbacks", JSON.stringify(feedbacks));
    setText("");
    setShow(false);
    toast({ title: "Teşekkürler! 💬", description: "Geri bildiriminiz kaydedildi." });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShow(!show)}
        className="gap-1.5 text-xs"
      >
        <MessageSquare className="h-3.5 w-3.5" /> Geri Bildirim
      </Button>

      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShow(false)}
        >
          <motion.div
            className="bg-card border border-border rounded-xl p-5 w-80 shadow-xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Geri Bildirim</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShow(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Önerilerinizi yazın..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[80px] text-sm mb-3"
            />
            <Button size="sm" onClick={handleSubmit} className="w-full gap-1.5 text-xs">
              <Send className="h-3.5 w-3.5" /> Gönder
            </Button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
