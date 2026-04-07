"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Bell, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "bn", name: "বাংলা (Bengali)" },
];

const notifications = [
  { id: 1, text: "New job near you", time: "5 minutes ago" },
  { id: 2, text: "Employer responded to your application", time: "1 hour ago" },
  { id: 3, text: "Application status updated", time: "2 hours ago" },
];

export function Header({ currentLanguage = "en", onLanguageChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#2EC4B6] flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span
            className="text-xl font-semibold text-[#1F2937]"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            कामConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { href: "/", label: "Home" },
            { href: "/job-seeker/jobs", label: "Find Jobs" },
            { href: "/how-it-works", label: "How It Works" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#1F2937] hover:text-[#3B5BDB] transition-colors relative group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3B5BDB] transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Globe className="h-5 w-5 text-[#6B7280]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageChange?.(lang.code)}
                  className={currentLanguage === lang.code ? "bg-[#EAF1FF] text-[#3B5BDB]" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex relative">
                <Bell className="h-5 w-5 text-[#6B7280]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
              </div>
              {notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-4 gap-1">
                  <span className="text-sm text-[#1F2937]">{notif.text}</span>
                  <span className="text-xs text-[#6B7280]">{notif.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 text-white border-0">
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6">
              <nav className="flex flex-col gap-6 mt-8">
                {[
                  { href: "/", label: "Home" },
                  { href: "/job-seeker/jobs", label: "Find Jobs" },
                  { href: "/how-it-works", label: "How It Works" },
                  { href: "/job-seeker/dashboard", label: "Worker Dashboard" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-lg text-[#1F2937] hover:text-[#3B5BDB] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <div className="border-t border-[#E5E7EB] pt-6 flex flex-col gap-3">
                  <Button asChild className="w-full bg-gradient-to-r from-[#3B5BDB] to-[#2EC4B6] hover:opacity-90 text-white border-0">
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
