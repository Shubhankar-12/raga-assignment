export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
};

export type Gender = "male" | "female" | "other";

export type PatientStatus = "stable" | "monitoring" | "critical" | "discharged";

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  status: PatientStatus;
  condition: string;
  doctor: string;
  department:
    | "Cardiology"
    | "Neurology"
    | "Oncology"
    | "Pediatrics"
    | "Orthopedics"
    | "General";
  admittedOn: string; // ISO
  lastVisit: string; // ISO
  avatarUrl: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygen: number;
  };
  notes?: string;
};

export type ViewMode = "grid" | "list";
