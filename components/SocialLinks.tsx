import { SOCIALS, type SocialName } from "@/lib/identity";
import { FacebookIcon, InstagramIcon, ThreadsIcon, XIcon } from "./Icons";

const ICONS: Record<SocialName, typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  X: XIcon,
  Threads: ThreadsIcon,
};

// A row of icon-only links to OASIS's social media accounts.
export function SocialLinks({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <ul className={`social-links ${className}`}>
      {SOCIALS.map(({ name, url }) => {
        const Icon = ICONS[name];
        return (
          <li key={name}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`OASIS on ${name}`} title={name}>
              <Icon size={size} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
