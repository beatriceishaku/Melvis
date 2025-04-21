
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-1">
        <header className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-blue-800">Hopetherapy</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="text-blue-800 border-blue-700">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-blue-700 text-white hover:bg-blue-800">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 py-12">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
              Refresh your mind, one breath at a time
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center justify-center">
            <img
              src="/lovable-uploads/fcac89a9-f1cf-414d-9c8b-d1b0b8e7f22b.png"
              alt="Person feeling refreshed"
              style={{ borderRadius: "1rem", background: "#b8daf8", maxWidth: "360px", boxShadow: "0 0 40px 0 #b8daf8" }}
              className="w-full max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </div>

      <footer className="bg-blue-700 py-6">
        <div className="container mx-auto px-4 text-center text-blue-100">
          <p>© {new Date().getFullYear()} Hopetherapy. All rights reserved.</p>
          <p className="mt-2">Taking care of your mental health, one step at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
