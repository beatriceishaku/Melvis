import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchGeminiResponse } from "@/utils/api";
import { YouTubeRecommendation } from "@/components/YouTubeRecommendation";
import { toast } from "@/components/ui/use-toast";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mic, MicOff, Square, Send, Sparkles } from "lucide-react";
import { detectIntent } from "@/utils/intents";
import { IntentChips } from "@/components/IntentChips";

const YOUTUBE_VIDEOS = [
  {
    title: "Mindful Breathing Meditation",
    youtubeId: "inpok4MKVLM"
  },
  {
    title: "Stress Relief Meditation",
    youtubeId: "z6X5oEIg6Ak"
  },
  {
    title: "Evening Relaxation",
    youtubeId: "aEqlQvczMVQ"
  }
];

export interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  videos?: typeof YOUTUBE_VIDEOS;
  intentName?: string;
}

// Remove this function as we'll use intents instead
// const containsVideoTrigger = (text: string) =>
//  /\bvideo(s)?\b/i.test(text);

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", content: "Hi! I'm here to help you with your mental health. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useSpeechToText();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg: ChatMessage = { sender: "user", content: input.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setChatLoading(true);

    try {
      // Use the authenticated API call that only uses intents
      const response = await fetchGeminiResponse({
        prompt: newMsg.content,
        previousMessages: messages.map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content
        }))
      });

      // Try to detect intent for additional features
      const intentResult = await detectIntent(newMsg.content);
      
      let botMessage: ChatMessage = {
        sender: "bot",
        content: response,
        intentName: intentResult?.intentName
      };

      // Add video recommendations for certain intents
      if (intentResult?.intentName === "video_recommendation" || 
          intentResult?.intentName === "meditation" ||
          /\b(video|meditation|relax)\b/i.test(newMsg.content)) {
        botMessage.videos = YOUTUBE_VIDEOS;
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chatbot error",
        description: err.response?.data?.detail || err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full bg-blue-50 min-h-[60vh] rounded-2xl shadow-md p-4 md:p-8 mt-4 flex flex-col">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800">Melvis AI Chat</h2>
        <div className="flex-1 overflow-auto space-y-4 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-xl px-4 py-2 max-w-[80%] ${
                  msg.sender === "bot"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-blue-700 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
                {msg.videos && (
                  <div className="mt-4">
                    <YouTubeRecommendation videos={msg.videos} />
                  </div>
                )}
                {msg.sender === "bot" && msg.intentName && (
                  <IntentChips intents={[msg.intentName]} />
                )}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 max-w-[80%] bg-blue-200 text-blue-800 animate-pulse">
                Typing...
              </div>
            </div>
          )}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 max-w-[80%] bg-blue-200 text-blue-800 animate-pulse">
                Processing speech...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-0 bg-gray-50 transition-all duration-300 pr-16"
                placeholder="Share your thoughts or ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={chatLoading || isRecording || isProcessing}
              />
              {(isRecording || isProcessing) && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                </div>
              )}
            </div>
            
            <Button
              type="button"
              onClick={handleMicClick}
              disabled={chatLoading || isProcessing}
              size="lg"
              className={`rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 active:scale-95 ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200" 
                  : "bg-gray-600 hover:bg-gray-700 shadow-lg shadow-gray-200"
              }`}
            >
              {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button 
              type="submit" 
              disabled={chatLoading || !input.trim() || isRecording || isProcessing}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl px-6 py-4 shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          
          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <span>Powered by Google Gemini • Intents: mental health, videos, help</span>
            <div className="flex items-center gap-2">
              {isRecording && (
                <span className="flex items-center gap-1 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording...
                </span>
              )}
              {isProcessing && (
                <span className="flex items-center gap-1 text-blue-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Processing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
