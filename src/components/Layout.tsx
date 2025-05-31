
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
import { Menu, LogOut, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Meditation", path: "/meditation" },
    { name: "Assessment", path: "/assessment" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white/95 backdrop-blur-lg border-0">
        <div className="flex flex-col mt-10 space-y-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-navy-800 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="text-2xl font-bold text-navy-800">Melvis</span>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-4 rounded-2xl transition-all duration-300 font-medium ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-500 to-navy-600 text-white shadow-lg"
                  : "hover:bg-blue-50 text-navy-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="p-4 mt-8 rounded-2xl hover:bg-red-50 text-red-600 font-medium flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNavigation = () => (
    <NavigationMenu>
      <NavigationMenuList className="space-x-2">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Link to={item.path}>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} rounded-xl px-6 py-2 font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <motion.header
        className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-blue-700 to-navy-800 shadow-xl backdrop-blur-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container flex h-20 items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <Link to="/home" className="text-3xl font-bold text-white">
              Melvis
            </Link>
          </motion.div>
          
          <div className="flex items-center gap-6">
            {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
            {!isMobile && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  asChild
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-white rounded-xl px-6 py-2 font-medium transition-all duration-300 backdrop-blur-sm"
                >
                  <Link to="/login" className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>
      
      <main className="flex-1 container py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
      
      <motion.footer
        className="bg-gradient-to-r from-navy-800 to-navy-900 py-8"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container flex flex-col items-center gap-3 text-center text-white">
          <p className="text-lg font-medium">© {new Date().getFullYear()} Melvis. All rights reserved.</p>
          <p className="text-slate-300">
            Empowering your mental wellness journey, one conversation at a time.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
