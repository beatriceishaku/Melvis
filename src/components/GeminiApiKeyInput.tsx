
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export function getGeminiApiKey(): string | null {
  return localStorage.getItem("geminiApiKey");
}

export function setGeminiApiKey(key: string) {
  localStorage.setItem("geminiApiKey", key);
}

export function GeminiApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    setSavedKey(localStorage.getItem("geminiApiKey"));
  }, []);

  const handleSave = () => {
    if (apiKey.trim().length < 10) {
      toast.error("Please enter a valid Gemini API key.");
      return;
    }
    setGeminiApiKey(apiKey.trim());
    setSavedKey(apiKey.trim());
    setApiKey("");
    toast.success("Gemini API key saved!");
  };

  const handleRemove = () => {
    localStorage.removeItem("geminiApiKey");
    setSavedKey(null);
    toast("Gemini API key removed.");
  };

  return (
    <div className="flex flex-col gap-2 items-start mb-4">
      {savedKey ? (
        <div className="flex items-center gap-2">
          <span className="text-green-700 font-medium">Gemini API key is set.</span>
          <Button size="sm" variant="destructive" onClick={handleRemove}>Remove</Button>
        </div>
      ) : (
        <>
          <label className="text-blue-700 text-sm">Enter your Gemini API key to enable AI-powered chat:</label>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              type="password"
              className="flex-1"
            />
            <Button size="sm" onClick={handleSave}>Save Key</Button>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 underline"
          >
            Get your Gemini API key &rarr;
          </a>
        </>
      )}
    </div>
  );
}
