import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themes = [
    { key: "light", label: "Açık", icon: Sun },
    { key: "dark", label: "Koyu", icon: Moon },
    { key: "system", label: "Sistem", icon: Monitor },
  ];

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(!open)}>
        <Palette className="h-5 w-5" />
      </Button>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-0 top-12 bg-card border border-border rounded-xl p-2 shadow-xl z-50 min-w-[140px]"
        >
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => { setTheme(t.key); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg transition-colors ${
                  theme === t.key ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
