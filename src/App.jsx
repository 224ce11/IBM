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
import { fetchWeatherData } from './services/weatherService';
import { translations } from './translations';
import './App.css';

import { fetchSoilData } from './services/soilService';

function App() {
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('Home');

  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang(prev => prev === 'en' ? 'gu' : 'en');

  useEffect(() => {
    // Default location (Nashik)
    const defaultLat = 19.9975;
    const defaultLon = 73.7898;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Got user location:", latitude, longitude);
          fetchWeatherData(latitude, longitude).then((data) => {
            console.log("✅ Live Weather Data Recieved:", data);
            setWeather(data);
          });
          fetchSoilData(latitude, longitude).then(setSoil);
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Fallback to default
          fetchWeatherData(defaultLat, defaultLon).then((data) => {
            console.log("⚠️ Using Default Location Data:", data);
            setWeather({
              ...data,
              locationName: `${data.locationName} (Default)`
            });
          });
        }
      );
    } else {
      fetchWeatherData(defaultLat, defaultLon).then((data) => {
        console.log("⚠️ Geolocation not supported, used default:", data);
        setWeather({
          ...data,
          locationName: `${data.locationName} (GPS Unsupported)`
        });
      });
    }
  }, []);

  return (
    <div className="container">
      <Header location={weather?.locationName} t={t} toggleLang={toggleLang} />
      <div className="content">
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
    </div>
  );
}

export default App;
