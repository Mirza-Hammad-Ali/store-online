
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <p className="p-6">Loading...</p>;

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/account"}
        replace
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const account = await login(email, password);
      const destination =
        account.role === "admin" ? "/admin" : "/account";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold">Welcome back</h1>
      <p className="mb-8 text-gray-600">
        Sign in to your store account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-[#24251f] p-3 text-white disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm">
        Don't have an account? <Link className="underline" to="/signup">Sign up</Link>
      </p>
    </section>
  );
}
