
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-1">
        <header className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-blue-700">MindfulMe</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 py-12">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800">
              A Fresh Approach to Mental Wellness
            </h2>
            <p className="text-xl text-blue-600">
              Your journey to a healthier mind starts here. Discover tools for
              meditation, self-assessment, and personalized support.
            </p>
            <Button size="lg" asChild className="mt-6">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843"
              alt="Mental wellness representation"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        <div className="py-12">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-12">
            Why Choose MindfulMe?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">
                  Guided Meditation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">
                  Start your day with calming guided meditation sessions
                  designed to center your mind and prepare you for the day ahead.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Self Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">
                  Understand your mental health better with our scientifically
                  designed self-assessment tools that provide personalized
                  insights.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">AI Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">
                  Chat with our supportive AI assistant that provides resources,
                  recommendations, and a listening ear whenever you need it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-blue-100 py-6">
        <div className="container mx-auto px-4 text-center text-blue-600">
          <p>© {new Date().getFullYear()} MindfulMe. All rights reserved.</p>
          <p className="mt-2">Taking care of your mental health, one step at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
