import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/lib/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/lib/components/ui/drawer';
import { useTheme } from '@/lib/hooks/theme';

const themeOptions = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const currentIcon =
    themeOptions.find((t) => t.value === theme)?.icon ||
    themeOptions.find((t) => t.value === resolvedTheme)?.icon ||
    Sun;

  const Icon = currentIcon;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Toggle theme"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Choose Theme</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4">
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;
            const isActive = theme === option.value;

            return (
              <Button
                key={option.value}
                variant={isActive ? 'default' : 'outline'}
                className="justify-start gap-3"
                onClick={() => setTheme(option.value)}
              >
                <OptionIcon className="h-4 w-4" />
                <span>{option.label}</span>
                {isActive && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Active
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
