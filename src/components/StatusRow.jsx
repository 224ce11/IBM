import React from 'react';
import { Bell, Sprout } from 'lucide-react';
import './StatusRow.css';

const StatusRow = () => {
    return (
        <div className="status-row">
            <div className="status-card warning">
                <div className="icon-wrapper warning-bg">
                    <Bell size={20} color="#F57C00" />
                    <span className="badge">2</span>
                </div>
                <div className="status-text">
                    <span className="label">Active Alerts</span>
                    <span className="value warning-text">2 Warning</span>
                </div>
            </div>

            <div className="status-card success">
                <div className="icon-wrapper success-bg">
                    <Sprout size={20} color="#388E3C" />
                </div>
                <div className="status-text">
                    <span className="label">Soil Status</span>
                    <span className="value success-text">Healthy</span>
                </div>
            </div>
        </div>
    );
};

export default StatusRow;
