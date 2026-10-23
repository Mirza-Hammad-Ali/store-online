import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'

function Footer() {
  return (
    <footer className="bg-[#30392e] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-display text-[32px] font-semibold tracking-[-0.06em]">
              forma<span className="text-[#b8c0a7]">.</span>
            </Link>
            <p className="mt-3 max-w-[300px] text-[12px] leading-6 text-white/65">
              Thoughtful things for everyday. Made with care, chosen to last.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Explore
            </p>
            <div className="flex flex-col items-start gap-3 text-[12px] text-white/80">
              <Link to="/shop" className="hover:text-white">Shop all</Link>
              <Link to="/about" className="hover:text-white">Our story</Link>
              <Link to="/contact" className="hover:text-white">Get in touch</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Stay in the loop
            </p>
            <p className="max-w-[250px] text-[12px] leading-6 text-white/70">
              Notes on good design, new arrivals, and the slower things.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 border-b border-white/40 pb-2 text-[10px] uppercase tracking-[0.12em] hover:border-white"
            >
              Say hello <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/15 pt-5 text-[10px] text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Forma Goods. Made for everyday.</p>
          <p>Thoughtfully chosen. Always.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
