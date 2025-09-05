from huggingface_hub import InferenceClient
client = InferenceClient("mistralai/Mistral-7B-Instruct-v0.2" #, 
                         #token="YOUR API TOKEN"
                         )
user_query = input("Ask your farming question: ")
messages = [
    {"role": "system", "content": "You are a helpful farming assistant."},
    {"role": "user", "content": user_query}
]
response = client.chat_completion(messages, max_tokens=300)
print("Assistant:", response.choices[0].message["content"])
