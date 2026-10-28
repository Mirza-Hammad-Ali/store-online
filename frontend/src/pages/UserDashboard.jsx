import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm text-gray-500">My Account</p>
      <h1 className="mt-2 text-3xl font-semibold">Welcome, {user.name}!</h1>
      <p className="mt-3 text-gray-600">{user.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/shop" className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Continue shopping</h2>
          <p className="mt-2 text-gray-600">Browse our products.</p>
        </Link>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">My orders</h2>
          <p className="mt-2 text-gray-600">
            Your order history will appear here once orders are connected.
          </p>
        </div>
      </div>

      <button onClick={logout} className="mt-8 rounded-lg border px-5 py-3">
        Logout
      </button>
    </section>
  );
}
