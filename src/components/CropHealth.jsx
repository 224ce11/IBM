import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, ChevronDown } from 'lucide-react';
import './CardStyles.css';
import './CropHealth.css';

const CropHealth = ({ t }) => {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [healthStats, setHealthStats] = useState({ stage: 'Flowering', risk: 'Low', score: 85, color: 'fill-green' });

    // Simulation: Different crops have different risks based on "current weather" (mocked)
    useEffect(() => {
        if (selectedCrop === 'Wheat') setHealthStats({ stage: 'Flowering', risk: 'Low', score: 92, color: 'fill-green' });
        if (selectedCrop === 'Rice (Paddy)') setHealthStats({ stage: 'Seedling', risk: 'Medium', score: 75, color: 'fill-orange' });
        if (selectedCrop === 'Cotton') setHealthStats({ stage: 'Boll Formation', risk: 'High', score: 45, color: 'fill-red' });
        if (selectedCrop === 'Sugarcane') setHealthStats({ stage: 'Vegetative', risk: 'Low', score: 88, color: 'fill-green' });
    }, [selectedCrop]);

    return (
        <div className="card-container">
            <h3 className="card-title">
                <Leaf size={18} color="#4CAF50" />
                {t('crop_health')}
            </h3>

            <div className="crop-info flex-between">
                <div className="crop-detail" style={{ width: '100%' }}>
                    <span className="label-sm">Select Your Crop</span>

                    {/* Crop Selector Dropdown */}
                    <div className="crop-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                        <span className="crop-icon">
                            {selectedCrop.includes('Rice') ? '🌾' : selectedCrop === 'Cotton' ? '👕' : selectedCrop === 'Sugarcane' ? '🍬' : '🍞'}
                        </span>

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <select
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    color: '#333',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    paddingRight: '24px', // Make space for the arrow
                                    zIndex: 10,
                                    position: 'relative' // Ensure it sits above
                                }}
                            >
                                <option value="Wheat">Wheat</option>
                                <option value="Rice (Paddy)">Rice</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Sugarcane">Sugarcane</option>
                            </select>
                            <ChevronDown
                                size={14}
                                color="#666"
                                style={{
                                    position: 'absolute',
                                    right: 4,
                                    pointerEvents: 'none', // CLICK-THROUGH: Clicks hit the select, not the icon
                                    zIndex: 0
                                }}
                            />
                        </div>
                    </div>

                    <div className="spacer"></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span className="label-sm">{t('growth_stage')}</span>
                            <div className="stage-name">
                                <TrendingUp size={14} className="icon-green" />
                                <span>{healthStats.stage}</span>
                            </div>
                        </div>

                        <div className={`risk-badge ${healthStats.risk.toLowerCase()}`} style={{
                            background: healthStats.risk === 'High' ? '#FFEBEE' : healthStats.risk === 'Medium' ? '#FFF3E0' : '#E8F5E9',
                            color: healthStats.risk === 'High' ? '#D32F2F' : healthStats.risk === 'Medium' ? '#EF6C00' : '#2E7D32'
                        }}>
                            <div>{t('risk_level')}</div>
                            <div className="level">{healthStats.risk}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="metric-row health-bar-container">
                <div className="metric-header">
                    <span className="label-sm">{t('overall_health')}</span>
                    <span className="health-percent" style={{ color: healthStats.score < 50 ? '#D32F2F' : '#333' }}>{healthStats.score}%</span>
                </div>
                <div className="progress-bg">
                    <div className={`progress-fill`} style={{
                        width: `${healthStats.score}%`,
                        background: healthStats.score < 50 ? '#EF5350' : healthStats.score < 80 ? '#FFA726' : '#66BB6A'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default CropHealth;
