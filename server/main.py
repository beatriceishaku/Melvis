from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI()


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


@app.post("/signup")
def create_user():
    #Going to write logic later
    return {"user created succesfully"}
    

@app.post("/login")
def login():
    return {"User logggeed in"}

    