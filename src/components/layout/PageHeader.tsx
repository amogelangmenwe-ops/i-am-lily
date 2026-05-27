import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {children}
    </div>
  );
}

export function ResponsibleAINotice() {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
      <strong className="text-foreground font-medium">Responsible AI:</strong>{" "}
      This AI assistant provides productivity support and generated suggestions.
      Verify important communications and decisions before use. Keep personal
      and sensitive data secure.
    </div>
  );
}