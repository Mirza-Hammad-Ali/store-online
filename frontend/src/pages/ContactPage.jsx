import { useState } from 'react'
import { FiArrowUpRight, FiCheck } from 'react-icons/fi'
function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }
  return (
    <section className="page-fade mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-14 lg:py-24">
      <div>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
          We’re all ears
        </p>
        <h1 className="font-display text-[49px] leading-[1.05] tracking-[-0.04em] sm:text-[66px]">
          Let’s talk.
        </h1>
        <p className="mt-5 max-w-[370px] text-[13px] leading-7 text-[#77776e]">
          A question about an order, a product, or just want to say hello? We’d
          love to hear from you.
        </p>
        <div className="mt-10 border-t border-[#e7e5de] pt-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#818271]">
            Send us a note
          </p>
          <a
            href="mailto:hello@formagoods.example"
            className="mt-2 inline-flex items-center gap-2 text-[14px] hover:text-[#69745f]"
          >
            hello@formagoods.example
            <FiArrowUpRight aria-hidden="true" />
          </a>
          <p className="mt-5 text-[11px] text-[#88877e]">
            Monday–Friday, 9am–5pm
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border border-[#e7e5de] bg-white/60 p-5 sm:p-8 lg:p-10"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
            Your name
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Name"
              className="h-12 border border-[#e2e0d8] bg-transparent px-3 text-[12px] font-normal normal-case tracking-normal outline-none placeholder:text-[#aaa99f] focus:border-[#69745f]"
            />
          </label>
          <label className="flex flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
            Email address
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-12 border border-[#e2e0d8] bg-transparent px-3 text-[12px] font-normal normal-case tracking-normal outline-none placeholder:text-[#aaa99f] focus:border-[#69745f]"
            />
          </label>
        </div>
        <label className="mt-5 flex flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
          What’s on your mind?
          <textarea
            name="message"
            required
            rows="5"
            placeholder="Tell us a little more..."
            className="resize-y border border-[#e2e0d8] bg-transparent p-3 text-[12px] font-normal normal-case tracking-normal outline-none placeholder:text-[#aaa99f] focus:border-[#69745f]"
          />
        </label>
        <button
          type="submit"
          className="mt-6 inline-flex min-h-12 items-center gap-5 bg-[#4b5947] px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#394536]"
        >
          Send your note <FiArrowUpRight aria-hidden="true" />
        </button>
        {submitted && (
          <p className="mt-4 flex items-center gap-2 text-[12px] text-[#4b5947]" role="status">
            <FiCheck aria-hidden="true" /> Thanks for trying the demo. Connect a form service to receive messages.
          </p>
        )}
      </form>
    </section>
  )
}

export default ContactPage
