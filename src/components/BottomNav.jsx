import React, { useState } from 'react';
import { Home, CloudSun, Sprout, Bell } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    const [active, setActive] = useState('Home');

    const navItems = [
        { name: 'Home', icon: Home },
        { name: 'Weather', icon: CloudSun },
        { name: 'Soil', icon: Sprout },
        { name: 'Alerts', icon: Bell }
    ];

    return (
        <div className="bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.name}
                    className={`nav-item ${active === item.name ? 'active' : ''}`}
                    onClick={() => setActive(item.name)}
                >
                    <div className={`icon-container ${active === item.name ? 'active-bg' : ''}`}>
                        <item.icon size={20} className={active === item.name ? 'icon-active' : 'icon-inactive'} />
                    </div>
                    <span className="nav-label">{item.name}</span>
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
