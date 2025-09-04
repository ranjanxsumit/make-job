import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Find Jobs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <div className="container mx-auto py-4">
        <div className="mx-auto hidden md:flex items-center justify-between rounded-[122px] border border-[#FCFCFC] bg-[#FFFFFF] px-[26px] py-[16px] shadow-[0_0_20px_0_rgba(127,127,127,0.15)] w-[890px] h-[80px] flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/cmwlogo%20(1)%201.svg" alt="CMW Logo" className="w-[44px] h-[44.677px] flex-shrink-0 rounded-md" />
            <span className="sr-only">Home</span>
          </Link>

          <nav className="flex items-center gap-[24px] text-[16px] text-[var(--Dark-Black,#303030)] mx-auto" style={{ fontFamily: '"Satoshi Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', fontStyle: 'normal', lineHeight: 'normal' }}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center px-[24px] py-[8px] text-[16px] font-semibold transition duration-200 ease-out rounded-[8px] focus:outline-none",
                  isActive
                    ? "text-[var(--Dark-Black,#303030)] border-[#A128FF] shadow-[0_8px_28px_rgba(161,40,255,0.16)]"
                    : "text-[var(--Dark-Black,#303030)] hover:text-gray-900 hover:border-[#A128FF] hover:shadow-[0_8px_28px_rgba(161,40,255,0.12)] hover:scale-105 focus-visible:border-[#A128FF] focus-visible:shadow-[0_8px_28px_rgba(161,40,255,0.12)]"
                )
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center justify-center px-[5px] py-[5px] text-[16px] font-semibold transition duration-200 ease-out rounded-[8px] focus:outline-none",
                  isActive
                    ? "text-[var(--Dark-Black,#303030)] border-[#A128FF] shadow-[0_8px_28px_rgba(161,40,255,0.16)]"
                    : "text-[var(--Dark-Black,#303030)] hover:text-gray-900 hover:border-[#A128FF] hover:shadow-[0_8px_28px_rgba(161,40,255,0.12)] hover:scale-105 focus-visible:border-[#A128FF] focus-visible:shadow-[0_8px_28px_rgba(161,40,255,0.12)]"
                )
              }
            >
              Find Jobs
            </NavLink>

            <NavLink
              to="/talents"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center justify-center px-[5px] py-[5px] text-[16px] font-semibold transition duration-200 ease-out rounded-[8px] focus:outline-none",
                  isActive
                    ? "text-[var(--Dark-Black,#303030)] border-[#A128FF] shadow-[0_8px_28px_rgba(161,40,255,0.16)]"
                    : "text-[var(--Dark-Black,#303030)] hover:text-gray-900 hover:border-[#A128FF] hover:shadow-[0_8px_28px_rgba(161,40,255,0.12)] hover:scale-105 focus-visible:border-[#A128FF] focus-visible:shadow-[0_8px_28px_rgba(161,40,255,0.12)]"
                )
              }
            >
              Find Talents
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center justify-center px-[5px] py-[5px] text-[16px] font-semibold transition duration-200 ease-out rounded-[8px] focus:outline-none",
                  isActive
                    ? "text-[var(--Dark-Black,#303030)] border-[#A128FF] shadow-[0_8px_28px_rgba(161,40,255,0.16)]"
                    : "text-[var(--Dark-Black,#303030)] hover:text-gray-900 hover:border-[#A128FF] hover:shadow-[0_8px_28px_rgba(161,40,255,0.12)] hover:scale-105 focus-visible:border-[#A128FF] focus-visible:shadow-[0_8px_28px_rgba(161,40,255,0.12)]"
                )
              }
            >
              About us
            </NavLink>

            <NavLink
              to="/testimonials"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center justify-center px-[5px] py-[5px] text-[16px] font-semibold transition duration-200 ease-out rounded-[8px] focus:outline-none",
                  isActive
                    ? "text-[var(--Dark-Black,#303030)] border-[#A128FF] shadow-[0_8px_28px_rgba(161,40,255,0.16)]"
                    : "text-[var(--Dark-Black,#303030)] hover:text-gray-900 hover:border-[#A128FF] hover:shadow-[0_8px_28px_rgba(161,40,255,0.12)] hover:scale-105 focus-visible:border-[#A128FF] focus-visible:shadow-[0_8px_28px_rgba(161,40,255,0.12)]"
                )
              }
            >
              Testimonials
            </NavLink>
          </nav>

          <Link
            to="/create-job"
            className="flex w-auto min-w-[150px] items-center justify-center px-[28px] py-[8px] gap-[10px] text-white text-[16px] font-semibold shadow flex-shrink-0 whitespace-nowrap transition duration-200 ease-out transform hover:scale-105 hover:shadow-[0_12px_34px_rgba(161,40,255,0.18)] focus-visible:scale-105 focus-visible:shadow-[0_12px_34px_rgba(161,40,255,0.18)]"
            style={{
              borderRadius: "30px",
              background: "var(--Button, linear-gradient(180deg, #A128FF 0%, #6100AD 113.79%))",
              fontFamily: '"Satoshi Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              textAlign: "center",
            }}
          >
            Create Jobs
          </Link>
        </div>

        <div className="flex md:hidden items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/cmwlogo%20(1)%201.svg" alt="CMW Logo" className="w-[44px] h-[44.677px] flex-shrink-0 rounded-md" />
            <span className="font-semibold text-lg">JobBoard</span>
          </Link>

          <Link
            to="/create-job"
            className="flex w-auto min-w-[150px] items-center justify-center px-[28px] py-[8px] gap-[10px] text-white text-[16px] font-semibold whitespace-nowrap transition duration-200 ease-out transform hover:scale-105 hover:shadow-[0_12px_34px_rgba(161,40,255,0.18)] focus-visible:scale-105 focus-visible:shadow-[0_12px_34px_rgba(161,40,255,0.18)]"
            style={{
              borderRadius: "30px",
              background: "var(--Button, linear-gradient(180deg, #A128FF 0%, #6100AD 113.79%))",
              fontFamily: '"Satoshi Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              textAlign: "center",
            }}
          >
            Create Jobs
          </Link>
        </div>
      </div>
    </header>
  );
}
