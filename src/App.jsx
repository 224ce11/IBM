import React, { useEffect, useState } from 'react';
import WeatherDetailView from './views/WeatherDetailView';
import SoilDetailView from './views/SoilDetailView';
import AlertsView from './views/AlertsView';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import StatusRow from './components/StatusRow';
import SoilHealth from './components/SoilHealth';
import CropHealth from './components/CropHealth';
import ActionList from './components/ActionList';
import BottomNav from './components/BottomNav';
import { fetchWeatherData, fetchCoordinates } from './services/weatherService';
import { translations } from './translations';
import './App.css';
import { fetchSoilData } from './services/soilService';
import { AlertCircle } from 'lucide-react';
import InstallPrompt from './components/InstallPrompt';


function App() {
  const [weather, setWeather] = useState(() => {
    const saved = localStorage.getItem('lastWeather');
    return saved ? JSON.parse(saved) : null;
  });
  const [soil, setSoil] = useState(() => {
    const saved = localStorage.getItem('lastSoil');
    return saved ? JSON.parse(saved) : null;
  });
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'en');
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoading, setIsLoading] = useState(false);

  const t = (key) => translations[lang][key] || key;

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'gu' : 'en';
    setLang(newLang);
    localStorage.setItem('appLang', newLang);
  };

  const handleSearch = async (city) => {
    try {
      setIsLoading(true);
      console.log("Searching for:", city);
      const coords = await fetchCoordinates(city);

      const weatherData = await fetchWeatherData(coords.lat, coords.lon);
      weatherData.locationName = `${coords.name}, ${coords.country}`;
      setWeather(weatherData);
      localStorage.setItem('lastWeather', JSON.stringify(weatherData));

      const soilData = await fetchSoilData(coords.lat, coords.lon);
      setSoil(soilData);
      localStorage.setItem('lastSoil', JSON.stringify(soilData));

      // Save coordinates for auto-refresh
      localStorage.setItem('lastCoords', JSON.stringify({ lat: coords.lat, lon: coords.lon }));
    } catch (error) {
      console.error("Search failed:", error);
      alert("Location not found or API error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we have saved coordinates, refresh them
    const savedCoords = localStorage.getItem('lastCoords');
    if (savedCoords) {
      const { lat, lon } = JSON.parse(savedCoords);
      fetchWeatherData(lat, lon).then(setWeather);
      fetchSoilData(lat, lon).then(setSoil);
      return;
    }

    // Default location (Nashik)
    const defaultLat = 19.9975;
    const defaultLon = 73.7898;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude).then((data) => {
            setWeather(data);
            localStorage.setItem('lastWeather', JSON.stringify(data));
          });
          fetchSoilData(latitude, longitude).then((data) => {
            setSoil(data);
            localStorage.setItem('lastSoil', JSON.stringify(data));
          });
          localStorage.setItem('lastCoords', JSON.stringify({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.log("Geolocation error:", error);
          if (!weather) { // Only fallback if no saved data
            fetchWeatherData(defaultLat, defaultLon).then(setWeather);
            fetchSoilData(defaultLat, defaultLon).then(setSoil);
          }
        }
      );
    } else if (!weather) {
      fetchWeatherData(defaultLat, defaultLon).then(setWeather);
      fetchSoilData(defaultLat, defaultLon).then(setSoil);
    }
  }, []);

  return (
    <div className="container" style={{ opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.3s' }}>
      <Header
        location={isLoading ? "Updating..." : weather?.locationName}
        t={t}
        toggleLang={toggleLang}
        onSearch={handleSearch}
      />
      <div className="content">
        {weather?.source === 'Mock Data' && (
          <div className="demo-banner">
            <AlertCircle size={16} />
            <span>{t('api_limit_warning')}</span>
          </div>
        )}
        {isLoading && <div className="loading-spinner"></div>}
        {activeTab === 'Weather' ? (
          <WeatherDetailView weather={weather} t={t} />
        ) : activeTab === 'Soil' ? (
          <SoilDetailView soilData={soil} t={t} />
        ) : activeTab === 'Alerts' ? (
          <AlertsView weather={weather} t={t} />
        ) : (
          <>
            <WeatherCard data={weather} t={t} />
            <StatusRow t={t} />
            <SoilHealth t={t} soilData={soil} />
            <CropHealth t={t} />
            <ActionList t={t} />
          </>
        )}
      </div>
      <BottomNav t={t} activeTab={activeTab} setActiveTab={setActiveTab} />
      <InstallPrompt t={t} />
    </div>
  );
}

export default App;
