import chromadb
from fastapi import FastAPI
from pydantic import BaseModel
import json
import requests
from sentence_transformers import SentenceTransformer
import os
from typing import Optional, List, Dict, Any

# Initialize ChromaDB client
db = chromadb.PersistentClient(path="./lead_data")
collection = db.get_or_create_collection(name="leads")

# Mock dataset
mock_leads = [
    {
        "company_name": "TechCorp",
        "industry": "Technology",
        "sponsorship_history": "Sponsored 3 tech events in 2024",
        "engagement_score": 85,
        "contact_status": "Interested",
        "actions": "Follow-up email scheduled"
    },
    {
        "company_name": "HealthPlus",
        "industry": "Healthcare",
        "sponsorship_history": "Sponsored medical conferences in 2023",
        "engagement_score": 78,
        "contact_status": "Pending Response",
        "actions": "Send proposal document"
    },
    {
        "company_name": "AutoDrive",
        "industry": "Automobile",
        "sponsorship_history": "Sponsored car expos in 2022 and 2023",
        "engagement_score": 92,
        "contact_status": "Highly Interested",
        "actions": "Arrange demo meeting"
    },
        {
        "company_name": "SportX",
        "industry": "Sports",
        "sponsorship_history": "Sponsored international sports events",
        "engagement_score": 87,
        "contact_status": "Engaged",
        "actions": "Plan event sponsorship strategy"
    },
    {
        "company_name": "LuxuryHomes",
        "industry": "Real Estate",
        "sponsorship_history": "Sponsored high-end property fairs",
        "engagement_score": 89,
        "contact_status": "Highly Interested",
        "actions": "Arrange a property showcase"
    },
    {
        "company_name": "MediaStream",
        "industry": "Entertainment",
        "sponsorship_history": "Sponsored online content creators",
        "engagement_score": 92,
        "contact_status": "Pending Response",
        "actions": "Negotiate influencer collaboration"
    },
    {
        "company_name": "AI Insights",
        "industry": "Artificial Intelligence",
        "sponsorship_history": "Sponsored AI summits worldwide",
        "engagement_score": 94,
        "contact_status": "Actively Engaged",
        "actions": "Finalize deal with R&D team"
    },
    {
        "company_name": "BuildTech",
        "industry": "Construction",
        "sponsorship_history": "Sponsored smart building expos",
        "engagement_score": 78,
        "contact_status": "Interested",
        "actions": "Schedule project feasibility meeting"
    },
    {
        "company_name": "GamerZone",
        "industry": "Gaming",
        "sponsorship_history": "Sponsored gaming tournaments in 2024",
        "engagement_score": 95,
        "contact_status": "Highly Interested",
        "actions": "Plan long-term sponsorship agreement"
    },
    {
        "company_name": "WearableX",
        "industry": "Fashion & Wearables",
        "sponsorship_history": "Sponsored global fashion weeks",
        "engagement_score": 81,
        "contact_status": "Pending Follow-Up",
        "actions": "Coordinate PR campaign launch"
    },
    {
        "company_name": "PetCare Co.",
        "industry": "Pet Industry",
        "sponsorship_history": "Sponsored pet adoption drives",
        "engagement_score": 84,
        "contact_status": "Open for Discussion",
        "actions": "Draft sponsorship agreement"
    },
    {
        "company_name": "SmartHome Inc.",
        "industry": "Home Automation",
        "sponsorship_history": "Sponsored IoT smart home expos",
        "engagement_score": 90,
        "contact_status": "Engaged",
        "actions": "Demonstration scheduled with stakeholders"
    },
    {
        "company_name": "LogiTech",
        "industry": "Logistics",
        "sponsorship_history": "Sponsored supply chain conferences",
        "engagement_score": 82,
        "contact_status": "Pending Review",
        "actions": "Send pitch deck for approval"
    },
    {
        "company_name": "EduBridge",
        "industry": "Education",
        "sponsorship_history": "Sponsored university career fairs",
        "engagement_score": 80,
        "contact_status": "In Talks",
        "actions": "Negotiate sponsorship package"
    }
]

# Add mock data to ChromaDB
for i, lead in enumerate(mock_leads):
    # ChromaDB expects string documents, not dictionaries
    collection.add(
        ids=[str(i)],  # Unique string ID
        documents=[json.dumps(lead)],  # Convert dict to JSON string
        metadatas=[{"source": "mock_data"}]
    )

# Initialize FastAPI app
app = FastAPI()

# Initialize the Sentence Transformer model (Hugging Face alternative)
# This will download the model on first run
model = SentenceTransformer('all-MiniLM-L6-v2')

# For Groq alternative (if you prefer API over local model)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

class EmbeddingProvider(BaseModel):
    name: str = "huggingface"  # Options: "huggingface" or "groq"

class LeadRequest(BaseModel):
    query: str
    provider: Optional[EmbeddingProvider] = None

async def get_embedding_huggingface(text: str) -> List[float]:
    """Get embedding using Hugging Face Sentence Transformers"""
    return model.encode(text).tolist()

async def get_embedding_groq(text: str) -> List[float]:
    """Get embedding using Groq API"""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable not set")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-8b-8192",  # Or another Groq model that supports embeddings
        "input": text,
        "task": "embeddings"
    }
    
    response = requests.post("https://api.groq.com/openai/v1/embeddings", 
                         headers=headers, 
                         json=payload)
    
    if response.status_code != 200:
        raise Exception(f"Error from Groq API: {response.text}")
    
    return response.json()["data"][0]["embedding"]

@app.post("/search_leads/")
async def search_leads(request: LeadRequest):
    """Search for leads based on semantic relevance."""
    provider = request.provider.name if request.provider else "huggingface"
    
    # Get embedding for the query using selected provider
    if provider == "huggingface":
        query_embedding = await get_embedding_huggingface(request.query)
    elif provider == "groq":
        query_embedding = await get_embedding_groq(request.query)
    else:
        raise ValueError(f"Unsupported embedding provider: {provider}")
    
    # Query the collection
    results = collection.query(
        query_embeddings=[query_embedding], 
        n_results=10
    )
    
    # Process results
    leads = []
    for i, doc_str in enumerate(results["documents"][0]):
        # Parse the JSON string back to dictionary
        doc = json.loads(doc_str)
        leads.append({
            "Company Name": doc["company_name"],
            "Industry": doc["industry"],
            "Sponsorship History": doc["sponsorship_history"],
            "Engagement Score": doc["engagement_score"],
            "Contact Status": doc["contact_status"],
            "Actions": doc["actions"]
        })
    
    return {"leads": leads}

@app.get("/embedding_providers/")
async def get_providers():
    """List available embedding providers"""
    return {
        "providers": [
            {
                "name": "huggingface",
                "description": "Local Sentence Transformer model (all-MiniLM-L6-v2)",
                "requires_api_key": False
            },
            {
                "name": "groq",
                "description": "Groq API (requires API key)",
                "requires_api_key": True
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)