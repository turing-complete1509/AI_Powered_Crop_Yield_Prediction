import os
from dotenv import load_dotenv
import requests

# Load environment variables from .env file for local development
load_dotenv() 

# Get the API key securely from the environment
API_KEY = os.getenv("WEATHER_API_KEY") 
if not API_KEY:
    raise ValueError("OpenWeatherMap API key not found. Make sure it's set as an environment variable named WEATHER_API_KEY.")

def fetch_weather(location: str):
    """Fetch weather info from OpenWeatherMap"""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    # This will raise an exception if the request fails (e.g., bad API key, bad location)
    response.raise_for_status() 
    data = response.json()

    temperature = data['main']['temp']
    humidity = data['main']['humidity']
    # Use .get() for safer access in case 'rain' key doesn't exist
    rainfall = data.get('rain', {}).get('1h', 0)  

    weather_doc = (
        f"Weather update for {location}: "
        f"Temperature {temperature}°C | Humidity {humidity}% | Rainfall {rainfall} mm"
    )
    weather_meta = {
        "location": location,
        "temperature": str(temperature),
        "humidity": str(humidity),
        "rainfall": str(rainfall)
    }
    
    return weather_doc, weather_meta