import axios from 'axios';

export async function fetchGeminiResponse({
  prompt,
  previousMessages = []
}: {
  prompt: string;
  previousMessages?: Array<{ role: string; content: string }>;
}): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt,
      previousMessages
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get a response from the chat API');
  }

  const data = await response.json();
  return data.response || "Sorry, I couldn't quite get that. Try again?";
}


const API = axios.create({
  baseURL: ' http://127.0.0.1:8000/api',
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

interface AuthResponse {
  token: string;
  user: any; 
}

export const signup = async (userData: any): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/signup', userData);
  const { token } = res.data;
  localStorage.setItem('token', token);
  return res.data;
};

export const login = async (credentials: any): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/login', credentials);
  const { token } = res.data;
  localStorage.setItem('token', token);
  return res.data;
};
