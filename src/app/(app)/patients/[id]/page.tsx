"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Droplet,
  HeartPulse,
  Mail,
  Phone,
  Stethoscope,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardBody, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VitalsChart } from "@/components/charts/analytics-charts";
import { usePatientStore } from "@/store/patient-store";
import { formatDate } from "@/lib/utils";
import { showLocalNotification } from "@/lib/notifications";

export default function PatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const patient = usePatientStore((s) => s.getById(params.id));
  const load = usePatientStore((s) => s.load);
  const loaded = usePatientStore((s) => s.loaded);

  useEffect(() => {
    load();
  }, [load]);

  const vitalsTrend = useMemo(() => {
    if (!patient) return [];
    const baseHr = patient.vitals.heartRate;
    const baseO2 = patient.vitals.oxygen;
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${String(i * 2).padStart(2, "0")}:00`,
      heartRate: Math.max(40, Math.round(baseHr + Math.sin(i / 2) * 6 + (i % 3) - 1)),
      oxygen: Math.min(100, Math.round(baseO2 + Math.cos(i / 3) * 1.5)),
    }));
  }, [patient]);

  if (loaded && !patient) {
    return (
      <>
        <Header title="Patient not found" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <p className="text-sm text-ink-500">
            We couldn't find a patient with ID <code>{params.id}</code>.
          </p>
          <Link href="/patients">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to patients
            </Button>
          </Link>
        </main>
      </>
    );
  }

  if (!patient) {
    return (
      <>
        <Header title="Patient details" />
        <main className="flex flex-1 items-center justify-center p-8">
          <span
            aria-hidden
            className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Patient details" />

      <main className="flex-1 space-y-6 p-4 lg:p-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              showLocalNotification({
                title: `Reminder: ${patient.name}`,
                body: `Follow-up due — ${patient.condition}`,
                tag: `hc-followup-${patient.id}`,
                url: `/patients/${patient.id}`,
              })
            }
          >
            <Bell className="h-4 w-4" />
            Notify follow-up
          </Button>
        </div>

        <Card>
          <CardBody className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <Avatar src={patient.avatarUrl} name={patient.name} size={88} />
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-ink-900">{patient.name}</h2>
                <StatusBadge status={patient.status} />
                <Badge tone="info">{patient.id}</Badge>
              </div>
              <p className="text-sm text-ink-600">
                {patient.age} y · {patient.gender} · Blood {patient.bloodGroup}
              </p>
              <p className="text-sm font-medium text-ink-800">{patient.condition}</p>
              <p className="text-xs text-ink-500">
                {patient.department} · Under care of {patient.doctor}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:text-right">
              <Detail icon={<Mail className="h-3.5 w-3.5" />} text={patient.email} />
              <Detail icon={<Phone className="h-3.5 w-3.5" />} text={patient.phone} />
            </div>
          </CardBody>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Vital
            icon={<HeartPulse className="h-5 w-5" />}
            label="Heart rate"
            value={`${patient.vitals.heartRate} bpm`}
            tone="red"
          />
          <Vital
            icon={<Droplet className="h-5 w-5" />}
            label="Blood pressure"
            value={patient.vitals.bloodPressure}
            tone="indigo"
          />
          <Vital
            icon={<ThermometerSun className="h-5 w-5" />}
            label="Temperature"
            value={`${patient.vitals.temperature}°F`}
            tone="amber"
          />
          <Vital
            icon={<Wind className="h-5 w-5" />}
            label="Oxygen sat."
            value={`${patient.vitals.oxygen}%`}
            tone="brand"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Vitals — last 24 hours</CardTitle>
                <CardSubtitle>Heart rate and oxygen saturation</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody>
              <VitalsChart data={vitalsTrend} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Visit history</CardTitle>
                <CardSubtitle>Recent timeline</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Timeline
                icon={<Calendar className="h-4 w-4" />}
                title="Admitted"
                date={formatDate(patient.admittedOn)}
              />
              <Timeline
                icon={<Stethoscope className="h-4 w-4" />}
                title="Last visit"
                date={formatDate(patient.lastVisit)}
              />
              {patient.notes ? (
                <div className="rounded-lg bg-ink-50 p-3 text-sm text-ink-700">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                    Clinician note
                  </div>
                  <p className="mt-1">{patient.notes}</p>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </section>
      </main>
    </>
  );
}

function Detail({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-ink-600 sm:justify-end">
      {icon}
      {text}
    </div>
  );
}

const vitalToneClasses = {
  red: "bg-red-50 text-red-600",
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  brand: "bg-brand-50 text-brand-600",
} as const;

function Vital({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: keyof typeof vitalToneClasses;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-card">
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${vitalToneClasses[tone]}`}
      >
        {icon}
      </span>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
          {label}
        </div>
        <div className="text-lg font-semibold text-ink-900">{value}</div>
      </div>
    </div>
  );
}

function Timeline({
  icon,
  title,
  date,
}: {
  icon: React.ReactNode;
  title: string;
  date: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div>
        <div className="text-sm font-medium text-ink-800">{title}</div>
        <div className="text-xs text-ink-500">{date}</div>
      </div>
    </div>
  );
}
