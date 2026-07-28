import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <Button
      variant="glass"
      size="icon"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {mounted && theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
