import { Link } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../../../public/logo.png";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex min-h-[10vh] w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-foreground">
          <img src={logo} alt="CarbonEase logo" width={160} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/calculator"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
          >
            Calculator
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
          >
            Contact Us
          </Link>
          <Link
            to="/blog"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
          >
            Blog
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Admin Panel
            </Link>
          )}
          {user?.role === "user" && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button
                onClick={logoutUser}
                className="bg-brandMainColor text-white hover:bg-brandMainColor/90 focus-visible:ring-brandMainColor"
              >
                Logout <LogOut size={16} className="ml-2" />
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-brandMainColor text-white hover:bg-brandMainColor/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden rounded-md p-2 hover:bg-muted">
              <Menu size={22} />
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-4 p-6">
              <Link
                to="/"
                onClick={closeSheet}
                className="text-xl font-bold text-foreground"
              >
                <img src={logo} alt="CarbonEase logo" width={140} />
              </Link>
              <Link
                to="/calculator"
                onClick={closeSheet}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
              >
                Calculator
              </Link>
              <Link
                to="/about"
                onClick={closeSheet}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={closeSheet}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
              >
                Contact Us
              </Link>
              <Link
                to="/blog"
                onClick={closeSheet}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
              >
                Blog
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeSheet}
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Admin Panel
                </Link>
              )}
              {user?.role === "user" && (
                <Link
                  to="/dashboard"
                  onClick={closeSheet}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-brandMainColor"
                >
                  Dashboard
                </Link>
              )}
              <div className="mt-2 border-t border-border pt-4">
                {user ? (
                  <Button
                    onClick={() => {
                      logoutUser();
                      closeSheet();
                    }}
                    className="w-full bg-brandMainColor text-white hover:bg-brandMainColor/90 focus-visible:ring-brandMainColor"
                  >
                    Logout <LogOut size={16} className="ml-2" />
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={closeSheet}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeSheet}>
                      <Button className="w-full bg-brandMainColor text-white hover:bg-brandMainColor/90">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
