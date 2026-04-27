import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ViewMode } from "@/types";

type UiState = {
  patientView: ViewMode;
  sidebarOpen: boolean;
  setPatientView: (v: ViewMode) => void;
  togglePatientView: () => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      patientView: "grid",
      sidebarOpen: false,

      setPatientView: (patientView) => set({ patientView }),
      togglePatientView: () =>
        set({ patientView: get().patientView === "grid" ? "list" : "grid" }),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: "hc:ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ patientView: s.patientView }),
    }
  )
);
