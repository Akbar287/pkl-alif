"use client";
import { useState, useEffect, useRef } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/assets/logo-kemenkeu.png";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const Navbar = () => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(
    "https://images.unsplash.com/photo-1587163689171-57b3c321bad2?q=80&w=2070&auto=format&fit=crop"
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [animateMenu, setAnimateMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (menuOpen) {
      const timer = setTimeout(() => {
        setAnimateMenu(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateMenu(false);
    }
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#01347c] dark:bg-[#01347c] shadow-md py-2"
          : "bg-gray-700/30 py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={Logo}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIKUExURQAAAOd4F6JXFslqF8ZpF5xVF8JnF8RoF5RRFsNnF5dTF+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F/+GEel5F+h4F+l5F4ZKFs1uHNhyGsxuHH5HF/+GCMdvIsark8aslsRvJf+FBel5FtV0INR1Iul4Fuh4Fud4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+h4Fuh4Fud4F+d4F+p5FtV0INR1Iup4Fv+PAMRuI8mumMmwmsRvJf+HAk4wFstuHNZwGNZwGMxuHG9AF/+ODel5F+h5F+h5F+l5F/+IEOd4F+d4F+d4F+h4F9lzGsKwoNrIuN/Mvd3Lu9vJueHVyrq8vpOVlpiam8LDxMTFxpmam5SVlre5u+LYztZ0H+PWyoaHiAwMDENDQykpKQ0NDYCAgeTZz9R1IdV0H+LVyo2Oj3V1dY2NjT8/P4qKind3d4iJiuTYzuh4FuDTyLGys7Ozs3NzcxMTExISEm9vb7S0tK+vsOHWzN/Sx8HCw8PDw39/fwYGBgUFBXp6esTExL/AweHVy+HUyKusra6urrGxsXR0dLCwsKipqeLWzIuMjVtbW8DAwN3d3dzc3MHBwV5eXoaHh+TXzIaIigECAzAxMnFyc3JzdDEyM4CChOXa0YZ0ZCMRASYUBJuJeZ+NfScVBSIQAIFwYNRuFdhyGeh5F////5uxOosAAABOdFJOUwAAAAAAAAAAAAAAB42OBn74f/mABn/5gAZ/+YAGBn/5+YAGf/n5gPmMhPX3iwR19nx29vh9BXb2+H0Edvb4fQUEdvb4fQUEdvb4fQWDiXvAvLMAAAABYktHRK0gYsIdAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6QQHDA0PucPkKwAAAURJREFUGNNjYAADRkZuHl5uRkYGJMDIyMcvICDIhywKFBMU8vMTEkYSZWIWERXzBwIxcREWVqg6ZglJqQAwkJKWYWGE6JWVkw8MCg4JCQ4NVFBUApkANE9ZJSw8IjIqOiY2Ll5VDWQu0A71hMSk5JTU1JS09IxMdaBtDNz8Qv5Z2Tm5efn5BYVFxZklQoLcDBoCfv5ZpWXlFZVV1TW1dZklfgI8DJpaQMH6hsam5pbWtvYOoKC2DoOunr5/VmdXd09ub19f/4TMEgEDPgZGXUOjhOyJkyZPmTpt+oziTGMTU6DtjLpm5jNnzZ4zd9782QsWWliaQhxqZW2zaPGSpcuWr1hpa2cP8T4jm4Oj06pVq1evWuXs4soODRIOTjd3jzX+/ms8vbzZuRBBp2uo7+cnYGKKGqC6eloCBqboQa/r4wsPYgAP5FJyLkQtQgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wNC0wN1QxMjoxMzoxMSswMDowMO6zX3EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDQtMDdUMTI6MTM6MTErMDA6MDCf7ufNAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA0LTA3VDEyOjEzOjE1KzAwOjAwPLTiAQAAAABJRU5ErkJggg=="
              alt="Logo"
              width={200}
              height={0}
              className="mr-2"
            />
          </a>

          <div className="hidden lg:flex items-center space-x-6">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>

          <div className="flex lg:hidden items-center space-x-4">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
