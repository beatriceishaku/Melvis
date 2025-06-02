import React from "react";

interface IntentChipsProps {
  intents: string[];
}

export const IntentChips: React.FC<IntentChipsProps> = ({ intents }) => {
  if (!intents.length) return null;
  
  // Get a color for each intent
  const getColorClass = (intent: string) => {
    const colors = {
      greeting: "bg-green-100 text-green-800",
      feeling: "bg-pink-100 text-pink-800",
      help: "bg-purple-100 text-purple-800",
      breathing_exercise: "bg-indigo-100 text-indigo-800",
      thank_you: "bg-yellow-100 text-yellow-800",
      video_recommendation: "bg-red-100 text-red-800",
      server_intent: "bg-teal-100 text-teal-800",
    };
    
    // Fallback color
    return colors[intent as keyof typeof colors] || "bg-blue-100 text-blue-800";
  };
  
  // Get a nice display name for the intent
  const getDisplayName = (intent: string) => {
    return intent
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {intents.map((intent, index) => (
        <div
          key={index}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getColorClass(intent)}`}
        >
          {getDisplayName(intent)}
        </div>
      ))}
    </div>
  );
};
