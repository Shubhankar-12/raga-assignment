"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Stethoscope } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const serverError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("doctor@carevia.io");
  const [password, setPassword] = useState("Password1");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialized && user) router.replace("/dashboard");
  }, [initialized, user, router]);

  const emailError =
    touched && !/^\S+@\S+\.\S+$/.test(email)
      ? "Please enter a valid email."
      : undefined;
  const passwordError =
    touched && password.length < 6
      ? "Password must be at least 6 characters."
      : undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (emailError || passwordError) return;
    try {
      if (mode === "signin") await login(email, password);
      else await register(email, password);
      router.replace("/dashboard");
    } catch {
      // serverError set in store
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Carevia</span>
        </div>

        <div className="space-y-6">
          <h2 className="max-w-md text-3xl font-semibold leading-snug">
            One platform for your patients, your team, and your clinic's
            outcomes.
          </h2>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
              Real-time vitals monitoring with critical alerts
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
              Department-wise analytics and admission trends
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
              HIPAA-aligned, role-based access for your staff
            </li>
          </ul>
        </div>

        <div className="text-xs text-white/60">
          © {new Date().getFullYear()} Carevia Health Systems
        </div>

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold tracking-tight text-ink-900">
                Carevia
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-ink-900">
            {mode === "signin"
              ? "Sign in to your clinic"
              : "Create your clinic account"}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {mode === "signin"
              ? "Welcome back. Please enter your credentials below."
              : "Get started — it only takes a minute."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (serverError) clearError();
              }}
              onBlur={() => setTouched(true)}
              leadingIcon={<Mail className="h-4 w-4" />}
              error={emailError}
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (serverError) clearError();
              }}
              onBlur={() => setTouched(true)}
              leadingIcon={<Lock className="h-4 w-4" />}
              error={passwordError}
              hint={mode === "signup" ? "At least 6 characters." : undefined}
              required
            />

            {serverError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {serverError}
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-brand-600 hover:text-brand-700"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                clearError();
              }}
            >
              {mode === "signin" ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
