import { ViewTransition } from "react";

// Templates re-mount on every navigation (layouts don't), so wrapping pages here
// lets each page animate in and out. Animations are defined in globals.css.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
