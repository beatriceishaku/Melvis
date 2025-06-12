from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
import sqlite3
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional, List
import json
import uuid

load_dotenv() 

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(minutes=30)

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

DB_FILE = "melvis.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    
    # Chat sessions table
    cursor.execute("""CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )""")
    
    # Messages table
    cursor.execute("""CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        sender TEXT CHECK(sender IN ('user', 'bot')),
        content TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
    )""")
    
    conn.commit()
    conn.close()

init_db()

# Mental Health System Prompt
MENTAL_HEALTH_PROMPT = """You are Melvis, a compassionate and professional AI mental health assistant. Your role is to:

1. Provide emotional support and active listening
2. Offer evidence-based coping strategies and techniques
3. Help users identify their emotions and thoughts
4. Suggest mindfulness and relaxation exercises
5. Provide psychoeducation about mental health topics
6. Encourage professional help when appropriate

Guidelines:
- Always be empathetic, non-judgmental, and supportive
- Use person-first language
- Validate the user's feelings and experiences
- Offer practical, actionable advice
- If the user expresses suicidal thoughts or severe crisis, encourage immediate professional help
- Keep responses conversational but professional
- Remember the context of previous messages in this session
- Avoid asterix* in your responses, and mark down symbols; format response in a very nice way also use numbers if you want to list something

Remember: You are not a replacement for professional therapy, but a supportive companion for mental wellness.

User message: """

class User(BaseModel):
    fullname: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str = None
    id: int = None

class LoginRequest(BaseModel):
    email: str
    password: str

class PromptRequest(BaseModel):
    prompt: str
    session_id: Optional[str] = None

class SessionCreate(BaseModel):
    title: Optional[str] = "New Chat Session"

class Message(BaseModel):
    id: int
    sender: str
    content: str
    timestamp: str

class ChatSession(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[Message] = []

origins = [
    "http://localhost:8080",
    "https://melvis-ai.vercel.app",

]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.replace("Bearer ", "")
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_session_context(session_id: str, limit: int = 10) -> str:
    """Get recent conversation context for the session"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT sender, content FROM messages 
        WHERE session_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
    """, (session_id, limit))
    
    messages = cursor.fetchall()
    conn.close()
    
    if not messages:
        return ""
    
    # Reverse to get chronological order
    messages = messages[::-1]
    
    context = "Previous conversation context:\n"
    for sender, content in messages:
        context += f"{sender.capitalize()}: {content}\n"
    
    return context + "\nCurrent conversation continues below:\n"

@app.get("/")
def index():
    return {"message": "Welcome to Melvis - Your Mental Health AI Assistant"}

@app.post("/api/chat")
def chat(request: PromptRequest, current_user: dict = Depends(get_current_user)):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    user_id = current_user["id"]
    session_id = request.session_id
    
    # If no session_id provided, create a new session
    if not session_id:
        session_id = str(uuid.uuid4())
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Generate a title from the first message (first 30 chars)
        title = request.prompt[:30] + "..." if len(request.prompt) > 30 else request.prompt
        
        cursor.execute("""
            INSERT INTO chat_sessions (id, user_id, title) 
            VALUES (?, ?, ?)
        """, (session_id, user_id, title))
        conn.commit()
        conn.close()
    
    # Save user message
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO messages (session_id, sender, content) 
        VALUES (?, ?, ?)
    """, (session_id, "user", request.prompt))
    conn.commit()
    conn.close()

    try:
        # Get conversation context
        context = get_session_context(session_id, limit=8)  # Get last 8 messages for context
        
        # Create the full prompt with context
        full_prompt = MENTAL_HEALTH_PROMPT + "\n\n"
        if context:
            full_prompt += context + "\n"
        full_prompt += f"User: {request.prompt}"
        
        # Generate response using Gemini 2.0 Flash
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        response = model.generate_content(full_prompt)
        bot_response = response.text
        
        # Save bot response
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO messages (session_id, sender, content) 
            VALUES (?, ?, ?)
        """, (session_id, "bot", bot_response))
        
        # Update session timestamp
        cursor.execute("""
            UPDATE chat_sessions 
            SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (session_id,))
        
        conn.commit()
        conn.close()
        
        return {
            "response": bot_response,
            "session_id": session_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/api/sessions")
def create_session(session_data: SessionCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    session_id = str(uuid.uuid4())
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO chat_sessions (id, user_id, title) 
        VALUES (?, ?, ?)
    """, (session_id, user_id, session_data.title))
    conn.commit()
    conn.close()
    
    return {"session_id": session_id, "title": session_data.title}

@app.get("/api/sessions")
def get_user_sessions(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, created_at, updated_at 
        FROM chat_sessions 
        WHERE user_id = ? 
        ORDER BY updated_at DESC
    """, (user_id,))
    sessions = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": session[0],
            "title": session[1],
            "created_at": session[2],
            "updated_at": session[3]
        }
        for session in sessions
    ]

@app.get("/api/sessions/{session_id}")
def get_session_messages(session_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Verify session belongs to user
    cursor.execute("""
        SELECT id FROM chat_sessions 
        WHERE id = ? AND user_id = ?
    """, (session_id, user_id))
    
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get messages
    cursor.execute("""
        SELECT id, sender, content, timestamp 
        FROM messages 
        WHERE session_id = ? 
        ORDER BY timestamp ASC
    """, (session_id,))
    
    messages = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": msg[0],
            "sender": msg[1],
            "content": msg[2],
            "timestamp": msg[3]
        }
        for msg in messages
    ]

@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Verify session belongs to user
    cursor.execute("""
        SELECT id FROM chat_sessions 
        WHERE id = ? AND user_id = ?
    """, (session_id, user_id))
    
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Delete messages first (foreign key constraint)
    cursor.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
    
    # Delete session
    cursor.execute("DELETE FROM chat_sessions WHERE id = ?", (session_id,))
    
    conn.commit()
    conn.close()
    
    return {"message": "Session deleted successfully"}

@app.post("/api/signup")
def signup(user: User):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    hashed_password = pwd_context.hash(user.password)

    try:
        cursor.execute("""INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)""", 
                      (user.fullname, user.email, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
    finally:
        conn.close()

    return {"message": "User created successfully"}

@app.post("/api/login")
def login(request: LoginRequest):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (request.email,))
    user = cursor.fetchone()
    conn.close()

    if user is None:
        raise HTTPException(status_code=404, detail="Invalid Credentials")

    user_id, fullname, email, password, created_at = user

    if not pwd_context.verify(request.password, password):
        raise HTTPException(status_code=404, detail="Invalid Credentials")

    token = jwt.encode({"email": email, "id": user_id}, SECRET_KEY, algorithm=JWT_ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/current-user")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT fullname FROM users WHERE id = ?", (user_id,))
    fullname = cursor.fetchone()
    conn.close()

    if fullname is None:
        raise HTTPException(status_code=404, detail="User not found in database")

    return {"fullname": fullname[0]}
