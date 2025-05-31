import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <header className="flex justify-between items-center px-6 py-4 bg-blue-50 shadow-md">
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900">Melvis</h1>
        </motion.div>
        <motion.div
          className="flex gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            asChild
            variant="outline"
            className="text-blue-800 border-blue-700 rounded-full py-2 px-4 transition-transform hover:scale-105"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-700 text-white rounded-full py-2 px-6 shadow-lg transition-transform hover:scale-105"
          >
            <Link to="/signup">Sign Up</Link>
          </Button>
        </motion.div>
      </header>

      <motion.main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-16" initial="hidden" animate="visible" variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}>
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-blue-900"
            whileHover={{ scale: 1.02 }}
          >
            Refresh your mind,
            <br /> one breath at a time
          </motion.h2>
          <motion.p
            className="text-lg text-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Empower your mental wellness with AI-driven guidance and support.
          </motion.p>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
            <Button className="bg-blue-700 text-white rounded-full py-3 px-8 shadow-md hover:bg-blue-800 transition-all">
              <Link to="/chat">Start Chatting</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="md:w-1/2 mt-10 md:mt-0 flex items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <img
            src="/lovable-uploads/fcac89a9-f1cf-414d-9c8b-d1b0b8e7f22b.png"
            alt="Person feeling refreshed"
            className="w-full max-w-xs md:max-w-sm rounded-2xl shadow-2xl"
          />
        </motion.div>
      </motion.main>

      <motion.footer
        className="bg-blue-900 text-blue-100 py-6 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© {new Date().getFullYear()} Melvis. All rights reserved.</p>
        <p className="mt-2">Taking care of your mental health, one step at a time.</p>
      </motion.footer>
    </motion.div>
  );
};

export default Landing;
