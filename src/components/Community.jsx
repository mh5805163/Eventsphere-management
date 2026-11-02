import { useEffect, useState } from "react";
import { demoStore } from "../services/demoStore";
import { Quote, Star } from "lucide-react";
export default function Community() {
  const [data, setData] = useState(null);
  useEffect(() => {
    demoStore("/community")
      .then(setData)
      .catch(() => {});
  }, []);
  if (!data) return null;
  return (
    <>
      <section className="border-y border-rose/15 bg-blush/35">
        <div className="section py-16">
          <div className="text-center">
            <p className="eyebrow">From our community</p>
            <h2 className="mt-4 text-5xl">
              The moments{" "}
              <em className="font-normal text-rose-dark">that stay.</em>
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {data.reviews.length ? (
              data.reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-xl border border-rose/20 bg-ivory p-7"
                >
                  <Quote size={24} strokeWidth={1} className="text-rose" />
                  <p className="my-5 font-display text-2xl leading-relaxed">
                    “{review.message}”
                  </p>
                  <div
                    className="mb-4 flex gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: review.rating || 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={11}
                        fill="currentColor"
                        className="text-rose"
                      />
                    ))}
                  </div>
                  <p className="text-xs">{review.name}</p>
                  {review.sample && (
                    <p className="mt-2 text-[9px] uppercase tracking-wider text-muted">
                      Sample client story
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-sm text-muted">
                Your story could be the next. Share your experience from your
                dashboard.
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="section grid grid-cols-2 gap-8 py-14 text-center md:grid-cols-4">
        {[
          [data.events, "Curated experiences"],
          [data.exhibitors, "Exhibitor brands"],
          [data.registrations, "Event registrations"],
          [data.booths, "Spaces for possibility"],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="font-display text-5xl text-rose-dark">{value}</p>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
              {label}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
