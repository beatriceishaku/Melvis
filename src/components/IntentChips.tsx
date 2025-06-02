import React from "react";

interface IntentChipsProps {
  intents: string[];
}

export const IntentChips: React.FC<IntentChipsProps> = ({ intents }) => {
  if (!intents.length) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {intents.map((intent, index) => (
        <div
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {intent.replace(/_/g, ' ')}
        </div>
      ))}
    </div>
  );
};
