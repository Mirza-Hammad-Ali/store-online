import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import { products } from "../data/products.js";
const filters = ["All pieces", "Wearables", "Accessories", "Living"];
function ShopPage({ onAddToBag }) {
  const [searchParams] = useSearchParams();
  const startingCategory = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState(
    filters.includes(startingCategory) ? startingCategory : "All pieces",
  );
  const filteredProducts = useMemo(
    () =>
      activeFilter === "All pieces"
        ? products
        : products.filter((product) => product.category === activeFilter),
    [activeFilter],
  );

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
            {filteredProducts.length} thoughtful pieces
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
      <ProductGrid products={filteredProducts} onAddToCart={onAddToBag} />
    </section>
  );
}

export default ShopPage;
