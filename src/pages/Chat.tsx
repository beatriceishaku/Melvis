import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchGeminiResponse, getSessions, getSessionMessages, createSession, deleteSession, checkAuthStatus } from "@/utils/api";
import { YouTubeRecommendation } from "@/components/YouTubeRecommendation";
import { toast } from "@/components/ui/use-toast";
import { Mic, MicOff, Plus, MessageSquare, Trash2, History } from "lucide-react";

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
  id?: number;
  sender: "user" | "bot";
  content: string;
  timestamp?: string;
  videos?: typeof YOUTUBE_VIDEOS;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const containsVideoTrigger = (text: string) =>
  /\bvideo(s)?\b/i.test(text);

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessions, setShowSessions] = useState(true); // Changed to true
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            variant: "destructive",
            title: "Speech Recognition Error",
            description: "Could not recognize speech. Please try again.",
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Load sessions on component mount and check auth
  useEffect(() => {
    const initializeChat = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to use the chat feature.",
        });
        // Redirect to login or handle auth state
        return;
      }
      loadSessions();
    };
    
    initializeChat();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSessions = async () => {
    try {
      const userSessions = await getSessions();
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const startNewSession = async () => {
    try {
      setMessages([
        { sender: "bot", content: "Hi! I'm Melvis, your mental health AI assistant. I'm here to listen and support you. How are you feeling today?" }
      ]);
      setCurrentSessionId(null);
      setShowSessions(true); // Keep open on new session
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start new session",
      });
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      setLoading(true);
      const sessionMessages = await getSessionMessages(sessionId);
      
      const formattedMessages: ChatMessage[] = sessionMessages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      setMessages(formattedMessages);
      setCurrentSessionId(sessionId);
      setShowSessions(true); // Keep open when loading session
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load session",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        startNewSession();
      }
      
      toast({
        title: "Session deleted",
        description: "Chat session has been deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete session",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check authentication before proceeding
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in again to continue chatting.",
      });
      return;
    }

    const newMsg: ChatMessage = { sender: "user", content: input.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    // Check for video trigger
    if (containsVideoTrigger(newMsg.content)) {
      const botMessage: ChatMessage = {
        sender: "bot",
        content: "Sure, here are some mental health and relaxation videos you might find helpful:",
        videos: YOUTUBE_VIDEOS,
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetchGeminiResponse({
        prompt: newMsg.content,
        sessionId: currentSessionId || undefined,
      });

      const botMessage: ChatMessage = { 
        sender: "bot", 
        content: response.response 
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      // Update current session ID if it's a new session
      if (!currentSessionId && response.session_id) {
        setCurrentSessionId(response.session_id);
        loadSessions(); // Refresh sessions list
      }
      
    } catch (err: any) {
      console.error('Chat error:', err);
      
      // Handle specific auth errors
      if (err.message.includes('401') || err.message.includes('token') || err.message.includes('auth')) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
        });
        localStorage.removeItem('token');
      } else {
        toast({
          variant: "destructive",
          title: "Chat Error",
          description: err.message || "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!speechSupported) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          variant: "destructive",
          title: "Microphone Error",
          description: "Could not access microphone. Please check permissions.",
        });
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Initialize with welcome message if no current session
  useEffect(() => {
    if (messages.length === 0 && !currentSessionId) {
      setMessages([
        { sender: "bot", content: "Hi! I'm Melvis, your mental health AI assistant. I'm here to listen and support you. How are you feeling today?" }
      ]);
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full flex gap-4 mt-4">
        {/* Sessions Sidebar */}
        <div className={`${showSessions ? 'w-80' : 'w-12'} transition-all duration-300 bg-white rounded-2xl shadow-md flex flex-col`}>
          <div className="p-4 border-b">
            <Button
              onClick={() => setShowSessions(!showSessions)}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <History className="h-4 w-4" />
              {showSessions && <span className="ml-2">Chat History</span>}
            </Button>
          </div>
          
          {showSessions && (
            <>
              <div className="p-4">
                <Button
                  onClick={startNewSession}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group ${
                      currentSessionId === session.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                    onClick={() => loadSession(session.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No chat sessions yet. Start a new conversation!
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-blue-50 min-h-[60vh] rounded-2xl shadow-md p-4 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">Melvis AI Chat</h2>
            <div className="text-sm text-blue-600">
              {currentSessionId ? 'Active Session' : 'New Session'}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto space-y-4 pb-4 max-h-[500px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-xl px-4 py-2 max-w-[80%] ${
                    msg.sender === "bot"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-blue-700 text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.videos && <YouTubeRecommendation videos={msg.videos} />}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-4 py-2 max-w-[80%] bg-blue-200 text-blue-800 animate-pulse">
                  Melvis is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                className="bg-white/80 border-blue-200 pr-12"
                placeholder={isListening ? "Listening..." : "Share what's on your mind..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading || isListening}
              />
              <Button
                type="button"
                onClick={toggleListening}
                disabled={loading}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8 ${
                  isListening 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              </Button>
            </div>
            <Button type="submit" disabled={loading || !input.trim()} className="bg-blue-700 hover:bg-blue-800 text-white">
              Send
            </Button>
          </form>
          <div className="text-xs text-blue-600 mt-1 text-center">
            🧠 Powered by Gemini 2.0 Flash | Mental Health AI Assistant
            {speechSupported && <span> | 🎤 Click mic to speak</span>}
            <br />
            💡 Type "video" for relaxation recommendations
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
