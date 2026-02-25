import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getCart, seedMarketData } from './marketService';
import MarketAuth from './MarketAuth';
import MarketHome from './MarketHome';
import MarketProductDetail from './MarketProductDetail';
import MarketCart from './MarketCart';
import MarketOrders from './MarketOrders';
import ShopRegister from './ShopRegister';
import { ShoppingCart, ClipboardList, Store, LogOut, LogIn, Sprout } from 'lucide-react';
import './market.css';

const PAGES = { HOME: 'home', PRODUCT: 'product', CART: 'cart', ORDERS: 'orders', SHOP_REG: 'shop_reg' };

const MarketApp = ({ t }) => {
    const [user, setUser] = useState(undefined);
    const [page, setPage] = useState(PAGES.HOME);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [seeding, setSeeding] = useState(false);
    const [seedDone, setSeedDone] = useState(false);

    // Read GPS from localStorage (set by App.jsx when weather loads)
    const savedCoords = localStorage.getItem('lastCoords');
    const rawCoords = savedCoords ? JSON.parse(savedCoords) : null;
    // Normalize: App.jsx saves as {lat, lon}, marketService expects {lat, lng}
    const locationForMarket = rawCoords ? { lat: rawCoords.lat, lng: rawCoords.lon } : null;

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return unsub;
    }, []);

    useEffect(() => {
        if (user) refreshCartCount();
        else setCartCount(0);
    }, [user, page]);

    const refreshCartCount = async () => {
        try {
            const items = await getCart(user.uid);
            setCartCount(items.reduce((s, i) => s + i.qty, 0));
        } catch { setCartCount(0); }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setPage(PAGES.PRODUCT);
    };

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const msg = await seedMarketData();
            setSeedDone(true);
            alert(msg);
        } catch (e) {
            alert('Seed failed: ' + e.message);
        }
        setSeeding(false);
    };

    if (user === undefined) {
        return (
            <div className="market-app">
                <div className="market-loading">
                    <div className="market-spinner" />
                    <span>{t('market_loading_app')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="market-app">
            {/* Top Bar */}
            <div className="market-topbar">
                {page !== PAGES.HOME ? (
                    <button className="btn-back" onClick={() => setPage(PAGES.HOME)}>←</button>
                ) : (
                    <Sprout size={20} />
                )}
                <h1>🌾 {t('market_title')}</h1>
                <div className="market-topbar-actions">
                    {!seedDone && (
                        <button className="market-icon-btn" onClick={handleSeed} disabled={seeding} title={t('market_seed_btn_title')}>
                            {seeding ? '⏳' : '🌱'}
                        </button>
                    )}
                    <button className="market-icon-btn" onClick={() => setPage(PAGES.CART)}>
                        <ShoppingCart size={16} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                    {user && (
                        <button className="market-icon-btn" onClick={() => setPage(PAGES.ORDERS)} title={t('market_orders')}>
                            <ClipboardList size={16} />
                        </button>
                    )}
                    {user && (
                        <button className="market-icon-btn" onClick={() => setPage(PAGES.SHOP_REG)} title={t('market_register_shop')}>
                            <Store size={16} />
                        </button>
                    )}
                    {user ? (
                        <button className="market-icon-btn" onClick={() => signOut(auth)} title={t('market_logout')}>
                            <LogOut size={16} />
                        </button>
                    ) : (
                        <button className="market-icon-btn" onClick={() => setShowAuth(true)}>
                            <LogIn size={16} /> {t('market_login')}
                        </button>
                    )}
                </div>
            </div>

            {/* User greeting */}
            {user && (
                <div className="user-greeting-strip">
                    👋 {t('market_logged_in_as')} {user.email}
                </div>
            )}

            {/* Main Content */}
            <div className="market-content">
                {page === PAGES.HOME && (
                    <MarketHome
                        userLocation={locationForMarket}
                        onProductClick={handleProductClick}
                        t={t}
                    />
                )}
                {page === PAGES.PRODUCT && selectedProduct && (
                    <MarketProductDetail
                        product={selectedProduct}
                        user={user}
                        onBack={() => setPage(PAGES.HOME)}
                        onGoToCart={() => setPage(PAGES.CART)}
                        onLoginRequired={() => setShowAuth(true)}
                        t={t}
                    />
                )}
                {page === PAGES.CART && (
                    <MarketCart
                        user={user}
                        onBack={() => setPage(PAGES.HOME)}
                        onOrderPlaced={() => { refreshCartCount(); setPage(PAGES.ORDERS); }}
                        onLoginRequired={() => setShowAuth(true)}
                        t={t}
                    />
                )}
                {page === PAGES.ORDERS && (
                    <MarketOrders
                        user={user}
                        onBack={() => setPage(PAGES.HOME)}
                        onLoginRequired={() => setShowAuth(true)}
                        t={t}
                    />
                )}
                {page === PAGES.SHOP_REG && (
                    <ShopRegister
                        user={user}
                        onBack={() => setPage(PAGES.HOME)}
                        t={t}
                    />
                )}
            </div>

            {showAuth && <MarketAuth onClose={() => setShowAuth(false)} t={t} />}
        </div>
    );
};

export default MarketApp;
