import React from 'react';
import WeatherCard from '../components/WeatherCard';
import { Droplet, Thermometer, Wind, Eye, Gauge, CloudRain } from 'lucide-react';
import '../components/CardStyles.css';
import './WeatherDetailView.css';

const WeatherDetailView = ({ weather, t }) => {
    if (!weather) return <div className="loading">{t('loading')}</div>;

    return (
        <div className="weather-detail-view">
            <WeatherCard data={weather} t={t} />

            <div className="card-container">
                <h3 className="card-title">{t('current_details')}</h3>
                <div className="details-grid">
                    <div className="detail-item">
                        <Thermometer size={20} className="icon-blue" />
                        <div>
                            <span className="detail-label">{t('feels_like')}</span>
                            <span className="detail-value">{weather.feelsLike}°C</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Droplet size={20} className="icon-blue" />
                        <div>
                            <span className="detail-label">{t('humidity')}</span>
                            <span className="detail-value">{weather.humidity}%</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <CloudRain size={20} className="icon-blue" />
                        <div>
                            <span className="detail-label">{t('precipitation')}</span>
                            <span className="detail-value">{weather.rainfall}mm</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Wind size={20} className="icon-blue" />
                        <div>
                            <span className="detail-label">{t('wind_speed')}</span>
                            <span className="detail-value">{weather.windSpeed} km/h</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Gauge size={20} className="icon-purple" />
                        <div>
                            <span className="detail-label">{t('pressure')}</span>
                            <span className="detail-value">{weather.pressure} hPa</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Eye size={20} className="icon-green" />
                        <div>
                            <span className="detail-label">{t('visibility')}</span>
                            <span className="detail-value">{weather.visibility} km</span>
                        </div>
                    </div>
                </div>
            </div>

            {
                weather.forecast && weather.forecast.length > 0 && (
                    <div className="card-container">
                        <h3 className="card-title">{t('forecast_3h')}</h3>
                        <div className="forecast-list">
                            {weather.forecast.map((item, index) => (
                                <div key={index} className="forecast-item">
                                    <span className="f-time">{item.time}</span>
                                    <span className="f-icon">{item.icon}</span>
                                    <span className="f-temp">{item.temp}°C</span>
                                    <span className="f-rain">
                                        <Droplet size={12} /> {item.chanceOfRain}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default WeatherDetailView;
