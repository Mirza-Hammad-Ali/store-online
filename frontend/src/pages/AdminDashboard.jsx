import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { title: "Dashboard" },
  { title: "Products" },
  { title: "Orders" },
  { title: "Customers" },
  { title: "Settings" },
];

const stats = [
  { title: "Total Products", value: "500" },
  { title: "Total Orders", value: "334" },
  { title: "Total Customers", value: "304" },
  { title: "Total Revenue", value: "1000$" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  async function verifyAdminAccess() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setMessage("Please log in again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/admin-check",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Access denied.");
      }

      setMessage(data.message || "Admin access verified successfully.");
    } catch (error) {
      setMessage(error.message || "Could not verify admin access.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col bg-gray-950 text-white md:flex">
          <div className="border-b border-white/10 px-6 py-7">
            <h2 className="text-2xl font-extrabold tracking-wide">
              STORE<span className="text-orange-400">.</span>
            </h2>
            <p className="mt-1 text-xs text-gray-400">ADMINISTRATION PANEL</p>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => setActiveMenu(item.title)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  activeMenu === item.title
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                {item.title}
              </button>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-sm font-semibold">
              {user?.name || "Administrator"}
            </p>
            <p className="mt-1 truncate text-xs text-gray-400">{user?.email}</p>
            <button
              onClick={logout}
              className="mt-4 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-white px-5 py-5 sm:px-8">
            <div>
              <p className="text-sm text-gray-500">
                Store Management / {activeMenu}
              </p>
              <h1 className="mt-1 text-2xl font-bold">{activeMenu}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">
                ADMIN
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 md:hidden"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <section className="rounded-2xl bg-gradient-to-r from-gray-950 to-gray-800 p-6 text-white sm:p-8">
              <p className="text-sm text-gray-300">
                Welcome back, {user?.name || "Administrator"}
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Manage your store
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
                Monitor your store, review customer activity and organize your
                products and orders from one place.
              </p>
            </section>

            {activeMenu === "Dashboard" && (
              <>
                <section className="mt-8">
                  <h2 className="text-lg font-bold">Store Overview</h2>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <article
                        key={stat.title}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{stat.title}</p>
                          <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                        <p className="mt-2 text-xs text-gray-400">
                          Connect backend to display live data
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-lg font-bold">Management</h2>

                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {[
                      {
                        title: "Products",
                        description: "Organize products, prices and stock.",
                      },
                      {
                        title: "Orders",
                        description:
                          "Review customer purchases and delivery status.",
                      },
                      {
                        title: "Customers",
                        description: "Review customer accounts and activity.",
                      },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => setActiveMenu(item.title)}
                        className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <h3 className="mt-4 font-bold">Manage {item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {item.description}
                        </p>
                        <span className="mt-5 inline-block text-sm font-semibold text-orange-600">
                          Open section →
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="mt-8 rounded-xl border bg-white p-6">
                  <h2 className="font-bold">Security & Permissions</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Verify that your account has administrator permissions on
                    the backend.
                  </p>
                  <button
                    onClick={verifyAdminAccess}
                    disabled={loading}
                    className="mt-4 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                  >
                    {loading ? "Checking..." : "Verify Admin Access"}
                  </button>

                  {message && (
                    <p
                      role="status"
                      className="mt-4 rounded-lg bg-gray-50 p-3 text-sm"
                    >
                      {message}
                    </p>
                  )}
                </section>
              </>
            )}

            {activeMenu !== "Dashboard" && (
              <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-bold">{activeMenu} Management</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  This section's interface is ready to be developed. Real{" "}
                  {activeMenu.toLowerCase()} data and management actions require
                  backend APIs.
                </p>
                <button
                  onClick={() => setActiveMenu("Dashboard")}
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Back to Dashboard
                </button>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
