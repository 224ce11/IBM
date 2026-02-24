import React, { useState, useMemo } from 'react';
import { Leaf, TrendingUp, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import './CardStyles.css';
import './CropHealth.css';

// Ideal conditions for each crop
const CROP_CONFIG = {
    'Wheat': {
        icon: '🍞',
        idealPh: [6.0, 7.5],
        idealTemp: [15, 25],
        idealMoisture: [40, 70],
        maxRainfall: 15,
        stage: (month) => {
            if (month >= 11 || month <= 1) return 'Sowing';
            if (month >= 2 && month <= 3) return 'Vegetative';
            if (month >= 4 && month <= 4) return 'Flowering';
            if (month >= 5) return 'Harvesting';
            return 'Off Season';
        }
    },
    'Rice (Paddy)': {
        icon: '🌾',
        idealPh: [5.5, 7.0],
        idealTemp: [22, 32],
        idealMoisture: [60, 90],
        maxRainfall: 50,
        stage: (month) => {
            if (month >= 6 && month <= 7) return 'Sowing';
            if (month >= 8 && month <= 9) return 'Vegetative';
            if (month >= 10 && month <= 10) return 'Flowering';
            if (month >= 11) return 'Harvesting';
            return 'Off Season';
        }
    },
    'Cotton': {
        icon: '🌿',
        idealPh: [5.8, 8.0],
        idealTemp: [25, 35],
        idealMoisture: [35, 65],
        maxRainfall: 20,
        stage: (month) => {
            if (month >= 4 && month <= 6) return 'Sowing';
            if (month >= 7 && month <= 9) return 'Boll Formation';
            if (month >= 10 && month <= 11) return 'Harvesting';
            return 'Off Season';
        }
    },
    'Sugarcane': {
        icon: '🍬',
        idealPh: [6.0, 7.5],
        idealTemp: [20, 35],
        idealMoisture: [50, 80],
        maxRainfall: 30,
        stage: (month) => {
            if (month >= 2 && month <= 4) return 'Sowing';
            if (month >= 5 && month <= 9) return 'Vegetative';
            if (month >= 10 && month <= 11) return 'Grand Growth';
            if (month >= 12 || month <= 1) return 'Harvesting';
            return 'Vegetative';
        }
    },
    'Maize': {
        icon: '🌽',
        idealPh: [5.5, 7.5],
        idealTemp: [18, 32],
        idealMoisture: [40, 70],
        maxRainfall: 25,
        stage: (month) => {
            if (month >= 6 && month <= 7) return 'Sowing';
            if (month >= 8 && month <= 9) return 'Vegetative';
            if (month >= 10) return 'Harvesting';
            return 'Off Season';
        }
    },
    'Groundnut': {
        icon: '🥜',
        idealPh: [5.5, 7.0],
        idealTemp: [22, 32],
        idealMoisture: [35, 60],
        maxRainfall: 15,
        stage: (month) => {
            if (month >= 6 && month <= 7) return 'Sowing';
            if (month >= 8 && month <= 10) return 'Pod Formation';
            if (month >= 11) return 'Harvesting';
            return 'Off Season';
        }
    }
};

// Dynamic scoring function
const computeScore = (crop, weather, soil) => {
    const config = CROP_CONFIG[crop];
    if (!config) return { score: 50, risk: 'Medium', reasons: [] };

    let score = 100;
    const reasons = [];
    const positives = [];

    // 1. pH Check
    const ph = parseFloat(soil?.ph) || 6.5;
    const [phMin, phMax] = config.idealPh;
    if (ph < phMin) {
        const penalty = Math.min(30, Math.round((phMin - ph) * 15));
        score -= penalty;
        reasons.push(`🧪 Soil pH too acidic (${ph}) — ideal is ${phMin}–${phMax}`);
    } else if (ph > phMax) {
        const penalty = Math.min(25, Math.round((ph - phMax) * 12));
        score -= penalty;
        reasons.push(`🧪 Soil pH too alkaline (${ph}) — ideal is ${phMin}–${phMax}`);
    } else {
        positives.push(`🧪 pH optimal (${ph})`);
    }

    // 2. Temperature Check
    const temp = weather?.temp ?? 28;
    const [tMin, tMax] = config.idealTemp;
    if (temp < tMin) {
        const penalty = Math.min(25, Math.round((tMin - temp) * 3));
        score -= penalty;
        reasons.push(`🌡 Too cold (${temp}°C) — ${crop} needs ${tMin}–${tMax}°C`);
    } else if (temp > tMax) {
        const penalty = Math.min(25, Math.round((temp - tMax) * 3));
        score -= penalty;
        reasons.push(`🌡 Heat stress (${temp}°C) — ${crop} needs ${tMin}–${tMax}°C`);
    } else {
        positives.push(`🌡 Temperature ideal (${temp}°C)`);
    }

    // 3. Moisture Check
    const moisture = parseFloat(soil?.moisture) || 45;
    const [mMin, mMax] = config.idealMoisture;
    if (moisture < mMin) {
        const penalty = Math.min(25, Math.round((mMin - moisture) * 0.8));
        score -= penalty;
        reasons.push(`💧 Low soil moisture (${moisture}%) — needs ${mMin}–${mMax}%`);
    } else if (moisture > mMax) {
        const penalty = Math.min(15, Math.round((moisture - mMax) * 0.4));
        score -= penalty;
        reasons.push(`💧 Waterlogged soil (${moisture}%) — ideal is ≤${mMax}%`);
    } else {
        positives.push(`💧 Moisture adequate (${moisture}%)`);
    }

    // 4. Rainfall Check
    const rainfall = weather?.rainfall ?? 0;
    if (rainfall > config.maxRainfall) {
        const penalty = Math.min(20, Math.round((rainfall - config.maxRainfall) * 0.5));
        score -= penalty;
        reasons.push(`🌧 Heavy rainfall (${rainfall}mm) may cause waterlogging`);
    } else if (rainfall === 0 && moisture < 30) {
        score -= 10;
        reasons.push(`☀️ No rain + low moisture — consider irrigating`);
    }

    // 5. Humidity check (fungal risk)
    const humidity = weather?.humidity ?? 60;
    if (humidity > 85) {
        score -= 10;
        reasons.push(`🍄 High humidity (${humidity}%) — fungal disease risk`);
    }

    score = Math.max(5, Math.min(100, Math.round(score)));
    const risk = score >= 75 ? 'Low' : score >= 50 ? 'Medium' : 'High';

    return { score, risk, reasons, positives };
};

const CropHealth = ({ t, weather, soil }) => {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [showBreakdown, setShowBreakdown] = useState(false);

    const currentMonth = new Date().getMonth() + 1; // 1–12
    const stage = CROP_CONFIG[selectedCrop]?.stage(currentMonth) ?? 'Unknown';

    const { score, risk, reasons, positives } = useMemo(
        () => computeScore(selectedCrop, weather, soil),
        [selectedCrop, weather, soil]
    );

    const riskColor = risk === 'High' ? '#D32F2F' : risk === 'Medium' ? '#EF6C00' : '#2E7D32';
    const riskBg = risk === 'High' ? '#FFEBEE' : risk === 'Medium' ? '#FFF3E0' : '#E8F5E9';
    const barColor = score < 50 ? '#EF5350' : score < 75 ? '#FFA726' : '#66BB6A';

    return (
        <div className="card-container">
            <h3 className="card-title">
                <Leaf size={18} color="#4CAF50" />
                {t('crop_health')}
            </h3>

            {/* Crop Selector */}
            <div className="crop-info flex-between">
                <div className="crop-detail" style={{ width: '100%' }}>
                    <span className="label-sm">{t('select_crop')}</span>

                    <div className="crop-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                        <span className="crop-icon">{CROP_CONFIG[selectedCrop]?.icon}</span>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <select
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                style={{
                                    border: 'none', background: 'transparent', fontWeight: 'bold',
                                    fontSize: '16px', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
                                    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                                    paddingRight: '24px', zIndex: 10, position: 'relative'
                                }}
                            >
                                {Object.keys(CROP_CONFIG).map(crop => (
                                    <option key={crop} value={crop}>{t(crop)}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 4, pointerEvents: 'none', zIndex: 0, color: 'var(--text-muted)' }} />
                        </div>
                    </div>

                    <div className="spacer"></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span className="label-sm">{t('growth_stage')}</span>
                            <div className="stage-name">
                                <TrendingUp size={14} className="icon-green" />
                                <span>{t(stage)}</span>
                            </div>
                        </div>
                        <div className="risk-badge" style={{ background: riskBg, color: riskColor }}>
                            <div>{t('risk_level')}</div>
                            <div className="level">{risk}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Score Bar */}
            <div className="metric-row health-bar-container">
                <div className="metric-header">
                    <span className="label-sm">{t('overall_health')}</span>
                    <span className="health-percent" style={{ color: score < 50 ? 'var(--danger)' : 'var(--text-primary)' }}>{score}%</span>
                </div>
                <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${score}%`, background: barColor }}></div>
                </div>
            </div>

            {/* Risk Breakdown Toggle */}
            <button
                className="score-breakdown-btn"
                onClick={() => setShowBreakdown(!showBreakdown)}
            >
                <span>📊 {t('why_score')}</span>
                <ChevronDown size={14} style={{ transform: showBreakdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
            </button>

            {showBreakdown && (
                <div className="breakdown-list">
                    {reasons.map((r, i) => (
                        <div key={i} className="breakdown-warning">
                            <AlertCircle size={13} style={{ marginTop: '1px', flexShrink: 0 }} />
                            <span>{r}</span>
                        </div>
                    ))}
                    {positives.map((p, i) => (
                        <div key={i} className="breakdown-positive">
                            <CheckCircle size={13} style={{ marginTop: '1px', flexShrink: 0 }} />
                            <span>{p}</span>
                        </div>
                    ))}
                    {reasons.length === 0 && positives.length === 0 && (
                        <div className="breakdown-empty">{t('loading_analysis')}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CropHealth;
