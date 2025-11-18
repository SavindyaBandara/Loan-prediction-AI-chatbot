from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY") 

if not GROQ_API_KEY:
    raise ValueError("API key not found. Check your .env file.")

client = Groq(api_key=GROQ_API_KEY)
# models = client.models.list()
# print(models)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

session_active = True

@app.post("/ask")
async def ask_question(q: Question):
    global session_active

    if q.question.lower() != "thank you":
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": q.question}],
            max_tokens=50,
            temperature=0.3
        )
        answer = response.choices[0].message.content
        return {"user": q.question, "answer": answer}  # Return both user question and AI answer
    else:
        session_active = False
        return {"user": q.question, "answer": "Happy to help you! Bye.."}

# while True:
#     question = input("Human : ")
#     if question != "thank you":
#         response = client.chat.completions.create(
#             model="llama-3.1-8b-instant",
#             messages=[{"role": "user", "content": question}],
#             max_tokens=50,
#             temperature =0.3
#         )
#         for choice in response.choices:
#             print(f"AI :  {choice.message.content}")
#     else:
#         print("Happy to help you! Bye..")
#         break

