import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface FavoriteButtonProps {
  result: FactCheckResult;
}

interface SavedFavorite {
  id: string;
  result: FactCheckResult;
  savedAt: string;
}

const STORAGE_KEY = "factcheck-favorites";

function getFavorites(): SavedFavorite[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(favs: SavedFavorite[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function FavoriteButton({ result }: FavoriteButtonProps) {
  const { toast } = useToast();
  const [isFav, setIsFav] = useState(false);

  const resultId = `${result.score}-${result.summary.substring(0, 30)}`;

  useEffect(() => {
    const favs = getFavorites();
    setIsFav(favs.some((f) => f.id === resultId));
  }, [resultId]);

  const toggleFav = () => {
    const favs = getFavorites();
    if (isFav) {
      saveFavorites(favs.filter((f) => f.id !== resultId));
      setIsFav(false);
      toast({ title: "Favorilerden çıkarıldı" });
    } else {
      saveFavorites([...favs, { id: resultId, result, savedAt: new Date().toISOString() }]);
      setIsFav(true);
      toast({ title: "Favorilere eklendi! ❤️" });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFav}
      className={`h-8 gap-1.5 text-xs ${isFav ? "text-danger border-danger/30 bg-danger/10" : ""}`}
    >
      <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
      {isFav ? "Favorilerde" : "Favorile"}
    </Button>
  );
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const removeFavorite = useCallback((id: string) => {
    const favs = getFavorites().filter((f) => f.id !== id);
    saveFavorites(favs);
    setFavorites(favs);
  }, []);

  return { favorites, removeFavorite };
}
