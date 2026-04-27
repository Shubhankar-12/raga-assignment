import Link from "next/link";
import { Activity, Heart, ThermometerSun, Wind } from "lucide-react";
import type { Patient } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Link
      href={`/patients/${patient.id}`}
      className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={patient.avatarUrl} name={patient.name} size={48} />
          <div>
            <div className="font-semibold text-ink-900 group-hover:text-brand-700">
              {patient.name}
            </div>
            <div className="text-xs text-ink-500">
              {patient.id} · {patient.age}y · {patient.gender}
            </div>
          </div>
        </div>
        <StatusBadge status={patient.status} />
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="text-sm font-medium text-ink-800">{patient.condition}</div>
        <div className="text-xs text-ink-500">
          {patient.department} · {patient.doctor}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-ink-100 pt-4">
        <Vital icon={<Heart className="h-3.5 w-3.5" />} label="HR" value={`${patient.vitals.heartRate}`} />
        <Vital icon={<Activity className="h-3.5 w-3.5" />} label="BP" value={patient.vitals.bloodPressure} />
        <Vital icon={<ThermometerSun className="h-3.5 w-3.5" />} label="Temp" value={`${patient.vitals.temperature}°`} />
        <Vital icon={<Wind className="h-3.5 w-3.5" />} label="O₂" value={`${patient.vitals.oxygen}%`} />
      </div>

      <div className="mt-4 text-xs text-ink-400">
        Last visit · {relativeTime(patient.lastVisit)}
      </div>
    </Link>
  );
}

function Vital({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 rounded-lg bg-ink-50 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-ink-500">
        {icon}
        {label}
      </div>
      <div className="text-xs font-semibold text-ink-800">{value}</div>
    </div>
  );
}
