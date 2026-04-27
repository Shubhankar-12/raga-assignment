"use client";

import { useEffect, useMemo } from "react";
import { Activity, IndianRupee, TrendingUp, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardBody, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { StatCard } from "@/components/charts/stat-card";
import {
  AdmissionsChart,
  DepartmentChart,
  RevenueChart,
} from "@/components/charts/analytics-charts";
import { usePatientStore } from "@/store/patient-store";

const ADMISSION_TREND = [
  { name: "Mon", admissions: 18, discharges: 12 },
  { name: "Tue", admissions: 24, discharges: 16 },
  { name: "Wed", admissions: 19, discharges: 21 },
  { name: "Thu", admissions: 28, discharges: 18 },
  { name: "Fri", admissions: 32, discharges: 24 },
  { name: "Sat", admissions: 21, discharges: 19 },
  { name: "Sun", admissions: 15, discharges: 14 },
];

const REVENUE_TREND = [
  { name: "Wk 1", value: 412_000 },
  { name: "Wk 2", value: 488_000 },
  { name: "Wk 3", value: 461_000 },
  { name: "Wk 4", value: 552_000 },
  { name: "Wk 5", value: 601_000 },
  { name: "Wk 6", value: 588_000 },
  { name: "Wk 7", value: 642_000 },
  { name: "Wk 8", value: 711_000 },
];

export default function AnalyticsPage() {
  const patients = usePatientStore((s) => s.patients);
  const load = usePatientStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  const departmentDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of patients) {
      counts.set(p.department, (counts.get(p.department) ?? 0) + 1);
    }
    return Array.from(counts, ([name, value]) => ({ name, value }));
  }, [patients]);

  return (
    <>
      <Header title="Analytics" />

      <main className="flex-1 space-y-6 p-4 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active patients"
            value={patients.length}
            icon={<Users className="h-5 w-5" />}
            accent="brand"
            delta={{ value: "+8.2%", positive: true }}
          />
          <StatCard
            label="Avg. occupancy"
            value="78%"
            icon={<Activity className="h-5 w-5" />}
            accent="emerald"
            delta={{ value: "+3.1%", positive: true }}
          />
          <StatCard
            label="Revenue (8w)"
            value="₹44.5L"
            icon={<IndianRupee className="h-5 w-5" />}
            accent="indigo"
            delta={{ value: "+12.4%", positive: true }}
          />
          <StatCard
            label="Re-admission rate"
            value="6.2%"
            icon={<TrendingUp className="h-5 w-5" />}
            accent="amber"
            delta={{ value: "-0.8%", positive: true }}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Admissions vs. discharges</CardTitle>
                <CardSubtitle>Last 7 days</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody>
              <AdmissionsChart data={ADMISSION_TREND} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Department mix</CardTitle>
                <CardSubtitle>Active patients by dept.</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody>
              {departmentDistribution.length > 0 ? (
                <DepartmentChart data={departmentDistribution} />
              ) : (
                <div className="grid h-[280px] place-items-center text-sm text-ink-400">
                  Loading…
                </div>
              )}
            </CardBody>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Revenue trend</CardTitle>
                <CardSubtitle>Weekly billing — last 8 weeks</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody>
              <RevenueChart data={REVENUE_TREND} />
            </CardBody>
          </Card>
        </section>
      </main>
    </>
  );
}
