import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Plus,
  ArrowUpRight,
  CalendarDays,
  Building2,
  Users,
  Grid2X2,
  Pencil,
  Trash2,
  Download,
  Check,
  X,
  Send,
  Upload,
  Search,
} from "lucide-react";
import { usePortal } from "../layouts/Dashboard";
import { useAuth } from "../context/DemoAuth";
import { Button, Badge, Card, Empty, Modal, Loading } from "../components/ui";
import { demoStore, asset, resetDemo } from "../services/demoStore";
import { dateText } from "../components/EventCard";
import EventCard from "../components/EventCard";
import { FloorPlan, Sessions } from "./EventDetails";
export function Heading({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">Your EventSphere</p>
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-xs leading-6 text-muted">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
function Metric({ icon: Icon, label, value, detail }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{label}</p>
        <Icon size={18} className="text-rose" />
      </div>
      <p className="my-3 font-display text-5xl">{value}</p>
      <p className="text-[10px] text-muted">{detail}</p>
    </Card>
  );
}
function Performance({ data }) {
  const chart = data.events.map((e) => ({
    name: e.title.split(" ").slice(0, 2).join(" "),
    attendees: data.registrations.filter(
      (r) => r.event?._id === e._id && !r.session,
    ).length,
    booths: data.booths.filter(
      (b) => (b.event?._id || b.event) === e._id && b.status === "occupied",
    ).length,
    visits: data.visits.filter((v) => v.event === e._id).length,
  }));
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <h3 className="mb-5 text-2xl">Attendee engagement</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="rose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bb8e85" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#bb8e85" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee5df"
              />
              <XAxis dataKey="name" fontSize={9} />
              <YAxis allowDecimals={false} fontSize={10} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="attendees"
                stroke="#bb8e85"
                fill="url(#rose)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-5 text-2xl">Booth activity</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee5df"
              />
              <XAxis dataKey="name" fontSize={9} />
              <YAxis allowDecimals={false} fontSize={10} />
              <Tooltip />
              <Bar dataKey="booths" fill="#bb8e85" radius={[4, 4, 0, 0]} />
              <Bar dataKey="visits" fill="#d9c7b9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
export function Overview() {
  const { data, user, base } = usePortal();
  const admin = user.role === "admin";
  const exhibitor = user.role === "exhibitor";
  return (
    <>
      <Heading
        title={`Hello, ${user.name.split(" ")[0]}.`}
        subtitle="Here's a little overview of everything coming together."
      />
      <div className="mb-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-blush p-7">
        <div>
          <h2 className="text-3xl">
            {admin
              ? "Beautiful experiences start with you."
              : exhibitor
                ? "Give your brand a moment to shine."
                : "Your next great experience is waiting."}
          </h2>
          <p className="mt-2 text-xs leading-6 text-muted">
            {admin
              ? "Keep every detail in place, and every person connected."
              : "A little inspiration, a few meaningful connections, and something to look forward to."}
          </p>
        </div>
        <Button asChild>
          <Link to={`${base}/events`}>
            {admin ? "Manage events" : "Explore events"}
            <ArrowUpRight size={15} />
          </Link>
        </Button>
      </div>
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(admin
          ? [
              [
                CalendarDays,
                "Events & expos",
                data.events.length,
                "Experiences in your portfolio",
              ],
              [
                Building2,
                "Exhibitors",
                data.users.filter((u) => u.role === "exhibitor").length,
                `${data.applications.filter((a) => a.status === "pending").length} applications awaiting review`,
              ],
              [
                Users,
                "Attendees",
                data.users.filter((u) => u.role === "attendee").length,
                `${data.registrations.filter((r) => !r.session).length} event registrations`,
              ],
              [
                Grid2X2,
                "Allocated booths",
                data.booths.filter((b) => b.status === "occupied").length,
                `${data.booths.filter((b) => b.status === "available").length} spaces available`,
              ],
            ]
          : exhibitor
            ? [
                [
                  Building2,
                  "Applications",
                  data.applications.length,
                  "Your brand, out in the world",
                ],
                [
                  Check,
                  "Approved",
                  data.applications.filter((a) => a.status === "approved")
                    .length,
                  "Ready for your next step",
                ],
                [
                  Grid2X2,
                  "Your booths",
                  data.booths.length,
                  "Spaces reserved for your story",
                ],
                [
                  Users,
                  "Messages",
                  data.messages.filter((m) => m.to?._id === user.id).length,
                  "Conversations that count",
                ],
              ]
            : [
                [
                  CalendarDays,
                  "Your events",
                  data.registrations.filter((r) => !r.session).length,
                  "Something to look forward to",
                ],
                [
                  Users,
                  "Your sessions",
                  data.registrations.filter((r) => r.session).length,
                  "Make the day yours",
                ],
                [
                  Check,
                  "Saved sessions",
                  data.bookmarks.length,
                  "Inspiration for later",
                ],
                [
                  Building2,
                  "Exhibitors",
                  data.companies.length,
                  "New connections to discover",
                ],
              ]
        ).map(([icon, label, value, detail]) => (
          <Metric key={label} {...{ icon, label, value, detail }} />
        ))}
      </div>
      {admin ? (
        <Performance data={data} />
      ) : (
        <>
          <h2 className="mb-5 text-3xl">On the horizon</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.events.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}
      <Card className="mt-7">
        <div className="mb-5 flex justify-between">
          <h3 className="text-2xl">Your latest updates</h3>
          <Link to={`${base}/notifications`} className="text-xs text-rose-dark">
            View all ↗
          </Link>
        </div>
        {data.notifications.slice(0, 3).map((n) => (
          <p
            key={n._id}
            className="border-t border-rose/15 py-4 text-xs leading-6 text-muted"
          >
            {n.text}
          </p>
        ))}
        {!data.notifications.length && <Empty>You're all caught up.</Empty>}
      </Card>
    </>
  );
}
const isoLocal = (value) => {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
const blankEvent = {
  title: "",
  description: "",
  date: "",
  endDate: "",
  location: "",
  theme: "",
  category: "Design & lifestyle",
  type: "expo",
  image: "",
  capacity: 500,
  price: 0,
};
export function Events() {
  const { data, user, act, busy, confirm } = usePortal();
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const events = data.events.filter(
    (e) =>
      `${e.title} ${e.location}`.toLowerCase().includes(q.toLowerCase()) &&
      (!category || e.category === category) &&
      (status === "all" ||
        (status === "upcoming"
          ? new Date(e.endDate || e.date) >= new Date()
          : status === "available"
            ? e.registrationCount < e.capacity
            : new Date(e.endDate || e.date) < new Date())),
  );
  async function save(e) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    body.date = new Date(body.date).toISOString();
    if (body.endDate) body.endDate = new Date(body.endDate).toISOString();
    else delete body.endDate;
    const result = await act(
      edit._id ? `/events/${edit._id}` : "/events",
      body,
      edit._id ? "PUT" : "POST",
    );
    if (result) setEdit(null);
  }
  return (
    <>
      <Heading
        title={
          user.role === "admin"
            ? "Events & expos"
            : "Find your next experience."
        }
        subtitle="All the details, beautifully in place."
      >
        {user.role === "admin" && (
          <Button onClick={() => setEdit(blankEvent)}>
            <Plus size={15} />
            Create an event
          </Button>
        )}
      </Heading>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search events"
          placeholder="Search events or locations…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          aria-label="Category filter"
          className="sm:max-w-56"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {[...new Set(data.events.map((e) => e.category))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Event status filter"
          className="sm:max-w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="available">Open spots</option>
          <option value="ended">Ended</option>
        </select>
      </div>
      {user.role === "admin" ? (
        <Table
          headers={["Experience", "Date & place", "Capacity", "Actions"]}
          rows={events.map((e) => [
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="mt-1 text-[10px] text-muted">
                {e.type} · {e.category}
              </p>
            </div>,
            <span>
              {dateText(e.date)}
              <br />
              <span className="text-muted">{e.location}</span>
            </span>,
            `${e.registrationCount} / ${e.capacity}`,
            <div className="flex gap-1">
              <Button asChild variant="ghost" size="icon">
                <Link to={`/events/${e._id}`} aria-label={`View ${e.title}`}>
                  <ArrowUpRight size={15} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${e.title}`}
                onClick={() =>
                  setEdit({
                    ...e,
                    date: isoLocal(e.date),
                    endDate: e.endDate ? isoLocal(e.endDate) : "",
                  })
                }
              >
                <Pencil size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${e.title}`}
                onClick={() =>
                  confirm(
                    () => act(`/events/${e._id}`, undefined, "DELETE"),
                    "Delete this event?",
                    "Registrations, sessions, booths, and applications for this event will also be removed.",
                  )
                }
              >
                <Trash2 size={15} />
              </Button>
            </div>,
          ])}
        />
      ) : events.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <Empty>No events match your search.</Empty>
      )}
      <Modal
        open={!!edit}
        onOpenChange={(v) => !v && setEdit(null)}
        title={
          edit?._id
            ? "A few thoughtful changes."
            : "Create something extraordinary."
        }
      >
        {edit && (
          <form className="grid gap-4" onSubmit={save}>
            <label>
              Event title
              <input
                name="title"
                defaultValue={edit.title}
                required
                minLength={3}
                maxLength={150}
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                defaultValue={edit.description}
                maxLength={5000}
                required
              />
            </label>
            <div className="field-grid">
              <label>
                Start date & time
                <input
                  type="datetime-local"
                  name="date"
                  defaultValue={edit.date}
                  required
                />
              </label>
              <label>
                End date & time
                <input
                  type="datetime-local"
                  name="endDate"
                  defaultValue={edit.endDate}
                />
              </label>
              <label>
                Location
                <input
                  name="location"
                  defaultValue={edit.location}
                  minLength={3}
                  required
                />
              </label>
              <label>
                Theme
                <input name="theme" defaultValue={edit.theme} />
              </label>
              <label>
                Category
                <input name="category" defaultValue={edit.category} required />
              </label>
              <label>
                Experience type
                <select name="type" defaultValue={edit.type}>
                  <option value="expo">Expo</option>
                  <option value="event">Event</option>
                </select>
              </label>
              <label>
                Capacity
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  max="100000"
                  defaultValue={edit.capacity}
                  required
                />
              </label>
              <label>
                Price (PKR)
                <input
                  name="price"
                  type="number"
                  min="0"
                  defaultValue={edit.price}
                  required
                />
              </label>
            </div>
            <label>
              Cover image (local path or HTTPS URL)
              <input
                name="image"
                defaultValue={
                  edit.image || "/images/photo-1511578314322-379afb476865.jpg"
                }
              />
            </label>
            <p className="text-[10px] text-muted">
              New events include a 16-booth floor plan. Times use your device's
              time zone.
            </p>
            <Button disabled={busy}>Save event</Button>
          </form>
        )}
      </Modal>
    </>
  );
}
export function Table({ headers, rows }) {
  return rows.length ? (
    <div className="overflow-x-auto rounded-xl border border-rose/20 bg-white">
      <table className="w-full text-left text-xs">
        <thead className="bg-blush/55">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap p-4 text-[10px] font-semibold uppercase tracking-wider text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-rose/15">
              {row.map((cell, j) => (
                <td key={j} className="p-4 leading-6">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty />
  );
}
export function Applications() {
  const { data, user, act, busy } = usePortal();
  const admin = user.role === "admin";
  return (
    <>
      <Heading
        title={admin ? "A place for remarkable brands." : "Your applications."}
        subtitle={
          admin
            ? "Review exhibitors and welcome the right people to your experience."
            : "Follow your brand’s next chapter, from application to approval."
        }
      />
      <Table
        headers={["Company", "Expo", "Status", admin ? "Review" : "Next step"]}
        rows={data.applications.map((a) => [
          <div>
            <p>{a.company?.name || a.user?.name}</p>
            <p className="mt-1 text-[10px] text-muted">{a.company?.products}</p>
            {admin &&
              a.company?.documents?.map((d, i) => (
                <a
                  key={d}
                  href={asset(d)}
                  target="_blank"
                  rel="noreferrer"
                  className="mr-2 text-rose-dark underline"
                >
                  Document {i + 1}
                </a>
              ))}
          </div>,
          a.event?.title || "Event removed",
          <Badge>{a.status}</Badge>,
          admin ? (
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={busy || a.status === "approved"}
                size="sm"
                onClick={() =>
                  act(`/applications/${a._id}`, { status: "approved" }, "PATCH")
                }
              >
                Approve
              </Button>
              <Button
                disabled={busy || a.status === "rejected"}
                variant="outline"
                size="sm"
                onClick={() =>
                  act(`/applications/${a._id}`, { status: "rejected" }, "PATCH")
                }
              >
                Reject
              </Button>
            </div>
          ) : a.status === "approved" ? (
            <Link className="text-rose-dark underline" to="../booths">
              Choose a booth
            </Link>
          ) : (
            "We’ll notify you of updates."
          ),
        ])}
      />
      {!admin && (
        <Button asChild className="mt-6">
          <Link to="../events">
            Discover more expos <ArrowUpRight size={14} />
          </Link>
        </Button>
      )}
    </>
  );
}
export function Company() {
  const { data, act, busy } = usePortal();
  const [logo, setLogo] = useState(data.company?.logo || "");
  const [documents, setDocuments] = useState(data.company?.documents || []);
  const [uploading, setUploading] = useState(false);
  async function upload(e, isLogo) {
    const file = e.target.files[0];
    if (!file) return;
    if (isLogo && !file.type.startsWith("image/"))
      return toast.error("Choose an image for your logo.");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await demoStore("/uploads", {
        method: "POST",
        body: form,
      });
      if (isLogo) setLogo(result.url);
      else setDocuments((d) => [...d, result.url]);
      toast.success("File uploaded. Save your profile to attach it.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      <Heading
        title="The story behind your brand."
        subtitle="Give visitors a thoughtful introduction to what you do."
      />
      <Card className="max-w-3xl">
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            act(
              "/company",
              {
                ...Object.fromEntries(new FormData(e.currentTarget)),
                logo,
                documents,
              },
              "PUT",
            );
          }}
        >
          <div className="flex items-center gap-5">
            {logo ? (
              <img
                src={asset(logo)}
                alt="Company logo"
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blush">
                <Building2 className="text-rose" />
              </div>
            )}
            <label className="text-xs">
              Company logo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => upload(e, true)}
              />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Company name
              <input
                name="name"
                defaultValue={data.company?.name}
                required
                minLength={2}
              />
            </label>
            <label>
              Category
              <input
                name="category"
                defaultValue={data.company?.category}
                required
              />
            </label>
          </div>
          <label>
            Your story
            <textarea
              name="description"
              defaultValue={data.company?.description}
              required
            />
          </label>
          <label>
            Products & services
            <textarea name="products" defaultValue={data.company?.products} />
          </label>
          <label>
            Public contact information
            <input name="contact" defaultValue={data.company?.contact} />
          </label>
          <label>
            Supporting documents (PDF or image, under 1 MB)
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/webp"
              onChange={(e) => upload(e, false)}
              disabled={documents.length >= 10}
            />
          </label>
          <div className="grid gap-2">
            {documents.map((doc, i) => (
              <div className="flex justify-between text-xs" key={doc}>
                <a
                  href={asset(doc)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-dark underline"
                >
                  Document {i + 1}
                </a>
                <button
                  type="button"
                  onClick={() =>
                    setDocuments(documents.filter((d) => d !== doc))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted">
            Use sample business materials. Attachments stay in this browser.
          </p>
          <Button disabled={busy || uploading}>
            {uploading ? "Uploading…" : "Save company profile"}
          </Button>
        </form>
      </Card>
    </>
  );
}
export function Booths() {
  const { data, user, act, busy, confirm } = usePortal();
  const [params] = useSearchParams();
  const [eventId, setEventId] = useState(
    params.get("event") || data.events[0]?._id || "",
  );
  const [detail, setDetail] = useState(null);
  const [booths, setBooths] = useState(null);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    if (eventId)
      demoStore(`/events/${eventId}`)
        .then(setDetail)
        .catch((e) => toast.error(e.message));
  }, [eventId, data]);
  return (
    <>
      <Heading
        title="A space for every story."
        subtitle="Explore the floor, reserve your place, and keep your booth details up to date."
      />
      <select
        aria-label="Select floor plan event"
        className="mb-6 max-w-md"
        value={eventId}
        onChange={(e) => {
          setDetail(null);
          setEventId(e.target.value);
        }}
      >
        {data.events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>
      {detail ? (
        <FloorPlan
          booths={detail.booths}
          user={user}
          act={act}
          users={data.users}
          applications={data.applications}
        />
      ) : data.events.length ? (
        <Loading />
      ) : (
        <Empty>No floor plans yet.</Empty>
      )}
      {user.role !== "attendee" && (
        <>
          <h2 className="mb-5 mt-10 text-3xl">Reservation requests</h2>
          <Table
            headers={["Expo / Booth", "Exhibitor", "Status", "Actions"]}
            rows={data.reservations.map((r) => [
              <span>
                {r.event?.title}
                <br />
                {r.booth?.code}
              </span>,
              r.user?.name,
              <Badge>{r.status}</Badge>,
              <div className="flex flex-wrap gap-2">
                {user.role === "admin" && r.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        act(
                          `/reservations/${r._id}`,
                          { status: "approved" },
                          "PATCH",
                        )
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        act(
                          `/reservations/${r._id}`,
                          { status: "rejected" },
                          "PATCH",
                        )
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
                {["pending", "approved"].includes(r.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      confirm(
                        () =>
                          act(
                            `/reservations/${r._id}`,
                            { status: "cancelled" },
                            "PATCH",
                          ),
                        "Release this booth?",
                        "The booth will become available for another exhibitor.",
                      )
                    }
                  >
                    Cancel
                  </Button>
                )}
              </div>,
            ])}
          />
          <h2 className="mb-5 mt-10 text-3xl">Booth details & staff</h2>
          <Table
            headers={["Booth", "Products / Staff", "Manage"]}
            rows={data.booths
              .filter(
                (b) => user.role === "exhibitor" || b.status === "occupied",
              )
              .map((b) => [
                <span>
                  {b.code} · {b.event?.title}
                </span>,
                <span>
                  {b.products || "No products added"}
                  <br />
                  {b.staff}
                </span>,
                <Button size="sm" variant="outline" onClick={() => setEdit(b)}>
                  Edit details
                </Button>,
              ])}
          />
        </>
      )}
      <Modal
        open={!!edit}
        onOpenChange={(v) => !v && setEdit(null)}
        title={`Booth ${edit?.code}`}
      >
        {edit && (
          <form
            className="grid gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                await act(
                  `/booths/${edit._id}`,
                  Object.fromEntries(new FormData(e.currentTarget)),
                  "PATCH",
                )
              )
                setEdit(null);
            }}
          >
            <label>
              Products on display
              <textarea name="products" defaultValue={edit.products} />
            </label>
            <label>
              Staff names & roles
              <textarea name="staff" defaultValue={edit.staff} />
            </label>
            <Button disabled={busy}>Save booth details</Button>
          </form>
        )}
      </Modal>
    </>
  );
}
export function Schedule() {
  const { data, user, act, busy, confirm } = usePortal();
  const [eventId, setEventId] = useState(data.events[0]?._id || "");
  const [sessions, setSessions] = useState(null);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    if (eventId)
      demoStore(`/events/${eventId}`)
        .then((d) => setSessions(d.sessions))
        .catch((e) => toast.error(e.message));
  }, [eventId, data]);
  const admin = user.role === "admin";
  async function save(e) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    body.start = new Date(body.start).toISOString();
    body.end = new Date(body.end).toISOString();
    body.event = eventId;
    if (
      await act(
        edit._id ? `/sessions/${edit._id}` : "/sessions",
        body,
        edit._id ? "PUT" : "POST",
      )
    )
      setEdit(null);
  }
  return (
    <>
      <Heading
        title="A day full of possibilities."
        subtitle="The right conversations, at the right time."
      >
        {admin && eventId && (
          <Button onClick={() => setEdit({})}>
            <Plus size={15} />
            Add a session
          </Button>
        )}
      </Heading>
      <select
        aria-label="Select schedule event"
        className="mb-6 max-w-md"
        value={eventId}
        onChange={(e) => {
          setSessions(null);
          setEventId(e.target.value);
        }}
      >
        {data.events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>
      {!sessions ? (
        data.events.length ? (
          <Loading />
        ) : (
          <Empty />
        )
      ) : admin ? (
        <Table
          headers={[
            "Session & topic",
            "Speaker",
            "When & where",
            "Popularity",
            "Actions",
          ]}
          rows={sessions.map((s) => [
            <span>
              {s.title}
              <br />
              <span className="text-muted">{s.topic}</span>
            </span>,
            s.speaker,
            <span>
              {dateText(s.start)} ·{" "}
              {new Date(s.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <br />
              {s.location}
            </span>,
            `${s.registrationCount} / ${s.capacity}`,
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${s.title}`}
                onClick={() =>
                  setEdit({
                    ...s,
                    start: isoLocal(s.start),
                    end: isoLocal(s.end),
                  })
                }
              >
                <Pencil size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${s.title}`}
                onClick={() =>
                  confirm(
                    () => act(`/sessions/${s._id}`, undefined, "DELETE"),
                    "Remove this session?",
                    "Session registrations and bookmarks will be removed, and participants notified.",
                  )
                }
              >
                <Trash2 size={15} />
              </Button>
            </div>,
          ])}
        />
      ) : (
        <Sessions
          sessions={sessions}
          user={user}
          act={act}
          registrations={data.registrations}
          bookmarks={data.bookmarks}
        />
      )}
      <Modal
        open={!!edit}
        onOpenChange={(v) => !v && setEdit(null)}
        title={
          edit?._id ? "Refine the schedule." : "Make room for inspiration."
        }
      >
        {edit && (
          <form className="grid gap-4" onSubmit={save}>
            <label>
              Session title
              <input
                name="title"
                defaultValue={edit.title}
                required
                minLength={3}
              />
            </label>
            <div className="field-grid">
              <label>
                Speaker
                <input
                  name="speaker"
                  defaultValue={edit.speaker}
                  required
                  minLength={2}
                />
              </label>
              <label>
                Topic
                <input name="topic" defaultValue={edit.topic} />
              </label>
              <label>
                Location
                <input
                  name="location"
                  defaultValue={edit.location}
                  required
                  minLength={2}
                />
              </label>
              <label>
                Capacity
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  defaultValue={edit.capacity || 50}
                  required
                />
              </label>
              <label>
                Starts
                <input
                  type="datetime-local"
                  name="start"
                  defaultValue={edit.start}
                  required
                />
              </label>
              <label>
                Ends
                <input
                  type="datetime-local"
                  name="end"
                  defaultValue={edit.end}
                  required
                />
              </label>
            </div>
            <Button disabled={busy}>Save session</Button>
          </form>
        )}
      </Modal>
    </>
  );
}
export function Registrations() {
  const { data, act, confirm } = usePortal();
  return (
    <>
      <Heading
        title="Good things to look forward to."
        subtitle="Your event invitations and session bookings, all in one place."
      />
      <Table
        headers={["Experience", "Your booking", "Date", "Actions"]}
        rows={data.registrations.map((r) => [
          r.event?.title || "Event removed",
          r.session?.title || "Event admission",
          r.event ? dateText(r.session?.start || r.event.date) : "—",
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/events/${r.event?._id}`}>View event</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                confirm(
                  () => act(`/registrations/${r._id}`, undefined, "DELETE"),
                  "Cancel your registration?",
                  r.session
                    ? "Your session place will be released."
                    : "Your event and associated session bookings will be cancelled.",
                )
              }
            >
              Cancel
            </Button>
          </div>,
        ])}
      />
    </>
  );
}
export function Bookmarks() {
  const { data, user, act } = usePortal();
  return (
    <>
      <Heading
        title="A little inspiration for later."
        subtitle="Saved sessions come with an in-app reminder within an hour of starting, while this demo is open."
      />
      <Sessions
        sessions={data.bookmarks.map((b) => b.session).filter(Boolean)}
        user={user}
        act={act}
        registrations={data.registrations}
        bookmarks={data.bookmarks}
      />
    </>
  );
}
export function Exhibitors() {
  const { data, base } = usePortal();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const filtered = data.companies.filter(
    (c) =>
      (!category || c.category === category) &&
      `${c.name} ${c.description} ${c.products}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <Heading
        title="Meet the makers & the dreamers."
        subtitle="Discover brands, products, and people worth getting to know."
      />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search exhibitors"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search companies, products, or keywords…"
        />
        <select
          className="sm:max-w-56"
          aria-label="Exhibitor category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {[...new Set(data.companies.map((c) => c.category))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c._id}>
            {c.logo && (
              <img
                src={asset(c.logo)}
                alt={`${c.name} logo`}
                className="mb-5 h-16 w-16 rounded-lg object-contain"
              />
            )}
            <Badge>{c.category}</Badge>
            <h2 className="my-4 text-3xl">{c.name}</h2>
            <p className="text-xs leading-7 text-muted">{c.description}</p>
            <p className="my-4 text-xs">{c.products}</p>
            <p className="my-4 text-xs text-muted">{c.contact}</p>
            <div className="mb-4 grid gap-2">
              {c.locations?.map((location) => (
                <Link
                  key={location._id}
                  className="text-xs text-rose-dark underline"
                  to={`${base}/booths?event=${location.event?._id}`}
                >
                  Booth {location.code} · {location.event?.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to={`${base}/messages?to=${c.user?._id}`}>
                  Start a conversation
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={`${base}/booths`}>Find their booth</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {!filtered.length && <Empty>No exhibitors match that search.</Empty>}
    </>
  );
}
export function Analytics() {
  const { data } = usePortal();
  function download() {
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ["Event", "Registrations", "Allocated booths", "Unique booth visits"],
      ...data.events.map((e) => [
        e.title,
        data.registrations.filter((r) => r.event?._id === e._id && !r.session)
          .length,
        data.booths.filter(
          (b) => b.event?._id === e._id && b.status === "occupied",
        ).length,
        data.visits.filter((v) => v.event === e._id).length,
      ]),
    ];
    const blob = new Blob(
      [rows.map((row) => row.map(escape).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "eventsphere-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  const sessions = data.registrations
    .filter((r) => r.session)
    .reduce((out, r) => {
      out[r.session._id] ||= {
        title: r.session.title,
        speaker: r.session.speaker,
        count: 0,
      };
      out[r.session._id].count++;
      return out;
    }, {});
  return (
    <>
      <Heading
        title="The story in the numbers."
        subtitle="Live records, meaningful insight. Booth traffic measures unique attendee check-ins."
      >
        <Button onClick={download}>
          <Download size={15} />
          Export CSV report
        </Button>
      </Heading>
      <Performance data={data} />
      <h2 className="my-7 text-3xl">Session popularity</h2>
      <Table
        headers={["Session", "Speaker", "Registrations"]}
        rows={Object.values(sessions)
          .sort((a, b) => b.count - a.count)
          .map((s) => [s.title, s.speaker, s.count])}
      />
    </>
  );
}
export function People() {
  const { data, user, act, busy, confirm } = usePortal();
  const [q, setQ] = useState("");
  return (
    <>
      <Heading
        title="The people who make it happen."
        subtitle="Manage access for the sample community. Explore roles from the sign-in screen."
      />
      <input
        className="mb-6"
        placeholder="Search people…"
        aria-label="Search users"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Table
        headers={["Name", "Email", "Role", "Access", "Manage"]}
        rows={data.users
          .filter((u) =>
            `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
          )
          .map((u) => [
            u.name,
            u.email,
            <Badge>{u.role}</Badge>,
            u.active ? "Active" : "Disabled",
            u.role !== "admin" ? (
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() =>
                  confirm(
                    () =>
                      act(`/users/${u._id}`, { active: !u.active }, "PATCH"),
                    `${u.active ? "Disable" : "Enable"} ${u.name}?`,
                    "This changes their ability to access the application.",
                  )
                }
              >
                {u.active ? "Disable access" : "Enable access"}
              </Button>
            ) : (
              "Organizer"
            ),
          ])}
      />
    </>
  );
}
export function Messages() {
  const { data, user, act, busy } = usePortal();
  const [params] = useSearchParams();
  const [recipient, setRecipient] = useState(params.get("to") || "");
  const [body, setBody] = useState("");
  const messages = data.messages.filter(
    (m) => m.from?._id === recipient || m.to?._id === recipient,
  );
  async function send(e) {
    e.preventDefault();
    if (await act("/messages", { to: recipient, body })) setBody("");
  }
  return (
    <>
      <Heading
        title="Good things start with a conversation."
        subtitle="Connect with organizers, exhibitors, and your event community."
      />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <Card>
          <label>
            Start or open a conversation
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            >
              <option value="">Choose someone</option>
              {data.users
                .filter((u) => u._id !== user.id && u.active !== false)
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} · {u.role}
                  </option>
                ))}
            </select>
          </label>
        </Card>
        <Card>
          {recipient ? (
            <>
              <div
                className="mb-4 h-96 space-y-4 overflow-y-auto pr-2"
                aria-live="polite"
              >
                {messages.length ? (
                  messages.map((m) => (
                    <div
                      key={m._id}
                      className={`max-w-[85%] rounded-xl p-4 ${m.from?._id === user.id ? "ml-auto bg-blush" : "bg-ivory"}`}
                    >
                      <p className="text-[10px] text-rose-dark">
                        {m.from?.name}
                      </p>
                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-6">
                        {m.body}
                      </p>
                      <p className="mt-2 text-[9px] text-muted">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <Empty>Say hello. Something great could start here.</Empty>
                )}
              </div>
              <form onSubmit={send} className="flex gap-2">
                <input
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write a thoughtful message…"
                  aria-label="Message"
                  maxLength={5000}
                  required
                />
                <Button disabled={busy} aria-label="Send message">
                  <Send size={16} />
                </Button>
              </form>
            </>
          ) : (
            <Empty>Choose someone to start a conversation.</Empty>
          )}
        </Card>
      </div>
    </>
  );
}
export function Notifications() {
  const { data, act, busy } = usePortal();
  return (
    <>
      <Heading
        title="A little update for you."
        subtitle="The details that matter, as they happen."
      >
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => act("/notifications/read", {}, "PATCH")}
        >
          Mark all as read
        </Button>
      </Heading>
      <div className="grid gap-3">
        {data.notifications.map((n) => (
          <Card
            key={n._id}
            className={`flex gap-4 ${!n.read ? "border-rose/60" : ""}`}
          >
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-rose/20" : "bg-rose"}`}
            />
            <div>
              <p className="text-sm leading-7">{n.text}</p>
              <p className="mt-2 text-[10px] text-muted">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
        {!data.notifications.length && <Empty>You're all caught up.</Empty>}
      </div>
    </>
  );
}
export function Support() {
  const { data, user, act, busy } = usePortal();
  const [sent, setSent] = useState(false);
  return (
    <>
      <Heading
        title={
          user.role === "admin"
            ? "A little care goes a long way."
            : "We’re here for the little details."
        }
        subtitle="Questions, suggestions, or something we can make better?"
      />
      {user.role !== "admin" && (
        <Card className="mb-8 max-w-2xl">
          {sent ? (
            <div role="status">
              <p className="text-sm">
                Your message has been saved. Track it below.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSent(false)}
              >
                Send another
              </Button>
            </div>
          ) : (
            <form
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const body = Object.fromEntries(new FormData(e.currentTarget));
                body.publish = body.publish === "on";
                if (await act("/feedback", body)) setSent(true);
              }}
            >
              <label>
                What’s on your mind?
                <select name="kind">
                  <option value="support">I need a little help</option>
                  <option value="feedback">A thought or suggestion</option>
                </select>
              </label>
              <label>
                Experience rating
                <select name="rating" defaultValue="5">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option value={n} key={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Your message
                <textarea required name="message" maxLength={5000} />
              </label>
              <label className="flex items-start gap-2 text-xs font-normal">
                <input type="checkbox" name="publish" />
                <span>
                  For feedback, I consent to display my name and review
                  publicly.
                </span>
              </label>
              <Button disabled={busy}>Send to our team</Button>
            </form>
          )}
        </Card>
      )}
      <Table
        headers={["From / Type", "Message", "Status", "Follow up"]}
        rows={data.feedback.map((f) => [
          <span>
            {f.name || (f.user === user.id ? "You" : "Community member")}
            <br />
            {f.email}
            <br />
            {f.kind} {f.rating ? `· ${f.rating}/5` : ""}
          </span>,
          f.message,
          <Badge>{f.status}</Badge>,
          user.role === "admin" ? (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() =>
                act(
                  `/feedback/${f._id}`,
                  { status: f.status === "open" ? "resolved" : "open" },
                  "PATCH",
                )
              }
            >
              {f.status === "open" ? "Resolve" : "Reopen"}
            </Button>
          ) : (
            "We’ll keep you updated."
          ),
        ])}
      />
    </>
  );
}
export function Settings() {
  const { user, act, busy, confirm } = usePortal();
  const { setUser } = useAuth();
  return (
    <>
      <Heading
        title="A few things about you."
        subtitle="Keep your personal details up to date."
      />
      <Card className="max-w-xl">
        <form
          className="grid gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await act(
              "/auth/profile",
              Object.fromEntries(new FormData(e.currentTarget)),
              "PATCH",
            );
            if (result) setUser(result);
          }}
        >
          <label>
            Your name
            <input
              name="name"
              defaultValue={user.name}
              minLength={2}
              maxLength={100}
              required
            />
          </label>
          <label>
            Email address
            <input value={user.email} disabled />
          </label>
          <label>
            Your role
            <input value={user.role} disabled />
          </label>
          <Button disabled={busy}>Save your details</Button>
          <Link
            to="/forgot-password"
            className="text-xs text-rose-dark underline"
          >
            Request a password reset
          </Link>
          <Link to="/contact" className="text-xs text-muted underline">
            Request data access or account deletion
          </Link>
        </form>
      </Card>
      <Card className="mt-6 max-w-xl">
        <h2 className="text-2xl">A fresh start for your demo.</h2>
        <p className="my-4 text-xs leading-6 text-muted">
          Restore the sample accounts, events, bookings, messages, and floor
          plans in this browser.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            confirm(
              resetDemo,
              "Reset this demo?",
              "Your browser’s demo changes will be replaced by the original sample data and you will be signed out.",
            )
          }
        >
          Reset sample data
        </Button>
      </Card>
    </>
  );
}
