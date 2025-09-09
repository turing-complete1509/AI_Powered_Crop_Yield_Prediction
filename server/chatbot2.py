import requests
import time
from build_db import docs
API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = "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" 
memory = []
def query_openrouter(messages, model="deepseek/deepseek-chat-v3-0324:free"):
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
        response = requests.post(API_URL, headers=headers, json=payload)

        if response.status_code == 429:
            wait_time = 2 ** i  
            print(f"⚠️ Rate limit hit. Waiting {wait_time} sec before retry...")
            time.sleep(wait_time)
            continue
        response.raise_for_status()
        return response.json()
    raise Exception("❌ Failed after multiple retries (rate limit).")
def query_db(query, location=None, n_results=2):
    docs = [
        f"Farming tip for {location}: ensure timely irrigation.",
        "Use disease-resistant crop varieties for better yield."
    ]
    metadata = {}
    return docs[:n_results], metadata

location = input("Please enter your district to get personalized answers: ")
while True:
    user_query = input("Ask your farming question: ")
    docs, metadata = query_db(user_query, location=location, n_results=2)
    context = "\n".join(docs)    
    system_prompt = """You are a helpful farming assistant.
    Provide accurate, practical advice based on the knowledge base.
    Consider the user's location and specific needs.
    Always respond in the SAME language as the user's question"""
    user_prompt = f"""Question: {user_query}

    Location: {location}

    Knowledge Base:
    {context}

    Please provide a detailed, helpful answer:"""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(memory) 
    messages.append({"role": "user", "content": user_prompt})


    response = query_openrouter(messages)

    assistant_reply = response["choices"][0]["message"]["content"]

    print("🔎 Retrieved from DB:\n", context)
    print("\n👨‍🌾 Assistant:", assistant_reply)

    memory.append({"role": "user", "content": user_prompt})
    memory.append({"role": "assistant", "content": assistant_reply})
    if len(memory) > 10:  
        memory = memory[-10:]
        time.sleep(2)