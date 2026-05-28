import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  CheckSquare,
  CalendarDays,
  Users,
  MessageSquare,
  Bell,
  Settings,
  User,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/emails", label: "Emails", icon: Mail },
  { to: "/tasks", label: "Task Planner", icon: CheckSquare },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/meetings", label: "Meetings", icon: Users },
  { to: "/chat", label: "AI Assistant", icon: MessageSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-gradient-hero">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold tracking-tight leading-tight">Lilly</h2>
            <p className="text-[11px] text-muted-foreground">Workplace Assistant</p>
          </div>
          <button
            className="ml-auto lg:hidden text-muted-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
          <span>
            Responsible AI: review AI suggestions before sending. Lilly supports — she doesn't replace — your judgement.
          </span>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold tracking-tight">Lilly</span>
        </header>
        <main className="flex-1 min-h-0">{children}</main>
      </div>
    </div>
  );
}