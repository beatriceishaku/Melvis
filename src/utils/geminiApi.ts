
export async function fetchGeminiResponse({
  prompt,
  apiKey,
}: {
  prompt: string;
  apiKey: string | null;
}): Promise<string> {
  if (!apiKey) throw new Error("Missing Gemini API key");
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!response.ok) throw new Error("Failed to get a response from Gemini API");
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't quite get that. Try again?";
}
