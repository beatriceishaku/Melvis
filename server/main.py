from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import sqlite3
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from intent import get_response, INTENTS, get_intent_and_response  # Import the enhanced intent functionality

load_dotenv() 

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(hours=24)




DB_FILE = "melvis.db"

def init_db():

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS users (
    
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL)""")
    conn.commit()
    conn.close()


init_db()

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
    previousMessages: list = []

class IntentRequest(BaseModel):
    message: str

# Authentication dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("email")
        user_id: int = payload.get("id")
        if email is None or user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return {"email": email, "id": user_id}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def index():
    return {"Welcome to Melvis"}

@app.post("/api/intent")
def process_intent(request: IntentRequest, current_user: dict = Depends(get_current_user)):
    # Use the enhanced intent detection function
    intent, response = get_intent_and_response(request.message)
    
    if not response:
        return {"response": "I'm not sure how to help with that. Could you try asking something else?", "intentName": "no-response"}
        
    # Return the intent tag and response
    if intent:
        return {"response": response, "intentName": intent.get('tag', 'unknown')}
                
    return {"response": response, "intentName": "general_response"}

@app.post("/api/chat")
def chat(request: PromptRequest, current_user: dict = Depends(get_current_user)):
    # Only use intent detection - no Gemini fallback
    intent, intent_response = get_intent_and_response(request.prompt)
    
    # If we have an intent match, return it
    if intent_response:
        return {
            "response": intent_response,
            "intentName": intent.get('tag') if intent else "general_response"
        }
    
    # If no intent matches, return a helpful fallback message
    return {
        "response": "I'm not sure how to help with that. You can ask me about movies, greetings, how I'm doing, or other topics I'm familiar with!",
        "intentName": "no-response"
    }


@app.post("/api/signup")
def signup(user: User):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    hashed_password = pwd_context.hash(user.password)

    try:
        cursor.execute("""INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)""", (user.fullname, user.email, hashed_password))
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
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id, fullname, email, password = user

    if not pwd_context.verify(request.password, password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create token with longer expiration
    token_data = {"email": email, "id": user_id, "exp": datetime.utcnow() + JWT_EXPIRATION_DELTA}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=JWT_ALGORITHM)

    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {"id": user_id, "email": email, "fullname": fullname}
    }

@app.get("/api/current-user")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    # Get user details from database
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, fullname, email FROM users WHERE id = ?", (current_user["id"],))
    user = cursor.fetchone()
    conn.close()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id, fullname, email = user
    return {"id": user_id, "email": email, "fullname": fullname}



@app.get("/get-users")
def get_users():
    pass 




    






    

