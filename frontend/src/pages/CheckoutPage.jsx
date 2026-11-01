
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";

export default function CheckoutPage({ cart }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Checkout form ready! Next step: connect orders with MongoDB.");
  };

  if (!cart.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-serif mb-4">Your bag is empty</h1>
        <Link to="/shop" className="bg-[#4b5947] text-white px-7 py-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-[#faf9f6] min-h-screen py-14 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-[#4b5947] mb-10"
        >
          <FiArrowLeft /> Back to Bag
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif text-[#24251f] mb-3">
          Checkout
        </h1>

        <p className="text-gray-500 mb-10">
          Complete your details to continue with your order.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-7">
            <div>
              <h2 className="text-xl font-serif mb-5">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full border border-gray-300 bg-transparent px-4 py-4 outline-none focus:border-[#4b5947]"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full border border-gray-300 bg-transparent px-4 py-4 outline-none focus:border-[#4b5947]"
                />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full border border-gray-300 bg-transparent px-4 py-4 outline-none focus:border-[#4b5947] md:col-span-2"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-serif mb-5">Shipping Address</h2>

              <div className="space-y-4">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  required
                  className="w-full border border-gray-300 bg-transparent px-4 py-4 outline-none focus:border-[#4b5947]"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full border border-gray-300 bg-transparent px-4 py-4 outline-none focus:border-[#4b5947]"
                  />

                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    required
                    className="w-full border border-gray-300 bg-transparent px-4 py-4 outline-none focus:border-[#4b5947]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4b5947] text-white py-4 hover:bg-[#394536] transition"
            >
              Continue to Place Order
            </button>

            <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <FiLock /> Your information is handled securely.
            </p>
          </form>

          <aside className="bg-white border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-serif mb-6">Order Summary</h2>

            <div className="space-y-5 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm mt-2">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between border-t pt-4 font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
