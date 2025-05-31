import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Meditation", path: "/meditation" },
    { name: "Assess Yourself", path: "/assessment" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-blue-100">
        <div className="flex flex-col mt-10 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-md ${
                isActive(item.path)
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="p-2 mt-4 rounded-md hover:bg-blue-200"
          >
            Logout
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNavigation = () => (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Link to={item.path}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={isActive(item.path)}
              >
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-blue-700 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <Link to="/home" className="text-2xl font-bold text-white">
              Melvis
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
            {!isMobile && (
              <Button variant="outline" asChild className="border-white text-white hover:bg-blue-800 hover:text-white">
                <Link to="/login">Logout</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 bg-blue-50 w-full">{children}</main>
      <footer className="border-t bg-blue-700 py-6">
        <div className="container flex flex-col items-center gap-2 text-center text-sm text-blue-100">
          <p>© {new Date().getFullYear()} Hopetherapy. All rights reserved.</p>
          <p>Taking care of your mental health, one step at a time.</p>
        </div>
      </footer>
    </div>
  );
}
