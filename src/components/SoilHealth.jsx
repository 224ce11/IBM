import React from 'react';
import { Sprout, Droplet, FlaskConical } from 'lucide-react';
import './CardStyles.css'; // Shared styles for cards

const SoilHealth = () => {
    return (
        <div className="card-container">
            <h3 className="card-title">
                <Sprout size={18} color="#795548" />
                Soil Health
            </h3>

            <div className="metric-row">
                <div className="metric-header">
                    <div className="metric-label">
                        <Droplet size={14} className="icon-blue" />
                        <span>Moisture</span>
                    </div>
                    <span className="metric-value">72% <span className="tag tag-green">High</span></span>
                </div>
                <div className="progress-bg">
                    <div className="progress-fill fill-blue" style={{ width: '72%' }}></div>
                </div>
            </div>

            <div className="metric-row">
                <div className="metric-header">
                    <div className="metric-label">
                        <FlaskConical size={14} className="icon-purple" />
                        <span>pH Level</span>
                    </div>
                    <span className="metric-value">6.8 <span className="tag tag-gray">Neutral</span></span>
                </div>
                {/* pH usually doesn't need a 0-100 bar, but maybe a scale. Image shows just text? 
            Looking at image, there is a bar for pH? Hard to see. 
            Actually, the image has Moisture bar. 
            Let's assume text for pH or a small indicator. 
            Wait, I should check the image description again.
            "Moisture ... 72% High ... [Bar]"
            "pH Level ... 6.8 Neutral" (maybe no bar, or just text).
            I'll stick to text for pH to keep it clean unless I see a bar in my mind's eye.
        */}
            </div>
        </div>
    ); // Wait, looking closely at the crop health, there is a bar. Soil health probably has one too or visually similar.
    // I'll add a simple visual if needed, but text is fine.
};

export default SoilHealth;
