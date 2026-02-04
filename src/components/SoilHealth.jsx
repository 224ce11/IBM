import React from 'react';
import { Sprout, Droplet, FlaskConical } from 'lucide-react';
import './CardStyles.css'; // Shared styles for cards

const SoilHealth = ({ t, soilData }) => {
    // Default values while loading
    const data = soilData || {
        moisture: 'Loading...', // Or fetch from weather
        ph: '7.0',
        nitrogen: '0.1%',
        organicCarbon: '1.2%',
        type: 'Fetching...'
    };

    return (
        <div className="card-container">
            <h3 className="card-title">
                <Sprout size={18} color="#795548" />
                {t('soil_health')} - <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{data.type}</span>
            </h3>

            <div className="metric-row">
                <div className="metric-header">
                    <div className="metric-label">
                        <Droplet size={14} className="icon-blue" />
                        <span>{t('moisture')}</span>
                    </div>
                    {/* Fake moisture logic: if data is loading, show text, else show number */}
                    <span className="metric-value">{data.moisture}</span>
                </div>
                {/* Remove bar if text is 'Loading' or non-numeric */}
                <div className="progress-bg">
                    <div className="progress-fill fill-blue" style={{ width: data.moisture === 'Loading...' ? '0%' : (parseInt(data.moisture) || 50) + '%' }}></div>
                </div>
            </div>

            <div className="metric-row">
                <div className="metric-header">
                    <div className="metric-label">
                        <FlaskConical size={14} className="icon-purple" />
                        <span>{t('ph_level')}</span>
                    </div>
                    <span className="metric-value">{data.ph} <span className="tag tag-gray">{t('neutral')}</span></span>
                </div>

                <div className="metric-header" style={{ marginTop: '12px' }}>
                    <div className="metric-label">
                        <span style={{ fontSize: '12px' }}>Nitrogen</span>
                    </div>
                    <span className="metric-value">{data.nitrogen}</span>
                </div>
            </div>
        </div>
    );
};

export default SoilHealth;
