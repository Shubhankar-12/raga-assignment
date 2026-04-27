"use client";

import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup } from "@/components/ui/toggle";
import { useUiStore } from "@/store/ui-store";
import type { ViewMode } from "@/types";

const OPTIONS = [
  { value: "grid" as const, label: "Grid", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { value: "list" as const, label: "List", icon: <List className="h-3.5 w-3.5" /> },
];

export function ViewToggle() {
  const view = useUiStore((s) => s.patientView);
  const setView = useUiStore((s) => s.setPatientView);
  return (
    <ToggleGroup<ViewMode>
      ariaLabel="Patient view"
      value={view}
      onChange={setView}
      options={OPTIONS}
    />
  );
}
