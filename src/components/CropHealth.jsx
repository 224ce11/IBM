import React from 'react';
import { Leaf, TrendingUp } from 'lucide-react';
import './CardStyles.css';
import './CropHealth.css';

const CropHealth = ({ t }) => {
    return (
        <div className="card-container">
            <h3 className="card-title">
                <Leaf size={18} color="#4CAF50" />
                {t('crop_health')}
            </h3>

            <div className="crop-info flex-between">
                <div className="crop-detail">
                    <span className="label-sm">{t('crop_label')}</span>
                    <div className="crop-name">
                        <span className="crop-icon">🌾</span>
                        <span>{t('crop_name')}</span>
                    </div>

                    <div className="spacer"></div>

                    <span className="label-sm">{t('growth_stage')}</span>
                    <div className="stage-name">
                        <TrendingUp size={14} className="icon-green" />
                        <span>{t('stage_name')}</span>
                    </div>
                </div>

                <div className="risk-badge low">
                    <div className="check-circle">✓</div>
                    <div>{t('risk_level')}</div>
                    <div className="level">{t('low')}</div>
                </div>
            </div>

            <div className="metric-row health-bar-container">
                <div className="metric-header">
                    <span className="label-sm">{t('overall_health')}</span>
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
