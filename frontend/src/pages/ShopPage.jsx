import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";

const filters = ["All pieces", "Wearables", "Accessories", "Living"];

function ShopPage({ onAddToBag }) {
  const [searchParams] = useSearchParams();
  const startingCategory = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState(
    filters.includes(startingCategory) ? startingCategory : "All pieces",
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from MongoDB through backend API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        setProducts(data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    return activeFilter === "All pieces"
      ? products
      : products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  return (
    <section className="page-fade mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-14 lg:pb-28">
      <div className="border-b border-[#e7e5de] pb-9 sm:pb-12">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
          Good things, gathered
        </p>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-[48px] leading-tight tracking-[-0.04em] sm:text-[62px]">
              The collection
            </h1>

            <p className="mt-3 max-w-[460px] text-[13px] leading-6 text-[#77776e]">
              Useful, beautiful things for home, out and about, and everywhere
              in between.
            </p>
          </div>

          <p className="text-[11px] text-[#77776e]">
            {loading
              ? "Loading pieces..."
              : `${filteredProducts.length} thoughtful pieces`}
          </p>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-2 py-7 sm:py-9"
        aria-label="Filter products"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={`rounded-full border px-4 py-2 text-[10px] font-medium transition-colors ${
              activeFilter === filter
                ? "border-[#4b5947] bg-[#4b5947] text-white"
                : "border-[#deddd5] text-[#64645b] hover:border-[#4b5947]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center text-sm text-[#77776e]">
          Loading products...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-20 text-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 border border-[#4b5947] px-5 py-2 text-xs hover:bg-[#4b5947] hover:text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products */}
      {!loading && !error && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} onAddToCart={onAddToBag} />
      )}

      {/* Empty products */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="text-xl font-medium">No products found</h2>
          <p className="mt-2 text-sm text-[#77776e]">
            Products will appear here when they are added to the store.
          </p>
        </div>
      )}
    </section>
  );
}

export default ShopPage;
