import React, { useState } from 'react';
import { Leaf, MapPin, Globe, Search, X } from 'lucide-react';
import './Header.css';

const Header = ({ location, t, toggleLang, onSearch }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setIsSearching(false);
            setQuery('');
        }
    };

    return (
        <header className="header">
            <div className="header-top">
                {isSearching ? (
                    <form className="search-form" onSubmit={handleSubmit}>
                        <Search size={18} className="search-icon-input" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder={t('search_placeholder')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="button" className="close-search" onClick={() => setIsSearching(false)}>
                            <X size={20} />
                        </button>
                    </form>
                ) : (
                    <>
                        <div className="logo-section">
                            <img src="/logo.png" alt="Leaf Logo" className="logo-img" />
                            <div>
                                <h1 className="app-name">{t('app_name')}</h1>
                                <div className="location" onClick={() => setIsSearching(true)}>
                                    <MapPin size={12} />
                                    <span>{location || t('detecting_loc')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="icon-btn" onClick={() => setIsSearching(true)}>
                                <Search size={20} />
                            </button>
                            <button className="lang-btn" onClick={toggleLang}>
                                <Globe size={16} />
                                <span>{t('lang_btn')}</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
