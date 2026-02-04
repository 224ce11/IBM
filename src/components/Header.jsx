import React from 'react';
import { Leaf, MapPin, Globe } from 'lucide-react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-top">
                <div className="logo-section">
                    <Leaf className="logo-icon" size={24} color="#4CAF50" />
                    <div>
                        <h1 className="app-name">Smart Farmer</h1>
                        <div className="location">
                            <MapPin size={12} />
                            <span>Nashik, Maharashtra</span>
                        </div>
                    </div>
                </div>
                <button className="lang-btn">
                    <Globe size={16} />
                    <span>हिंदी</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
