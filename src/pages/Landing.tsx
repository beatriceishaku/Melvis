
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Always here when you need someone to talk to"
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are completely confidential"
    },
    {
      icon: Users,
      title: "Professional Care",
      description: "AI-powered guidance based on therapeutic principles"
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <motion.div
          className="max-w-7xl mx-auto flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-navy-800 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-navy-800 to-blue-600 bg-clip-text text-transparent">
              Melvis
            </h1>
          </motion.div>

          <motion.div
            className="flex gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              asChild
              variant="ghost"
              className="text-navy-700 hover:text-navy-800 hover:bg-white/80 rounded-xl px-6 transition-all duration-300"
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-navy-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <motion.div
              className="space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.h2
                className="text-5xl lg:text-6xl font-bold text-navy-800 leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your mental wellness,
                <span className="block bg-gradient-to-r from-blue-600 to-navy-700 bg-clip-text text-transparent">
                  reimagined
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-slate-600 max-w-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Experience compassionate AI-powered support that's available whenever you need it. 
                Take the first step towards better mental health today.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-navy-700 text-white rounded-2xl px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <Link to="/chat" className="flex items-center gap-2">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-navy-200 text-navy-700 hover:bg-navy-50 rounded-2xl px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                >
                  <Link to="/home">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-navy-600/20 rounded-3xl blur-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <img
                  src="/lovable-uploads/fcac89a9-f1cf-414d-9c8b-d1b0b8e7f22b.png"
                  alt="Mental wellness illustration"
                  className="relative w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-navy-800 mb-4">
              Why choose Melvis?
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the future of mental health support with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 + index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-navy-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-navy-800 mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-gradient-to-r from-navy-800 to-navy-900 text-white py-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg mb-2">© {new Date().getFullYear()} Melvis. All rights reserved.</p>
          <p className="text-slate-300">
            Empowering your mental wellness journey, one conversation at a time.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Landing;
