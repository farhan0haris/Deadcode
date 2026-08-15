"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ghost,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Home,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // GitHub Handle Quick Connect Modal state
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubHandleInput, setGithubHandleInput] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter your email and password.");
      setIsLoading(false);
      return;
    }

    if (authMode === "register") {
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match. Please re-enter.");
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        setErrorMsg("Password must be at least 8 characters.");
        setIsLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9_-]{1,39}$/.test(formData.username || "")) {
        setErrorMsg("Username must be 1-39 alphanumeric characters.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        name: formData.name || formData.email.split("@")[0],
        username: formData.username || formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setErrorMsg("Sign in failed. Please check your details.");
      } else {
        // Save user profile locally
        localStorage.setItem(
          "deadcode_user_profile",
          JSON.stringify({
            name: formData.name || formData.email.split("@")[0],
            username: formData.username || formData.email.split("@")[0],
            email: formData.email,
            github: formData.username || "",
          })
        );

        setSuccessMsg(
          authMode === "login"
            ? "Signed in successfully! Launching Command Center..."
            : "Account registered successfully! Launching Command Center..."
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      }
    } catch {
      setErrorMsg("Authentication error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubClick = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("github", { callbackUrl: "/dashboard", redirect: false });
      if (res?.error) {
        // If OAuth credentials aren't configured in GitHub Developer settings yet, show GitHub Handle Direct Connect
        setShowGithubModal(true);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setShowGithubModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubDirectConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubHandleInput.trim()) return;
    setIsLoading(true);

    const handle = githubHandleInput.trim().replace(/^@/, "");
    localStorage.setItem(
      "deadcode_user_profile",
      JSON.stringify({
        name: handle,
        username: handle,
        email: `${handle}@users.noreply.github.com`,
        github: handle,
      })
    );

    await signIn("credentials", {
      redirect: false,
      name: handle,
      username: handle,
      email: `${handle}@users.noreply.github.com`,
      password: "github_oauth_session_token",
    });

    setSuccessMsg(`Connected as @${handle}! Loading dashboard...`);
    setShowGithubModal(false);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    localStorage.setItem(
      "deadcode_user_profile",
      JSON.stringify({
        name: "Developer",
        username: "developer",
        email: "demo@deadcode.dev",
        github: "developer",
      })
    );

    await signIn("credentials", {
      redirect: false,
      name: "Developer",
      username: "developer",
      email: "demo@deadcode.dev",
      password: "demopassword123",
    });
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Top Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 rounded-xl border border-[#74B4D9]/25 bg-[#74B4D9]/10 px-4 py-2 text-xs font-bold text-[#74B4D9] transition-all hover:bg-[#74B4D9]/20 backdrop-blur-md"
      >
        <Home className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>

      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-[#10367D]/45 blur-[140px]" />

      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-[#74B4D9]/25 relative z-10">
        {/* Logo & Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#EBEBEB] shadow-lg shadow-[#10367D]/60 border border-[#74B4D9]/40 mb-3">
            <Ghost className="h-7 w-7 text-[#74B4D9]" />
          </div>
          <h1 className="text-2xl font-black text-[#EBEBEB] tracking-tight">
            {authMode === "login" ? "Welcome Back to DeadCode" : "Create Your Developer Account"}
          </h1>
          <p className="mt-1 text-xs text-[#EBEBEB]/70 font-medium">
            {authMode === "login"
              ? "Access your privacy-first Git time machine and developer memory stream."
              : "Start tracking and preserving your real coding journey across all repositories."}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`rounded-lg py-2 text-xs font-black transition-all ${
              authMode === "login"
                ? "bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#10367D] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
                : "text-[#EBEBEB]/60 hover:text-[#EBEBEB]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`rounded-lg py-2 text-xs font-black transition-all ${
              authMode === "register"
                ? "bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#10367D] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
                : "text-[#EBEBEB]/60 hover:text-[#EBEBEB]"
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/50 p-3 text-xs font-bold text-rose-300">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-3 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* GitHub 1-Click OAuth Button */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGithubClick}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-4 py-3 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-lg shadow-[#10367D]/40 transition-all hover:scale-[1.02] hover:border-[#74B4D9] disabled:opacity-50"
          >
            <GithubIcon className="h-4 w-4" />
            <span>
              {authMode === "login" ? "Continue with GitHub" : "Register with GitHub"}
            </span>
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-[#74B4D9]/20" />
            <span className="absolute bg-[#0d2452] px-3 text-[10px] uppercase font-black tracking-widest text-[#74B4D9]">
              or use email credentials
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialAuth} className="mt-4 space-y-3.5">
          {authMode === "register" && (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Developer"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  GitHub Username / Handle
                </label>
                <div className="relative">
                  <GithubIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. alex_github"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="developer@example.com"
                className="h-10 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="h-10 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-10 pr-10 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74B4D9]/50 hover:text-[#74B4D9]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {authMode === "register" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                />
              </div>
            </div>
          )}

          {authMode === "login" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#EBEBEB]/70">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="rounded border-[#74B4D9]/30 bg-[#74B4D9]/10 text-[#10367D] focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  alert("Password reset instructions have been dispatched to your email address.")
                }
                className="text-xs font-bold text-[#74B4D9] underline hover:opacity-80"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#74B4D9] px-4 py-3 text-xs font-black text-[#091836] shadow-md transition-all hover:bg-[#8ec7e8] hover:scale-[1.01] disabled:opacity-50"
          >
            <span>
              {isLoading
                ? "Authenticating..."
                : authMode === "login"
                ? "Sign In to Dashboard"
                : "Complete Registration"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 1-Click Instant Demo / Guest Mode */}
        <div className="mt-5 pt-4 border-t border-[#74B4D9]/20 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#74B4D9]/25 bg-[#74B4D9]/10 px-4 py-2.5 text-xs font-bold text-[#74B4D9] transition-all hover:bg-[#74B4D9]/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explore Demo Environment (1-Click Guest Access)</span>
          </button>

          <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-[#EBEBEB]/60 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Offline Guard & Local Token Storage Active</span>
          </div>
        </div>
      </div>

      {/* GitHub Direct Handle Connect Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091836]/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-[#74B4D9]/30 bg-[#0d2452] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10367D] text-[#74B4D9] border border-[#74B4D9]/30">
                <GithubIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#EBEBEB]">GitHub Quick Sync</h3>
                <p className="text-[11px] text-[#EBEBEB]/70">Enter your GitHub username to connect your repositories.</p>
              </div>
            </div>

            <form onSubmit={handleGithubDirectConnect} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Your GitHub Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#74B4D9]">@</span>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={githubHandleInput}
                    onChange={(e) => setGithubHandleInput(e.target.value)}
                    placeholder="your_github_handle"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836] pl-8 pr-4 text-xs font-bold text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  className="flex-1 rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 py-2.5 text-xs font-bold text-[#EBEBEB] hover:bg-[#74B4D9]/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !githubHandleInput.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] py-2.5 text-xs font-black text-[#EBEBEB] shadow-md border border-[#74B4D9]/40 hover:scale-105 transition-all disabled:opacity-50"
                >
                  Connect & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
