from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests 
from dotenv import load_dotenv
import sqlite3
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
# in server/main.py

load_dotenv() 

app = FastAPI()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


#jwt
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(minutes=30)




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



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)


class PromptRequest(BaseModel):
    prompt: str



GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

@app.get("/")
def index():
    return {"Welcome to Melvis"}

#def chat(request: PromptRequest):
    #response = get_response(request.prompt)#
   # if not response:
        #raise HTTPException(status_code=404, detail="No matching intent found")
   # return {"response": response}

@app.post("/api/chat")
def chat(request: PromptRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": request.prompt}]
        }]
    }

    try:
        response = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        return {"response": text or "No response from Gemini model"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
            raise HTTPException(status_code=404, detail="Invalid Credentials ")

    user_id, fullname, email, password = user

    if not pwd_context.verify(request.password, password):
            raise HTTPException(status_code=404, detail="Invalid Credentials ")



    token = jwt.encode({"email": email, "id": user_id}, SECRET_KEY, algorithm=JWT_ALGORITHM)


    return {"access_token": token, "token_type": "bearer"}



@app.get("/api/current-user")
def get_current_user(token:str = Depends(lambda request: request.cookies.get("access_token"))):

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")



@app.get("/get-users")
def get_users():
    pass 




    






    

