
export async function fetchGeminiResponse({
  prompt,
}: {
  prompt: string;
}): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) throw new Error("Failed to get a response from the chat API");
  const data = await response.json();
  return data.response || "Sorry, I couldn't quite get that. Try again?";
}
