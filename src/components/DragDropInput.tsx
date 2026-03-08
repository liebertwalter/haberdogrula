import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DragDropInputProps {
  onTextLoad: (text: string) => void;
}

export function DragDropInput({ onTextLoad }: DragDropInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const text = e.dataTransfer.getData("text/plain");
      if (text) {
        onTextLoad(text.slice(0, 5000));
        toast({ title: "Metin yüklendi 📋", description: "Sürükle-bırak ile metin eklendi." });
        return;
      }

      const file = e.dataTransfer.files?.[0];
      if (file && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = (ev.target?.result as string) || "";
          onTextLoad(content.slice(0, 5000));
          toast({ title: "Dosya yüklendi 📁", description: `${file.name} dosyası okundu.` });
        };
        reader.readAsText(file);
      }
    },
    [onTextLoad, toast]
  );

  return (
    <motion.div
      className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
        isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
    >
      <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
      <p className="text-xs text-muted-foreground">
        Metin veya .txt dosyasını sürükleyip bırakın
      </p>
    </motion.div>
  );
}
