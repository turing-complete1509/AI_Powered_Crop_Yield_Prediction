# chatbot2.py
import os
from dotenv import load_dotenv
import requests
import time
from vector_db import query_db

# Load environment variables from .env file
load_dotenv()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
# Securely get the API key from the environment
API_KEY = os.getenv("OPENROUTER_API_KEY")

# Check if the key was loaded
if not API_KEY:
    raise ValueError("OpenRouter API key not found. Make sure it's set in your .env file.")

# Note: In a production server, memory should be managed per-user (e.g., in a database or cache).
# A simple global list like this is not suitable for concurrent users.
memory = []

def query_openrouter(messages, model="deepseek/deepseek-chat-v3-0324:free"):
    """Sends a request to the OpenRouter API and returns the response."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": 500,
        "temperature": 0.7,
    }
    
    retries = 3
    for i in range(retries):
        try:
            response = requests.post(API_URL, headers=headers, json=payload)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            if response.status_code == 429:
                wait_time = 2 ** i  
                print(f"⚠️ Rate limit hit. Waiting {wait_time} sec before retry...")
                time.sleep(wait_time)
                continue
            else:
                print(f"❌ An error occurred: {e}")
                raise
    raise Exception("❌ Failed after multiple retries.")

def get_bot_response(user_query: str, location: str) -> str:
    """
    Gets a response from the farming assistant RAG pipeline.
    """
    global memory

    # 1. Retrieve context from the vector database
    docs, metadata = query_db(user_query, location=location, n_results=2)
    context = "\n".join(docs)
    
    # 2. Construct the prompts
    system_prompt = """You are a helpful farming assistant.
    Provide accurate, practical advice based on the knowledge base.
    Consider the user's location and specific needs.
    Always respond in the SAME language as the user's question."""

    user_prompt = f"""Question: {user_query}

    Location: {location}

    Knowledge Base:
    {context}

    Please provide a detailed, helpful answer:"""

    # 3. Build the message history
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(memory) 
    messages.append({"role": "user", "content": user_prompt})

    # 4. Query the LLM
    try:
        response = query_openrouter(messages)
        assistant_reply = response["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error querying LLM: {e}")
        assistant_reply = "I'm sorry, I encountered an error trying to generate a response. Please try again."

    # 5. Update and manage memory
    memory.append({"role": "user", "content": user_prompt}) # Storing the full prompt for better context
    memory.append({"role": "assistant", "content": assistant_reply})
    if len(memory) > 10:  # Keep memory to the last 5 conversation turns (10 messages)
        memory = memory[-10:]
        
    # 6. Return the final response
    return assistant_reply