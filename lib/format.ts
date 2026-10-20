export function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Scheduling uses Nigeria time (West Africa Time, UTC+1 all year, no daylight saving).
export const SITE_TIME_ZONE = "Africa/Lagos";
const SITE_UTC_OFFSET = "+01:00";

export function formatDateTime(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: SITE_TIME_ZONE,
  });
}

// Date -> "YYYY-MM-DDTHH:mm" in Nigeria time, for <input type="datetime-local">.
export function toSiteInputValue(value: Date | string | null) {
  if (!value) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: SITE_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(value))
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

// "YYYY-MM-DDTHH:mm" entered in Nigeria time -> Date, or null if invalid.
export function fromSiteInputValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00${SITE_UTC_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const CONTACT_SUBJECTS = [
  "General enquiry",
  "Request support",
  "Partnership",
  "Funding",
  "Research collaboration",
  "Donation",
  "Media",
] as const;
