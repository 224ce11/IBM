import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Wind, CloudLightning, ShieldCheck, MessageSquare } from 'lucide-react';
import '../components/CardStyles.css';

const AlertsView = ({ weather, t }) => {
    const [permission, setPermission] = useState(Notification.permission);
    const [phoneNumber, setPhoneNumber] = useState('');
    // ... existing ...

    const sendSMS = () => {
        if (!phoneNumber) {
            alert(t('enter_phone'));
            return;
        }

        // 1. Simulation Toast
        alert(`✅ ${t('sms_sent')} ${phoneNumber}`);

        // 2. Actual SMS Trigger (Opens default SMS app)
        // In a real app with backend, this would call an API like Twilio
        const message = "WARNING: Heavy Storm predicted in your area. Please stay safe. - Smart Farmer App";
        window.open(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`, '_blank');
    };


    // Simulated Alerts Data (since live storms are rare for testing)
    // In production, this would come from weather.alerts array
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // Detect severe conditions from live weather data
        if (weather) {
            const newAlerts = [];

            // 1. High Wind Alert
            if (weather.windSpeed > 20) {
                newAlerts.push({
                    type: 'warning',
                    title: 'High Wind Warning',
                    message: `Wind speeds detected at ${weather.windSpeed} km/h. Secure loose objects.`,
                    icon: <Wind size={24} color="#F57C00" />
                });
            }

            // 2. Storm/Rain Alert
            if (weather.condition.toLowerCase().includes('storm') || weather.rainfall > 10) {
                newAlerts.push({
                    type: 'danger',
                    title: 'Storm Alert',
                    message: `Heavy rain/storm detected (${weather.rainfall}mm). Stay indoors.`,
                    icon: <CloudLightning size={24} color="#D32F2F" />
                });
            }

            // 3. Demo Mock Alert if empty (so user sees something)
            if (newAlerts.length === 0) {
                newAlerts.push({
                    type: 'success',
                    title: 'No Active Warnings',
                    message: 'Weather conditions are currently safe.',
                    icon: <ShieldCheck size={24} color="#388E3C" />
                });
            }

            setAlerts(newAlerts);
        }
    }, [weather]);

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert("This browser does not support desktop notifications");
            return;
        }
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            new Notification(t('app_name'), {
                body: "Notifications enabled! You will be alerted of severe weather.",
                icon: '/icon.png' // Ensure you have an icon or remove this line
            });
        }
    };

    const simulateStorm = () => {
        if (permission === 'granted') {
            new Notification("⚠️ " + t("storm_alert"), {
                body: "Cyclone Warning: High winds (80km/h) expected in 1 hour. Seek shelter.",
                icon: '/vite.svg',
                vibrate: [200, 100, 200]
            });
        } else {
            alert("Please enable notifications first!");
        }
    };

    return (
        <div className="view-container">
            <h2 className="view-title">{t('active_alerts')}</h2>

            {/* Permission Request Card */}
            {permission !== 'granted' && (
                <div className="recommendation-card" style={{ marginBottom: '20px', borderLeftColor: '#2196F3' }}>
                    <Bell size={24} color="#2196F3" style={{ marginRight: '16px' }} />
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{t('enable_notifications')}</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>{t('notify_desc')}</p>
                    </div>
                    <button
                        onClick={requestNotificationPermission}
                        style={{ background: '#2196F3', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}
                    >
                        {t('enable')}
                    </button>
                </div>
            )}

            {/* List of Alerts */}
            <div className="recommendation-list" style={{ display: 'flex', flexDirection: 'column' }}>
                {alerts.map((alert, index) => (
                    <div key={index} className="recommendation-card" style={{
                        borderLeftColor: alert.type === 'danger' ? '#D32F2F' : alert.type === 'warning' ? '#F57C00' : '#388E3C',
                        background: alert.type === 'success' ? '#F1F8E9' : '#fff'
                    }}>
                        <div style={{ marginRight: '16px' }}>{alert.icon}</div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{alert.title}</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#555' }}>{alert.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Safety Action Plan - Recommendation System */}
            {alerts.length > 0 && (
                <div style={{ marginTop: '20px', padding: '20px', background: '#FFF3E0', borderRadius: '12px', borderLeft: '4px solid #F57C00' }}>
                    <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={18} color="#F57C00" />
                        {t('safety_tips')}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#555' }}>
                        {alerts.some(a => a.type === 'warning') && <li>{t('tip_wind')}</li>}
                        {alerts.some(a => a.type === 'danger') && <li>{t('tip_storm')}</li>}
                        <li>{t('tip_general')}</li>
                    </ul>
                </div>
            )}

            {/* Simulated Demo Control */}
            <div style={{ marginTop: '20px', padding: '20px', background: '#FFF3E0', borderRadius: '12px' }}>
                {/* ... rest of existing code ... */}
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#F57C00" />
                    Test Simulation
                </h4>
                <p style={{ fontSize: '12px', marginBottom: '12px' }}>Test how an alert will look on the user's phone:</p>
                <button
                    onClick={simulateStorm}
                    style={{
                        background: '#D32F2F',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        width: '100%',
                        fontWeight: 'bold'
                    }}
                >
                    🚨 Simulate Hurricane Alert
                </button>
            </div>

            {/* SMS Section */}
            <div style={{ marginTop: '20px', padding: '20px', background: '#E3F2FD', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="#1565C0" />
                    {t('sms_alerts')}
                </h4>

                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            width: '100%'
                        }}
                    />
                    <button
                        onClick={sendSMS}
                        style={{
                            background: '#1565C0',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {t('send_sms')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertsView;
