"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../website/halaman_utama/Navbar";
import Footer from "../website/halaman_utama/Footer";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const LayoutNoauth = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideLayoutOn = ["/login", "/register", "/forgot-password"];
  const hideLayout = hideLayoutOn.some((path) => pathname.startsWith(path));

  return (
    <div className={`min-h-screen transition-opacity w-full duration-500`}>
      {!hideLayout && <Navbar />}
      <div>{children}</div>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default LayoutNoauth;
