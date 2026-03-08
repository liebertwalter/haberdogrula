import { motion } from "framer-motion";
import { Bookmark, FolderOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { useToast } from "@/hooks/use-toast";

interface BookmarkCategoriesProps {
  result: FactCheckResult;
}

const categories = [
  { id: "important", label: "Önemli", emoji: "⭐" },
  { id: "suspicious", label: "Şüpheli", emoji: "🔍" },
  { id: "verified", label: "Doğrulanmış", emoji: "✅" },
  { id: "fake", label: "Sahte", emoji: "❌" },
  { id: "later", label: "Sonra Oku", emoji: "📌" },
];

export function BookmarkCategories({ result }: BookmarkCategoriesProps) {
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  const handleSave = (catId: string) => {
    const stored = JSON.parse(localStorage.getItem("fc_bookmarks") || "{}");
    if (!stored[catId]) stored[catId] = [];
    stored[catId].push({
      score: result.score,
      summary: result.summary.substring(0, 100),
      category: result.category,
      date: new Date().toISOString(),
    });
    localStorage.setItem("fc_bookmarks", JSON.stringify(stored));
    setShow(false);
    const cat = categories.find((c) => c.id === catId);
    toast({ title: `${cat?.emoji} Kaydedildi`, description: `"${cat?.label}" kategorisine eklendi.` });
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setShow(!show)} className="h-8 gap-1.5 text-xs">
        <FolderOpen className="h-3.5 w-3.5" /> Kategorize Et
      </Button>
      {show && (
        <motion.div
          className="absolute bottom-10 left-0 bg-card border border-border rounded-xl p-2 shadow-xl z-50 w-40"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="w-full text-left text-xs px-3 py-1.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              onClick={() => handleSave(cat.id)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
