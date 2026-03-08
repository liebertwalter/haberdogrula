import { useFavorites } from "@/components/FavoriteButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2 pt-4">
          <Heart className="h-10 w-10 text-danger mx-auto" />
          <h1 className="text-2xl font-bold">Kaydedilen Sonuçlar</h1>
          <p className="text-sm text-muted-foreground">{favorites.length} sonuç kaydedildi</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz favori sonuç yok.</p>
            <Link to="/dogrula">
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
                        {new Date(fav.savedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getScoreColor(fav.result.score)}`}>%{fav.result.score}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => removeFavorite(fav.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
