import React from 'react';
import { Sprout } from 'lucide-react';
import '../components/CardStyles.css';
import SoilHealth from '../components/SoilHealth';

const SoilDetailView = ({ soilData, t }) => {
    if (!soilData) return <div className="loading">{t('loading')}</div>;

    // Crop Recommendations Logic
    const getRecommendations = (type) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('clay')) return [
            { name: "Rice (Paddy)", icon: "🌾", reason: "Holds water well" },
            { name: "Wheat", icon: "🍞", reason: "Good for heavy soil" },
            { name: "Broccoli/Cabbage", icon: "🥦", reason: "Thrives in nutrient rich soil" }
        ];
        if (lowerType.includes('sand')) return [
            { name: "Carrots", icon: "🥕", reason: "Needs loose soil" },
            { name: "Potatoes", icon: "🥔", reason: "Tubers grow easily" },
            { name: "Watermelon", icon: "🍉", reason: "Drains well" }
        ];
        if (lowerType.includes('silt')) return [
            { name: "Corn (Maize)", icon: "🌽", reason: "High fertility" },
            { name: "Tomatoes", icon: "🍅", reason: "Holds moisture" },
            { name: "Cotton", icon: "👕", reason: "Needs rich soil" }
        ];
        // Default Loam
        return [
            { name: "Sugarcane", icon: "🍬", reason: "Balanced nutrients" },
            { name: "Cotton", icon: "👕", reason: "Versatile soil" },
            { name: "Vegetables", icon: "🥗", reason: "Optimum growth" }
        ];
    };

    const recommendations = getRecommendations(soilData.type);

    return (
        <div className="view-container">
            <h2 className="view-title">{t('soil_health')} & {t('recommendations')}</h2>

            {/* Reuse existing component for the basics */}
            <SoilHealth t={t} soilData={soilData} />

            <div className="card-container" style={{ marginTop: '20px' }}>
                <h3 className="card-title">
                    <Sprout size={18} color="#2E7D32" />
                    {t('recommended_crops')}
                </h3>

                <div className="recommendation-list" style={{ marginTop: '12px' }}>
                    {recommendations.map((crop, index) => (
                        <div key={index} className="recommendation-card">
                            <span style={{ fontSize: '24px', marginRight: '16px' }}>{crop.icon}</span>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px', color: '#1b5e20' }}>{t(crop.name) || crop.name}</h4>
                                <span style={{ fontSize: '12px', color: '#666' }}>{t('why')}: {t(crop.reason) || crop.reason}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-container" style={{ marginTop: '20px' }}>
                <h3 className="card-title">
                    Note
                </h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                    {t('soil_note')}
                </p>
            </div>
        </div>
    );
};

export default SoilDetailView;
