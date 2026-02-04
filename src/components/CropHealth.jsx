import React from 'react';
import { Leaf, TrendingUp } from 'lucide-react';
import './CardStyles.css';
import './CropHealth.css';

const CropHealth = () => {
    return (
        <div className="card-container">
            <h3 className="card-title">
                <Leaf size={18} color="#4CAF50" />
                Crop Health
            </h3>

            <div className="crop-info flex-between">
                <div className="crop-detail">
                    <span className="label-sm">Crop / फसल</span>
                    <div className="crop-name">
                        <span className="crop-icon">🌾</span>
                        <span>Wheat / गेहूं</span>
                    </div>

                    <div className="spacer"></div>

                    <span className="label-sm">Growth Stage</span>
                    <div className="stage-name">
                        <TrendingUp size={14} className="icon-green" />
                        <span>Flowering / फूल आना</span>
                    </div>
                </div>

                <div className="risk-badge low">
                    <div className="check-circle">✓</div>
                    <div>Risk Level</div>
                    <div className="level">Low</div>
                </div>
            </div>

            <div className="metric-row health-bar-container">
                <div className="metric-header">
                    <span className="label-sm">Overall Health</span>
                    <span className="health-percent">85%</span>
                </div>
                <div className="progress-bg">
                    <div className="progress-fill fill-green" style={{ width: '85%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default CropHealth;
