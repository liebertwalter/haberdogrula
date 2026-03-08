import { useState } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function HistoryManager() {
  const { toast } = useToast();

  const handleExportHistory = () => {
    const favorites = JSON.parse(localStorage.getItem("factCheckFavorites") || "[]");
    const bookmarks = JSON.parse(localStorage.getItem("fc_bookmarks") || "{}");
    const feedbacks = JSON.parse(localStorage.getItem("fc_feedbacks") || "[]");

    const exportData = { favorites, bookmarks, feedbacks, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factcheck-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "İndirildi 📥", description: "Tüm verileriniz dışa aktarıldı." });
  };

  const handleClearLocal = () => {
    const keys = ["factCheckFavorites", "fc_bookmarks", "fc_feedbacks", "fc_draft_text", "fc_draft_url"];
    keys.forEach((k) => localStorage.removeItem(k));
    toast({ title: "Temizlendi 🧹", description: "Yerel veriler silindi." });
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" size="sm" onClick={handleExportHistory} className="h-7 gap-1 text-[10px]" title="Verileri dışa aktar">
        <Download className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClearLocal} className="h-7 gap-1 text-[10px] text-danger hover:text-danger" title="Yerel verileri temizle">
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
