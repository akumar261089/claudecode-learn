# /weather Command

A mock weather command that demonstrates parameter handling.

## Usage
```
/weather [city]
/weather [city] --units [celsius|fahrenheit]
/weather [city] --days [1-7]
```

## Parameters
- `city` (required): Name of the city to get weather for
- `--units`: Temperature units (celsius or fahrenheit)
- `--days`: Number of days for forecast (1-7, default: 3)

## Output
Displays a mock weather report with:
- Current temperature
- Weather condition (sunny, cloudy, rainy, etc.)
- Humidity percentage
- Wind speed
- Multi-day forecast (if days > 1)

## Example
```
User: /weather London --units celsius --days 3
Claude: 🌤️ Weather for London

       Current Conditions:
       Temperature: 15°C
       Condition: Partly Cloudy
       Humidity: 72%
       Wind: 12 km/h

       3-Day Forecast:
       Day 1: 16°C, Light Rain
       Day 2: 14°C, Cloudy
       Day 3: 18°C, Sunny
```

## Implementation
This is a mock command that demonstrates:
1. Required positional parameters (city)
2. Optional named parameters (--units, --days)
3. Default values
4. Conditional output based on parameters
5. Formatted response generation

Generate realistic but mock weather data based on the city name.
