import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import StatusRow from './components/StatusRow';
import SoilHealth from './components/SoilHealth';
import CropHealth from './components/CropHealth';
import ActionList from './components/ActionList';
import BottomNav from './components/BottomNav';
import { fetchWeatherData } from './services/weatherService';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Default location (Nashik)
    const defaultLat = 19.9975;
    const defaultLon = 73.7898;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Got user location:", latitude, longitude);
          fetchWeatherData(latitude, longitude).then(setWeather);
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Fallback to default
          fetchWeatherData(defaultLat, defaultLon).then(setWeather);
        }
      );
    } else {
      fetchWeatherData(defaultLat, defaultLon).then(setWeather);
    }
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="content">
        <WeatherCard data={weather} />
        <StatusRow />
        <SoilHealth />
        <CropHealth />
        <ActionList />
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
