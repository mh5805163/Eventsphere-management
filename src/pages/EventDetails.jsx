import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  Bookmark,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { demoStore, subscribeDemo } from "../services/demoStore";
import { useAuth } from "../context/DemoAuth";
import { Badge, Button, Card, Empty, Loading, Modal } from "../components/ui";
import { dateText } from "../components/EventCard";
export function FloorPlan({
  booths,
  user,
  act,
  users = [],
  applications = [],
}) {
  const [selected, setSelected] = useState(null);
  const [recipient, setRecipient] = useState("");
  const current = booths.find((b) => b._id === selected?._id);
  return (
    <>
      <div className="rounded-2xl border border-rose/25 bg-white p-5 md:p-8">
        <div className="mb-7 flex flex-wrap justify-between gap-3 text-[10px]">
          <span className="eyebrow">Interactive expo floor</span>
          <div className="flex gap-4">
            {[
              ["bg-blush", "Available"],
              ["bg-[#dcc6ab]", "Pending"],
              ["bg-rose-dark", "Allocated"],
            ].map(([color, text]) => (
              <span key={text} className="flex items-center gap-1.5">
                <i className={`h-2.5 w-2.5 rounded-sm ${color}`} />
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-5 rounded border border-dashed border-rose/40 py-3 text-center text-[10px] uppercase tracking-[.3em] text-muted">
          Main stage & networking lounge
        </div>
        <div className="grid grid-cols-4 gap-3 sm:gap-5">
          {booths.map((b) => (
            <button
              key={b._id}
              onClick={() => {
                setSelected(b);
                setRecipient("");
              }}
              aria-label={`Booth ${b.code}, ${b.status}`}
              className={`flex min-h-20 flex-col items-center justify-center rounded-md border py-4 transition hover:-translate-y-1 ${b.status === "available" ? "border-rose/20 bg-blush" : b.status === "reserved" ? "border-[#b49d80] bg-[#dcc6ab]" : "border-rose-dark bg-rose-dark text-white"}`}
            >
              <span className="font-display text-2xl">{b.code}</span>
              <span className="mt-1 text-[9px]">{b.size}</span>
            </button>
          ))}
        </div>
        <div className="mx-auto mt-7 max-w-48 rounded-t-full border-x border-t border-rose/30 py-3 text-center text-[9px] uppercase tracking-[.3em] text-muted">
          Welcome / Entrance
        </div>
      </div>
      <Modal
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
        title={`Booth ${current?.code || ""}`}
      >
        {current && (
          <div className="space-y-4">
            <Badge>{current.status}</Badge>
            <p className="text-sm">
              {current.size} · PKR {current.price?.toLocaleString()}
            </p>
            {current.occupant?.name && (
              <p className="text-sm">Exhibitor: {current.occupant.name}</p>
            )}
            {current.products && (
              <p className="text-sm text-muted">
                Showcasing: {current.products}
              </p>
            )}
            {current.staff && (
              <p className="text-sm text-muted">Staff: {current.staff}</p>
            )}
            {user?.role === "admin" && current.status === "available" && (
              <label>
                Assign to an approved exhibitor
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                >
                  <option value="">Choose exhibitor</option>
                  {users
                    .filter((u) =>
                      applications.some(
                        (a) =>
                          a.status === "approved" &&
                          (a.user?._id || a.user) === u._id &&
                          (a.event?._id || a.event) === current.event,
                      ),
                    )
                    .map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </label>
            )}
            {current.status === "available" &&
              ["admin", "exhibitor"].includes(user?.role) && (
                <Button
                  disabled={user.role === "admin" && !recipient}
                  onClick={async () => {
                    await act(`/booths/${current._id}/reserve`, {
                      user: recipient,
                    });
                    setSelected(null);
                  }}
                >
                  Request this booth <ArrowUpRight size={14} />
                </Button>
              )}
            {current.status === "occupied" && user?.role === "attendee" && (
              <Button onClick={() => act(`/booths/${current._id}/visit`, {})}>
                Check in at this booth
              </Button>
            )}
            {!user && (
              <Button asChild>
                <Link to="/login">Sign in to get involved</Link>
              </Button>
            )}
            <p className="text-xs leading-6 text-muted">
              Available booths are held when requested. Organizer approval
              confirms your space.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
export function Sessions({
  sessions,
  user,
  act,
  registrations = [],
  bookmarks = [],
}) {
  return (
    <div className="grid gap-4">
      {sessions.length ? (
        sessions.map((s) => {
          const registered = registrations.some(
            (r) => r.session?._id === s._id,
          );
          const saved = bookmarks.some((b) => b.session?._id === s._id);
          return (
            <Card
              key={s._id}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="eyebrow">
                  {new Date(s.start).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  —{" "}
                  {new Date(s.end).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {dateText(s.start)}
                </p>
                <h3 className="mt-2 text-3xl">{s.title}</h3>
                <p className="mt-2 text-xs text-muted">
                  {s.speaker} · {s.location} · {s.topic}
                </p>
                <p className="mt-2 text-[10px] text-muted">
                  {s.registrationCount} / {s.capacity} places booked
                </p>
              </div>
              {user?.role === "attendee" && (
                <div className="flex gap-2">
                  <Button
                    variant={saved ? "default" : "outline"}
                    size="icon"
                    aria-label={saved ? "Remove bookmark" : "Bookmark session"}
                    onClick={() => act(`/sessions/${s._id}/bookmark`, {})}
                  >
                    <Bookmark size={16} />
                  </Button>
                  <Button
                    disabled={registered || s.registrationCount >= s.capacity}
                    onClick={() =>
                      act(`/events/${s.event?._id || s.event}/register`, {
                        session: s._id,
                      })
                    }
                  >
                    {registered ? "Registered" : "Join session"}
                  </Button>
                </div>
              )}
            </Card>
          );
        })
      ) : (
        <Empty>
          The schedule will appear here when the organizer adds sessions.
        </Empty>
      )}
    </div>
  );
}
export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [portal, setPortal] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("story");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const detail = await demoStore(`/events/${id}`);
      setData(detail);
      if (user) setPortal(await demoStore("/portal"));
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
    return subscribeDemo(load);
  }, [id, user]);
  async function act(path, body) {
    setBusy(true);
    try {
      await demoStore(path, { method: "POST", body });
      toast.success("Your changes have been saved.");
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (error)
    return (
      <div className="section">
        <Empty>{error}</Empty>
      </div>
    );
  if (!data) return <Loading />;
  const { event, sessions, booths, exhibitors } = data;
  const registered = portal?.registrations.some(
    (r) => r.event?._id === id && !r.session,
  );
  const application = portal?.applications.find((a) => a.event?._id === id);
  return (
    <>
      <div className="relative h-96">
        <img
          src={event.image}
          className="h-full w-full object-cover"
          alt={event.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="absolute bottom-10 left-6 right-6 mx-auto max-w-6xl text-white">
          <Badge>{event.category}</Badge>
          <h1 className="mt-4 text-5xl md:text-7xl">{event.title}</h1>
        </div>
      </div>
      <section className="section grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List
            className="mb-8 flex flex-wrap gap-6 border-b border-rose/25 pb-4"
            aria-label="Event information"
          >
            {[
              ["story", "The experience"],
              ["schedule", "The schedule"],
              ["floor", "Floor plan"],
              ["brands", "Exhibitors"],
            ].map(([v, label]) => (
              <Tabs.Trigger
                value={v}
                key={v}
                className={`text-xs ${tab === v ? "font-semibold text-rose-dark" : "text-muted"}`}
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Tabs.Content value="story">
            <h2 className="text-4xl">Something worth showing up for.</h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted">
              {event.description}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card>
                <Users className="text-rose" size={20} />
                <h3 className="my-3 text-2xl">Find your people</h3>
                <p className="text-xs leading-6 text-muted">
                  Meet exhibitors and fellow attendees who share your curiosity.
                </p>
              </Card>
              <Card>
                <Clock className="text-rose" size={20} />
                <h3 className="my-3 text-2xl">Make the day yours</h3>
                <p className="text-xs leading-6 text-muted">
                  Explore the schedule and save the sessions that inspire you.
                </p>
              </Card>
            </div>
          </Tabs.Content>
          <Tabs.Content value="schedule">
            <Sessions
              sessions={sessions}
              user={user}
              act={act}
              registrations={portal?.registrations}
              bookmarks={portal?.bookmarks}
            />
          </Tabs.Content>
          <Tabs.Content value="floor">
            <FloorPlan booths={booths} user={user} act={act} />
          </Tabs.Content>
          <Tabs.Content value="brands">
            <div className="grid gap-4">
              {exhibitors.length ? (
                exhibitors.map((c) => (
                  <Card key={c._id}>
                    <Badge>{c.category}</Badge>
                    <h3 className="my-3 text-3xl">{c.name}</h3>
                    <p className="text-sm leading-7 text-muted">
                      {c.description}
                    </p>
                    <p className="mt-3 text-xs">{c.products}</p>
                    <p className="mt-3 text-xs text-rose-dark">{c.contact}</p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link
                        to={
                          user
                            ? `/dashboard/${user.role}/messages?to=${c.user}`
                            : "/login"
                        }
                      >
                        Contact exhibitor
                      </Link>
                    </Button>
                  </Card>
                ))
              ) : (
                <Empty>
                  Exhibitors will appear as applications are approved.
                </Empty>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
        <aside>
          <Card className="sticky top-28">
            <p className="eyebrow">Your invitation</p>
            <h3 className="my-4 text-3xl">Be part of the experience.</h3>
            <div className="grid gap-4 text-xs text-muted">
              <p className="flex gap-3">
                <CalendarDays size={16} />
                {dateText(event.date)}
              </p>
              <p className="flex gap-3">
                <Clock size={16} />
                {new Date(event.date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="flex gap-3">
                <MapPin size={16} />
                {event.location}
              </p>
            </div>
            <div className="my-6 border-t border-rose/20 pt-5">
              <span className="font-display text-3xl">
                {event.price
                  ? `PKR ${event.price.toLocaleString()}`
                  : "Complimentary"}
              </span>
              <p className="mt-2 text-[10px] text-muted">
                {event.capacity - event.registrationCount} places available ·
                Registration only; payment is arranged by the organizer.
              </p>
            </div>
            {!user ? (
              <Button asChild className="w-full">
                <Link to="/login">
                  Sign in to join <ArrowUpRight size={15} />
                </Link>
              </Button>
            ) : user.role === "attendee" ? (
              <Button
                className="w-full"
                disabled={busy || registered}
                onClick={() => act(`/events/${id}/register`, {})}
              >
                {registered ? "You’re on the guest list" : "Reserve your place"}
              </Button>
            ) : user.role === "exhibitor" && event.type === "expo" ? (
              <Button
                className="w-full"
                disabled={busy || !!application}
                onClick={() => act(`/events/${id}/apply`, {})}
              >
                {application
                  ? `Application ${application.status}`
                  : "Apply to exhibit"}
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to={`/dashboard/${user.role}`}>Go to dashboard</Link>
              </Button>
            )}
          </Card>
        </aside>
      </section>
    </>
  );
}
