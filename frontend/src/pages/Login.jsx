import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/todos");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-14">
          <h1 className="text-2xl font-bold text-black uppercase">
            Sign In
          </h1>
          <div className="mt-4 mx-auto w-8 h-px bg-black" />
          <p className="text-[11px] tracking-[0.2em] text-neutral-500 uppercase mt-4">
            Manage your tasks
          </p>
        </div>

        {error && (
          <div className="mb-8 py-3 px-4 border border-neutral-900 text-[11px] tracking-wide uppercase text-neutral-900 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="relative">
            
            <input
              id="email"
              type="email"
              value={email}
              placeholder="EMAIL"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="peer w-full bg-transparent border-0 border-b border-neutral-500 pb-2 text-sm text-black tracking-wide placeholder-neutral-500 focus:outline-none focus:border-black transition-colors duration-300"
            />
            <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-black transition-all duration-300 peer-focus:w-full" />
          </div>

          <div className="relative">
            
            <input
              id="password"
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="peer w-full bg-transparent border-0 border-b border-neutral-500 pb-2 text-sm text-black tracking-wide placeholder-neutral-500 focus:outline-none focus:border-black transition-colors duration-300"
            />
            <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-black transition-all duration-300 peer-focus:w-full" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-[11px] tracking-[0.3em] uppercase font-normal hover:bg-neutral-800 active:scale-[0.99] transition disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging In
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-16 pt-6 border-t border-neutral-200 text-center">
          <p className="text-[11px]  text-neutral-600">
            No account?{" "}
            <Link
              to="/register"
              className="text-black underline uppercase underline-offset-4 hover:no-underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;