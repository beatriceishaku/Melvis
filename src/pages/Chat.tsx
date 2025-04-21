import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { GeminiApiKeyInput, getGeminiApiKey } from "@/components/GeminiApiKeyInput";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface YouTubeVideo {
  title: string;
  url: string;
  thumbnail: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    text: "Hello! I'm your MindfulMe assistant. How are you feeling today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const YOUTUBE_VIDEOS: Record<string, YouTubeVideo[]> = {
  anxiety: [
    {
      title: "Anxiety Relief - Calm Your Anxiety in 10 Minutes",
      url: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
      thumbnail: "https://img.youtube.com/vi/O-6f5wQXSu8/hqdefault.jpg",
    },
    {
      title: "How to Manage Anxiety | Therapy Techniques",
      url: "https://www.youtube.com/watch?v=WWloIAQpMcQ",
      thumbnail: "https://img.youtube.com/vi/WWloIAQpMcQ/hqdefault.jpg",
    },
  ],
  depression: [
    {
      title: "Understanding Depression - Signs, Causes and Treatment",
      url: "https://www.youtube.com/watch?v=z6X5oEIg6Ak",
      thumbnail: "https://img.youtube.com/vi/z6X5oEIg6Ak/hqdefault.jpg",
    },
    {
      title: "How to Fight Depression - Strategies That Work",
      url: "https://www.youtube.com/watch?v=Sxddnugwu-8",
      thumbnail: "https://img.youtube.com/vi/Sxddnugwu-8/hqdefault.jpg",
    },
  ],
  sleep: [
    {
      title: "Fall Asleep in 10 Minutes - Guided Sleep Meditation",
      url: "https://www.youtube.com/watch?v=aEqlQvczMVQ",
      thumbnail: "https://img.youtube.com/vi/aEqlQvczMVQ/hqdefault.jpg",
    },
    {
      title: "How to Fix Your Sleep Schedule - Science-Based Tips",
      url: "https://www.youtube.com/watch?v=EiYm20F9WXU",
      thumbnail: "https://img.youtube.com/vi/EiYm20F9WXU/hqdefault.jpg",
    },
  ],
  mindfulness: [
    {
      title: "5-Minute Mindfulness Meditation",
      url: "https://www.youtube.com/watch?v=inpok4MKVLM",
      thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg",
    },
    {
      title: "The Science of Mindfulness",
      url: "https://www.youtube.com/watch?v=8GVwnxkWmSM",
      thumbnail: "https://img.youtube.com/vi/8GVwnxkWmSM/hqdefault.jpg",
    },
  ],
  stress: [
    {
      title: "How to Make Stress Your Friend",
      url: "https://www.youtube.com/watch?v=RcGyVTAoXEU",
      thumbnail: "https://img.youtube.com/vi/RcGyVTAoXEU/hqdefault.jpg",
    },
    {
      title: "Quick Stress Relief Techniques",
      url: "https://www.youtube.com/watch?v=ztTexqGQ0VI",
      thumbnail: "https://img.youtube.com/vi/ztTexqGQ0VI/hqdefault.jpg",
    },
  ],
};

