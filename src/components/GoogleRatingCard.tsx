import { StarIcon } from "./Icons";

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/**
 * Clickable Google rating badge. Links to the business's Google reviews
 * (settings → googleReviewsUrl) or falls back to a Maps search.
 */
export default function GoogleRatingCard({
  rating,
  reviewCount,
  reviewsUrl,
  businessName,
  city,
}: {
  rating: number;
  reviewCount: number;
  reviewsUrl?: string;
  businessName: string;
  city: string;
}) {
  const href =
    reviewsUrl && reviewsUrl.trim() !== ""
      ? reviewsUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${businessName} ${city}`
        )}`;

  const full = Math.round(rating);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group press inline-flex items-center gap-3.5 rounded-2xl border border-ink-700/80 bg-ink-900/70 py-3 pl-4 pr-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-500 hover:bg-ink-800/80 hover:shadow-xl hover:shadow-ink-950/50"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-inner">
        <GoogleG />
      </span>
      <span>
        <span className="flex items-center gap-2">
          <span className="font-display text-lg font-bold leading-none text-white">
            {rating.toFixed(1)}
          </span>
          <span className="flex gap-0.5 text-brand-400" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                width={13}
                height={13}
                className={i < full ? "" : "opacity-25"}
              />
            ))}
          </span>
        </span>
        <span className="mt-1 block text-xs font-semibold text-ink-300 transition-colors group-hover:text-ink-100">
          {reviewCount}+ Google reviews
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </span>
    </a>
  );
}
