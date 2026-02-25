import React from 'react';
import { CloudSun, Droplets, CloudRain, Wind } from 'lucide-react';
import './WeatherCard.css';

const WeatherCard = ({ data, t }) => {
    if (!data) return <div className="weather-card loading">{t('loading')}</div>;

    return (
        <div className="weather-card">
            <div className="weather-header">
                <span>{t('todays_weather')}</span>
                <CloudSun size={48} className="main-weather-icon" />
            </div>

            <div className="temp-section">
                <span className="temperature">{data.temp}°</span>
                <span className="unit">C</span>
            </div>

            <div className="condition">
                {data.condition} / {data.conditionLocal}
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>
                    {t('source')}: {data.source}
                </div>
            </div>

            <div className="weather-stats">
                <div className="stat-item">
                    <Droplets size={20} />
                    <span className="stat-value">{data.humidity}%</span>
                    <span className="stat-label">{t('humidity')}</span>
                </div>
                <div className="stat-item">
                    <CloudRain size={20} />
                    <span className="stat-value">{data.rainfall}mm</span>
                    <span className="stat-label">{t('rainfall')}</span>
                </div>
                <div className="stat-item">
                    <Wind size={20} />
                    <span className="stat-value">{data.windSpeed}</span>
                    <span className="stat-label">km/h</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
