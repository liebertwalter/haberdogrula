import { useFavorites } from "@/components/FavoriteButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield } from "lucide-react";
import { ScoreGauge } from "@/components/ScoreGauge";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">Favoriler</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <div className="text-center space-y-2 pt-4">
          <Heart className="h-10 w-10 text-danger mx-auto" />
          <h1 className="text-2xl font-bold">Kaydedilen Sonuçlar</h1>
          <p className="text-sm text-muted-foreground">{favorites.length} sonuç kaydedildi</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz favori sonuç yok.</p>
            <Link to="/">
              <Button variant="outline" className="mt-4">Doğrulama Yap</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => (
              <Card key={fav.id} className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm line-clamp-2">{fav.result.summary}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(fav.savedAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getScoreColor(fav.result.score)}`}>
                        %{fav.result.score}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-danger hover:bg-danger/10"
                        onClick={() => removeFavorite(fav.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
