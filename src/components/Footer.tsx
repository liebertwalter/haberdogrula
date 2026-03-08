import { Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16 py-6 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>FactCheck - Haber Doğrula</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/hakkinda" className="hover:text-foreground transition-colors">Hakkında</Link>
            <Link to="/hakkinda" className="hover:text-foreground transition-colors">S.S.S</Link>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-danger" />
            <span>Postal Dijital</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
