import { FileText, Clock } from "lucide-react";

interface TextStatsProps {
  text: string;
}

export function TextStats({ text }: TextStatsProps) {
  if (!text.trim()) return null;

  const words = text.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        {words} kelime
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        ~{readTime} dk okuma
      </span>
    </div>
  );
}
