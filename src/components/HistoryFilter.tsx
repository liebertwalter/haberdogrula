import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: "all", label: "Tümü" },
  { key: "high", label: "Güvenilir" },
  { key: "mid", label: "Şüpheli" },
  { key: "low", label: "Güvenilmez" },
];

export function HistoryFilter({ activeFilter, onFilterChange }: HistoryFilterProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      {filters.map((f) => (
        <Button
          key={f.key}
          variant={activeFilter === f.key ? "default" : "outline"}
          size="sm"
          className="h-6 text-[10px] px-2 rounded-full"
          onClick={() => onFilterChange(f.key)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
