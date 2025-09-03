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
        <div className="mx-auto hidden md:flex items-center justify-between rounded-full border border-white/60 bg-white/90 px-6 py-3 shadow-[0_0_20px_rgba(127,127,127,0.15)] max-w-[890px]">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/cmwlogo%20(1)%201.svg" alt="CMW Logo" className="h-8 w-8 rounded-md" />
            <span className="sr-only">Home</span>
          </Link>
          <nav className="flex items-center gap-8 text-sm text-gray-700">
            <NavLink to="/" className={({isActive})=>cn(isActive&&"font-medium text-gray-900","hover:text-gray-900")}>Home</NavLink>
            <NavLink to="/jobs" className={({isActive})=>cn(isActive&&"font-medium text-gray-900","hover:text-gray-900")}>Find Jobs</NavLink>
            <NavLink to="/talents" className={({isActive})=>cn(isActive&&"font-medium text-gray-900","hover:text-gray-900")}>Find Talents</NavLink>
            <NavLink to="/about" className={({isActive})=>cn(isActive&&"font-medium text-gray-900","hover:text-gray-900")}>About us</NavLink>
            <NavLink to="/testimonials" className={({isActive})=>cn(isActive&&"font-medium text-gray-900","hover:text-gray-900")}>Testimonials</NavLink>
          </nav>
          <Link to="/create-job" className="rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2 text-sm font-semibold shadow hover:opacity-95">
            Create Jobs
          </Link>
        </div>
        <div className="flex md:hidden items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/cmwlogo%20(1)%201.svg" alt="CMW Logo" className="h-8 w-8 rounded-md" />
            <span className="font-semibold text-lg">JobBoard</span>
          </Link>
          <Link to="/create-job" className="rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold">Create Jobs</Link>
        </div>
      </div>
    </header>
  );
}
