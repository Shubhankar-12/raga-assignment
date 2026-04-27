"use client";

import { useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "@/components/patients/view-toggle";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientList } from "@/components/patients/patient-list";
import { useUiStore } from "@/store/ui-store";
import {
  selectFilteredPatients,
  usePatientStore,
} from "@/store/patient-store";

export default function PatientsPage() {
  const view = useUiStore((s) => s.patientView);

  const patients = usePatientStore((s) => s.patients);
  const filters = usePatientStore((s) => s.filters);
  const load = usePatientStore((s) => s.load);
  const setSearch = usePatientStore((s) => s.setSearch);
  const setStatus = usePatientStore((s) => s.setStatus);
  const setDepartment = usePatientStore((s) => s.setDepartment);
  const resetFilters = usePatientStore((s) => s.resetFilters);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => selectFilteredPatients(patients, filters),
    [patients, filters]
  );

  const departments = useMemo(() => {
    const set = new Set(patients.map((p) => p.department));
    return Array.from(set);
  }, [patients]);

  const filtersActive =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.department !== "all";

  return (
    <>
      <Header title="Patients" />

      <main className="flex-1 space-y-5 p-4 lg:p-8">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">
              {filtered.length} patient{filtered.length === 1 ? "" : "s"}
            </h2>
            <p className="text-sm text-ink-500">
              Switch between grid and list view to suit your workflow.
            </p>
          </div>
          <ViewToggle />
        </section>

        <section className="rounded-2xl border border-ink-200 bg-white p-3 shadow-card">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <Input
              placeholder="Search by name, condition, doctor, or ID…"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              leadingIcon={<Search className="h-4 w-4" />}
            />
            <Select
              value={filters.status}
              onChange={(e) => setStatus(e.target.value as typeof filters.status)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="stable">Stable</option>
              <option value="monitoring">Monitoring</option>
              <option value="critical">Critical</option>
              <option value="discharged">Discharged</option>
            </Select>
            <Select
              value={filters.department}
              onChange={(e) =>
                setDepartment(e.target.value as typeof filters.department)
              }
              aria-label="Filter by department"
            >
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!filtersActive}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-100 text-ink-500">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-ink-800">No patients found</h3>
              <p className="mt-1 text-sm text-ink-500">
                {filtersActive
                  ? "Try adjusting your filters or clearing the search."
                  : "Patients will appear here once your team adds records."}
              </p>
            </div>
            {filtersActive ? (
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((p) => (
              <PatientCard key={p.id} patient={p} />
            ))}
          </div>
        ) : (
          <PatientList patients={filtered} />
        )}
      </main>
    </>
  );
}
