import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Search, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { demoStore, asset } from "../services/demoStore";
import { Button, Card, Empty, Loading, Modal } from "../components/ui";
import EventCard from "../components/EventCard";
import { photos, faqs } from "./Home";
export function PageHeading({ eyebrow, title, children }) {
  return (
    <div className="bg-blush/65 px-6 py-16 text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="my-4 text-5xl md:text-6xl">{title}</h1>
      <p className="mx-auto max-w-xl text-sm leading-7 text-muted">
        {children}
      </p>
    </div>
  );
}
export function EventList({ type }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [availability, setAvailability] = useState("upcoming");
  const [sort, setSort] = useState("date");
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setEvents(null);
    demoStore(`/events?type=${type}`)
      .then(setEvents)
      .catch((e) => setError(e.message));
  }, [type]);
  const filtered = events
    ?.filter(
      (e) =>
        (!category || e.category === category) &&
        (availability === "all" ||
          (availability === "available"
            ? e.registrationCount < e.capacity
            : new Date(e.endDate || e.date) >= new Date())) &&
        `${e.title} ${e.location} ${e.description}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title)
        : new Date(a.date) - new Date(b.date),
    );
  return (
    <>
      <PageHeading
        eyebrow="A world of possibilities"
        title={
          type === "expo"
            ? "Discover something extraordinary."
            : "Make room for memorable."
        }
      >
        Find your people, your inspiration, and your next great experience.
      </PageHeading>
      <section className="section">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3.5 text-muted" />
            <input
              aria-label="Search events"
              placeholder="Search by name, location, or interest…"
              className="pl-10!"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className="sm:max-w-64"
            aria-label="Filter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {[
              ...new Set([
                ...(events || []).map((e) => e.category),
                ...(category ? [category] : []),
              ]),
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="sm:max-w-52"
            aria-label="Filter availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="available">Open spots</option>
            <option value="all">All dates</option>
          </select>
          <select
            className="sm:max-w-48"
            aria-label="Sort events"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date">Soonest first</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        {error ? (
          <Empty>{error}. Please refresh this demo.</Empty>
        ) : events === null ? (
          <Loading />
        ) : filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        ) : (
          <Empty>No experiences match your search. Try another category.</Empty>
        )}
      </section>
    </>
  );
}
export function About() {
  return (
    <>
      <PageHeading
        eyebrow="The story behind the moments"
        title="Made for bringing people together."
      >
        A thoughtful platform. A shared purpose. A world of possibilities.
      </PageHeading>
      <section className="section grid items-center gap-12 md:grid-cols-2">
        <img
          src={photos.table}
          className="h-[480px] w-full rounded-t-full object-cover"
          alt="Thoughtfully styled gathering"
        />
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="my-5 text-5xl">
            The details matter.
            <br />
            <em className="font-normal text-rose-dark">So do the people.</em>
          </h2>
          <p className="text-sm leading-8 text-muted">
            EventSphere was created around a simple idea: the best gatherings
            leave people feeling more connected. We bring the people, the
            planning, and the possibilities into one place, so organizers can
            focus on creating an experience worth remembering.
          </p>
          <p className="mt-4 text-sm leading-8 text-muted">
            Explore inspiring expos, discover independent brands, reserve a
            space for your business, or build a day around the sessions you
            love. From the first hello to the final detail, this is your space
            to connect.
          </p>
          <Button asChild className="mt-7">
            <Link to="/expos">
              Find your next experience <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="section grid gap-6 pt-0 md:grid-cols-3">
        {[
          [
            "Thoughtful by design",
            "Clear schedules, simple registrations, and carefully considered spaces.",
          ],
          [
            "Connected in real time",
            "Stay close to the details with live updates and personal notifications.",
          ],
          [
            "A place for everyone",
            "Organizers, ambitious exhibitors, and curious attendees, all brought together.",
          ],
        ].map(([title, text]) => (
          <Card key={title}>
            <h3 className="mb-3 text-3xl">{title}</h3>
            <p className="text-sm leading-7 text-muted">{text}</p>
          </Card>
        ))}
      </section>
    </>
  );
}
export function Gallery() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <PageHeading
        eyebrow="Little details. Lasting memories."
        title="The art of a beautiful gathering."
      >
        A little inspiration for your next special moment.
      </PageHeading>
      <section className="section">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            photos.flowers,
            photos.table,
            photos.party,
            photos.expo,
            photos.hero,
          ].map((src, i) => (
            <button
              className={i === 4 ? "md:col-span-2" : ""}
              key={`${src}${i}`}
              onClick={() => setSelected(src)}
              aria-label={`Enlarge gallery image ${i + 1}`}
            >
              <img
                src={src}
                className="h-96 w-full rounded-xl object-cover"
                alt={
                  [
                    "Floral wedding setting",
                    "A beautiful table",
                    "Celebration decor",
                    "An inspiring gathering",
                    "Wedding details",
                  ][i]
                }
              />
            </button>
          ))}
        </div>
        <Modal
          open={!!selected}
          onOpenChange={(v) => !v && setSelected(null)}
          title="A closer look."
        >
          {selected && (
            <img
              src={selected}
              alt="Enlarged event inspiration"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </Modal>
      </section>
    </>
  );
}
export function Contact() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await demoStore("/contact", { method: "POST", body });
      setSent(true);
      toast.success("Your inquiry has been saved.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="We'd love to hear from you"
        title="Every great gathering starts with hello."
      >
        A question, an idea, or something extraordinary in mind? Let's talk.
      </PageHeading>
      <section className="section grid gap-14 md:grid-cols-2">
        <div>
          <h2 className="text-4xl">Let's make it happen.</h2>
          <p className="my-5 max-w-sm text-sm leading-7 text-muted">
            Tell us what you're thinking. Our team can help you find the right
            experience, bring your brand to an expo, or navigate the details.
          </p>
          <div className="grid gap-6 py-5 text-sm">
            <a href="mailto:hello@eventsphere.com" className="flex gap-3">
              <Mail size={18} />
              hello@eventsphere.com
            </a>
            <a href="tel:+923001234567" className="flex gap-3">
              <Phone size={18} />
              +92 300 1234567
            </a>
            <p className="flex gap-3">
              <MapPin size={18} />
              Karachi, Pakistan · Mon–Fri, 9 am–6 pm
            </p>
          </div>
          <img
            src={photos.flowers}
            alt="An invitation to something beautiful"
            className="mt-8 h-64 w-full rounded-xl object-cover"
          />
        </div>
        <Card>
          {sent ? (
            <div role="status">
              <h3 className="text-3xl">A lovely beginning.</h3>
              <p className="my-5 text-sm leading-7 text-muted">
                Your inquiry is saved in our support inbox. Thank you for
                reaching out.
              </p>
              <Button onClick={() => setSent(false)}>
                Send another inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5">
              <h3 className="text-3xl">Send a little hello.</h3>
              <label>
                Your name
                <input name="name" required minLength={2} maxLength={100} />
              </label>
              <label>
                Email address
                <input name="email" type="email" required />
              </label>
              <label>
                How can we help?
                <select name="kind">
                  <option value="support">Support & inquiries</option>
                  <option value="feedback">Feedback & suggestions</option>
                </select>
              </label>
              <label>
                Your message
                <textarea name="message" required maxLength={5000} />
              </label>
              <p className="text-[10px] text-muted">
                Your details are used to respond to this inquiry.{" "}
                <Link to="/privacy" className="underline">
                  Read our privacy notice.
                </Link>
              </p>
              <Button disabled={busy}>
                {busy ? "Sending…" : "Send your message"}
                <ArrowUpRight size={14} />
              </Button>
            </form>
          )}
        </Card>
      </section>
    </>
  );
}
export function Privacy() {
  return (
    <>
      <PageHeading
        eyebrow="Your information, thoughtfully handled"
        title="Privacy & consent"
      />
      <article className="section max-w-3xl space-y-6 text-sm leading-8">
        <h2 className="text-3xl">What this application stores</h2>
        <p>
          This frontend demonstration stores sample accounts, event bookings,
          exhibitor profiles, messages, and preferences in your browser’s
          localStorage. Nothing is sent to an application server. Use fictional
          details when trying the forms.
        </p>
        <h2 className="text-3xl">Your choices</h2>
        <p>
          You choose which company details and documents to upload. Do not
          upload sensitive identity documents. You can update your profile,
          cancel registrations, remove bookmarks, and contact support to request
          access to your demo data. Reset sample data in account settings to
          clear your changes.
        </p>
        <h2 className="text-3xl">Development use</h2>
        <p>
          Sign-in and role restrictions demonstrate the interface only. They are
          not a security system. Attachments are stored locally with the company
          profile. The recovery screen creates a local reset link and sends no
          email. Event photos and fonts are bundled with the project.
        </p>
        <Link to="/contact" className="text-rose-dark underline">
          Contact support about your data
        </Link>
      </article>
    </>
  );
}
