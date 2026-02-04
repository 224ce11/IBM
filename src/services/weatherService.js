import axios from 'axios';

// Access keys from .env file (Vite prefix is required)
const KEYS = {
    OPEN_WEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
    WEATHER_API: import.meta.env.VITE_WEATHERAPI_KEY,
    STORM_GLASS: import.meta.env.VITE_STORMGLASS_API_KEY
};

// Fallback logic to get distinct icon names that map to our UI (optional)
const getIcon = (condition) => {
    const c = condition.toLowerCase();
    if (c.includes('rain')) return 'cloud-rain';
    if (c.includes('cloud')) return 'cloud';
    if (c.includes('sun') || c.includes('clear')) return 'sun';
    return 'sun-cloud'; // default
};

// 1. OpenWeatherMap Implementation
const fetchOpenWeather = async (lat, lon) => {
    if (!KEYS.OPEN_WEATHER || KEYS.OPEN_WEATHER.includes('your_')) throw new Error('No OpenWeather Key');

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEYS.OPEN_WEATHER}`;
    const res = await axios.get(url);
    const data = res.data;

    return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        conditionLocal: data.weather[0].description, // Localize if needed via API lang param
        humidity: data.main.humidity,
        rainfall: data.rain ? data.rain['1h'] || 0 : 0, // OM gives rain in last 1h or 3h
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        source: 'OpenWeather'
    };
};

// 2. WeatherAPI Implementation
const fetchWeatherAPI = async (lat, lon) => {
    if (!KEYS.WEATHER_API || KEYS.WEATHER_API.includes('your_')) throw new Error('No WeatherAPI Key');

    const url = `https://api.weatherapi.com/v1/current.json?key=${KEYS.WEATHER_API}&q=${lat},${lon}`;
    const res = await axios.get(url);
    const data = res.data;

    return {
        temp: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        conditionLocal: data.current.condition.text,
        humidity: data.current.humidity,
        rainfall: data.current.precip_mm,
        windSpeed: Math.round(data.current.wind_kph),
        source: 'WeatherAPI'
    };
};

// 3. StormGlass Implementation (More complex, requires header)
const fetchStormGlass = async (lat, lon) => {
    if (!KEYS.STORM_GLASS || KEYS.STORM_GLASS.includes('your_')) throw new Error('No StormGlass Key');

    const params = 'airTemperature,humidity,precipitation,windSpeed';
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=${params}`;

    const res = await axios.get(url, {
        headers: { 'Authorization': KEYS.STORM_GLASS }
    });

    // StormGlass returns hours list. Get current hour.
    const current = res.data.hours[0];

    return {
        temp: Math.round(current.airTemperature.sg),
        condition: 'StormGlass Data', // SG doesn't give simple text condition easily
        conditionLocal: 'Detailed Metrics',
        humidity: Math.round(current.humidity.sg),
        rainfall: current.precipitation.sg,
        windSpeed: Math.round(current.windSpeed.sg * 3.6),
        source: 'StormGlass'
    };
};

// Main Fetch Function with Fallback Strategy
export const fetchWeatherData = async (lat, lon) => {
    console.log(`Fetching weather for ${lat}, ${lon}...`);

    try {
        // Priority 1: OpenWeatherMap
        return await fetchOpenWeather(lat, lon);
    } catch (err1) {
        console.warn('OpenWeather failed, trying WeatherAPI...', err1.message);
        try {
            // Priority 2: WeatherAPI
            return await fetchWeatherAPI(lat, lon);
        } catch (err2) {
            console.warn('WeatherAPI failed, trying StormGlass...', err2.message);
            try {
                // Priority 3: StormGlass
                return await fetchStormGlass(lat, lon);
            } catch (err3) {
                console.error('All APIs failed. Returning mock data.', err3.message);

                // Final Fallback: Mock Data (so app doesn't break)
                return {
                    temp: 32,
                    condition: 'Partly Cloudy',
                    conditionLocal: 'API Unavailable',
                    humidity: 65,
                    rainfall: 2,
                    windSpeed: 12,
                    source: 'Mock Data'
                };
            }
        }
    }
};
