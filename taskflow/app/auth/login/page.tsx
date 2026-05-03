"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const FEATURES = [
  "JWT-secured authentication",
  "Priority-based task management",
  "Real-time filters & search",
  "Beautiful analytics dashboard",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("taskflow_token");
    if (token) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("taskflow_token", data.token);
      localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex overflow-hidden">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-primary" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-jade/5 rounded-full blur-3xl animate-pulse-soft animation-delay-300" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-gold rounded-xl flex items-center justify-center shadow-gold-sm">
              <Zap className="w-5 h-5 text-bg-primary" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">TaskFlow</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse" />
              <span className="text-accent-gold text-xs font-display font-semibold tracking-wider uppercase">Production Ready</span>
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.1] text-text-primary">
              Organize work.<br />
              <span className="gradient-text">Ship faster.</span>
            </h1>
            <p className="text-text-secondary font-body text-lg leading-relaxed max-w-sm">
              A premium task management system built for developers who care about their workflow.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div
                key={f}
                className={`flex items-center gap-3 ${mounted ? "animate-slide-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 0.1 + 0.2}s`, animationFillMode: "both" }}
              >
                <CheckCircle2 className="w-4 h-4 text-accent-jade shrink-0" />
                <span className="text-text-secondary text-sm font-body">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-text-muted text-xs font-body">Built with Next.js · MongoDB · TypeScript</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-bg-secondary/50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/3 rounded-full blur-3xl" />

        <div className={`relative z-10 w-full max-w-md ${mounted ? "animate-slide-up" : "opacity-0"}`}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-accent-gold rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-bg-primary" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">TaskFlow</span>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-text-primary">Welcome back</h2>
              <p className="text-text-secondary text-sm font-body">Sign in to your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pr-12"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-bg-card px-3 text-text-tertiary text-xs font-body">or</span>
              </div>
            </div>

            <p className="text-center text-text-secondary text-sm font-body">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-accent-gold hover:text-accent-gold-dim font-semibold transition-colors">
                Create one →
              </Link>
            </p>
          </div>

          <p className="text-center text-text-muted text-xs font-body mt-6">
            Protected by JWT · Data encrypted with bcrypt
          </p>
        </div>
      </div>
    </div>
  );
}
