import { create } from "zustand";
import type { Patient, PatientStatus } from "@/types";
import { MOCK_PATIENTS } from "@/data/mock-patients";

type PatientFilters = {
  search: string;
  status: PatientStatus | "all";
  department: Patient["department"] | "all";
};

type PatientState = {
  patients: Patient[];
  loaded: boolean;
  filters: PatientFilters;
  load: () => Promise<void>;
  setSearch: (q: string) => void;
  setStatus: (s: PatientFilters["status"]) => void;
  setDepartment: (d: PatientFilters["department"]) => void;
  resetFilters: () => void;
  getById: (id: string) => Patient | undefined;
};

const defaultFilters: PatientFilters = {
  search: "",
  status: "all",
  department: "all",
};

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loaded: false,
  filters: defaultFilters,

  load: async () => {
    if (get().loaded) return;
    // Simulated async fetch — swap for a real API call when available.
    await new Promise((r) => setTimeout(r, 250));
    set({ patients: MOCK_PATIENTS, loaded: true });
  },

  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setStatus: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setDepartment: (department) => set((s) => ({ filters: { ...s.filters, department } })),
  resetFilters: () => set({ filters: defaultFilters }),

  getById: (id) => get().patients.find((p) => p.id === id),
}));

export function selectFilteredPatients(
  patients: Patient[],
  filters: PatientFilters
): Patient[] {
  const q = filters.search.trim().toLowerCase();
  return patients.filter((p) => {
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (filters.department !== "all" && p.department !== filters.department) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q) ||
      p.doctor.toLowerCase().includes(q)
    );
  });
}
