import { useEffect, useState, createContext, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Grid2X2,
  Clock,
  ChartNoAxesCombined,
  Users,
  Bell,
  MessageSquare,
  HeartHandshake,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  Bookmark,
} from "lucide-react";
import { demoStore, subscribeDemo } from "../services/demoStore";
import { useAuth } from "../context/DemoAuth";
import { Brand } from "./Public";
import { Button, Loading, Empty, Confirm } from "../components/ui";
const Context = createContext();
export const usePortal = () => useContext(Context);
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  async function load() {
    try {
      setData(await demoStore("/portal"));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
    return subscribeDemo(load);
  }, []);
  async function act(path, body, method = "POST") {
    setBusy(true);
    try {
      const result = await demoStore(path, { method, body });
      await load();
      toast.success("Saved successfully.");
      return result;
    } catch (e) {
      toast.error(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  function confirm(action, title, description) {
    setConfirmation({ action, title, description });
  }
  const base = `/dashboard/${user.role}`;
  const admin = user.role === "admin";
  const exhibitor = user.role === "exhibitor";
  const links = [
    ["", "Overview", LayoutDashboard],
    ["events", admin ? "Events & expos" : "Discover events", CalendarDays],
    ...(admin ? [["applications", "Exhibitor applications", Building2]] : []),
    ...(exhibitor
      ? [
          ["company", "Company profile", Building2],
          ["applications", "My applications", Building2],
        ]
      : []),
    ["booths", admin ? "Booths & reservations" : "Expo floor plans", Grid2X2],
    ["sessions", "Sessions & speakers", Clock],
    ...(!admin && !exhibitor
      ? [
          ["registrations", "My registrations", CalendarDays],
          ["bookmarks", "Saved sessions", Bookmark],
          ["exhibitors", "Exhibitor directory", Building2],
        ]
      : []),
    ...(admin
      ? [
          ["analytics", "Analytics & reports", ChartNoAxesCombined],
          ["users", "People & accounts", Users],
        ]
      : []),
    ["messages", "Messages", MessageSquare],
    ["notifications", "Notifications", Bell],
    ["support", "Feedback & support", HeartHandshake],
    ["settings", "Account settings", Settings],
  ];
  return (
    <div className="min-h-screen bg-[#f7f3ef]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-rose/20 bg-ivory transition-transform lg:translate-x-0 ${open ? "translate-x-0 shadow-2xl" : "hidden -translate-x-full lg:block"}`}
      >
        <div className="flex h-24 items-center justify-between px-6">
          <Brand />
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <p className="px-6 pb-4 text-[9px] uppercase tracking-[.2em] text-muted">
          {admin
            ? "Organizer workspace"
            : exhibitor
              ? "Exhibitor studio"
              : "Your experience"}
        </p>
        <nav
          className="h-[calc(100vh-210px)] space-y-1 overflow-y-auto px-3"
          aria-label="Dashboard navigation"
        >
          {links.map(([path, label, Icon]) => (
            <NavLink
              end
              key={path}
              to={`${base}${path ? `/${path}` : ""}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-xs ${isActive ? "bg-blush font-semibold text-rose-dark" : "text-muted hover:bg-blush/60"}`
              }
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
              {path === "notifications" &&
                !!data?.notifications.filter((n) => !n.read).length && (
                  <span className="ml-auto rounded-full bg-rose px-1.5 text-[9px] text-white">
                    {data.notifications.filter((n) => !n.read).length}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>
        <button
          className="absolute bottom-7 left-6 flex items-center gap-3 text-xs text-muted"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>
      {open && (
        <button
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
        />
      )}
      <div className="lg:pl-64">
        <header className="flex h-20 items-center justify-between gap-4 border-b border-rose/15 bg-ivory px-5 md:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <span className="text-xs text-muted">
              A little more organized. A lot more possible.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden items-center gap-1 text-xs text-rose-dark sm:flex"
            >
              Visit website <ArrowUpRight size={13} />
            </Link>
            <Link to={`${base}/notifications`} aria-label="Notifications">
              <Bell size={18} />
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush font-display text-xl text-rose-dark">
              {user.name[0]}
            </span>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] p-5 md:p-9">
          {error ? (
            <Empty>
              {error}
              <Button onClick={load} className="ml-3">
                Retry
              </Button>
            </Empty>
          ) : !data ? (
            <Loading />
          ) : (
            <Context.Provider
              value={{ data, load, act, confirm, busy, user, base }}
            >
              <Outlet />
            </Context.Provider>
          )}
        </div>
      </div>
      <Confirm
        open={!!confirmation}
        onOpenChange={(v) => !v && setConfirmation(null)}
        title={confirmation?.title}
        description={confirmation?.description}
        onConfirm={() => {
          const action = confirmation?.action;
          setConfirmation(null);
          action?.();
        }}
      />
    </div>
  );
}
