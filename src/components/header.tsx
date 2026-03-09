"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/#check", label: "駐車場を判定" },
  { href: "/", label: "車種一覧" },
  { href: "/area", label: "エリア" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Compare Park</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">メニューを開く</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>
                <span className="text-primary">Compare Park</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 px-4">
              {navLinks.map((link) => (
                <SheetClose key={link.href} render={<span />}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
