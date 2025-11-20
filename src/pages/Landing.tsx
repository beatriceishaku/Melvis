import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-gray-900">Melvis</h1>
        <p className="text-2xl text-gray-600">Your AI Mental Health Companion</p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
