import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ResultFeedback() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const { toast } = useToast();

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    toast({
      title: type === "up" ? "Teşekkürler! 👍" : "Geri bildirim alındı",
      description: type === "up" ? "Olumlu değerlendirmeniz için teşekkürler." : "Sonuçları iyileştirmek için çalışacağız.",
    });
  };

  if (feedback) {
    return (
      <div className="text-center text-xs text-muted-foreground py-2">
        {feedback === "up" ? "👍" : "👎"} Geri bildiriminiz kaydedildi. Teşekkürler!
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <span className="text-xs text-muted-foreground">Bu sonuç faydalı mıydı?</span>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 text-xs hover:bg-success/10 hover:border-success/30 hover:text-success"
        onClick={() => handleFeedback("up")}
      >
        <ThumbsUp className="h-3 w-3" /> Evet
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 text-xs hover:bg-danger/10 hover:border-danger/30 hover:text-danger"
        onClick={() => handleFeedback("down")}
      >
        <ThumbsDown className="h-3 w-3" /> Hayır
      </Button>
    </div>
  );
}
