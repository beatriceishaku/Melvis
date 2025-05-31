
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Brain, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  const cards = [
    {
      icon: MessageCircle,
      title: "Chat with Melvis",
      description: "Start a meaningful conversation with our AI companion. Get personalized support and guidance whenever you need it.",
      link: "/chat",
      buttonText: "Start Chatting",
      gradient: "from-blue-500 to-blue-600",
      primary: true
    },
    {
      icon: Brain,
      title: "Morning Meditation",
      description: "Begin your day with guided mindfulness sessions designed to reduce stress and increase mental clarity.",
      link: "/meditation",
      buttonText: "Begin Session",
      gradient: "from-navy-600 to-navy-700"
    },
    {
      icon: CheckCircle,
      title: "Wellness Assessment",
      description: "Take our comprehensive assessment to receive personalized insights about your mental health journey.",
      link: "/assessment",
      buttonText: "Take Assessment",
      gradient: "from-slate-600 to-slate-700"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-6 py-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-navy-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-navy-800 to-blue-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Welcome back to Melvis
          </motion.h1>
          
          <motion.p
            className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Your personal mental wellness companion is here to support you. 
            Choose how you'd like to start your journey today.
          </motion.p>
        </motion.div>
        
        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className={`h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden ${card.primary ? 'ring-2 ring-blue-200' : ''}`}>
                <CardHeader className="pb-4">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <card.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl text-navy-800 font-bold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {card.description}
                  </p>
                  <Button
                    asChild
                    className={`w-full ${card.primary 
                      ? 'bg-gradient-to-r from-blue-600 to-navy-700 hover:from-blue-700 hover:to-navy-800' 
                      : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
                    } text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
                  >
                    <Link to={card.link} className="flex items-center justify-center gap-2">
                      {card.buttonText}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-navy-800 text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <motion.div
                className="flex flex-col md:flex-row items-center justify-between gap-8"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-bold">Need immediate support?</h3>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Our AI assistant is available 24/7 to provide you with compassionate, 
                    confidential support whenever you need it most.
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-navy-800 hover:bg-blue-50 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link to="/chat" className="flex items-center gap-2">
                      Talk Now
                      <MessageCircle className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Daily Tip */}
        <motion.div
          className="text-center space-y-6 py-8"
          variants={itemVariants}
        >
          <motion.div
            className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Today's Wellness Insight</h2>
            <p className="text-lg text-slate-700 italic leading-relaxed">
              "Remember that progress isn't always linear. Take a moment today to practice self-compassion 
              and acknowledge how far you've come on your mental health journey."
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Home;
