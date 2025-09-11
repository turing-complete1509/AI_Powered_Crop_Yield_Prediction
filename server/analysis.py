import random
from typing import Dict, Any, List

# Import our existing logic modules
from weather import fetch_weather
from chatbot2 import query_openrouter

def get_weather_analysis(location: str, crop: str) -> Dict[str, Any]:
    """
    Generates a weather analysis dashboard including current weather,
    a simulated forecast, and AI-powered insights.
    """
    try:
        # 1. Fetch REAL current weather data
        current_weather_doc, current_weather_meta = fetch_weather(location)
        current_weather = {
            "temperature": float(current_weather_meta.get("temperature", 0)),
            "humidity": float(current_weather_meta.get("humidity", 0)),
            "rainfall": float(current_weather_meta.get("rainfall", 0)),
            # Placeholder values for wind and condition
            "windSpeed": random.randint(5, 15),
            "condition": "Partly Cloudy",
        }

        # 2. Simulate a 7-day forecast based on current weather
        # (A real application would use a dedicated forecast API)
        forecast = []
        for i in range(7):
            day_temp = current_weather["temperature"] + random.uniform(-3, 3)
            day_rain = max(0, current_weather["rainfall"] + random.uniform(-2, 5) if i > 0 else current_weather["rainfall"])
            conditions = ["sunny", "partly-cloudy", "cloudy", "light-rain", "rain"]
            day_condition = random.choice(conditions)
            
            day_name = "Today" if i == 0 else f"Day {i + 1}"

            forecast.append({
                "day": day_name,
                "temp": round(day_temp, 1),
                "rain": round(day_rain, 1),
                "condition": day_condition,
            })

        # 3. Use the LLM to generate AI-powered insights
        system_prompt = """You are a farming expert. Based on the provided weather data for a specific crop and location, generate exactly 3 brief, actionable insights. For each insight, you MUST provide a 'type' (warning, info, or success), a 'message', and a recommended 'action'. Format your response as a simple list of sentences, one insight per line, like this:
        type: [type], message: [message], action: [action]
        type: [type], message: [message], action: [action]
        type: [type], message: [message], action: [action]"""

        user_prompt = f"""Here is the weather data for {location}, where I am growing {crop}:
        Current Weather: Temperature {current_weather['temperature']}°C, Humidity {current_weather['humidity']}%.
        7-Day Forecast: Temperatures will range from {min([d['temp'] for d in forecast]):.1f}°C to {max([d['temp'] for d in forecast]):.1f}°C. Total expected rainfall over the next week is {sum([d['rain'] for d in forecast]):.1f}mm.

        Based on this, provide 3 actionable insights for my {crop} crop."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        response = query_openrouter(messages)
        raw_insights = response["choices"][0]["message"]["content"]

        # 4. Parse the LLM's text response into structured data
        insights = []
        for line in raw_insights.strip().split('\n'):
            line = line.strip()
            if not line:
                continue
            
            try:
                # Simple parsing logic for "type: ..., message: ..., action: ..."
                parts = [p.strip() for p in line.split(',')]
                insight_type = parts[0].split(':')[1].strip()
                insight_message = parts[1].split(':')[1].strip()
                insight_action = parts[2].split(':')[1].strip()

                if insight_type in ["warning", "info", "success"]:
                    insights.append({
                        "type": insight_type,
                        "message": insight_message,
                        "action": insight_action
                    })
            except IndexError:
                # If parsing fails, skip this line
                print(f"Could not parse insight line: {line}")

        # Ensure we always have at least one placeholder insight if parsing fails
        if not insights:
            insights.append({
                "type": "info",
                "message": "Weather conditions are stable.",
                "action": "Continue with your current farming schedule."
            })

        # 5. Assemble the final response object
        return {
            "currentWeather": current_weather,
            "forecast": forecast,
            "insights": insights[:3] # Ensure we only return 3 insights
        }

    except Exception as e:
        print(f"Error getting weather analysis: {e}")
        # Return a default error structure
        return {
            "currentWeather": {"temperature": 0, "humidity": 0, "rainfall": 0, "windSpeed": 0, "condition": "Error"},
            "forecast": [],
            "insights": [{"type": "warning", "message": "Could not fetch weather data.", "action": "Please try again later."}]
        }