import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Patient } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export function PatientList({ patients }: { patients: Patient[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-ink-100">
          <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Condition</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last visit</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 text-sm">
            {patients.map((p) => (
              <tr key={p.id} className="group transition-colors hover:bg-ink-50">
                <td className="px-5 py-3">
                  <Link href={`/patients/${p.id}`} className="flex items-center gap-3">
                    <Avatar src={p.avatarUrl} name={p.name} size={36} />
                    <div>
                      <div className="font-medium text-ink-900 group-hover:text-brand-700">
                        {p.name}
                      </div>
                      <div className="text-xs text-ink-500">
                        {p.id} · {p.age}y · {p.gender}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink-700">{p.condition}</td>
                <td className="px-5 py-3 text-ink-600">{p.department}</td>
                <td className="px-5 py-3 text-ink-600">{p.doctor}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3 text-ink-500">{relativeTime(p.lastVisit)}</td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/patients/${p.id}`}
                    className="inline-flex items-center text-brand-600 hover:text-brand-700"
                    aria-label={`Open ${p.name}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <ul className="divide-y divide-ink-100 md:hidden">
        {patients.map((p) => (
          <li key={p.id}>
            <Link href={`/patients/${p.id}`} className="flex items-center gap-3 px-4 py-3">
              <Avatar src={p.avatarUrl} name={p.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-medium text-ink-900">{p.name}</div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="truncate text-xs text-ink-500">
                  {p.condition} · {p.department}
                </div>
                <div className="text-[11px] text-ink-400">
                  Last visit · {relativeTime(p.lastVisit)}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-ink-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
