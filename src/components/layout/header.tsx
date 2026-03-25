'use client';

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Phone, User, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase/provider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { useLanguage } from "@/context/language-context";
import { HeaderBookButton } from "./header-book-button";

export function Header() {
  const { t } = useLanguage();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is logged in via cookies
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardLink, setDashboardLink] = useState("/dashboard");

  useEffect(() => {
    // Check cookies on mount and when path changes
    const checkLoginStatus = () => {
      const adminToken = Cookies.get("admin_token");
      const userToken = Cookies.get("user_token");

      if (adminToken) {
        setIsLoggedIn(true);
        setDashboardLink("/admin/dashboard");
      } else if (userToken) {
        setIsLoggedIn(true);
        setDashboardLink("/dashboard");
      } else {
        setIsLoggedIn(false);
        setDashboardLink("/dashboard");
      }
    };

    checkLoginStatus();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("admin_token");
      Cookies.remove("user_token");
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/treatments", label: t("nav.treatments") },
    { href: "/about-us", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-headline font-bold text-primary tracking-tighter">Glow Studio</span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-2 border-l pl-6 ml-2">

            <a href="tel:+15147544499">
              <Button variant="default" className="uppercase tracking-wider rounded-full px-6 flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Phone className="h-4 w-4" />
                +1 514 754 4499
              </Button>
            </a>


            {isLoggedIn ? ( // Check login status
              <div className="flex items-center gap-2">
                <Link href={dashboardLink} className="flex items-center gap-2 text-primary font-medium px-4">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : null}

            <HeaderBookButton className="uppercase tracking-wider rounded-full px-6 bg-primary hover:bg-primary/90" />

            {!isLoggedIn && (
              <>
                <Link href="/signin">
                  <Button variant="outline" className="rounded-full px-6">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" className="rounded-full px-6 bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="flex flex-col h-full">
              <div className="flex-1 mt-10 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium transition-colors hover:text-primary uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>


              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 pb-4 border-b mb-4">
                {isLoggedIn ? (
                  <>
                    <Link href={dashboardLink}>
                      <Button variant="outline" className="w-full rounded-full flex items-center justify-center gap-2">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={handleLogout} className="w-full rounded-full flex items-center justify-center gap-2 text-muted-foreground">
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/signin">
                      <Button variant="outline" className="w-full rounded-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="pb-8 space-y-2">
                <a href="tel:+15147544499">
                  <Button className="w-full uppercase tracking-wider rounded-full flex items-center gap-2 bg-primary hover:bg-primary/90">
                    <Phone className="h-4 w-4" />
                    +1 514 754 4499
                  </Button>
                </a>
                <HeaderBookButton className="w-full uppercase tracking-wider rounded-full bg-primary hover:bg-primary/90" />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
