// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// export default function UserDashboard() {
//   const { user, logout } = useAuth();
//   return (
//     <section className="mx-auto max-w-5xl px-6 py-12">
//       <p className="text-sm text-gray-500">My Account</p>
//       <h1 className="mt-2 text-3xl font-semibold">Welcome, {user.name}!</h1>
//       <p className="mt-3 text-gray-600">{user.email}</p>
//       <div className="mt-8 grid gap-4 sm:grid-cols-2">
//         <Link to="/shop" className="rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-semibold">Continue shopping</h2>
//           <p className="mt-2 text-gray-600">Browse our products.</p>
//         </Link>
//         <div className="rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-semibold">My orders</h2>
//           <p className="mt-2 text-gray-600">
//             Your order history will appear here once orders are connected.
//           </p>
//         </div>
//       </div>
//       <button onClick={logout} className="mt-8 rounded-lg border px-5 py-3">
//         Logout
//       </button>
//     </section>
//   );
// }



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  // Get logged-in user and logout function
  const { user, logout } = useAuth();

  // Store orders fetched from MongoDB
  const [orders, setOrders] = useState([]);

  // Track loading state
  const [loading, setLoading] = useState(true);

  // Store API errors
  const [error, setError] = useState("");

  // Fetch customer orders when dashboard opens
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // Get JWT token from localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Please log in to view your orders.");
        }

        // Send request to backend API
        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Convert API response into JavaScript object
        const data = await response.json();

        // Check if request was successful
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders.");
        }

        // Save orders in React state
        setOrders(data.orders || []);

      } catch (err) {
        setError(err.message);
      } finally {
        // Stop loading whether request succeeds or fails
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format order date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format currency
  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };

  // Display order status with suitable styling
  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">

      {/* Account heading */}
      <p className="text-sm text-gray-500">My Account</p>

      <h1 className="mt-2 text-3xl font-semibold">
        Welcome, {user?.name || "Customer"}!
      </h1>

      <p className="mt-3 text-gray-600">{user?.email}</p>

      {/* Dashboard cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        {/* Continue shopping */}
        <Link
          to="/shop"
          className="rounded-xl border bg-white p-6"
        >
          <h2 className="text-xl font-semibold">
            Continue shopping
          </h2>

          <p className="mt-2 text-gray-600">
            Browse our products.
          </p>
        </Link>

        {/* My Orders summary */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">My Orders</h2>

          <p className="mt-2 text-gray-600">
            {loading
              ? "Loading your orders..."
              : `${orders.length} orders found`}
          </p>
        </div>
      </div>

      {/* Orders section */}
      <div className="mt-10">

        <h2 className="mb-5 text-2xl font-semibold">
          Order History
        </h2>

        {/* Loading state */}
        {loading && (
          <div className="rounded-xl border bg-white p-8 text-center">
            <p className="text-gray-600">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty orders state */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl border bg-white p-8 text-center">
            <h3 className="text-lg font-semibold">
              No orders yet
            </h3>

            <p className="mt-2 text-gray-600">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/shop"
              className="mt-5 inline-block rounded-lg bg-[#4b5947] px-6 py-3 text-white"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Display customer orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border bg-white p-6"
              >

                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-semibold">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Ordered products */}
                <div className="mt-5 space-y-4">

                  {order.items.map((item, index) => {

                    const productImage =
                      item.image ||
                      item.product?.images?.[0];

                    return (
                      <div
                        key={item.product?._id || index}
                        className="flex items-center gap-4"
                      >

                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.name}
                            className="h-20 w-20 rounded-lg border object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                            No image
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-medium">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-1 font-medium">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* Order payment details */}
                <div className="mt-5 border-t pt-4">

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>

                  <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Payment: Cash on Delivery
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-8 rounded-lg border px-5 py-3"
      >
        Logout
      </button>

    </section>
  );
}
