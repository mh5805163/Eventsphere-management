import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "../context/DemoAuth";
import PublicLayout from "../layouts/Public";
import DashboardLayout from "../layouts/Dashboard";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import EventDetails from "../pages/EventDetails";
import {
  EventList,
  About,
  Gallery,
  Contact,
  Privacy,
} from "../pages/PublicPages";
const dashboardPage = (name) =>
  lazy(() =>
    import("../pages/DashboardPages").then((module) => ({
      default: module[name],
    })),
  );
const [
  Overview,
  Events,
  Applications,
  Company,
  Booths,
  Schedule,
  Registrations,
  Bookmarks,
  Exhibitors,
  Analytics,
  People,
  Messages,
  Notifications,
  Support,
  Settings,
] = [
  "Overview",
  "Events",
  "Applications",
  "Company",
  "Booths",
  "Schedule",
  "Registrations",
  "Bookmarks",
  "Exhibitors",
  "Analytics",
  "People",
  "Messages",
  "Notifications",
  "Support",
  "Settings",
].map(dashboardPage);
import { Loading, Button } from "../components/ui";
function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role)
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  return children;
}
function DirectoryRedirect() {
  const { user } = useAuth();
  return (
    <Navigate
      to={user ? `/dashboard/${user.role}/exhibitors` : "/register"}
      replace
    />
  );
}
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollTop />
        <Toaster position="bottom-right" richColors />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="expos" element={<EventList type="expo" />} />
              <Route path="events" element={<EventList type="event" />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="exhibitors" element={<DirectoryRedirect />} />
              {[
                ["login", "login"],
                ["register", "register"],
                ["forgot-password", "forgot"],
                ["reset-password", "reset"],
              ].map(([path, mode]) => (
                <Route key={path} path={path} element={<Auth mode={mode} />} />
              ))}{" "}
              <Route
                path="*"
                element={
                  <div className="section text-center">
                    <h1 className="text-5xl">A little off the beaten path.</h1>
                    <p className="my-6 text-sm text-muted">
                      This page couldn’t be found.
                    </p>
                    <Button asChild>
                      <Link to="/">Back to the beginning</Link>
                    </Button>
                  </div>
                }
              />
            </Route>
            {["admin", "exhibitor", "attendee"].map((role) => (
              <Route
                key={role}
                path={`dashboard/${role}`}
                element={
                  <Protected role={role}>
                    <DashboardLayout />
                  </Protected>
                }
              >
                <Route index element={<Overview />} />
                <Route path="events" element={<Events />} />
                {role !== "attendee" && (
                  <Route path="applications" element={<Applications />} />
                )}
                <Route path="booths" element={<Booths />} />
                <Route path="sessions" element={<Schedule />} />
                <Route path="exhibitors" element={<Exhibitors />} />
                {role === "exhibitor" && (
                  <Route path="company" element={<Company />} />
                )}
                {role === "attendee" && (
                  <>
                    <Route path="registrations" element={<Registrations />} />
                    <Route path="bookmarks" element={<Bookmarks />} />
                  </>
                )}
                {role === "admin" && (
                  <>
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="users" element={<People />} />
                  </>
                )}
                <Route path="messages" element={<Messages />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="support" element={<Support />} />
                <Route path="settings" element={<Settings />} />
                <Route
                  path="*"
                  element={<Navigate to={`/dashboard/${role}`} replace />}
                />
              </Route>
            ))}
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
