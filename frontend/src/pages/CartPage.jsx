import { Link } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CartPage({ cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <section className="page-fade mx-auto min-h-[65vh] max-w-[1200px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-14">
      <div className="border-b border-[#e7e5de] pb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
          Your selection
        </p>

        <h1 className="font-display text-[45px] leading-tight tracking-[-0.04em] sm:text-[58px]">
          Shop bag
        </h1>

        <p className="mt-3 text-sm text-[#77776e]">
          {cart.length} different {cart.length === 1 ? "item" : "items"} in your
          bag
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center">
          <div className="text-5xl">🛍️</div>

          <h2 className="mt-6 font-display text-3xl">Your bag is waiting</h2>

          <p className="mt-3 text-sm text-[#77776e]">
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 bg-[#4b5947] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#394536]"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 py-10 lg:grid-cols-[1fr_350px]">
          {/* Cart products */}
          <div>
            <div className="mb-5 hidden grid-cols-[1fr_120px_100px] border-b border-[#e7e5de] pb-4 text-[10px] font-semibold uppercase tracking-wider text-[#88877e] sm:grid">
              <span>Product</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
            </div>

            <div className="divide-y divide-[#e7e5de]">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 py-6 sm:grid-cols-[1fr_120px_100px] sm:items-center"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-24 shrink-0 bg-[#efeee9] object-cover sm:h-32 sm:w-28"
                    />

                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm font-semibold">{item.name}</h3>

                      <p className="mt-1 text-xs text-[#88877e]">
                        {item.category}
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="mt-3 flex w-fit items-center gap-1.5 text-[11px] text-[#88877e] transition hover:text-red-600"
                      >
                        <FiTrash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="grid h-8 w-8 place-items-center border border-[#deddd5] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={12} />
                    </button>

                    <span className="min-w-4 text-center text-sm">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center border border-[#deddd5]"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>

                  <p className="text-sm font-semibold sm:text-right">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </article>
              ))}
            </div>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#69745f] hover:text-[#394536]"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <aside className="h-fit border border-[#e7e5de] bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl">Order summary</h2>

            <div className="mt-7 space-y-4 border-b border-[#e7e5de] pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#77776e]">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#77776e]">Shipping</span>
                <span>
                  {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-5 text-base font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-[#4b5947] py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#394536]"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-[10px] leading-5 text-[#88877e]">
              Complimentary shipping on orders over $100.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
