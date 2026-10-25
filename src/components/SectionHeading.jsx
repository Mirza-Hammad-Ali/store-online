function SectionHeading({ eyebrow, title, description, align = "center" }) {
  return (
    <div
      className={`${
        align === "left" ? "text-left" : "text-center"
      } mb-8 sm:mb-10`}
    >
      {eyebrow && (
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f846f]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-[34px] font-medium leading-tight tracking-[-0.035em] sm:text-[44px]">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-3 max-w-[480px] text-[13px] leading-6 text-[#77776e] sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
