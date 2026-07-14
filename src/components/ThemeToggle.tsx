"use client";

import { useCallback, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Preference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

const OPTIONS: { value: Preference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function readPreference(): Preference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function resolve(pref: Preference): "light" | "dark" {
  if (pref !== "system") return pref;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  // Start at "system" (matches the server-rendered markup) and only read the
  // real client preference after mount, so the icon swap happens as a normal
  // post-hydration update rather than a server/client render mismatch.
  const [pref, setPref] = useState<Preference>("system");

  useEffect(() => {
    // Reads a client-only source (localStorage) to correct the "system"
    // placeholder above; must run post-mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPref(readPreference());
  }, []);

  const apply = useCallback((next: Preference) => {
    setPref(next);
    if (next === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
    document.documentElement.setAttribute("data-theme", resolve(next));
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      document.documentElement.setAttribute("data-theme", resolve("system"));
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [pref]);

  const CurrentIcon = OPTIONS.find((option) => option.value === pref)!.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Theme: ${pref}. Open theme menu.`}
          suppressHydrationWarning
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={pref}
          onValueChange={(value) => apply(value as Preference)}
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon className="h-4 w-4" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