const CHATBOT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! How are you feeling today?",
    "Hi there! How can I support your mental well-being today?",
    "Welcome! I'm here to help with your mental health questions.",
  ],
  anxiety: [
    "Anxiety can be challenging. Try taking slow, deep breaths when you feel anxious.",
    "When anxiety strikes, grounding techniques can help. Try naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    "Regular exercise can help reduce anxiety symptoms. Even a short walk can make a difference.",
  ],
  depression: [
    "Depression is difficult, but you're not alone. Small steps like getting outside for fresh air can help.",
    "Setting tiny achievable goals each day can help with depression. Even something as simple as making your bed counts as a win.",
    "Social connection is important when dealing with depression. Reaching out to just one person can make a difference.",
  ],
  sleep: [
    "For better sleep, try to maintain a consistent sleep schedule, even on weekends.",
    "Creating a relaxing bedtime routine signals to your body it's time to wind down.",
    "Limiting screen time before bed can improve your sleep quality significantly.",
  ],
  stress: [
    "When feeling stressed, try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8.",
    "Regular breaks throughout your day can help manage stress levels.",
    "Physical activity is one of the most effective stress relievers.",
  ],
  general: [
    "Taking care of your mental health is just as important as physical health.",
    "Remember to be kind to yourself. Self-compassion is key to mental wellness.",
    "Small positive changes can have a big impact on your mental well-being over time.",
    "Mindfulness practices can help bring your attention to the present moment.",
    "It's okay to not be okay sometimes. Recognizing your feelings is an important step.",
  ],
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [showVideos, setShowVideos] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState<YouTubeVideo[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getChatbotResponse = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes("hello") || lowercaseText.includes("hi") || lowercaseText.includes("hey")) {
      return getRandomResponse("greeting");
    } else if (lowercaseText.includes("anxiety") || lowercaseText.includes("anxious") || lowercaseText.includes("nervous")) {
      return getRandomResponse("anxiety");
    } else if (lowercaseText.includes("depress") || lowercaseText.includes("sad") || lowercaseText.includes("unhappy")) {
      return getRandomResponse("depression");
    } else if (lowercaseText.includes("sleep") || lowercaseText.includes("insomnia") || lowercaseText.includes("tired")) {
      return getRandomResponse("sleep");
    } else if (lowercaseText.includes("stress") || lowercaseText.includes("overwhelm") || lowercaseText.includes("pressure")) {
      return getRandomResponse("stress");
    } else {
      return getRandomResponse("general");
    }
  };

  const getRandomResponse = (type: string): string => {
    const responses = CHATBOT_RESPONSES[type] || CHATBOT_RESPONSES.general;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getRecommendedVideos = (text: string): YouTubeVideo[] => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes("anxiety") || lowercaseText.includes("anxious")) {
      return YOUTUBE_VIDEOS.anxiety;
    } else if (lowercaseText.includes("depress") || lowercaseText.includes("sad")) {
      return YOUTUBE_VIDEOS.depression;
    } else if (lowercaseText.includes("sleep") || lowercaseText.includes("insomnia")) {
      return YOUTUBE_VIDEOS.sleep;
    } else if (lowercaseText.includes("mindful") || lowercaseText.includes("meditation")) {
      return YOUTUBE_VIDEOS.mindfulness;
    } else if (lowercaseText.includes("stress") || lowercaseText.includes("overwhelm")) {
      return YOUTUBE_VIDEOS.stress;
    } else {
      // Combine all videos and select a random subset
      const allVideos = Object.values(YOUTUBE_VIDEOS).flat();
      return allVideos.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
  };

  const fetchGeminiResponse = async (userPrompt: string): Promise<string | null> => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return null;
    }
    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: userPrompt }]
          }]
        }),
      });
      if (!res.ok) {
        return `Error: Gemini API returned ${res.status}`;
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.candidates?.[0]?.content?.text;
      if (!text) return "Sorry, no response was generated.";
      return text;
    } catch (error: any) {
      return "Sorry, there was an error connecting to the Gemini API.";
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const lowercaseInput = inputValue.toLowerCase();
    if (lowercaseInput.includes("video") || lowercaseInput.includes("videos")) {
      const videos = getRecommendedVideos(lowercaseInput);
      setRecommendedVideos(videos);
      setShowVideos(true);

      setTimeout(() => {
        const botVideoResponse: Message = {
          id: Date.now().toString() + "-bot",
          text: `Here are some helpful videos about ${
            lowercaseInput.includes("anxiety") ? "anxiety" :
            lowercaseInput.includes("depress") ? "depression" :
            lowercaseInput.includes("sleep") ? "sleep" :
            lowercaseInput.includes("mindful") ? "mindfulness" :
            lowercaseInput.includes("stress") ? "stress management" :
            "mental wellness"
          }:`,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botVideoResponse]);
        setIsLoading(false);
      }, 1000);
    } else {
      setShowVideos(false);

      const apiKey = getGeminiApiKey();
      if (apiKey) {
        try {
          const responseText = await fetchGeminiResponse(inputValue);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "-bot",
              text: responseText || "Sorry, Gemini didn't respond.",
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        } catch (err: any) {
          toast.error("Error getting AI response: " + (err?.message || "unknown error"));
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "-bot",
              text: "Sorry, there was an error getting a response from Gemini.",
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }
        setIsLoading(false);
      } else {
        setTimeout(() => {
          const botResponse: Message = {
            id: Date.now().toString() + "-bot",
            text: getChatbotResponse(inputValue),
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botResponse]);
          toast("Set your Gemini API key above to use AI-generated answers!");
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Chat with MindfulMe AI</h1>
          <p className="text-blue-600">
            Share how you're feeling or ask for advice. Type "videos" along with your topic to get video recommendations.
          </p>
        </div>
        <GeminiApiKeyInput />
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-blue-700">Your Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4 pb-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <p>{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : "text-blue-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {showVideos && (
              <div className="flex justify-start">
                <div className="rounded-lg p-4 bg-blue-100 text-blue-800 max-w-[80%]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recommendedVideos.map((video, index) => (
                      <a
                        key={index}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:opacity-90 transition-opacity"
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full rounded-md"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-md">
                            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-blue-600 border-b-[6px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm font-medium">{video.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <div className="flex w-full gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleSendMessage();
                }}
                placeholder={isLoading ? "Waiting for Gemini..." : "Type your message..."}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
