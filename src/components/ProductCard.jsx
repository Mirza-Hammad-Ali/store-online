import { FiArrowUpRight } from "react-icons/fi";

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/4.7] overflow-hidden bg-[#efeee9]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 bg-[#faf9f6] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]">
            {product.tag}
          </span>
        )}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="absolute bottom-3 left-3 right-3 flex translate-y-0 items-center justify-between bg-[#faf9f6] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] opacity-100 transition-all duration-300 hover:bg-[#4b5947] hover:text-white focus:translate-y-0 focus:opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          aria-label={`Add ${product.name} to bag`}
        >
          Add to bag <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 pt-4">
        <div>
          <p className="text-[13px] font-medium">{product.name}</p>
          <p className="mt-1 text-[11px] text-[#88877e]">{product.category}</p>
        </div>
        <p className="pt-0.5 text-[12px] font-medium">${product.price}</p>
      </div>
    </article>
  );
}

export default ProductCard;
