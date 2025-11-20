

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Shield, Clock, MessageCircle, Heart, Star } from "lucide-react";

const Landing = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-6 bg-white">
        <motion.div
          className="flex items-center gap-2 sm:gap-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Melvis</h1>
        </motion.div>
        <motion.div
          className="flex gap-2 sm:gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 rounded-full px-3 sm:px-6 text-sm sm:text-base"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 sm:px-6 shadow-sm transition-all duration-200 text-sm sm:text-base"
          >
            <Link to="/signup">Sign Up</Link>
          </Button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <motion.main 
        className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-16 lg:py-24"
        initial="hidden" 
        animate="visible" 
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
      >
        <div className="lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left max-w-xl w-full">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            whileHover={{ scale: 1.02 }}
          >
            Refresh your mind,
            <br />
            <span className="text-blue-600">one breath at a time</span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Meet Melvis, your AI-powered mental health companion. Get personalized support, 
            mindfulness resources, and professional guidance whenever you need it.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: 0.6 }}
          >
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg shadow-lg transition-all duration-200 hover:shadow-xl w-full sm:w-auto"
              asChild
            >
              <Link to="/signup">Start Your Journey</Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg transition-all duration-200 w-full sm:w-auto"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="lg:w-1/2 mt-8 sm:mt-12 lg:mt-0 flex items-center justify-center w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative w-full max-w-sm lg:max-w-none">
            <div className="w-full max-w-xs sm:max-w-sm lg:w-80 lg:h-96 h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 mx-auto">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">AI Chat Support</h3>
                  <p className="text-sm sm:text-base text-gray-600">24/7 personalized mental health guidance</p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-200 rounded-full"></div>
                    <div className="h-2 bg-blue-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Why Choose Melvis Section */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Melvis?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive mental health support designed with your wellbeing in mind
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Brain className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">AI-Powered Support</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Advanced AI understands your needs and provides personalized mental health guidance
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Private & Secure</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your conversations are completely private and encrypted for your peace of mind
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">24/7 Availability</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Access support whenever you need it, day or night, without appointments
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Services Section */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive mental health tools and resources at your fingertips
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <motion.div 
              className="p-4 sm:p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">AI Chat Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Intelligent conversations that understand your emotional needs
              </p>
            </motion.div>

            <motion.div 
              className="p-4 sm:p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Brain className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Mental Health Assessment</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Professional assessments to understand your mental health status
              </p>
            </motion.div>

            <motion.div 
              className="p-4 sm:p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Meditation & Mindfulness</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Guided meditation sessions and mindfulness exercises
              </p>
            </motion.div>

            <motion.div 
              className="p-4 sm:p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Star className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Resource Library</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Curated videos and articles for your mental wellbeing
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-blue-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of people who have found support and guidance with Melvis
          </p>
          <Button 
            className="bg-white text-blue-600 hover:bg-gray-100 rounded-full py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-lg transition-all duration-200"
            asChild
          >
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-blue-900 text-blue-100 py-6 sm:py-8 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-base sm:text-lg">© {new Date().getFullYear()} Melvis. All rights reserved.</p>
          <p className="mt-2 text-sm sm:text-base text-blue-200">Taking care of your mental health, one step at a time.</p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Landing;

