import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiShoppingBag, FiX } from "react-icons/fi";

const links = [
  { label: "Shop", to: "/shop" },
  { label: "Our story", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Navbar({ bagCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `text-[12px] font-medium tracking-[0.04em] transition-colors hover:text-[#69745f] ${
      isActive ? "text-[#69745f]" : "text-[#66665e]"
    }`;

  return (
    <>
      {/* Announcement bar */}
      <div className="flex h-9 items-center justify-center bg-[#4b5947] px-4 text-center text-[10px] font-medium tracking-[0.14em] text-white sm:text-[11px]">
        A little something for you — complimentary shipping over $100
        <FiArrowUpRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
      </div>

      {/* Main Navbar */}
      <header className="relative z-20 border-b border-[#e8e6df] bg-[#faf9f6]">
        <nav
          className="relative mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14"
          aria-label="Main navigation"
        >
          {/* Left: Logo */}
          <Link
            className="font-display relative z-10 text-[29px] font-semibold tracking-[-0.06em]"
            to="/"
            onClick={closeMenu}
            aria-label="Forma home"
          >
            forma<span className="text-[#a1a38f]">.</span>
          </Link>

          {/* Center: Navigation links */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Login, Signup and Shopping Bag */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="hidden h-10 items-center justify-center px-2 text-[12px] font-medium tracking-[0.04em] text-[#44453e] transition-colors hover:text-[#69745f] sm:flex"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="flex h-9 items-center justify-center rounded-sm bg-[#4b5947] px-3 text-[11px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#394536] sm:h-10 sm:px-5 sm:text-[12px]"
            >
              Sign Up
            </Link>

            <Link
              to="/shop"
              className="flex h-10 items-center gap-2 text-[12px] font-medium tracking-[0.04em] transition-colors hover:text-[#69745f]"
              aria-label={`Visit the shop, bag has ${bagCount} items`}
            >
              <span className="hidden lg:inline">Explore</span>

              <span className="relative">
                <FiShoppingBag
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />

                {bagCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#4b5947] px-1 text-[9px] text-white">
                    {bagCount}
                  </span>
                )}
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="grid h-10 w-8 place-items-center text-xl md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-[#e8e6df] bg-[#faf9f6] px-6 py-4 shadow-lg md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="block border-b border-[#e8e6df] py-4 text-sm last:border-0"
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/login"
              onClick={closeMenu}
              className="block border-b border-[#e8e6df] py-4 text-sm"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="mt-4 block rounded-sm bg-[#4b5947] py-3 text-center text-sm font-medium text-white"
            >
              Sign Up
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
