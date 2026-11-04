import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/products";

const menuItems = [
  { title: "Dashboard", icon: "📊" },
  { title: "Products", icon: "📦" },
  { title: "Orders", icon: "🛒" },
  { title: "Customers", icon: "👥" },
  { title: "Settings", icon: "⚙️" },
];

const initialForm = {
  name: "",
  category: "Wearables",
  price: "",
  image: "",
  tag: "",
  description: "",
  stock: "0",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Product states
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productError, setProductError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Load products from MongoDB
  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load products.");
      }

      setProducts(data.products || []);
    } catch (error) {
      setProductError(error.message || "Something went wrong.");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeMenu === "Products") {
      loadProducts();
    }
  }, [activeMenu, loadProducts]);

  // Verify admin access
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

  // Form input changes
  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Open add product form
  function openAddForm() {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
    setProductError("");
  }

  // Open edit product form
  function openEditForm(product) {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "Wearables",
      price: String(product.price ?? ""),
      image: product.images?.[0] || product.image || "",
      tag: product.tag || "",
      description: product.description || "",
      stock: String(product.stock ?? 0),
    });

    setShowForm(true);
    setProductError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Add or update product
  async function handleProductSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      setProductError("Your login session is missing. Please log in again.");
      return;
    }

    const productData = {
      ...form,
      images: form.image.trim() ? [form.image.trim()] : [],
      price: Number(form.price),
      stock: Number(form.stock),
      status: "active",
    };

    delete productData.image;

    if (
      !productData.name.trim() ||
      !productData.images?.[0]?.trim() ||
      !productData.description.trim() ||
      !Number.isFinite(productData.price) ||
      productData.price < 0 ||
      !Number.isInteger(productData.stock) ||
      productData.stock < 0
    ) {
      setProductError(
        "Please enter valid product information, including image and description.",
      );
      return;
    }

    try {
      setSavingProduct(true);
      setProductError("");

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save product.");
      }

      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!",
      );

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await loadProducts();
    } catch (error) {
      setProductError(error.message || "Something went wrong.");
    } finally {
      setSavingProduct(false);
    }
  }

  // Delete product
  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setProductError("Please log in again.");
      return;
    }

    try {
      setProductError("");

      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete product.");
      }

      setMessage("Product deleted successfully!");
      await loadProducts();
    } catch (error) {
      setProductError(error.message || "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
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
                onClick={() => {
                  setActiveMenu(item.title);
                  setMessage("");
                  setProductError("");
                  setShowForm(false);
                }}
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

        {/* Main */}
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

            {/* Mobile menu */}
            <div className="flex w-full gap-2 overflow-x-auto md:hidden">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    setActiveMenu(item.title);
                    setShowForm(false);
                    setMessage("");
                  }}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                    activeMenu === item.title
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.icon} {item.title}
                </button>
              ))}
            </div>
          </header>

          <div className="p-5 sm:p-8">
            {/* Welcome section */}
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

            {/* Dashboard */}
            {activeMenu === "Dashboard" && (
              <>
                <section className="mt-8">
                  <h2 className="text-lg font-bold">Store Overview</h2>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        title: "Total Products",
                        value: "—",
                        icon: "📦",
                      },
                      {
                        title: "Total Orders",
                        value: "—",
                        icon: "🛒",
                      },
                      {
                        title: "Total Customers",
                        value: "—",
                        icon: "👥",
                      },
                      {
                        title: "Total Revenue",
                        value: "—",
                        icon: "💰",
                      },
                    ].map((stat) => (
                      <article
                        key={stat.title}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{stat.title}</p>
                          <span className="text-2xl">{stat.icon}</span>
                        </div>

                        <p className="mt-4 text-3xl font-bold">
                          {stat.title === "Total Products"
                            ? products.length || "—"
                            : stat.value}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Live statistics will be connected next
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
                        icon: "📦",
                        description: "Organize products, prices and stock.",
                      },
                      {
                        title: "Orders",
                        icon: "🛒",
                        description:
                          "Review customer purchases and delivery status.",
                      },
                      {
                        title: "Customers",
                        icon: "👥",
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

            {/* Products */}
            {activeMenu === "Products" && (
              <section className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Products Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Add, edit and manage your store products.
                    </p>
                  </div>

                  <button
                    onClick={openAddForm}
                    className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    + Add New Product
                  </button>
                </div>

                {message && (
                  <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {message}
                  </p>
                )}

                {productError && (
                  <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {productError}
                  </p>
                )}

                {/* Add/Edit form */}
                {showForm && (
                  <form
                    onSubmit={handleProductSubmit}
                    className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
                  >
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold">
                        {editingId ? "Edit Product" : "Add New Product"}
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setForm(initialForm);
                          setProductError("");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Product Name *
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleFormChange}
                          placeholder="e.g. Everyday Chrono"
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
                        >
                          <option value="Wearables">Wearables</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Living">Living</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Price ($) *
                        </label>
                        <input
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={handleFormChange}
                          placeholder="128"
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Stock Quantity *
                        </label>
                        <input
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={form.stock}
                          onChange={handleFormChange}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Product Image URL *
                        </label>
                        <input
                          name="image"
                          type="url"
                          value={form.image}
                          onChange={handleFormChange}
                          placeholder="https://example.com/image.jpg"
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Product Tag
                        </label>
                        <input
                          name="tag"
                          value={form.tag}
                          onChange={handleFormChange}
                          placeholder="Bestseller / New"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleFormChange}
                          rows="3"
                          required
                          placeholder="Write a short product description..."
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {form.image && (
                      <div className="mt-5">
                        <p className="mb-2 text-sm font-medium">
                          Image Preview
                        </p>
                        <img
                          src={form.image}
                          alt="Product preview"
                          className="h-32 w-32 rounded-lg border object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                      >
                        {savingProduct
                          ? "Saving..."
                          : editingId
                            ? "Update Product"
                            : "Save Product"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setForm(initialForm);
                        }}
                        className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                {/* Products list */}
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
                    <h3 className="font-bold">All Products</h3>
                    <button
                      onClick={loadProducts}
                      disabled={productsLoading}
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      ↻ Refresh
                    </button>
                  </div>
                  {productsLoading ? (
                    <p className="p-10 text-center text-sm text-gray-500">
                      Loading products...
                    </p>
                  ) : products.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-4xl">📦</p>
                      <h3 className="mt-3 font-bold">No products yet</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Click Add New Product to add your first product.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                          <tr>
                            <th className="px-5 py-4">Product</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Price</th>
                            <th className="px-5 py-4">Stock</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Actions</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      product.images?.[0] ||
                                      product.image ||
                                      undefined
                                    }
                                    alt={product.name}
                                    className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                                  />
                                  <div>
                                    <p className="font-semibold">
                                      {product.name}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                      {product.tag || "No tag"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-gray-600">
                                {product.category}
                              </td>

                              <td className="px-5 py-4 font-semibold">
                                ${product.price}
                              </td>

                              <td className="px-5 py-4">
                                {product.stock ?? 0}
                              </td>

                              <td className="px-5 py-4">
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                  {product.status || "active"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => openEditForm(product)}
                                    className="font-semibold text-blue-600 hover:text-blue-800"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                    className="font-semibold text-red-600 hover:text-red-800"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Other sections */}
            {["Orders", "Customers", "Settings"].includes(activeMenu) && (
              <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-bold">{activeMenu} Management</h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  This section is ready for its next development stage. We will
                  connect its real database functionality next.
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
