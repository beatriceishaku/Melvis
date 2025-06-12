import axios from 'axios';

const API = axios.create({
  baseURL: 'https://melvisai.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// Types
interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

// Chat API
export async function fetchGeminiResponse({
  prompt,
  sessionId,
}: {
  prompt: string;
  sessionId?: string;
}): Promise<ChatResponse> {
  try {
    const response = await API.post('/chat', { 
      prompt,
      session_id: sessionId 
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to get response from chat API');
  }
}

// Session Management
export const createSession = async (title?: string): Promise<{ session_id: string; title: string }> => {
  const response = await API.post('/sessions', { title: title || 'New Chat Session' });
  return response.data;
};

export const getSessions = async (): Promise<Session[]> => {
  const response = await API.get('/sessions');
  return response.data;
};

export const getSessionMessages = async (sessionId: string): Promise<Message[]> => {
  const response = await API.get(`/sessions/${sessionId}`);
  return response.data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await API.delete(`/sessions/${sessionId}`);
};

// Auth API
export const signup = async (userData: {
  fullname: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/signup', userData);
  return res.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/login', credentials);
  const { access_token } = res.data;
  localStorage.setItem('token', access_token);
  return res.data;
};

// Add token validation helper
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Basic token structure check (you can make this more sophisticated)
    const parts = token.split('.');
    return parts.length === 3;
  } catch {
    return false;
  }
};

// Add token refresh helper
export const checkAuthStatus = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    await getCurrentUser();
    return true;
  } catch {
    localStorage.removeItem('token');
    return false;
  }
};

export const getCurrentUser = async () => {
  const response = await API.get('/current-user');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
