import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  ArrowUpRight,
  Menu,
  X,
  Flower2,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui";
import { useAuth } from "../context/DemoAuth";
export function Brand({ light = false }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 ${light ? "text-ivory" : "text-ink"}`}
    >
      <Flower2 size={31} strokeWidth={1} />
      <span className="font-display text-2xl font-semibold tracking-tight">
        EventSphere
        <span className="block text-center font-sans text-[7px] font-normal uppercase tracking-[.36em]">
          Moments. People. Possibilities.
        </span>
      </span>
    </Link>
  );
}
export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <>
      <div className="bg-rose-dark px-4 py-2 text-center text-[9px] uppercase tracking-[.23em] text-white">
        Extraordinary gatherings. Beautifully brought together.
      </div>
      <header className="sticky top-0 z-40 border-b border-rose/15 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex h-23 max-w-7xl items-center justify-between px-6 md:px-12">
          <Brand />
          <nav
            className="hidden items-center gap-7 text-[11px] font-medium lg:flex"
            aria-label="Main navigation"
          >
            {[
              ["/", "Home"],
              ["/about", "Our story"],
              ["/expos", "Expos"],
              ["/events", "Events"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact"],
            ].map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-dark underline underline-offset-8"
                    : "hover:text-rose-dark"
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              className="hidden text-xs sm:block"
              to={user ? `/dashboard/${user.role}` : "/login"}
            >
              {user ? "My dashboard" : "Sign in"}
            </Link>
            <Button asChild className="hidden sm:inline-flex">
              <Link to={user ? "/expos" : "/register"}>
                {user ? "Explore expos" : "Join the experience"}
                <ArrowUpRight size={14} />
              </Link>
            </Button>
            <button
              className="p-2 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-4 border-t border-rose/20 px-6 py-5 lg:hidden">
            {[
              ["/", "Home"],
              ["/about", "Our story"],
              ["/expos", "Expos"],
              ["/events", "Events"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact"],
              [
                user ? `/dashboard/${user.role}` : "/login",
                user ? "Dashboard" : "Sign in",
              ],
            ].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-ink text-ivory">
        <div className="section grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Brand light />
            <p className="mt-5 max-w-xs text-xs leading-6 text-ivory/60">
              For the connections that matter.
              <br />
              For the moments that stay with you.
              <br />A thoughtful way to bring people together.
            </p>
            <div className="mt-5 flex gap-3">
              <Mail size={17} />
              <Flower2 size={17} />
              <Instagram size={17} />
            </div>
          </div>
          <div>
            <p className="eyebrow text-rose">Discover</p>
            <div className="mt-5 grid gap-3 text-xs text-ivory/70">
              {[
                ["/about", "Our story"],
                ["/expos", "Upcoming expos"],
                ["/events", "Featured events"],
                ["/gallery", "The gallery"],
              ].map(([p, l]) => (
                <Link key={p} to={p}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-rose">Your experience</p>
            <div className="mt-5 grid gap-3 text-xs text-ivory/70">
              <Link to="/register">Become an exhibitor</Link>
              <Link to="/register">Join as an attendee</Link>
              <Link to="/login">Your dashboard</Link>
              <Link to="/contact">Help & support</Link>
              <Link to="/privacy">Privacy & consent</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-rose">Let's connect</p>
            <div className="mt-5 grid gap-4 text-xs text-ivory/70">
              <span className="flex gap-3">
                <MapPin size={15} /> Karachi, Pakistan
              </span>
              <a href="mailto:hello@eventsphere.com" className="flex gap-3">
                <Mail size={15} /> hello@eventsphere.com
              </a>
              <a href="tel:+923001234567" className="flex gap-3">
                <Phone size={15} /> +92 300 1234567
              </a>
              <Link to="/contact" className="mt-2 text-rose">
                Plan something extraordinary ↗
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-ivory/10 px-6 py-6 text-[10px] text-ivory/40 md:px-12">
          <span>
            © {new Date().getFullYear()} EventSphere Management. All rights
            reserved.
          </span>
          <span>Thoughtfully planned. Beautifully experienced.</span>
        </div>
      </footer>
    </>
  );
}
