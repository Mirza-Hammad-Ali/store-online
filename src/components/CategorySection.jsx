import { Link } from "react-router-dom";
import { categories } from "../data/products.js";
import SectionHeading from "./SectionHeading.jsx";

function CategorySection() {
  return (
    <section
      id="discover"
      className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24"
    >
      <SectionHeading
        eyebrow="A little of what you love"
        title="Make room for good things."
        description="The essentials you reach for, and the little discoveries that make the day."
      />
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {categories.map((category, index) => (
          <Link
            to={category.href}
            key={category.name}
            className={`group relative block overflow-hidden bg-[#e7e5de] ${
              index === 1 ? "sm:mt-8" : ""
            }`}
          >
            <div className="aspect-[4/5] overflow-hidden sm:aspect-[4/5.6]">
              <img
                src={category.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-6 sm:left-6">
              <div>
                <p className="font-display text-[25px] sm:text-[29px]">
                  {category.name}
                </p>
                <p className="mt-1 text-[11px] text-white/80">
                  {category.detail}
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/60 transition-colors group-hover:bg-white group-hover:text-[#24251f]">
                ↗
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
