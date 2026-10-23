import { Link } from 'react-router-dom'
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi'

function Hero() {
  return (
    <section className="page-fade mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 sm:pt-12 lg:px-14 lg:pb-16 lg:pt-14">
      <div className="relative min-h-[570px] overflow-hidden bg-[#e8e8df] sm:min-h-[620px] lg:min-h-[660px]">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=90"
          alt="Warm, thoughtfully styled modern boutique"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172018]/70 via-[#172018]/30 to-transparent" />
        <div className="relative flex min-h-[570px] max-w-[650px] flex-col items-start justify-center px-7 py-14 text-white sm:min-h-[620px] sm:px-14 lg:min-h-[660px] lg:px-[76px]">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80 sm:text-[11px]">
            Considered goods for everyday
          </p>
          <h1 className="font-display max-w-[580px] text-[52px] font-medium leading-[1.04] tracking-[-0.04em] sm:text-[68px] lg:text-[78px]">
            Find joy in the <em>everyday.</em>
          </h1>
          <p className="mt-6 max-w-[370px] text-[14px] leading-7 text-white/85 sm:text-[15px]">
            Thoughtful pieces, timeless by nature. Made to be used, loved, and
            lived in.
          </p>
          <Link
            to="/shop"
            className="mt-9 inline-flex min-h-12 items-center gap-7 bg-[#faf9f6] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#24251f] transition-colors hover:bg-[#d9ddcf]"
          >
            Shop the collection
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#discover"
            aria-label="Scroll to discover more"
            className="absolute bottom-8 left-7 flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/80 sm:left-14 lg:left-[76px]"
          >
            <FiArrowDown className="h-4 w-4" aria-hidden="true" />
            Scroll to discover
          </a>
        </div>
        <p className="absolute bottom-8 right-7 hidden text-[9px] uppercase tracking-[0.18em] text-white/80 sm:block">
          Objects for a slower kind of living
        </p>
      </div>
    </section>
  )
}

export default Hero
