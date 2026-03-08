import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  delay?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

export function ResultCard({ icon: Icon, title, children, delay = 0, variant = "default" }: ResultCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-success/30",
    warning: "border-warning/30",
    danger: "border-danger/30",
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className={`${variantStyles[variant]} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className={`h-5 w-5 ${iconStyles[variant]}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
