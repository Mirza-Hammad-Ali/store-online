import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

function StoryBanner() {
  return (
    <section className="bg-[#e9e9e1]">
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
        <div className="flex flex-col items-start justify-center px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
            A more thoughtful way
          </p>
          <h2 className="font-display max-w-[460px] text-[38px] leading-[1.12] tracking-[-0.035em] sm:text-[48px]">
            Less, but better. Always.
          </h2>
          <p className="mt-5 max-w-[410px] text-[13px] leading-7 text-[#68695f]">
            We believe the things we keep should earn their place. So we work
            with good people to make useful, beautiful pieces that stay with
            you.
          </p>
          <Link
            to="/about"
            className="mt-7 inline-flex items-center gap-3 border-b border-[#9a9b8c] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-[#69745f]"
          >
            Get to know us <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="min-h-[320px] overflow-hidden sm:min-h-[440px]">
          <img
            className="h-full min-h-[320px] w-full object-cover sm:min-h-[440px]"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
            alt="Calm, sunlit home interior with natural materials"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default StoryBanner;
