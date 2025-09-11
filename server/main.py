import os
import logging
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

# Import our logic functions
from chatbot2 import get_bot_response
from recommendations import get_crop_recommendations
from analysis import get_weather_analysis

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Pydantic Models ---

# Models for Chatbot
class ChatRequest(BaseModel):
    message: str
    location: str

class ChatResponse(BaseModel):
    reply: str

# Models for Crop Recommendation
class LocationRequest(BaseModel):
    district: str
    state: Optional[str] = None

class CropData(BaseModel):
    name: str
    reason: str
    favorability: str

class CropRecommendationResponse(BaseModel):
    favorable: List[CropData]
    unfavorable: List[CropData]

# Models for Weather Analysis
class WeatherAnalysisRequest(BaseModel):
    location: str
    crop: str

class CurrentWeather(BaseModel):
    temperature: float
    humidity: float
    rainfall: float
    windSpeed: int
    condition: str

class ForecastDay(BaseModel):
    day: str
    temp: float
    rain: float
    condition: str

class Insight(BaseModel):
    type: str
    message: str
    action: str

class WeatherAnalysisResponse(BaseModel):
    currentWeather: CurrentWeather
    forecast: List[ForecastDay]
    insights: List[Insight]

# --- FastAPI Application ---
app = FastAPI(title="CropWeather AI API")

# CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/")
def home():
    return {"message": "Server is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Endpoint to handle chatbot conversations."""
    try:
        reply = await run_in_threadpool(
            get_bot_response, user_query=request.message, location=request.location
        )
        return ChatResponse(reply=reply)
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your chat request.")

@app.post("/api/crop-recommendations", response_model=CropRecommendationResponse)
async def crop_recommendations(request: LocationRequest):
    """Endpoint to get crop recommendations for a location."""
    try:
        recommendations = await run_in_threadpool(
            get_crop_recommendations, district=request.district, state=request.state
        )
        return CropRecommendationResponse(**recommendations)
    except Exception as e:
        logger.error(f"Crop recommendation endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching crop recommendations.")

@app.post("/api/weather-analysis", response_model=WeatherAnalysisResponse)
async def weather_analysis(request: WeatherAnalysisRequest):
    """Endpoint for the main weather analysis dashboard."""
    try:
        analysis_data = await run_in_threadpool(
            get_weather_analysis, location=request.location, crop=request.crop
        )
        return WeatherAnalysisResponse(**analysis_data)
    except Exception as e:
        logger.error(f"Weather analysis endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the weather analysis.")


if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info", reload=True)