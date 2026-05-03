"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, ArrowRight, User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("taskflow_token");
    if (token) router.replace("/dashboard");
  }, [router]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Please fill in all fields");
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("taskflow_token", data.token);
      localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      toast.success("Account created! Welcome to TaskFlow 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColors = ["", "bg-accent-rose", "bg-accent-gold", "bg-accent-jade", "bg-accent-jade"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-bg-primary flex overflow-hidden">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-primary" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-accent-violet/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl animate-pulse-soft animation-delay-500" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 text-center space-y-6">
          <div className="w-20 h-20 bg-accent-gold/10 border border-accent-gold/20 rounded-3xl flex items-center justify-center mx-auto animate-float">
            <Zap className="w-10 h-10 text-accent-gold" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-text-primary mb-3">
              Start your journey
            </h1>
            <p className="text-text-secondary font-body text-base max-w-xs mx-auto leading-relaxed">
              Join TaskFlow and take control of your productivity. Free forever.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 pt-4">
            {[
              { label: "Tasks", value: "∞" },
              { label: "Projects", value: "Free" },
              { label: "Storage", value: "100MB" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-xl font-bold text-accent-gold">{stat.value}</div>
                <div className="text-text-tertiary text-xs font-body mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-bg-secondary/40" />

        <div className={`relative z-10 w-full max-w-md ${mounted ? "animate-slide-up" : "opacity-0"}`}>
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-accent-gold rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-bg-primary" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">TaskFlow</span>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-text-primary">Create account</h2>
              <p className="text-text-secondary text-sm font-body">Get started in 30 seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="John Doe"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={update("password")}
                    placeholder="Min. 6 characters"
                    className="input-field pl-10 pr-12"
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
                {form.password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : "bg-bg-hover"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-tertiary font-body">
                      Password strength: <span className="text-text-secondary">{strengthLabels[strength]}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={update("confirm")}
                  placeholder="Repeat password"
                  className={`input-field ${form.confirm && form.confirm !== form.password ? "border-accent-rose/50" : ""}`}
                  required
                />
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-accent-rose text-xs font-body">Passwords don&apos;t match</p>
                )}
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
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-text-secondary text-sm font-body">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-accent-gold hover:text-accent-gold-dim font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
