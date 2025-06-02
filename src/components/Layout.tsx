import React, { useState, useEffect } from "react";
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
import { Menu, LogOut, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, logout } from "@/utils/api";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

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
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="p-2 mt-4 rounded-md hover:bg-blue-200 justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
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
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <User className="h-4 w-4 mr-2" />
                    {user?.fullname || user?.email || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
          <p>© {new Date().getFullYear()} Melvis. All rights reserved.</p>
          <p>Taking care of your mental health, one step at a time.</p>
        </div>
      </footer>
    </div>
  );
}
