"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/charts/stat-card";
import { Card, CardBody, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { usePatientStore } from "@/store/patient-store";
import { relativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const patients = usePatientStore((s) => s.patients);
  const load = usePatientStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = patients.length;
    const critical = patients.filter((p) => p.status === "critical").length;
    const monitoring = patients.filter((p) => p.status === "monitoring").length;
    const stable = patients.filter((p) => p.status === "stable").length;
    return { total, critical, monitoring, stable };
  }, [patients]);

  const criticalList = useMemo(
    () => patients.filter((p) => p.status === "critical").slice(0, 4),
    [patients]
  );

  const recent = useMemo(
    () =>
      [...patients]
        .sort((a, b) => +new Date(b.lastVisit) - +new Date(a.lastVisit))
        .slice(0, 5),
    [patients]
  );

  return (
    <>
      <Header title="Dashboard" />

      <main className="flex-1 space-y-6 p-4 lg:p-8">
        <section className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-ink-500">Welcome back,</p>
              <h2 className="text-xl font-semibold text-ink-900">
                Dr. {user?.displayName ?? user?.email?.split("@")[0]}
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                Here's what's happening across your clinic today.
              </p>
            </div>
            <Link href="/patients">
              <Button>
                View all patients
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total patients"
            value={stats.total}
            icon={<Users className="h-5 w-5" />}
            accent="brand"
            delta={{ value: "+8.2%", positive: true }}
          />
          <StatCard
            label="Critical"
            value={stats.critical}
            icon={<AlertTriangle className="h-5 w-5" />}
            accent="red"
            delta={{ value: "+1", positive: false }}
          />
          <StatCard
            label="Under monitoring"
            value={stats.monitoring}
            icon={<HeartPulse className="h-5 w-5" />}
            accent="amber"
          />
          <StatCard
            label="Stable"
            value={stats.stable}
            icon={<Activity className="h-5 w-5" />}
            accent="emerald"
            delta={{ value: "+4", positive: true }}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardSubtitle>Latest patient visits across departments</CardSubtitle>
              </div>
              <Link href="/patients" className="text-sm font-medium text-brand-600">
                View all
              </Link>
            </CardHeader>
            <CardBody className="px-0 pb-0">
              <ul className="divide-y divide-ink-100">
                {recent.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/patients/${p.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ink-50"
                    >
                      <Avatar src={p.avatarUrl} name={p.name} size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium text-ink-900">
                            {p.name}
                          </span>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="truncate text-xs text-ink-500">
                          {p.condition} · {p.doctor}
                        </div>
                      </div>
                      <span className="hidden text-xs text-ink-400 sm:block">
                        {relativeTime(p.lastVisit)}
                      </span>
                    </Link>
                  </li>
                ))}
                {recent.length === 0 ? (
                  <li className="px-5 py-8 text-center text-sm text-ink-500">
                    Loading patients…
                  </li>
                ) : null}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Critical patients</CardTitle>
                <CardSubtitle>Needs immediate attention</CardSubtitle>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600">
                <AlertTriangle className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardBody className="space-y-3">
              {criticalList.length === 0 ? (
                <p className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
                  No critical patients right now. 🎉
                </p>
              ) : (
                criticalList.map((p) => (
                  <Link
                    key={p.id}
                    href={`/patients/${p.id}`}
                    className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50/40 p-3 hover:bg-red-50"
                  >
                    <Avatar src={p.avatarUrl} name={p.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-900">
                        {p.name}
                      </div>
                      <div className="truncate text-xs text-ink-500">{p.condition}</div>
                    </div>
                    <Stethoscope className="h-4 w-4 shrink-0 text-red-500" />
                  </Link>
                ))
              )}
            </CardBody>
          </Card>
        </section>
      </main>
    </>
  );
}
