import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="px-4 py-4">
      <div className="mx-auto flex max-w-[65ch] items-center justify-between">
        <Sidebar />
        <ThemeToggle />
      </div>
    </header>
  );
}
