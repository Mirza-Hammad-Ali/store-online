import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import SectionHeading from "../components/SectionHeading.jsx";
const values = [
  {
    number: "01",
    title: "Buy with intention",
    body: "We choose fewer things, and spend more time making sure each one deserves a place in your day.",
  },
  {
    number: "02",
    title: "Made to be kept",
    body: "Good materials, thoughtful details, and timeless shapes. We want you to reach for these years from now.",
  },
  {
    number: "03",
    title: "People matter",
    body: "We partner with makers who care about their craft, their communities, and the world we share.",
  },
];

function AboutPage() {
  return (
    <div className="page-fade">
      <section className="mx-auto max-w-[1440px] px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-14 lg:pt-24">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
          A little about us
        </p>
        <h1 className="font-display max-w-[900px] text-[47px] leading-[1.08] tracking-[-0.04em] sm:text-[68px] lg:text-[82px]">
          We think everyday things can make everyday life <em>better.</em>
        </h1>
      </section>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="h-[300px] overflow-hidden sm:h-[470px]">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90"
            alt="A bright, peaceful room filled with natural textures"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <section className="mx-auto grid max-w-[1100px] gap-6 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
          Why Forma exists
        </p>
        <div>
          <h2 className="font-display text-[32px] leading-tight tracking-[-0.03em] sm:text-[42px]">
            A more considered collection for the life you actually live.
          </h2>
          <p className="mt-5 text-[13px] leading-7 text-[#77776e] sm:text-sm">
            Forma started with a simple question: what if shopping felt a little
            less like searching, and a little more like finding? We bring
            together useful, beautifully made pieces from people who care about
            the details. No endless scroll. No things just for the sake of
            things. Just the good stuff, chosen with care.
          </p>
        </div>
      </section>
      <section className="bg-[#e9e9e1]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
          <SectionHeading
            eyebrow="What we believe"
            title="The things that matter to us."
          />
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {values.map((value) => (
              <article
                key={value.number}
                className="border-t border-[#c9c9be] pt-5"
              >
                <p className="text-[10px] text-[#818271]">{value.number}</p>
                <h3 className="font-display mt-5 text-[24px]">{value.title}</h3>
                <p className="mt-3 text-[12px] leading-6 text-[#6c6d63]">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
          <Link
            to="/shop"
            className="mx-auto mt-12 inline-flex items-center gap-3 bg-[#4b5947] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#394536]"
          >
            Browse the collection <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
