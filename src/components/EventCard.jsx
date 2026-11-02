import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "./ui";
export const dateText = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export default function EventCard({ event }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-rose/20 bg-white">
      <Link
        to={`/events/${event._id}`}
        className="relative block overflow-hidden"
      >
        <img
          src={event.image}
          alt={event.title}
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-md bg-ivory/95 px-3 py-2 text-center">
          <span className="block font-display text-2xl leading-6">
            {new Date(event.date).getDate()}
          </span>
          <span className="text-[9px] uppercase tracking-wider">
            {new Date(event.date).toLocaleDateString("en-GB", {
              month: "short",
            })}
          </span>
        </span>
      </Link>
      <div className="p-6">
        <Badge>{event.category}</Badge>
        <h3 className="mt-3 text-3xl">
          <Link to={`/events/${event._id}`}>{event.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-xs leading-6 text-muted">
          {event.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted">
          <MapPin size={13} />
          {event.location}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
          <CalendarDays size={13} />
          {dateText(event.date)}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-rose/15 pt-4">
          <span className="text-xs text-rose-dark">
            {event.price
              ? `PKR ${event.price.toLocaleString()}`
              : "Complimentary entry"}
          </span>
          <Link
            to={`/events/${event._id}`}
            className="flex items-center gap-2 text-xs font-semibold"
          >
            Discover more <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
