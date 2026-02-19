"use client";
import { useReducer } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Truck, Zap, AlertCircle, Eye, EyeOff } from "lucide-react";

// ─── Reducer ────────────────────────────────────────────────
interface LoginState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  showPw: boolean;
}

type LoginAction =
  | { type: "SET_EMAIL"; value: string }
  | { type: "SET_PASSWORD"; value: string }
  | { type: "SET_ERROR"; value: string }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "TOGGLE_PW" };

const initialState: LoginState = {
  email: "ricky@hemut.io",
  password: "hemut2026",
  error: "",
  loading: false,
  showPw: false,
};

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_EMAIL":    return { ...state, email: action.value };
    case "SET_PASSWORD": return { ...state, password: action.value };
    case "SET_ERROR":    return { ...state, error: action.value, loading: false };
    case "SET_LOADING":  return { ...state, loading: action.value };
    case "TOGGLE_PW":    return { ...state, showPw: !state.showPw };
    default:             return state;
  }
}

export function LoginClient() {
  const router = useRouter();
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { email, password, error, loading, showPw } = state;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", value: true });
    dispatch({ type: "SET_ERROR", value: "" });

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      dispatch({ type: "SET_ERROR", value: "Invalid email or password. Try ricky@hemut.io / hemut2026" });
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center p-6">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-xl tracking-tight">Hemut</div>
            <div className="text-white/30 text-xs font-medium">AI Logistics OS</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold tracking-wide">LIVE</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm">
          <h1 className="text-white text-xl font-bold mb-1">Sign in to Hemut</h1>
          <p className="text-white/35 text-sm mb-6">Operations Command · Fleet Intelligence</p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-3 mb-5 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => dispatch({ type: "SET_EMAIL", value: e.target.value })}
                required
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => dispatch({ type: "SET_PASSWORD", value: e.target.value })}
                  required
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_PW" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-bold py-2.5 rounded-xl transition-all mt-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Demo creds */}
        <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[10px] text-white/25 uppercase tracking-wider font-bold mb-2">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <span className="text-white/35">Email</span>
            <span className="text-white/60 font-mono">ricky@hemut.io</span>
            <span className="text-white/35">Password</span>
            <span className="text-white/60 font-mono">hemut2026</span>
          </div>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          Hemut Logistics OS · Powered by AI
        </p>
      </div>
    </div>
  );
}
