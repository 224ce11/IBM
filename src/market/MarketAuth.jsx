import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { X } from 'lucide-react';

const MarketAuth = ({ onClose, t }) => {
    const [tab, setTab] = useState('login');
    const [role, setRole] = useState('customer');
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            onClose();
        } catch (err) {
            setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim());
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await setDoc(doc(db, 'users', cred.user.uid), {
                name: form.name,
                email: form.email,
                phone: form.phone,
                role,
                createdAt: serverTimestamp(),
            });
            onClose();
        } catch (err) {
            setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim());
        }
        setLoading(false);
    };

    return (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="auth-modal">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h2>🌾 {t('market_title')}</h2>
                        <p style={{ margin: 0 }}>{tab === 'login' ? t('market_welcome') : t('market_join')}</p>
                    </div>
                    <button className="btn-back-dark" onClick={onClose} style={{ margin: 0, padding: '6px' }}>
                        <X size={18} />
                    </button>
                </div>

                <div className="auth-tabs">
                    <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>{t('market_login')}</button>
                    <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>{t('market_create_account')}</button>
                </div>

                {tab === 'login' ? (
                    <form className="market-form" onSubmit={handleLogin}>
                        <input className="market-input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
                        <input className="market-input" type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
                        {error && <div className="market-error">{error}</div>}
                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? t('market_logging_in') : t('market_login')}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => setTab('register')}>
                            {t('market_no_account')}
                        </button>
                    </form>
                ) : (
                    <form className="market-form" onSubmit={handleRegister}>
                        <input className="market-input" type="text" placeholder="Full name" value={form.name} onChange={set('name')} required />
                        <input className="market-input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
                        <input className="market-input" type="tel" placeholder="Phone" value={form.phone} onChange={set('phone')} />
                        <input className="market-input" type="password" placeholder="Password (min 6)" value={form.password} onChange={set('password')} required minLength={6} />
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('market_i_am')}</p>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['customer', 'shop_owner'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={role === r ? 'btn-primary' : 'btn-secondary'}
                                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem' }}
                                    >
                                        {r === 'customer' ? `🛒 ${t('market_farmer_buyer')}` : `🏪 ${t('market_shop_owner')}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <div className="market-error">{error}</div>}
                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? t('market_creating') : t('market_create_account')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MarketAuth;
