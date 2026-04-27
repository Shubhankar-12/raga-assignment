"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_HEIGHT = 280;

type Series = { name: string; value: number }[];
type DualSeries = { name: string; admissions: number; discharges: number }[];
type VitalsSeries = { time: string; heartRate: number; oxygen: number }[];

const PIE_COLORS = ["#3279ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9"];

export function AdmissionsChart({ data }: { data: DualSeries }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
        <XAxis dataKey="name" stroke="#8290ad" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8290ad" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            border: "1px solid #dde2ec",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="admissions" name="Admissions" fill="#3279ff" radius={[6, 6, 0, 0]} />
        <Bar dataKey="discharges" name="Discharges" fill="#10b981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DepartmentChart({ data }: { data: Series }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <PieChart>
        <Tooltip
          contentStyle={{
            border: "1px solid #dde2ec",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart({ data }: { data: Series }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3279ff" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3279ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
        <XAxis dataKey="name" stroke="#8290ad" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8290ad" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            border: "1px solid #dde2ec",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3279ff"
          strokeWidth={2}
          fill="url(#rev)"
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function VitalsChart({ data }: { data: VitalsSeries }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
        <XAxis dataKey="time" stroke="#8290ad" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#8290ad" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            border: "1px solid #dde2ec",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ef4444" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="oxygen" name="O₂" stroke="#3279ff" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
