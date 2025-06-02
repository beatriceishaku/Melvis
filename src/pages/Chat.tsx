import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchGeminiResponse } from "@/utils/api";
import { YouTubeRecommendation } from "@/components/YouTubeRecommendation";
import { toast } from "@/components/ui/use-toast";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mic, MicOff, Square } from "lucide-react";

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
}

const containsVideoTrigger = (text: string) =>
  /\bvideo(s)?\b/i.test(text);

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", content: "Hi! I'm here to help you with your mental health. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useSpeechToText();

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
    setLoading(true);

    let botMessage: ChatMessage;
    if (containsVideoTrigger(newMsg.content)) {
      botMessage = {
        sender: "bot",
        content: "Sure, here are some videos you might find helpful.",
        videos: YOUTUBE_VIDEOS,
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetchGeminiResponse({
        prompt: newMsg.content,
      });
      botMessage = { sender: "bot", content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chatbot error",
        description: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
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
                {msg.content}
                {msg.videos && <YouTubeRecommendation videos={msg.videos} />}
              </div>
            </div>
          ))}
          {loading && (
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
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            ref={inputRef}
            className="bg-white/80 border-blue-200 flex-1"
            placeholder="Type your message or use the microphone..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading || isRecording || isProcessing}
          />
          <Button
            type="button"
            onClick={handleMicClick}
            disabled={loading || isProcessing}
            className={`${
              isRecording 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button type="submit" disabled={loading || !input.trim() || isRecording || isProcessing} className="bg-blue-700 hover:bg-blue-800 text-white">
            Send
          </Button>
        </form>
        <div className="text-xs text-blue-600 mt-1 flex justify-between">
          <span>Powered by Google Gemini&nbsp;|&nbsp;Type "video" for recommendations</span>
          <span>
            {isRecording && "🎤 Recording..."}
            {isProcessing && "⏳ Processing..."}
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
