import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Add authorization header to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function fetchGeminiResponse({
  prompt,
  previousMessages = []
}: {
  prompt: string;
  previousMessages?: Array<{ role: string; content: string }>;
}): Promise<string> {
  const response = await API.post('/chat', { 
    prompt,
    previousMessages
  });

  return response.data.response || "Sorry, I couldn't quite get that. Try again?";
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    fullname: string;
  };
}

export const signup = async (userData: any): Promise<{ message: string }> => {
  const res = await API.post('/signup', userData);
  return res.data;
};

export const login = async (credentials: any): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/login', credentials);
  const token = res.data.access_token;
  localStorage.setItem('token', token);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get('/current-user');
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default API;
