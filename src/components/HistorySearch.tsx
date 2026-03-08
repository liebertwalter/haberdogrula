import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HistorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function HistorySearch({ value, onChange }: HistorySearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder="Geçmişte ara..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs pl-8 bg-card/60 backdrop-blur-sm border-border/50"
      />
    </div>
  );
}
