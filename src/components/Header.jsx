import React from 'react';
import { Leaf, MapPin, Globe } from 'lucide-react';
import './Header.css';

const Header = ({ location, t, toggleLang }) => {
    return (
        <header className="header">
            <div className="header-top">
                <div className="logo-section">
                    <Leaf className="logo-icon" size={24} color="#4CAF50" />
                    <div>
                        <h1 className="app-name">{t('app_name')}</h1>
                        <div className="location">
                            <MapPin size={12} />
                            <span>{location || t('detecting_loc')}</span>
                        </div>
                    </div>
                </div>
                <button className="lang-btn" onClick={toggleLang}>
                    <Globe size={16} />
                    <span>{t('lang_btn')}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
