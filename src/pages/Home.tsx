
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Welcome to MindfulMe</h1>
          <p className="text-xl text-blue-600">Your personal mental wellness companion</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-700">Chat with MindfulMe AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-600">
                Talk about your feelings, get advice, or simply have a comforting conversation with our supportive AI.
              </p>
              <Button asChild className="w-full">
                <Link to="/chat">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-700">Morning Meditation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-600">
                Start your day with peaceful guided meditation sessions to center your mind and reduce anxiety.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/meditation">Begin Meditation</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-700">Self Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-600">
                Take our mental wellness assessment to get personalized insights about your current state.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/assessment">Take Assessment</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Feeling overwhelmed?</h3>
                <p>Our AI assistant is available 24/7 to help you through difficult moments.</p>
              </div>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/chat">Talk Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-blue-700">Daily Wellness Tip</h2>
          <p className="text-lg text-blue-600 italic">
            "Take a moment today to practice gratitude. Write down three things you're thankful for to shift your focus to the positive aspects of your life."
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
