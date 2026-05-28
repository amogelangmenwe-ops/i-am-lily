import { useEffect, useState } from "react";
import { loadPlan, savePlan, uid, type PlanItem } from "@/lib/assistant";
import { Check, Plus, Trash2, Bell } from "lucide-react";

const DEFAULT_TIMES = ["09:00", "12:00", "15:00", "17:00"];

export function PlanPanel() {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  useEffect(() => {
    const stored = loadPlan();
    if (stored.length === 0) {
      const seed: PlanItem[] = DEFAULT_TIMES.map((t, i) => ({
        id: uid(),
        time: t,
        task: ["Review priorities & inbox", "Lunch + quick walk", "Deep work block", "Wrap-up & follow-ups"][i],
        done: false,
      }));
      setItems(seed);
      savePlan(seed);
    } else {
      setItems(stored);
    }
  }, []);

  function update(next: PlanItem[]) {
    setItems(next);
    savePlan(next);
  }

  function add() {
    if (!newTask.trim()) return;
    update([...items, { id: uid(), time: newTime, task: newTask.trim(), done: false }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTask("");
  }

  function toggle(id: string) {
    update(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function remove(id: string) {
    update(items.filter((i) => i.id !== id));
  }

  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-primary" />
        <h2 className="font-medium tracking-tight">Today's Plan</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {items.filter((i) => i.done).length}/{items.length} done
        </span>
      </div>

      <ul className="space-y-2 flex-1 overflow-y-auto pr-1">
        {items.map((it) => (
          <li
            key={it.id}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 border border-border bg-background/50 hover:bg-secondary transition-colors ${
              it.done ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => toggle(it.id)}
              className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                it.done ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary"
              }`}
              aria-label="Toggle task"
            >
              {it.done && <Check className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs font-mono text-muted-foreground tabular-nums w-12">{it.time}</span>
            <span className={`text-sm flex-1 ${it.done ? "line-through" : ""}`}>{it.task}</span>
            <button
              onClick={() => remove(it.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground text-center py-8">No tasks yet. Ask Lilly to plan your day.</li>
        )}
      </ul>

      <div className="mt-4 flex gap-2">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="bg-background border border-border rounded-lg px-2 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task…"
          className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={add}
          className="bg-primary text-primary-foreground rounded-lg px-3 hover:opacity-90 transition-opacity"
          aria-label="Add"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}