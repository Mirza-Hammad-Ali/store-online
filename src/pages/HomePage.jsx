import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import CategorySection from '../components/CategorySection.jsx'
import Hero from '../components/Hero.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import StoryBanner from '../components/StoryBanner.jsx'
import { products } from '../data/products.js'

function HomePage({ onAddToBag }) {
  return (
    <div className="page-fade">
      <Hero />
      <CategorySection />
      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-14 lg:pb-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="The good stuff"
            title="A few current favourites."
            align="left"
          />
          <Link
            to="/shop"
            className="mb-9 inline-flex items-center gap-2 self-start text-[10px] font-semibold uppercase tracking-[0.12em] sm:self-auto"
          >
            See everything <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} onAddToCart={onAddToBag} />
      </section>
      <StoryBanner />
      <section className="mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <p className="font-display text-[25px] italic leading-relaxed text-[#626457] sm:text-[34px]">
          “Buy less, choose well, make it last.”
        </p>
        <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#89897f]">
          A little reminder from us
        </p>
      </section>
    </div>
  )
}

export default HomePage
