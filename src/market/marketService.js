import { db } from '../services/firebase';
import {
    collection, doc, getDocs, getDoc, addDoc, setDoc,
    updateDoc, deleteDoc, query, where, serverTimestamp
} from 'firebase/firestore';

// ─── Haversine Distance (km) ───────────────────────────────────────────────
export function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Products ──────────────────────────────────────────────────────────────
export async function getAllProducts(category = null) {
    const ref = collection(db, 'products');
    const q = category ? query(ref, where('category', '==', category)) : ref;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getProductById(productId) {
    const snap = await getDoc(doc(db, 'products', productId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getNearbyProducts(userLat, userLng, category = null, radiusKm = 5) {
    // Fetch all shops first, filter by distance
    const shopsSnap = await getDocs(collection(db, 'shops'));
    const nearbyShopIds = [];
    shopsSnap.docs.forEach(d => {
        const s = d.data();
        if (s.status === 'active' && s.lat && s.lng) {
            const dist = haversineDistance(userLat, userLng, s.lat, s.lng);
            if (dist <= radiusKm) nearbyShopIds.push({ id: d.id, dist: dist.toFixed(1), name: s.name });
        }
    });

    // Get products from nearby shops
    const productsSnap = await getDocs(collection(db, 'products'));
    return productsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => {
            const shop = nearbyShopIds.find(s => s.id === p.shopId);
            if (!shop) return false;
            if (category && p.category !== category) return false;
            p.shopName = shop.name;
            p.distanceKm = shop.dist;
            return true;
        })
        .sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));
}

// ─── Shops ──────────────────────────────────────────────────────────────────
export async function registerShop(uid, shopData) {
    const shopRef = await addDoc(collection(db, 'shops'), {
        ownerUid: uid,
        ...shopData,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    return shopRef.id;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export async function getCart(uid) {
    const snap = await getDocs(collection(db, 'carts', uid, 'items'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addToCart(uid, product, qty = 1) {
    const itemRef = doc(db, 'carts', uid, 'items', product.id);
    const existing = await getDoc(itemRef);
    if (existing.exists()) {
        await updateDoc(itemRef, { qty: existing.data().qty + qty });
    } else {
        await setDoc(itemRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            shopId: product.shopId,
            imageUrl: product.imageUrl || '',
            qty,
        });
    }
}

export async function updateCartQty(uid, itemId, qty) {
    if (qty <= 0) {
        await deleteDoc(doc(db, 'carts', uid, 'items', itemId));
    } else {
        await updateDoc(doc(db, 'carts', uid, 'items', itemId), { qty });
    }
}

export async function removeFromCart(uid, itemId) {
    await deleteDoc(doc(db, 'carts', uid, 'items', itemId));
}

export async function clearCart(uid) {
    const snap = await getDocs(collection(db, 'carts', uid, 'items'));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export async function placeOrder(uid, cartItems, total) {
    const orderRef = await addDoc(collection(db, 'orders'), {
        userId: uid,
        items: cartItems,
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    await clearCart(uid);
    return orderRef.id;
}

export async function getUserOrders(uid) {
    const q = query(collection(db, 'orders'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Seed Data (dev only) ────────────────────────────────────────────────────
export async function seedMarketData() {
    // Create a sample shop
    const shopRef = await addDoc(collection(db, 'shops'), {
        ownerUid: 'seed',
        name: 'Green Fields Agri Store',
        address: 'Ahmedabad, Gujarat',
        category: 'Fertilizer Supplier',
        lat: 23.0225,
        lng: 72.5714,
        status: 'active',
        createdAt: serverTimestamp(),
    });

    const shopId = shopRef.id;

    const products = [
        { name: 'NPK Fertilizer 50kg', category: 'Fertilizers', price: 250, stock: 100, description: 'Balanced NPK fertilizer suitable for all crops. Promotes healthy growth.', imageUrl: '' },
        { name: 'DAP Fertilizer 45kg', category: 'Fertilizers', price: 320, stock: 80, description: 'Di-ammonium Phosphate for high phosphorus needs.', imageUrl: '' },
        { name: 'Urea 50kg Bag', category: 'Fertilizers', price: 180, stock: 200, description: 'High nitrogen content for leafy growth.', imageUrl: '' },
        { name: 'Carbofuran Pesticide 1L', category: 'Pesticides', price: 180, stock: 50, description: 'Effective against soil insects and nematodes.', imageUrl: '' },
        { name: 'Chlorpyrifos 500ml', category: 'Pesticides', price: 145, stock: 60, description: 'Broad-spectrum insecticide for field crops.', imageUrl: '' },
        { name: 'Mancozeb Fungicide 500g', category: 'Pesticides', price: 95, stock: 120, description: 'Protects crops from fungal diseases like blight and rust.', imageUrl: '' },
        { name: 'Hybrid Wheat Seeds 5kg', category: 'Seeds', price: 320, stock: 200, description: 'High-yield hybrid wheat variety, drought-resistant.', imageUrl: '' },
        { name: 'BT Cotton Seeds 450g', category: 'Seeds', price: 750, stock: 80, description: 'Bollworm-resistant Bt cotton seeds for high yield.', imageUrl: '' },
        { name: 'Paddy Seeds IR-36 5kg', category: 'Seeds', price: 280, stock: 150, description: 'Short-duration, high-yielding rice variety.', imageUrl: '' },
        { name: 'Drip Irrigation Kit (1 Acre)', category: 'Irrigation', price: 4500, stock: 20, description: 'Complete drip irrigation set for 1 acre. Saves 60% water.', imageUrl: '' },
        { name: 'Sprinkler Set 4-head', category: 'Irrigation', price: 1200, stock: 35, description: '4-head sprinkler system for medium-sized fields.', imageUrl: '' },
        { name: 'Hand Tractor Mini Tiller', category: 'Farm Equipment', price: 12000, stock: 10, description: 'Petrol-powered mini tiller for small and medium farms.', imageUrl: '' },
        { name: 'Knapsack Sprayer 16L', category: 'Farm Equipment', price: 650, stock: 45, description: 'Manual backpack sprayer for pesticide/fertilizer application.', imageUrl: '' },
        { name: 'Organic Vermicompost 25kg', category: 'Organic Products', price: 150, stock: 300, description: 'Rich earthworm compost for natural soil enrichment.', imageUrl: '' },
        { name: 'Cattle Fodder Mix 40kg', category: 'Animal Feed', price: 220, stock: 90, description: 'Nutritious mixed fodder for dairy cattle.', imageUrl: '' },
        { name: 'Sickle / Danti (Sharp)', category: 'Tools', price: 120, stock: 200, description: 'Hand-forged steel sickle for harvesting crops.', imageUrl: '' },
    ];

    await Promise.all(
        products.map(p => addDoc(collection(db, 'products'), { ...p, shopId, createdAt: serverTimestamp() }))
    );

    return 'Seeded 1 shop + ' + products.length + ' products ✅';
}
