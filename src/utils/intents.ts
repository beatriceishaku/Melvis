import { ChatMessage } from "@/pages/Chat";
import API from "./api";

export interface Intent {
  name: string;
  patterns: RegExp[];
  handler: (message: string) => Promise<ChatMessage>;
}

interface ServerIntentResponse {
  response: string;
  intentName?: string;
}

// Function to detect intent from user message using server
export const detectIntent = async (message: string): Promise<ChatMessage & { intentName?: string } | null> => {
  try {
    const response = await fetch('/api/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      // If server intent detection fails, fallback to client-side intents
      return detectClientIntent(message);
    }

    const data = await response.json() as ServerIntentResponse;
    
    if (!data.response) {
      return null;
    }

    return {
      sender: "bot",
      content: data.response,
      intentName: data.intentName || "server_intent"
    };
  } catch (error) {
    console.error("Error with server intent detection:", error);
    // Fallback to client-side intents
    return detectClientIntent(message);
  }
};

// Video recommendations intent
export const videoIntent: Intent = {
  name: "video_recommendation",
  patterns: [/\bvideo(s)?\b/i, /\bwatch\b/i, /\brecommend(ation)?s?\b/i],
  handler: async (message: string) => {
    return {
      sender: "bot",
      content: "Here are some videos you might find helpful for relaxation and mindfulness.",
      videos: [
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
      ]
    };
  }
};

// Greeting intent
export const greetingIntent: Intent = {
  name: "greeting",
  patterns: [
    /^(hi|hello|hey|greetings|howdy|hola)/i,
    /^good\s(morning|afternoon|evening)/i
  ],
  handler: async (message: string) => {
    return {
      sender: "bot",
      content: "Hello! I'm Melvis, your mental health companion. How are you feeling today?"
    };
  }
};

// Feeling intent
export const feelingIntent: Intent = {
  name: "feeling",
  patterns: [
    /\bfeel(ing)?\s(sad|down|depressed|anxious|stressed|worried|overwhelmed)\b/i,
    /\b(sad|down|depressed|anxious|stressed|worried|overwhelmed)\b/i,
    /\bnot\s(good|great|well|okay|ok)\b/i
  ],
  handler: async (message: string) => {
    // Check if message contains negative emotions
    const negativeEmotions = [
      "sad", "down", "depressed", "anxious", 
      "stressed", "worried", "overwhelmed"
    ];
    
    const hasNegativeEmotion = negativeEmotions.some(emotion => 
      message.toLowerCase().includes(emotion)
    );
    
    if (hasNegativeEmotion) {
      return {
        sender: "bot",
        content: "I'm sorry to hear you're feeling that way. Remember that it's okay to feel this way, and these feelings are temporary. Would you like to try a quick breathing exercise or listen to some calming music to help you feel better?"
      };
    } else {
      return {
        sender: "bot",
        content: "How are those feelings affecting you? I'm here to listen and support you."
      };
    }
  }
};

// Help intent
export const helpIntent: Intent = {
  name: "help",
  patterns: [
    /\bhelp\b/i,
    /\bwhat can you do\b/i,
    /\bhow (do|can) (I|you|we)\b/i
  ],
  handler: async (message: string) => {
    return {
      sender: "bot",
      content: "I'm Melvis, your mental health companion. I can:\n- Listen and respond to how you're feeling\n- Recommend meditation videos (just ask for a video)\n- Provide coping strategies for anxiety and stress\n- Guide you through breathing exercises\n\nFeel free to share how you're feeling or ask for specific help!"
    };
  }
};

// Breathing exercise intent
export const breathingIntent: Intent = {
  name: "breathing_exercise",
  patterns: [
    /\bbreath(ing|e)\b/i,
    /\bcalm(ing)?\b/i,
    /\brelax(ation|ing)?\b/i
  ],
  handler: async (message: string) => {
    return {
      sender: "bot",
      content: "Let's try a simple breathing exercise:\n\n1. Find a comfortable position\n2. Breathe in slowly through your nose for 4 counts\n3. Hold your breath for 2 counts\n4. Exhale slowly through your mouth for 6 counts\n5. Repeat 5 times\n\nHow do you feel after trying this?"
    };
  }
};

// Thank you intent
export const thankYouIntent: Intent = {
  name: "thank_you",
  patterns: [
    /\b(thank(s)?|thx)\b/i,
    /\bappreciate\b/i
  ],
  handler: async (message: string) => {
    return {
      sender: "bot",
      content: "You're welcome! I'm here anytime you need someone to talk to. Is there anything else I can help you with today?"
    };
  }
};

// Export all intents
export const clientIntents: Intent[] = [
  videoIntent,
  greetingIntent,
  feelingIntent,
  helpIntent,
  breathingIntent,
  thankYouIntent
];

// Client-side intent detection as fallback
export const detectClientIntent = async (message: string): Promise<ChatMessage & { intentName?: string } | null> => {
  for (const intent of clientIntents) {
    const matchesIntent = intent.patterns.some(pattern => pattern.test(message));
    if (matchesIntent) {
      const response = await intent.handler(message);
      return {
        ...response,
        intentName: intent.name
      };
    }
  }
  return null; // No intent matched
};
