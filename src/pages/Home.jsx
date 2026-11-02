import Community from "../components/Community";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Flower2,
  Sparkles,
  HeartHandshake,
  Building2,
  Leaf,
  Palette,
  Cake,
  Quote,
  Check,
  ArrowRight,
} from "lucide-react";
import { demoStore } from "../services/demoStore";
import { Button } from "../components/ui";
import EventCard from "../components/EventCard";
export const photos = {
  hero: "/images/photo-1519225421980-715cb0215aed.jpg",
  table: "/images/photo-1478146896981-b80fe463b330.jpg",
  flowers: "/images/photo-1519741497674-611481863552.jpg",
  party: "/images/photo-1530103862676-de8c9debad1d.jpg",
  expo: "/images/photo-1511578314322-379afb476865.jpg",
};
export const faqs = [
  [
    "How do I join an expo as an exhibitor?",
    "Create an exhibitor account, complete your company profile, and apply to an upcoming expo. Once approved, you can select a booth on the interactive floor plan.",
  ],
  [
    "Can I register for more than one event?",
    "Absolutely. Your attendee account brings all your event registrations, session bookings, and saved sessions together in one dashboard.",
  ],
  [
    "How does booth selection work?",
    "Approved exhibitors can choose an available space on the expo floor plan. A reservation holds the space while the organizer reviews it; a rejected or cancelled reservation releases it.",
  ],
  [
    "How will I know if a schedule changes?",
    "Registered attendees and people who bookmark a session receive in-app notifications. Your dashboard also updates live when event information changes.",
  ],
];
export default function Home() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    demoStore("/events")
      .then(setEvents)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-blush">
        <img
          src={photos.hero}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_50%]"
          alt="Beautifully styled wedding celebration with flowers and warm lighting"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ivory via-ivory/90 to-ivory/5" />
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <div className="max-w-xl">
            <p className="eyebrow mb-6">
              Beautiful gatherings. Meaningful connections.
            </p>
            <h1 className="text-[64px] leading-[.97] tracking-tight md:text-[88px]">
              Where moments
              <br />
              become{" "}
              <span className="font-normal italic text-rose-dark">
                memories.
              </span>
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-7 text-muted">
              Discover inspiring expos, celebrate life's milestones, and bring
              extraordinary people together. We'll take care of the details.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/expos">
                  Explore experiences <ArrowUpRight size={15} />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/register">Become an exhibitor</Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[10px] tracking-wide text-muted">
              <span className="flex -space-x-2">
                {["AK", "SA", "ZH"].map((name, i) => (
                  <span
                    key={name}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-ivory ${i === 1 ? "bg-rose text-white" : "bg-[#d7c6b8]"}`}
                  >
                    {name}
                  </span>
                ))}
              </span>
              <span>For people who love a little extraordinary.</span>
            </div>
          </div>
        </div>
        <p className="absolute bottom-8 right-10 hidden -rotate-6 font-display text-3xl italic text-white drop-shadow md:block">
          Thoughtfully curated.
          <br />
          Beautifully experienced.
        </p>
      </section>
      <div className="border-b border-rose/15 bg-blush/60">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 px-6 py-8 md:grid-cols-6">
          {[
            [Flower2, "Weddings"],
            [Cake, "Celebrations"],
            [Palette, "Design & lifestyle"],
            [Building2, "Business & technology"],
            [Leaf, "Sustainability"],
            [Sparkles, "All experiences"],
          ].map(([Icon, title]) => (
            <Link
              to={
                title === "All experiences"
                  ? "/expos"
                  : `/expos?category=${encodeURIComponent(title)}`
              }
              key={title}
              className="flex flex-col items-center gap-3 text-center text-[9px] uppercase tracking-[.13em] text-rose-dark"
            >
              <Icon size={27} strokeWidth={1} />
              {title}
            </Link>
          ))}
        </div>
      </div>
      <section className="section grid items-center gap-14 md:grid-cols-2">
        <div className="relative pb-6 pr-6">
          <img
            src={photos.table}
            alt="Thoughtful table styling for an intimate event"
            className="h-[440px] w-full rounded-t-[150px] object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 right-0 max-w-44 rounded-tl-3xl bg-blush p-7">
            <Flower2 className="mb-2 text-rose-dark" strokeWidth={1} />
            <p className="font-display text-2xl leading-tight">
              A little detail.
              <br />A lasting impression.
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow">The EventSphere way</p>
          <h2 className="mt-5 text-5xl leading-tight md:text-6xl">
            We bring it together.
            <br />
            <span className="italic text-rose-dark">You make it yours.</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-muted">
            Behind every remarkable gathering is a world of thoughtful details.
            EventSphere brings organizers, exhibitors, and curious minds into
            one beautifully connected space.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted">
            From finding your next inspiration to choosing your perfect booth,
            we make the journey feel as special as the day itself.
          </p>
          <div className="my-7 grid grid-cols-2 gap-3 text-xs">
            {[
              "Thoughtfully curated events",
              "Seamless registration",
              "Spaces for every story",
              "Real connections, in real time",
            ].map((t) => (
              <p key={t} className="flex items-center gap-2">
                <Check size={14} className="text-rose" />
                {t}
              </p>
            ))}
          </div>
          <Button asChild variant="outline">
            <Link to="/about">
              A little about us <ArrowUpRight size={14} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="bg-blush/45">
        <div className="section">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Find your next inspiration</p>
              <h2 className="mt-3 text-5xl md:text-6xl">
                On the <em className="font-normal text-rose-dark">horizon.</em>
              </h2>
            </div>
            <Link to="/expos" className="flex items-center gap-2 text-xs">
              View all expos <ArrowRight size={16} />
            </Link>
          </div>
          {error ? (
            <div className="panel text-sm">
              We couldn't read the saved demo events. Refresh to try again.{" "}
              <button
                className="underline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {events
                .filter((e) => e.type === "expo")
                .slice(0, 3)
                .map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="mb-10 text-center">
          <p className="eyebrow">For every kind of special</p>
          <h2 className="mt-3 text-5xl">
            Life deserves a{" "}
            <em className="font-normal text-rose-dark">celebration.</em>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {events
            .filter((e) => e.type === "event")
            .slice(0, 2)
            .map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
        </div>
      </section>
      <section className="bg-[#cfbcb3]">
        <div className="section text-center">
          <p className="eyebrow">Less planning. More possibilities.</p>
          <h2 className="mt-3 text-5xl">
            Your experience, <em className="font-normal">made simple.</em>
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Discover your moment",
                "Browse beautiful events and inspiring expos. Find the one that feels like you.",
              ],
              [
                "02",
                "Make it official",
                "Create an account, book your place, or apply to showcase your brand.",
              ],
              [
                "03",
                "Show up & connect",
                "Build your schedule, meet your people, and make memories worth keeping.",
              ],
            ].map(([n, title, text]) => (
              <div className="rounded-xl bg-ivory/75 px-8 py-10" key={n}>
                <span className="eyebrow">{n} / The next chapter</span>
                <h3 className="my-4 text-3xl">{title}</h3>
                <p className="text-xs leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-9" variant="dark">
            <Link to="/register">
              Let's get started <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="section grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Meet the people behind the magic</p>
          <h2 className="my-5 text-5xl">
            Remarkable brands.
            <br />
            <em className="font-normal text-rose-dark">
              Shared possibilities.
            </em>
          </h2>
          <p className="max-w-md text-sm leading-7 text-muted">
            A platform for the makers, the dreamers, and the people building
            something worth sharing. Give your brand a space to shine.
          </p>
          <Button asChild className="mt-7" variant="outline">
            <Link to="/register?role=exhibitor">
              Join our exhibitor community <ArrowUpRight size={14} />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-t-full bg-blush p-8 pt-16 text-center">
            <Flower2
              size={48}
              strokeWidth={1}
              className="mx-auto text-rose-dark"
            />
            <h3 className="mt-6 text-3xl">Petal & Poise</h3>
            <p className="mt-3 text-xs leading-6 text-muted">
              Floral artistry & thoughtful styling
            </p>
            <Link
              to="/exhibitors"
              className="mt-5 inline-block text-xs underline underline-offset-4"
            >
              Meet our exhibitors
            </Link>
          </div>
          <img
            src={photos.flowers}
            className="h-80 w-full rounded-b-full object-cover"
            loading="lazy"
            alt="Floral artistry by event creators"
          />
        </div>
      </section>
      <section className="border-y border-rose/15 bg-blush/40">
        <div className="section py-14 text-center">
          <Quote className="mx-auto text-rose" size={30} strokeWidth={1} />
          <p className="eyebrow mt-4">The kind words that stay with us</p>
          <blockquote className="mx-auto mt-6 max-w-3xl font-display text-3xl leading-relaxed md:text-4xl">
            “Every detail felt considered. Every moment felt effortless.
            EventSphere made bringing our vision to life a truly beautiful
            experience.”
          </blockquote>
          <p className="mt-6 text-xs">The EventSphere promise</p>
          <p className="mt-1 text-[10px] text-muted">
            Thoughtful service, from the first idea to the final detail.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr]">
          {[photos.flowers, photos.party, photos.expo].map((photo, i) => (
            <Link to="/gallery" key={photo}>
              <img
                src={photo}
                className="h-80 w-full rounded-lg object-cover"
                loading="lazy"
                alt={
                  [
                    "An unforgettable wedding",
                    "A joyful celebration",
                    "A place for people to connect",
                  ][i]
                }
              />
            </Link>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="font-display text-2xl italic">
            A glimpse of the extraordinary.
          </p>
          <Link to="/gallery" className="text-xs">
            Explore the gallery ↗
          </Link>
        </div>
      </section>
      <Community />
      <section className="section pt-0">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-center">A few things you might wonder</p>
          <h2 className="my-5 text-center text-4xl md:text-5xl">
            Good questions.{" "}
            <em className="font-normal text-rose-dark">Thoughtful answers.</em>
          </h2>
          <div className="mt-8">
            {faqs.map(([q, a]) => (
              <details key={q} className="border-b border-rose/25 py-5">
                <summary className="text-sm font-medium">{q}</summary>
                <p className="mt-4 text-sm leading-7 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-blush">
        <div className="section flex flex-wrap items-center justify-between gap-8 py-14">
          <div>
            <p className="eyebrow">Your next beautiful chapter</p>
            <h2 className="mt-3 text-4xl md:text-5xl">
              Let's make something{" "}
              <em className="font-normal text-rose-dark">memorable.</em>
            </h2>
          </div>
          <Button asChild>
            <Link to="/contact">
              Start a conversation <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
