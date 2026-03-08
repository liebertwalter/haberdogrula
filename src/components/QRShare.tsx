import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QRShareProps {
  score: number;
}

export function QRShare({ score }: QRShareProps) {
  const [show, setShow] = useState(false);
  const url = `https://haberdogrula.lovable.app`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000`;

  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setShow(!show)} className="h-8 gap-1.5 text-xs">
        <QrCode className="h-3.5 w-3.5" /> QR Kod
      </Button>
      {show && (
        <motion.div
          className="p-3 bg-card rounded-xl border border-border shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img src={qrUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
          <p className="text-[10px] text-muted-foreground text-center mt-1">Taratarak paylaş</p>
        </motion.div>
      )}
    </div>
  );
}
