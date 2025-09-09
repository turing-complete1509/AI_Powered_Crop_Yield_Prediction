import requests

API_KEY = "a817d955063af5f2fc40f78f2b68bc3e" 

def fetch_weather(location: str):
    """Fetch weather info from OpenWeatherMap"""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()

    temperature = data['main']['temp']
    humidity = data['main']['humidity']
    rainfall = data.get('rain', {}).get('24h', 0)  

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
