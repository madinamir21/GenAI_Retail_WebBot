import React, { useState, useRef, useEffect } from 'react';
import StoreMap from './StoreMap.jsx'
import AuthScreen from './AuthScreen.jsx'
import { useUserData } from './hooks/useUserData.js'
import { franc } from "franc";

// SVG Icons
const Icons = {
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  ShoppingCart: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Check: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  FileText: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
};

// Mock Data
const MOCK_ORDERS = [
  {
    id: '10247', date: 'November 15, 2025', status: 'In Progress',
    items: [
      { name: 'Chicken Breast', qty: 67, price: 2.49 }, { name: 'Brown Rice', qty: 4, price: 3.99 },
      { name: 'Broccoli', qty: 2, price: 1.99 }, { name: 'Olive Oil', qty: 2, price: 8.99 },
      { name: 'Garlic', qty: 3, price: 0.89 }, { name: 'Pasta', qty: 2, price: 1.49 },
      { name: 'Tomato Sauce', qty: 4, price: 2.29 }, { name: 'Spinach', qty: 2, price: 3.49 },
      { name: 'Bell Peppers', qty: 6, price: 1.29 }, { name: 'Greek Yogurt', qty: 3, price: 4.99 },
    ],
    subtotal: 245.00, tax: 22.03, shipping: 0, total: 267.03,
  },
  {
    id: '10168', date: 'November 12, 2025', status: 'Completed',
    items: [
      { name: 'Greek Yogurt', qty: 3, price: 4.99 }, { name: 'Bananas', qty: 2, price: 0.59 },
      { name: 'Almond Butter', qty: 1, price: 7.99 }, { name: 'Honey', qty: 1, price: 5.49 },
      { name: 'Granola', qty: 2, price: 4.29 }, { name: 'Blueberries', qty: 1, price: 4.68 },
    ],
    subtotal: 24.29, tax: 2.43, shipping: 0, total: 26.72,
  },
  {
    id: '10067', date: 'November 8, 2025', status: 'Completed',
    items: [
      { name: 'Organic Milk', qty: 2, price: 5.99 }, { name: 'Whole Wheat Bread', qty: 1, price: 3.49 },
      { name: 'Eggs', qty: 1, price: 4.29 }, { name: 'Fresh Spinach', qty: 1, price: 3.49 },
      { name: 'Cheddar Cheese', qty: 2, price: 5.99 }, { name: 'Butter', qty: 1, price: 4.79 },
      { name: 'Orange Juice', qty: 1, price: 5.49 },
    ],
    subtotal: 43.07, tax: 4.60, shipping: 0, total: 47.67,
  },
];

const MOCK_CART = [
  { id: 1, name: 'Barilla Spaghetti (12oz)', qty: 1, price: 2.99, emoji: '🍝' },
  { id: 2, name: 'Jif Peanut Butter', qty: 2, price: 2.69, emoji: '🥜' },
  { id: 3, name: 'Blueberries (pint)', qty: 1, price: 4.68, emoji: '🫐' },
];

const SAVED_ADDRESSES = [
  { id: 1, label: 'Home', firstName: 'Jason', lastName: 'Zhang', line1: '123 Random ST', line2: '', zip: '45678', city: 'Knoxville', state: 'TN' },
  { id: 2, label: 'Work', firstName: 'Jason', lastName: 'Zhang', line1: '456 Office Blvd', line2: 'Suite 200', zip: '37902', city: 'Knoxville', state: 'TN' },
];

const SAVED_CARDS = [
  { id: 1, label: 'Visa ending 1212', name: 'Jason Zhang', number: '**** **** **** 1212', expMonth: '01', expYear: '26', cvv: '***' },
  { id: 2, label: 'MC ending 5678', name: 'Jason Zhang', number: '**** **** **** 5678', expMonth: '09', expYear: '27', cvv: '***' },
];

// Mock User / Preferences / Settings
// TODO: Replace with real API calls when backend is ready
const MOCK_USER = {
  name: 'Jason',
  displayName: 'Jason',
  email: 'jason.zhang@example.com',
  phone: { country: 'US +1', number: '(865) 712-02**' },
  avatar: null, // URL or null for default icon
  addresses: [
    { id: 1, line1: '123 Random ST', city: 'Knoxville', state: 'TN', zip: '37919', country: 'UNITED STATES', isDefault: true },
  ],
  paymentMethods: [
    { id: 1, type: 'Debit Card', last4: '1212', isDefault: true },
    { id: 2, type: 'Credit Card', last4: '5768', isDefault: false },
  ],
  linkedAccounts: [
    { id: 'google', label: 'Google', linked: false },
    { id: 'instagram', label: 'Instagram', linked: false },
  ],
};

const MOCK_PREFERENCES = {
  diet: {
    type: { value: 'Halal', lastUpdated: 'Nov 20, 2025' },
    restrictions: { values: ['No High Fructose', 'Lactose Free'], lastUpdated: 'Nov 20, 2025' },
    lifestyle: { values: ['High Protein'], lastUpdated: 'Nov 20, 2025' },
  },
  sustainability: {
    enabled: false,
    priorities: ['Recycled Materials', 'Energy Efficiency', 'Animal Welfare'],
  },
};

const MOCK_SETTINGS = {
  notifications: false,
  sound: false,
};

const fmt = (n) => `$${Number(n).toFixed(2)}`;

function getOrderSummary(items) {
  const top = items.slice(0, 4).map(i => `${i.name} x${i.qty}`).join(', ');
  const extra = items.length - 4;
  return extra > 0 ? `${top}, +${extra} more items` : top;
}

// Upload Modal
function UploadModal({ onClose, setMessages }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  function removeChar(item) {
    return item.replace(/[*\,]/g, "").trim();
  }

  function parseFile(text, fileName) {
    const lines = text.split(/\r?\n/);
    if (fileName.endsWith(".csv")) {
      return lines
      .flatMap(line => line.split(","))
      .map(line => removeChar(line.split(",")[0]))
      .filter(line => line);
    } else if (fileName.endsWith(".txt")) {
      return lines 
      .flatMap(line => line.split(","))
      .map(line => removeChar(line))
      .filter(line => line);
    }
    return [];
  }

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitted(true);
  
    try {
      // Read and parse the file
      const text = await file.text();
      const items = parseFile(text, file.name);
  
      // Call API Gateway 
      const response = await fetch(
        "https://3r2pvmau42.execute-api.us-east-1.amazonaws.com/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }
  
      const raw = await response.json();
      const data = raw.body ? JSON.parse(raw.body) : raw;

      if (data.messages) {
        const assistantMessages = data.messages.map((msg, idx) => ({
          id: Date.now() + idx,
          type: 'assistant',
          text: msg,
        }));
  
        setMessages(prev => [...prev, ...assistantMessages]);
      }
  
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to process the shopping list.");
    }

    setTimeout(() => onClose(), 1800);
  };

  return (
    <div style={mStyle.overlay} onClick={onClose}>
      <div style={mStyle.modal} onClick={e => e.stopPropagation()}>
        <div style={mStyle.modalHeader}>
          <h2 style={mStyle.modalTitle}>Upload Shopping List</h2>
          <button onClick={onClose} style={mStyle.closeBtn}><Icons.X /></button>
        </div>
        {submitted ? (
          <div style={mStyle.successBox}>
            <div style={mStyle.successIcon}><Icons.Check /></div>
            <p style={mStyle.successText}>List uploaded successfully!</p>
            <p style={mStyle.successSub}>Processing your items…</p>
          </div>
        ) : (
          <>
            <div
              style={{ ...mStyle.dropZone, ...(dragOver ? mStyle.dropZoneActive : {}), ...(file ? mStyle.dropZoneFilled : {}) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <input ref={inputRef} type="file" accept=".txt,.csv" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              <div style={mStyle.dropIcon}><Icons.FileText /></div>
              {file ? (
                <>
                  <p style={mStyle.fileName}>{file.name}</p>
                  <p style={mStyle.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p style={mStyle.dropText}>Drag & drop your file here</p>
                  <p style={mStyle.dropSub}>or <span style={mStyle.dropLink}>click to browse</span></p>
                </>
              )}
            </div>
            <p style={mStyle.formatHint}>Accepted Formats: .txt, .csv</p>
            <button
              style={{ ...mStyle.submitBtn, ...(file ? {} : mStyle.submitBtnDisabled) }}
              onClick={handleSubmit}
              disabled={!file}
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const mStyle = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '16px', padding: '32px', width: '460px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a1a' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px', borderRadius: '6px', display: 'flex' },
  dropZone: { border: '2px dashed #3CB371', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8fff8', transition: 'all .2s', marginBottom: '14px' },
  dropZoneActive: { background: '#e8f8ee', borderColor: '#2a9a5a', transform: 'scale(1.01)' },
  dropZoneFilled: { background: '#e8f8ee', borderStyle: 'solid' },
  dropIcon: { color: '#3CB371', marginBottom: '12px', display: 'flex', justifyContent: 'center' },
  dropText: { fontSize: '15px', color: '#444', fontWeight: '500', marginBottom: '4px' },
  dropSub: { fontSize: '13px', color: '#888' },
  dropLink: { color: '#3CB371', fontWeight: '600', textDecoration: 'underline' },
  fileName: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
  fileSize: { fontSize: '13px', color: '#666' },
  formatHint: { fontSize: '12px', color: '#999', textAlign: 'center', marginBottom: '20px' },
  submitBtn: { width: '100%', padding: '14px', background: '#3CB371', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  submitBtnDisabled: { background: '#a8d8bc', cursor: 'not-allowed' },
  successBox: { textAlign: 'center', padding: '20px 0' },
  successIcon: { width: '72px', height: '72px', background: '#e8f8ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#3CB371' },
  successText: { fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' },
  successSub: { fontSize: '14px', color: '#888' },
};

// Address Selector Modal
function AddressSelectorModal({ onSelect, onClose }) {
  return (
    <div style={mStyle.overlay} onClick={onClose}>
      <div style={{ ...mStyle.modal, width: '400px' }} onClick={e => e.stopPropagation()}>
        <div style={mStyle.modalHeader}>
          <h2 style={mStyle.modalTitle}>Saved Addresses</h2>
          <button onClick={onClose} style={mStyle.closeBtn}><Icons.X /></button>
        </div>
        {SAVED_ADDRESSES.map(addr => (
          <button key={addr.id} className="addr-card" onClick={() => onSelect(addr)} style={addrStyle.card}>
            <span style={addrStyle.label}>{addr.label}</span>
            <span style={addrStyle.name}>{addr.firstName} {addr.lastName}</span>
            <span style={addrStyle.detail}>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</span>
            <span style={addrStyle.detail}>{addr.city}, {addr.state} {addr.zip}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const addrStyle = {
  card: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', background: '#f8f9fa', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '14px 18px', marginBottom: '12px', cursor: 'pointer', gap: '2px' },
  label: { fontSize: '11px', fontWeight: '700', color: '#3CB371', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' },
  name: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a' },
  detail: { fontSize: '13px', color: '#666' },
};

// Card Selector Modal
function CardSelectorModal({ onSelect, onClose }) {
  return (
    <div style={mStyle.overlay} onClick={onClose}>
      <div style={{ ...mStyle.modal, width: '400px' }} onClick={e => e.stopPropagation()}>
        <div style={mStyle.modalHeader}>
          <h2 style={mStyle.modalTitle}>Saved Cards</h2>
          <button onClick={onClose} style={mStyle.closeBtn}><Icons.X /></button>
        </div>
        {SAVED_CARDS.map(card => (
          <button key={card.id} className="addr-card" onClick={() => onSelect(card)} style={addrStyle.card}>
            <span style={addrStyle.label}>{card.label}</span>
            <span style={addrStyle.name}>{card.name}</span>
            <span style={addrStyle.detail}>Expires {card.expMonth}/{card.expYear}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Order History
function OrderHistory({ orders = [] }) {
  const [expanded, setExpanded] = useState(null);
  // Normalize orders — items may be a JSON string from DynamoDB or an array from mock data
  const normalizedOrders = orders.map(o => ({
    ...o,
    items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
  }));
  return (
    <div style={pageStyle.container}>
      <div style={pageStyle.header}>
        <h1 style={pageStyle.title}>Order History</h1>
        <p style={pageStyle.subtitle}>View your past shopping trips and reorder favorites</p>
      </div>
      <div style={pageStyle.list}>
        {normalizedOrders.length === 0 && (
          <p style={{ color: '#aaa', fontSize: '15px', textAlign: 'center', marginTop: '40px' }}>No orders yet.</p>
        )}
        {normalizedOrders.map(order => (
          <div key={order.id} style={pageStyle.card}>
            <div style={pageStyle.cardTop}>
              <div>
                <p style={pageStyle.orderDate}>{order.date}</p>
                <p style={pageStyle.orderId}>Order #{order.id}</p>
              </div>
              <span style={{ ...pageStyle.badge, ...(order.status === 'In Progress' ? pageStyle.badgeProgress : pageStyle.badgeComplete) }}>
                {order.status}
              </span>
            </div>
            <hr style={pageStyle.divider} />
            <p style={pageStyle.itemSummary}>{getOrderSummary(order.items)}</p>
            <div style={pageStyle.cardBottom}>
              <span style={pageStyle.totalPrice}>{fmt(order.total)}</span>
              <button className="detail-btn" style={pageStyle.detailsBtn} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                {expanded === order.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            {expanded === order.id && (
              <div style={pageStyle.expanded}>
                <table style={pageStyle.table}>
                  <thead>
                    <tr>
                      <th style={pageStyle.th}>Item</th>
                      <th style={{ ...pageStyle.th, textAlign: 'center' }}>Qty</th>
                      <th style={{ ...pageStyle.th, textAlign: 'right' }}>Unit Price</th>
                      <th style={{ ...pageStyle.th, textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} style={i % 2 === 0 ? { background: '#fafafa' } : {}}>
                        <td style={pageStyle.td}>{item.name}</td>
                        <td style={{ ...pageStyle.td, textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ ...pageStyle.td, textAlign: 'right' }}>{fmt(item.price)}</td>
                        <td style={{ ...pageStyle.td, textAlign: 'right' }}>{fmt(item.qty * item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={pageStyle.totals}>
                  <span>Tax: {fmt(order.tax)}</span>
                  <span style={pageStyle.totalBold}>Total: {fmt(order.total)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  container: { padding: '4px 0', width: '100%', maxWidth: '820px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  title: { fontSize: '30px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  orderDate: { fontSize: '12px', color: '#aaa', marginBottom: '3px' },
  orderId: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  badgeProgress: { background: '#FFF3CD', color: '#856404' },
  badgeComplete: { background: '#D1FAE5', color: '#065F46' },
  divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '10px 0' },
  itemSummary: { fontSize: '13px', color: '#666', marginBottom: '14px' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a' },
  detailsBtn: { background: '#3CB371', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background .2s' },
  expanded: { marginTop: '18px', borderTop: '1px solid #f0f0f0', paddingTop: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '13px' },
  th: { padding: '7px 10px', color: '#999', fontWeight: '600', textAlign: 'left', borderBottom: '1px solid #eee' },
  td: { padding: '7px 10px', color: '#333' },
  totals: { display: 'flex', justifyContent: 'flex-end', gap: '24px', fontSize: '13px', color: '#666' },
  totalBold: { fontWeight: '700', color: '#1a1a1a' },
};

// Shopping Cart
function Cart({ sessionId, onCheckout, onBack }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://yjntp2mq03.execute-api.us-east-1.amazonaws.com/cart",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchCart();
  }, [sessionId]);

  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.095;
  const total = subtotal + tax;

  if (loading) return <p style={{ textAlign: "center" }}>Loading cart...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={cartStyle.container}>
      <h1 style={cartStyle.title}>Shopping Cart</h1>
      <div style={cartStyle.items}>
        {cartItems.map(item => (
          <div key={item.id} style={cartStyle.row}>
            <div style={cartStyle.imageContainer}>
              {item.image_url ? ( <img src={item.image_url} alt={item.name} style={cartStyle.image} />) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                alt="No Image" style={cartStyle.image} />
              )}
            </div>
            <span style={cartStyle.itemName}>{item.name}</span>
            <span style={cartStyle.qty}>Qt: {item.qty}</span>
            <span style={cartStyle.price}>{fmt(item.qty * item.price)}</span>
          </div>
        ))}
      </div>
      <div style={cartStyle.summary}>
        <div style={cartStyle.summaryRow}><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
        <div style={cartStyle.summaryRow}><span>Tax:</span><span>{fmt(tax)}</span></div>
        <div style={{ ...cartStyle.summaryRow, ...cartStyle.summaryTotal }}><span>Total Before Shipping:</span><span>{fmt(total)}</span></div>
      </div>
      <div style={cartStyle.actions}>
        <button style={cartStyle.checkoutBtn} onClick={onCheckout}>CHECKOUT</button>
        <button style={cartStyle.backBtn} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

const cartStyle = {
  container: { width: '100%', maxWidth: '680px', margin: '0 auto', padding: '4px 0' },
  title: { fontSize: '26px', fontWeight: '700', textAlign: 'center', marginBottom: '28px', color: '#1a1a1a' },
  items: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' },
  row: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  imageContainer: { width: '60px', textAlign: 'center', flexShrink: 0 },
  image: { width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px' }, 
  itemName: { flex: 1, fontSize: '15px', fontWeight: '500', color: '#1a1a1a' },
  qty: { fontSize: '14px', color: '#777', minWidth: '58px', textAlign: 'center' },
  price: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a', minWidth: '65px', textAlign: 'right' },
  summary: { border: '1px solid #eee', borderRadius: '12px', padding: '16px 22px', marginBottom: '22px', background: '#fafafa' },
  summaryRow: { display: 'flex', justifyContent: 'flex-end', gap: '28px', fontSize: '14px', color: '#666', marginBottom: '7px' },
  summaryTotal: { fontSize: '15px', fontWeight: '700', color: '#1a1a1a', paddingTop: '8px', borderTop: '1px solid #e4e4e4', marginTop: '4px', marginBottom: 0 },
  actions: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '260px', margin: '0 auto' },
  checkoutBtn: { padding: '13px', background: '#FFBABA', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', color: '#7a0000', letterSpacing: '0.5px' },
  backBtn: { padding: '13px', background: '#FFD4D4', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#7a0000' },
};

// Address Form
function AddressForm({ title, data, onChange, onContinue, onBack, extraAction }) {
  const [showSelector, setShowSelector] = useState(false);
  const handleSelect = (addr) => { onChange({ ...addr }); setShowSelector(false); };
  const fields = [
    { label: 'First Name', key: 'firstName' }, { label: 'Last Name', key: 'lastName' },
    { label: 'Address Line 1', key: 'line1' }, { label: 'Address Line 2', key: 'line2' },
    { label: 'City', key: 'city' }, { label: 'State', key: 'state' },
    { label: 'Zip Code', key: 'zip', short: true },
  ];
  return (
    <>
      {showSelector && <AddressSelectorModal onSelect={handleSelect} onClose={() => setShowSelector(false)} />}
      <div style={formStyle.page}>
        <div style={formStyle.card}>
          <h2 style={formStyle.title}>{title}</h2>
          <div style={formStyle.grid}>
            {fields.map(f => (
              <div key={f.key} style={formStyle.field}>
                <label style={formStyle.label}>{f.label}</label>
                <input style={{ ...formStyle.input, ...(f.short ? formStyle.inputShort : {}) }} value={data[f.key] || ''} onChange={e => onChange({ ...data, [f.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={formStyle.actions}>
            <button style={formStyle.actionBtn} onClick={() => setShowSelector(true)}>Select Address</button>
            {extraAction && <button style={formStyle.actionBtn} onClick={extraAction.fn}>{extraAction.label}</button>}
            <button style={formStyle.actionBtn} onClick={onContinue}>Continue</button>
            <button style={formStyle.actionBtn} onClick={onBack}>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}

const formStyle = {
  page: { display: 'flex', justifyContent: 'center', paddingTop: '10px', width: '100%' },
  card: { background: '#FFD9D9', borderRadius: '16px', padding: '32px 40px', width: '100%', maxWidth: '500px' },
  title: { fontSize: '21px', fontWeight: '700', color: '#1a1a1a', marginBottom: '22px', textAlign: 'center' },
  grid: { display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '22px' },
  field: { display: 'flex', alignItems: 'center', gap: '10px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444', minWidth: '120px', textAlign: 'right' },
  input: { flex: 1, padding: '8px 11px', border: 'none', borderRadius: '6px', fontSize: '14px', background: 'white', outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  inputShort: { flex: 'none', width: '80px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '9px', alignItems: 'center' },
  actionBtn: { width: '195px', padding: '10px', background: '#B5DCF7', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#1a3a5c' },
};

// Payment Form
function PaymentForm({ data, onChange, onReview, onBack }) {
  const [showSelector, setShowSelector] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i).slice(2));
  const handleSelect = (card) => { onChange({ name: card.name, number: card.number, expMonth: card.expMonth, expYear: card.expYear, cvv: card.cvv }); setShowSelector(false); };
  return (
    <>
      {showSelector && <CardSelectorModal onSelect={handleSelect} onClose={() => setShowSelector(false)} />}
      <div style={formStyle.page}>
        <div style={formStyle.card}>
          <h2 style={formStyle.title}>Enter Payment Information</h2>
          <div style={formStyle.grid}>
            {[{ label: 'Cardholder Name', key: 'name' }, { label: 'Card Number', key: 'number' }].map(f => (
              <div key={f.key} style={formStyle.field}>
                <label style={formStyle.label}>{f.label}</label>
                <input style={formStyle.input} value={data[f.key] || ''} onChange={e => onChange({ ...data, [f.key]: e.target.value })} />
              </div>
            ))}
            <div style={formStyle.field}>
              <label style={formStyle.label}>Expiration Date</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select style={{ ...formStyle.input, flex: 'none', width: '68px' }} value={data.expMonth || ''} onChange={e => onChange({ ...data, expMonth: e.target.value })}>
                  <option value="">MM</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select style={{ ...formStyle.input, flex: 'none', width: '68px' }} value={data.expYear || ''} onChange={e => onChange({ ...data, expYear: e.target.value })}>
                  <option value="">YY</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div style={formStyle.field}>
              <label style={formStyle.label}>CVV</label>
              <input style={{ ...formStyle.input, flex: 'none', width: '75px' }} maxLength={4} value={data.cvv || ''} onChange={e => onChange({ ...data, cvv: e.target.value })} />
            </div>
          </div>
          <div style={formStyle.actions}>
            <button style={formStyle.actionBtn} onClick={() => setShowSelector(true)}>Select Card</button>
            <button style={formStyle.actionBtn} onClick={onReview}>Review</button>
            <button style={formStyle.actionBtn} onClick={onBack}>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}

// Review Page
function ReviewPage({ shipping, billing, payment, cartItems, onConfirm, onBack }) {
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.095;
  const shippingCost = 2.99;
  const total = subtotal + tax + shippingCost;
  const fmtAddr = (a) => [
    `${a.firstName} ${a.lastName}`,
    `${a.line1}${a.line2 ? ' ' + a.line2 : ''}`,
    `${a.city}, ${a.state} ${a.zip}`,
  ].filter(Boolean);
  return (
    <div style={formStyle.page}>
      <div style={formStyle.card}>
        <h2 style={formStyle.title}>Review Information</h2>
        {[
          { label: 'Ship To:', lines: fmtAddr(shipping) },
          { label: 'Billing Address:', lines: fmtAddr(billing) },
          { label: 'Card Information:', lines: [payment.name, payment.number, `${payment.expMonth}/${payment.expYear}`] },
        ].map(r => (
          <div key={r.label} style={reviewStyle.row}>
            <span style={reviewStyle.rowLabel}>{r.label}</span>
            <div style={reviewStyle.rowValue}>{r.lines.map((l, i) => <div key={i}>{l}</div>)}</div>
          </div>
        ))}
        <div style={reviewStyle.row}>
          <div style={{ width: '100%' }}>
            <div style={reviewStyle.totalRow}><span>Total Before Shipping:</span><span>{fmt(subtotal + tax)}</span></div>
            <div style={reviewStyle.totalRow}><span>Shipping Cost:</span><span>{fmt(shippingCost)}</span></div>
            <div style={{ ...reviewStyle.totalRow, fontWeight: '700', fontSize: '15px', borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '4px' }}><span>Total:</span><span>{fmt(total)}</span></div>
          </div>
        </div>
        <div style={formStyle.actions}>
          <button style={formStyle.actionBtn} onClick={onConfirm}>Confirm</button>
          <button style={formStyle.actionBtn} onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  );
}

const reviewStyle = {
  row: { display: 'flex', gap: '14px', background: 'white', borderRadius: '8px', padding: '13px 16px', marginBottom: '10px', fontSize: '14px' },
  rowLabel: { fontWeight: '700', color: '#666', minWidth: '130px', flexShrink: 0 },
  rowValue: { color: '#1a1a1a', lineHeight: '1.65' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#444', fontSize: '14px' },
};

// Confirmation
function ConfirmationPage({ onBackToChat }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', paddingTop: '80px' }}>
      <div style={{ width: '90px', height: '90px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3CB371' }}>
        <Icons.Check />
      </div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>Order Confirmed!</h2>
      <p style={{ fontSize: '15px', color: '#777', textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
        Thank you for your purchase. Your order is being processed and you'll receive a confirmation email shortly.
      </p>
      <button style={{ marginTop: '16px', padding: '13px 36px', background: '#3CB371', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }} onClick={onBackToChat}>
        Back to Chat
      </button>
    </div>
  );
}

// Toggle Switch
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '52px', height: '28px', borderRadius: '14px', border: 'none', cursor: 'pointer',
        background: on ? '#3CB371' : '#bbb', position: 'relative', transition: 'background .2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px', left: on ? '26px' : '3px', width: '22px', height: '22px',
        background: 'white', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </button>
  );
}

// Settings Page
function SettingsPage({ onViewProfile, settings, onToggle }) {
  const items = [
    { key: 'notifications', label: 'Notifications' },
    { key: 'sound', label: 'Sound' },
  ];

  return (
    <div style={settingsStyle.page}>
      <h1 style={settingsStyle.title}>Settings</h1>

      {/* My Profile */}
      <div style={settingsStyle.card}>
        <span style={settingsStyle.cardLabel}>My Profile</span>
        <button style={settingsStyle.editLink} onClick={onViewProfile}>Edit</button>
      </div>

      {/* Toggles */}
      {items.map(({ key, label }) => (
        <div key={key} style={settingsStyle.card}>
          <span style={settingsStyle.cardLabel}>{label}</span>
          <Toggle on={settings[key]} onChange={() => onToggle(key)} />
        </div>
      ))}
    </div>
  );
}

const settingsStyle = {
  page: { width: '100%', maxWidth: '700px', margin: '0 auto', padding: '4px 0', display: 'flex', flexDirection: 'column', gap: '14px' },
  title: { fontSize: '30px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' },
  card: { background: '#f4f4f4', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  cardLabel: { fontSize: '17px', fontWeight: '600', color: '#1a1a1a' },
  editLink: { background: 'none', border: 'none', fontSize: '15px', fontWeight: '600', color: '#1a1a1a', textDecoration: 'underline', cursor: 'pointer' },
};

// Diet Options + Helpers
const DIET_OPTIONS = {
  type: ['Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher'],
  restrictions: ['Gluten Free', 'Dairy Free', 'Nut Free', 'Lactose Free', 'Soy Free', 'Low Sodium', 'No High Fructose'],
  lifestyle: ['High Protein', 'Low Carb', 'Keto', 'Paleo', 'Low Calorie', 'High Fiber'],
};

function DietEditModal({ prefKey, currentValues, isType, onApply, onClose }) {
  const options = DIET_OPTIONS[prefKey] || [];
  const [selected, setSelected] = useState([...currentValues]);
  const toggle = (opt) => {
    if (isType) { setSelected([opt]); return; }
    setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]);
  };
  return (
    <div style={mStyle.overlay} onClick={onClose}>
      <div style={{ ...mStyle.modal, width: '400px' }} onClick={e => e.stopPropagation()}>
        <div style={mStyle.modalHeader}>
          <h2 style={mStyle.modalTitle}>Edit {prefKey?.charAt(0).toUpperCase() + prefKey?.slice(1)}</h2>
          <button onClick={onClose} style={mStyle.closeBtn}><Icons.X /></button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {options.map(opt => (
            <button key={opt} onClick={() => toggle(opt)} style={{
              padding: '7px 16px', borderRadius: '20px', border: '2px solid',
              borderColor: selected.includes(opt) ? '#3CB371' : '#ddd',
              background: selected.includes(opt) ? '#d4f0df' : '#f8f8f8',
              color: selected.includes(opt) ? '#1a5c35' : '#555',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>{opt}</button>
          ))}
        </div>
        <button style={mStyle.submitBtn} onClick={() => onApply(selected)}>Apply</button>
      </div>
    </div>
  );
}

function InlineInput({ value, onChange, onSave, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, padding: '5px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
        onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel(); }}
        autoFocus
      />
      <button style={{ background: '#c8ecd4', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', color: '#1a5c35', cursor: 'pointer' }} onClick={onSave}>SAVE</button>
      <button style={{ background: '#f0f0f0', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', color: '#555', cursor: 'pointer' }} onClick={onCancel}>CANCEL</button>
    </div>
  );
}

// Profile Page
function ProfilePage({ onBack, profile: profileProp, preferences: prefsProp, addresses: addressesProp = [], paymentMethods: paymentsProp = [], onSaveProfile, onSavePreferences, onAddAddress, onRemoveAddress, onAddPaymentMethod, onRemovePaymentMethod }) {
  const [user, setUser] = useState({
    name: profileProp?.displayName || '',
    displayName: profileProp?.displayName || '',
    email: profileProp?.email || '',
    phone: { country: profileProp?.phoneCountry || 'US +1', number: profileProp?.phoneNumber || '' },
    avatar: null,
    addresses: addressesProp,
    paymentMethods: paymentsProp.map(p => ({ id: p.id, type: p.cardType, last4: p.last4, isDefault: p.isDefault })),
    linkedAccounts: [{ id: 'google', label: 'Google', linked: false }, { id: 'instagram', label: 'Instagram', linked: false }],
  });
  const [prefs, setPrefs] = useState({
    diet: {
      type: { value: prefsProp?.dietType || '', lastUpdated: '' },
      restrictions: { values: prefsProp?.dietRestrictions || [], lastUpdated: '' },
      lifestyle: { values: prefsProp?.dietLifestyle || [], lastUpdated: '' },
    },
    sustainability: {
      enabled: prefsProp?.sustainabilityOn || false,
      priorities: prefsProp?.sustainabilityPriorities || [],
    },
  });
  const [sustainabilityOn, setSustainabilityOn] = useState(prefsProp?.sustainabilityOn || false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const avatarInputRef = useRef();
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', line1: '', city: '', state: '', zip: '', country: 'UNITED STATES' });
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: '', last4: '' });
  const [editPrefKey, setEditPrefKey] = useState(null);
  const [selectedPriorities, setSelectedPriorities] = useState(prefsProp?.sustainabilityPriorities || []);
  const [saved, setSaved] = useState(false);

  const togglePriority = (p) => setSelectedPriorities(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p]);

  const startEdit = (field, val) => { setEditField(field); setEditValue(val); };
  const saveField = (field) => {
    if (field === 'email') setUser(u => ({ ...u, email: editValue }));
    else if (field === 'phone') setUser(u => ({ ...u, phone: { ...u.phone, number: editValue } }));
    else if (field === 'displayName') setUser(u => ({ ...u, displayName: editValue }));
    setEditField(null);
  };
  const removeAddress = (id) => {
    setUser(u => ({ ...u, addresses: u.addresses.filter(a => a.id !== id) }));
    onRemoveAddress?.(id);
  };
  const addAddress = async () => {
    if (!newAddr.line1) return;
    const saved = await onAddAddress?.(newAddr) || { ...newAddr, id: Date.now(), isDefault: false };
    setUser(u => ({ ...u, addresses: [...u.addresses, saved] }));
    setNewAddr({ label: '', line1: '', city: '', state: '', zip: '', country: 'UNITED STATES' });
    setAddingAddress(false);
  };
  const removePayment = (id) => {
    setUser(u => ({ ...u, paymentMethods: u.paymentMethods.filter(p => p.id !== id) }));
    onRemovePaymentMethod?.(id);
  };
  const addPayment = async () => {
    if (!newPayment.type || !newPayment.last4) return;
    const saved = await onAddPaymentMethod?.({ cardType: newPayment.type, last4: newPayment.last4, isDefault: false }) || { ...newPayment, id: Date.now(), isDefault: false };
    setUser(u => ({ ...u, paymentMethods: [...u.paymentMethods, { id: saved.id, type: saved.cardType || newPayment.type, last4: saved.last4 || newPayment.last4, isDefault: false }] }));
    setNewPayment({ type: '', last4: '' });
    setAddingPayment(false);
  };
  const clearPref = (key) => {
    setPrefs(p => {
      if (key === 'type') return { ...p, diet: { ...p.diet, type: { ...p.diet.type, value: '' } } };
      return { ...p, diet: { ...p.diet, [key]: { ...p.diet[key], values: [] } } };
    });
  };
  const applyPref = (key, selected) => {
    setPrefs(p => {
      if (key === 'type') return { ...p, diet: { ...p.diet, type: { value: selected[0] || '', lastUpdated: 'Now' } } };
      return { ...p, diet: { ...p.diet, [key]: { ...p.diet[key], values: selected, lastUpdated: 'Now' } } };
    });
    setEditPrefKey(null);
  };
  const handleSave = async () => {
    await onSaveProfile?.({ displayName: user.displayName, email: user.email, phoneCountry: user.phone?.country, phoneNumber: user.phone?.number });
    await onSavePreferences?.({ dietType: prefs.diet.type.value, dietRestrictions: prefs.diet.restrictions.values, dietLifestyle: prefs.diet.lifestyle.values, sustainabilityOn, sustainabilityPriorities: selectedPriorities });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const GreenTag = ({ label }) => <span style={profStyle.greenTag}>{label}</span>;

  const SectionBlock = ({ title, prefKey, tags, lastUpdated }) => (
    <div style={profStyle.prefBlock}>
      <div style={profStyle.prefBlockHeader}>
        <span style={profStyle.prefBlockTitle}>{title}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          <button style={profStyle.smallBtn} onClick={() => setEditPrefKey(prefKey)}>EDIT</button>
          <button style={profStyle.smallBtnGhost} onClick={() => clearPref(prefKey)}>CLEAR</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        {tags.filter(Boolean).map(t => <GreenTag key={t} label={t} />)}
        {tags.filter(Boolean).length === 0 && <span style={{ fontSize: '13px', color: '#aaa' }}>None set</span>}
      </div>
      <span style={profStyle.lastUpdated}>Last updated on {lastUpdated}</span>
    </div>
  );

  return (
    <div style={profStyle.page}>
      {editPrefKey && (
        <DietEditModal
          prefKey={editPrefKey}
          currentValues={editPrefKey === 'type' ? (prefs.diet.type.value ? [prefs.diet.type.value] : []) : (prefs.diet[editPrefKey]?.values || [])}
          isType={editPrefKey === 'type'}
          onApply={(selected) => applyPref(editPrefKey, selected)}
          onClose={() => setEditPrefKey(null)}
        />
      )}
      <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files[0]; if (f) setAvatarSrc(URL.createObjectURL(f)); }} />

      <h1 style={profStyle.title}>Super Awesome Shopper Helper</h1>

      {/* My Account */}
      <div style={profStyle.accountRow}>
        <div style={{ position: 'relative', marginRight: '24px' }}>
          <div style={{ ...profStyle.avatar, cursor: 'pointer' }} onClick={() => avatarInputRef.current.click()}>
            {avatarSrc ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <Icons.User />}
          </div>
          <button style={profStyle.avatarEdit} onClick={() => avatarInputRef.current.click()}>✏️</button>
          <div style={profStyle.avatarName}>{user.displayName}</div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={profStyle.accountTitle}>MY ACCOUNT</h2>

          <div style={profStyle.fieldRow}>
            <span style={profStyle.fieldLabel}>EMAIL:</span>
            {editField === 'email'
              ? <InlineInput value={editValue} onChange={setEditValue} onSave={() => saveField('email')} onCancel={() => setEditField(null)} />
              : <><span style={profStyle.fieldValue}>{user.email}</span><button style={profStyle.greenBtn} onClick={() => startEdit('email', user.email)}>EDIT</button></>
            }
          </div>

          <div style={profStyle.fieldRow}>
            <span style={profStyle.fieldLabel}>PHONE:</span>
            {editField === 'phone'
              ? <InlineInput value={editValue} onChange={setEditValue} onSave={() => saveField('phone')} onCancel={() => setEditField(null)} />
              : <><span style={profStyle.fieldValue}>🇺🇸 {user.phone.country} | {user.phone.number}</span><button style={profStyle.greenBtn} onClick={() => startEdit('phone', user.phone.number)}>EDIT</button></>
            }
          </div>

          <div style={profStyle.fieldRow}>
            <span style={profStyle.fieldLabel}>What Should We Call You?</span>
          </div>
          <div style={profStyle.fieldRow}>
            {editField === 'displayName'
              ? <InlineInput value={editValue} onChange={setEditValue} onSave={() => saveField('displayName')} onCancel={() => setEditField(null)} />
              : <><span style={{ ...profStyle.fieldValue, flex: 1, background: '#f4f4f4', borderRadius: '6px', padding: '6px 12px' }}>{user.displayName}</span><button style={profStyle.greenBtn} onClick={() => startEdit('displayName', user.displayName)}>EDIT</button></>
            }
          </div>
        </div>
      </div>

      {/* Addresses + Payments */}
      <div style={profStyle.twoCol}>
        <div style={profStyle.colBox}>
          <h3 style={profStyle.colTitle}>MY ADDRESSES</h3>
          {user.addresses.map(a => (
            <div key={a.id} style={profStyle.addrCard}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: '#1a1a1a' }}>{a.line1}</div>
                <div style={{ fontSize: '13px', color: '#555' }}>{a.city}, {a.state} {a.zip}</div>
                <div style={{ fontSize: '13px', color: '#555' }}>{a.country}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                {a.isDefault && <span style={profStyle.defaultTag}>DEFAULT</span>}
                <button style={profStyle.removeBtn} onClick={() => removeAddress(a.id)}>REMOVE</button>
              </div>
            </div>
          ))}
          {addingAddress ? (
            <div style={{ background: '#f0faf4', borderRadius: '10px', padding: '12px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[['Label', 'label'], ['Street', 'line1'], ['City', 'city'], ['State', 'state'], ['Zip', 'zip']].map(([lbl, key]) => (
                <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#555', minWidth: '44px' }}>{lbl}</span>
                  <input style={{ flex: 1, padding: '5px 8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }} value={newAddr[key]} onChange={e => setNewAddr(a => ({ ...a, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button style={profStyle.greenBtn} onClick={addAddress}>SAVE</button>
                <button style={{ background: '#f0f0f0', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', color: '#555', cursor: 'pointer' }} onClick={() => setAddingAddress(false)}>CANCEL</button>
              </div>
            </div>
          ) : (
            <button style={profStyle.addDashedBtn} onClick={() => setAddingAddress(true)}>+ &nbsp; Add Address</button>
          )}
        </div>

        <div style={profStyle.colBox}>
          <h3 style={profStyle.colTitle}>MY PAYMENT METHODS ({user.paymentMethods.length})</h3>
          {user.paymentMethods.map(p => (
            <div key={p.id} style={profStyle.addrCard}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: '#1a1a1a' }}>{p.type} Ending In ***{p.last4}</div>
                {p.isDefault && <span style={profStyle.defaultTag}>DEFAULT</span>}
              </div>
              <button style={profStyle.removeBtn} onClick={() => removePayment(p.id)}>REMOVE</button>
            </div>
          ))}
          {addingPayment ? (
            <div style={{ background: '#f0faf4', borderRadius: '10px', padding: '12px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', minWidth: '44px' }}>Type</span>
                <select style={{ flex: 1, padding: '5px 8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }} value={newPayment.type} onChange={e => setNewPayment(p => ({ ...p, type: e.target.value }))}>
                  <option value="">Select…</option>
                  <option>Debit Card</option>
                  <option>Credit Card</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', minWidth: '44px' }}>Last 4</span>
                <input maxLength={4} style={{ width: '80px', padding: '5px 8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }} value={newPayment.last4} onChange={e => setNewPayment(p => ({ ...p, last4: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button style={profStyle.greenBtn} onClick={addPayment}>SAVE</button>
                <button style={{ background: '#f0f0f0', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', color: '#555', cursor: 'pointer' }} onClick={() => setAddingPayment(false)}>CANCEL</button>
              </div>
            </div>
          ) : (
            <button style={profStyle.addDashedBtn} onClick={() => setAddingPayment(true)}>+ &nbsp; Add a payment method</button>
          )}
        </div>
      </div>

      {/* Preferences */}
      <h2 style={profStyle.sectionHeader}>PREFERENCES</h2>

      <h3 style={profStyle.subHeader}>DIET</h3>
      <SectionBlock title="Type" prefKey="type" tags={[prefs.diet.type.value]} lastUpdated={prefs.diet.type.lastUpdated} />
      <SectionBlock title="Restrictions" prefKey="restrictions" tags={prefs.diet.restrictions.values} lastUpdated={prefs.diet.restrictions.lastUpdated} />
      <SectionBlock title="Lifestyle" prefKey="lifestyle" tags={prefs.diet.lifestyle.values} lastUpdated={prefs.diet.lifestyle.lastUpdated} />

      <h3 style={{ ...profStyle.subHeader, marginTop: '20px' }}>SUSTAINABILITY</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', color: '#333' }}>Get personalized recommendations for more sustainable items</span>
        <Toggle on={sustainabilityOn} onChange={setSustainabilityOn} />
      </div>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>What matters to you?</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {['Recycled Materials', 'Energy Efficiency', 'Animal Welfare'].map(p => {
          const on = selectedPriorities.includes(p);
          return (
            <button key={p} onClick={() => togglePriority(p)} style={{
              padding: '7px 16px', borderRadius: '20px', border: '2px solid',
              borderColor: on ? '#c9a000' : '#ddd',
              background: on ? '#FFF3CD' : '#f4f4f4',
              color: on ? '#7a5c00' : '#888',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all .15s',
            }}>{p}</button>
          );
        })}
      </div>

      <button style={{ ...profStyle.saveBtn, background: saved ? '#d4f0df' : '#FFBF7A', color: saved ? '#1a5c35' : '#7a3a00' }} onClick={handleSave}>
        {saved ? 'SAVED ✓' : 'SAVE'}
      </button>

      <button onClick={onBack} style={profStyle.backCircle}>←</button>
    </div>
  );
}

const profStyle = {
  page: { width: '100%', maxWidth: '860px', margin: '0 auto', padding: '4px 0 40px', position: 'relative' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' },
  accountRow: { display: 'flex', alignItems: 'flex-start', marginBottom: '24px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: '#d8edd8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3CB371', fontSize: '36px' },
  avatarEdit: { position: 'absolute', bottom: '28px', right: '-4px', background: '#f5a623', border: 'none', borderRadius: '6px', padding: '3px 5px', fontSize: '14px', cursor: 'pointer' },
  avatarName: { textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginTop: '6px' },
  accountTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px', letterSpacing: '0.5px' },
  fieldRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' },
  fieldLabel: { fontSize: '12px', fontWeight: '700', color: '#333', textTransform: 'uppercase', minWidth: '52px' },
  fieldValue: { fontSize: '14px', color: '#1a1a1a' },
  greenBtn: { background: '#c8ecd4', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', color: '#1a5c35', cursor: 'pointer' },
  socialRow: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f4', borderRadius: '8px', padding: '6px 12px' },
  socialLabel: { fontSize: '13px', color: '#1a1a1a' },
  twoCol: { display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' },
  colBox: { flex: 1, minWidth: '260px' },
  colTitle: { fontSize: '12px', fontWeight: '800', color: '#333', marginBottom: '12px', letterSpacing: '0.5px' },
  addrCard: { display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f4f4f4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' },
  defaultTag: { fontSize: '11px', fontStyle: 'italic', color: '#555', fontWeight: '600' },
  removeBtn: { background: '#c8ecd4', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', color: '#1a5c35', cursor: 'pointer' },
  addDashedBtn: { width: '100%', padding: '12px', background: 'transparent', border: '2px dashed #3CB371', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#3CB371', cursor: 'pointer' },
  sectionHeader: { fontSize: '14px', fontWeight: '800', color: '#333', letterSpacing: '1px', marginBottom: '14px', borderBottom: '1px solid #eee', paddingBottom: '8px' },
  subHeader: { fontSize: '13px', fontWeight: '800', color: '#555', letterSpacing: '0.5px', marginBottom: '12px', marginTop: '4px' },
  prefBlock: { background: '#f4f4f4', borderRadius: '12px', padding: '14px 18px', marginBottom: '12px' },
  prefBlockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  prefBlockTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a' },
  smallBtn: { background: '#c8ecd4', border: 'none', borderRadius: '5px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: '#1a5c35', cursor: 'pointer' },
  smallBtnGhost: { background: '#c8ecd4', border: 'none', borderRadius: '5px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: '#1a5c35', cursor: 'pointer' },
  greenTag: { background: '#d4f0df', borderRadius: '6px', padding: '5px 14px', fontSize: '13px', fontWeight: '600', color: '#1a5c35' },
  lastUpdated: { fontSize: '12px', color: '#888' },
  saveBtn: { background: '#FFBF7A', border: 'none', borderRadius: '8px', padding: '10px 30px', fontSize: '14px', fontWeight: '700', color: '#7a3a00', cursor: 'pointer', marginBottom: '16px' },
  backCircle: { position: 'fixed', bottom: '30px', left: '230px', width: '48px', height: '48px', borderRadius: '50%', background: '#3CB371', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' },
};

// Main App
export default function App() {
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('authUser')) } catch { return null }
  });

  const { profile, preferences, settings: userSettings, addresses, paymentMethods, orders, loading: dataLoading, saveProfile, savePreferences, saveSettings, addAddress, removeAddress, addPaymentMethod, removePaymentMethod } = useUserData(authUser);

  const toggleSetting = async (key) => {
    await saveSettings({ ...(userSettings || {}), [key]: !(userSettings?.[key]) });
  };

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [view, setView] = useState('chat');
  const [showUpload, setShowUpload] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [shipping, setShipping] = useState({ firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '' });
  const [billing, setBilling] = useState({ firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '' });
  const [payment, setPayment] = useState({ name: '', number: '', expMonth: '', expYear: '', cvv: '' });
  const [cartItems] = useState([]);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const [showFade, setShowFade] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const navigate = (v) => { setView(v); setActiveNav(v); };

  // Determine locale based on language
  const determineLocale = (text) => {
    if (/[\u4E00-\u9FFF]/.test(text)) return "zh_CN";

    const lang = franc(text);
    if (lang === "cmn") return "zh_CN";
    if (lang === "spa") return "es_US";

    return "en_US";
  };

  // AWS Bedrock integration
  const sendMessage = async (msg, sessionId, localeId) => {
    console.log("Sending message:", msg, "Locale:", localeId, "Session:", sessionId);

    try {
      const response = await fetch(
        "https://bsqk8gu8cc.execute-api.us-east-1.amazonaws.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: msg,
            sessionId: sessionId, 
            localeId: localeId,
          }),
        }
      );
      const data = await response.json();
      console.log("Lex response:", data);
      return data;
    } catch (error) {
      console.error("API error:", error);
      return { text: "Server error. Please try again." };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const localeId = determineLocale(inputValue);
    const newSessionId = `${authUser?.userId}-${localeId}`;

    setSessionId(newSessionId);

    const userMsg = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    try {
      const res = await sendMessage(inputValue, newSessionId, localeId);

      // Each Lex message has its own bubble
      const assistantMessages = res.messages.map((msg, idx) => ({
        id: Date.now() + idx + 1,
        type: 'assistant',
        text: msg,
      }));

      setMessages(prev => [...prev, ...assistantMessages]);

    } finally { setIsLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  const toggleRecording = async () => {
    if (!recording) {
 
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
      // Determine supported mimeType
      let mimeType;
      if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else {
        mimeType = ""; 
        console.warn("Neither MP4 nor WebM is supported. Using default format.");
      }
  
      // Create MediaRecorder with the chosen MIME type
      mediaRecorderRef.current = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
  
        const blob = new Blob(chunks, { type: mediaRecorderRef.current.mimeType });
        setAudioBlob(blob);
  
        // Transcribe audio
        const textMessage = await transcribeAudio(blob);
        setInputValue(textMessage);
  
        setRecording(false);
      };
  
      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (blob) => {
    try {
      // Convert to base64
      const reader = new FileReader();
      const base64Audio = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // remove data:<type>;base64,
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const mimeType = blob.type.split(';')[0];
  
      // Send to Lambda with the correct mimeType
      const response = await fetch(
        "https://v9m2i36p8e.execute-api.us-east-1.amazonaws.com/transcribe", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio: base64Audio,
            mimeType: mimeType,
          }),
        }
      );
  
      const data = await response.json();
      return data.text;
  
    } catch (err) {
      console.error("Transcription error:", err);
      return "";
    }
  };

  const handleNavClick = (key) => {
    if (key === 'upload') { setShowUpload(true); return; }
    if (key === 'chat') { setView('chat'); setActiveNav('chat'); return; }
    if (key === 'orderHistory') { navigate('orderHistory'); return; }
    if (key === 'map') { navigate('map'); return; }
  };

  const goBack = () => {
    const prev = { cart: 'chat', shipping: 'cart', billing: 'shipping', payment: 'billing', review: 'payment', orderHistory: 'chat', settings: 'chat', profile: 'chat', map: 'chat' };
    const next = prev[view] || 'chat';
    setView(next);
    if (next === 'chat') setActiveNav(null);
  };

  const checkoutSteps = ['cart', 'shipping', 'billing', 'payment', 'review'];

  const renderContent = () => {
    if (view === 'settings') return <SettingsPage onViewProfile={() => { setView('profile'); setShowUserMenu(false); }} settings={userSettings || {}} onToggle={toggleSetting} />;
    if (view === 'profile') return <ProfilePage onBack={() => setView('chat')} profile={profile} preferences={preferences} addresses={addresses} paymentMethods={paymentMethods} onSaveProfile={saveProfile} onSavePreferences={savePreferences} onAddAddress={addAddress} onRemoveAddress={removeAddress} onAddPaymentMethod={addPaymentMethod} onRemovePaymentMethod={removePaymentMethod} />;
    if (view === 'orderHistory') return <OrderHistory orders={orders} />;
    if (view === 'map') return <StoreMap />;
    if (view === 'cart') return <Cart sessionId={authUser?.userId} onCheckout={() => setView('shipping')} onBack={goBack} />;
    if (view === 'shipping') return <AddressForm title="Enter Shipping Address" data={shipping} onChange={setShipping} onContinue={() => setView('billing')} onBack={goBack} />;
    if (view === 'billing') return <AddressForm title="Enter Billing Address" data={billing} onChange={setBilling} onContinue={() => setView('payment')} onBack={goBack} extraAction={{ label: 'Same as Shipping', fn: () => { setBilling({ ...shipping }); setView('payment'); } }} />;
    if (view === 'payment') return <PaymentForm data={payment} onChange={setPayment} onReview={() => setView('review')} onBack={goBack} />;
    if (view === 'review') return <ReviewPage shipping={shipping} billing={billing} payment={payment} cartItems={cartItems} onConfirm={() => setView('confirmed')} onBack={goBack} />;
    if (view === 'confirmed') return <ConfirmationPage onBackToChat={() => { setView('chat'); setActiveNav(null); }} />;

    // Chat view
    return (
      <div style={{ ...appStyle.chatArea, justifyContent: messages.length === 0 ? 'center' : 'flex-start' }}>
        {messages.length === 0 ? (
          <div style={appStyle.welcomeContainer}>
            <h2 style={appStyle.welcomeTitle}>What are we craving today?</h2>
            <div style={appStyle.inputContainer}>
              <input type="text" placeholder="Let's stock up..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKey} style={appStyle.chatInput} />
              {/* Red toggle mic button */}
              <div style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                {recording && ( <span style={{ position: 'absolute', top: '-10px', left: '-10px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,0,0,0.3)',
                  animation: 'pulse 1s infinite', }} />)}
                <button onClick={toggleRecording} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: recording ? '#FF4444' : '#D32F2F', cursor: 'pointer',
                  transform: recording ? 'translateY(-4px) rotate(5deg)' : 'none', transition: 'all 0.2s ease', boxShadow: recording ? '0 4px 15px rgba(255,0,0,0.6)' : '0 2px 5px rgba(0,0,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
                  <img src={ recording ? 'https://www.clker.com/cliparts/l/i/L/g/d/e/talk-radio-microphone-md.png' : 'https://cdn.creazilla.com/icons/3204588/mic-off-icon-lg.png' } alt="mic"
                    style={{ width: '30px', height: '30px', pointerEvents: 'none', filter: 'invert(1)', }} />
                </button>
                <style>{`
                  @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                    100% { transform: scale(1); opacity: 0.7; }
                  }
                `}</style>
              </div>
              <button className="send-btn" style={appStyle.sendBtn} onClick={handleSendMessage} disabled={!inputValue.trim()}><Icons.MessageSquare /></button>
            </div>
          </div>
        ) : (
          <div style={appStyle.conversationContainer}>
            <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={appStyle.messagesContainer} onScroll={e => setShowFade(e.target.scrollTop > 20)}>
                {messages.map(msg => {
                  
                  // Extract image URL if present
                  const url = msg.text ? msg.text.match(/https?:\/\/[^\s]+/i) : null;
                  const caption = msg.text ? msg.text.replace(/https?:\/\/[^\s]+/gi, '') : '';
                  return (
                    <div key={msg.id} style={{ ...appStyle.messageRow, justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ ...appStyle.messageBubble, ...(msg.type === 'user' ? appStyle.userBubble : appStyle.assistantBubble) }}>
                        
                        {/* Text without URL */}
                        {caption && <div>{caption}</div>}

                        {/* Image */}
                        {url && (
                        <img src={url[0]} alt="product" style={{ marginTop: '8px', maxWidth: '220px', borderRadius: '10px' }} onClick={() => setExpandedImage(url[0])} /> )}
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div style={{ ...appStyle.messageRow, justifyContent: 'flex-start' }}>
                    <div style={{ ...appStyle.messageBubble, ...appStyle.assistantBubble, display: 'flex', gap: '5px', padding: '18px' }}>
                      <span style={{ ...appStyle.dot, animationDelay: '-0.32s' }} /><span style={{ ...appStyle.dot, animationDelay: '-0.16s' }} /><span style={appStyle.dot} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {showFade && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 1 }} />}
            </div>
            <div style={{ paddingTop: '14px', paddingBottom: '6px' }}>
              <div style={appStyle.inputContainer}>
                <input type="text" placeholder="Ask away..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKey} style={appStyle.chatInput} />
                {/* Red toggle mic button */}
                <div style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                  {recording && ( <span style={{ position: 'absolute', top: '-10px', left: '-10px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,0,0,0.3)',
                    animation: 'pulse 1s infinite', }} /> )}
                  <button onClick={toggleRecording} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: recording ? '#FF4444' : '#D32F2F', cursor: 'pointer',
                    transform: recording ? 'translateY(-4px) rotate(5deg)' : 'none', transition: 'all 0.2s ease', boxShadow: recording ? '0 4px 15px rgba(255,0,0,0.6)' : '0 2px 5px rgba(0,0,0,0.2)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
                    <img src={ recording ? 'https://www.clker.com/cliparts/l/i/L/g/d/e/talk-radio-microphone-md.png' : 'https://cdn.creazilla.com/icons/3204588/mic-off-icon-lg.png' } alt="mic"
                      style={{ width: '30px', height: '30px', pointerEvents: 'none', filter: 'invert(1)', }} />
                  </button>
                  <style>{`
                    @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                    100% { transform: scale(1); opacity: 0.7; }
                    }
                  `}</style>
                </div>
                { <button className="send-btn" style={appStyle.sendBtn} onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}><Icons.MessageSquare /></button> }
              </div>
            </div>
            {expandedImage && (
              <div onClick={() => setExpandedImage(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',justifyContent: 'center', alignItems: 'center', zIndex: 999 }} >
                <img src={expandedImage} alt="expanded" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px'}} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!authUser) return <AuthScreen onAuthSuccess={(user) => setAuthUser(user)} />;

  return (
    <div style={appStyle.container} onClick={() => showUserMenu && setShowUserMenu(false)}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        .tool-item:hover{background-color:rgba(255,255,255,0.18)!important}
        .tool-item.active-nav{background-color:rgba(255,255,255,0.28)!important;font-weight:600}
        .send-btn:hover:not(:disabled){background-color:#3CB371!important;color:white!important}
        .send-btn:disabled{opacity:.45;cursor:not-allowed}
        .icon-btn:hover{background-color:rgba(255,255,255,0.2);border-radius:50%}
        .cart-btn:hover{opacity:.75}
        .detail-btn:hover{background:#2ea860!important}
        .addr-card:hover{border-color:#3CB371!important;background:#f0faf4!important}
        .view-profile-btn:hover{background:#f0faf4!important}
        .app-title:hover{color:#3CB371!important}
        *{margin:0;padding:0;box-sizing:border-box}
        input,select{font-family:inherit}
        *::-webkit-scrollbar{display:none}
      `}</style>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} setMessages={setMessages} />}

      {/* Sidebar */}
      <aside style={appStyle.sidebar}>
        <div style={{ ...appStyle.sidebarHeader, position: 'relative' }}>
          <button
            className="icon-btn"
            style={{ ...appStyle.iconBtn, background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }}
            onClick={() => setShowUserMenu(v => !v)}
          >
            <Icons.User />
          </button>
          <button
            className="icon-btn"
            style={appStyle.iconBtn}
            onClick={() => { setView('settings'); setActiveNav('settings'); setShowUserMenu(false); }}
          >
            <Icons.Settings />
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div style={userMenuStyle.dropdown} onClick={e => e.stopPropagation()}>
              <div style={userMenuStyle.top}>
                <div>
                  <div style={userMenuStyle.greeting}>Hello, {profile?.displayName || authUser?.displayName || authUser?.email?.split('@')[0] || 'User'}</div>
                  <button style={userMenuStyle.switchBtn} onClick={() => setShowUserMenu(false)}>Switch Profile</button>
                </div>
                <button style={userMenuStyle.signOut} onClick={() => { localStorage.removeItem('authUser'); setSessionId(null); setAuthUser(null); setMessages([]); setShowUserMenu(false); }}>Sign Out</button>
              </div>
              <button
                style={userMenuStyle.viewProfile}
                onClick={() => { setView('profile'); setActiveNav(null); setShowUserMenu(false); }}
              >
                View Profile
              </button>
            </div>
          )}
        </div>
        <h3 style={appStyle.toolsTitle}>Tools</h3>
        {[
          { key: 'chat', icon: <Icons.MessageSquare />, label: 'Chat' },
          { key: 'orderHistory', icon: <Icons.Clock />, label: 'Order History' },
          { key: 'upload', icon: <Icons.Upload />, label: 'Upload List' },
          { key: 'map', icon: <Icons.MapPin />, label: 'Store Map' },
        ].map(({ key, icon, label, disabled }) => (
          <button
            key={key}
            className={`tool-item${activeNav === key ? ' active-nav' : ''}`}
            style={{ ...appStyle.toolItem, ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
            onClick={() => !disabled && handleNavClick(key)}
          >
            {icon}
            <span>{label}</span>
            {disabled && <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={appStyle.mainContent}>
        <header style={appStyle.header}>
          <div>
            <h1
              className="app-title"
              style={{ ...appStyle.title, cursor: 'pointer', transition: 'color .15s' }}
              onClick={() => { setView('chat'); setActiveNav('chat'); }}
              title="Back to chat"
            >Super Awesome Shopper Helper</h1>
            {checkoutSteps.includes(view) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                {checkoutSteps.map((step, i) => (
                  <React.Fragment key={step}>
                    <span style={{ fontSize: '12px', fontWeight: view === step ? '700' : '400', color: view === step ? '#3CB371' : '#ccc', textTransform: 'capitalize' }}>
                      {['Cart', 'Shipping', 'Billing', 'Payment', 'Review'][i]}
                    </span>
                    {i < 4 && <span style={{ color: '#ddd', fontSize: '12px' }}>›</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
            {view === 'orderHistory' && <p style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>Order History</p>}
          </div>
          <button className="cart-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: '#3CB371', padding: '4px' }} onClick={() => navigate('cart')}>
            <Icons.ShoppingCart size={42} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#FF4444', color: 'white', fontSize: '11px', fontWeight: '700', width: '19px', height: '19px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const userMenuStyle = {
  dropdown: { position: 'absolute', top: '54px', left: '0', background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)', zIndex: 200, width: '270px', overflow: 'hidden' },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: '#e8f5ee', gap: '12px' },
  greeting: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a' },
  switchBtn: { background: 'none', border: 'none', fontSize: '13px', color: '#3CB371', cursor: 'pointer', padding: 0, textAlign: 'left', fontWeight: '500' },
  signOut: { background: '#d6d6d6', border: 'none', borderRadius: '8px', padding: '7px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: '#333', whiteSpace: 'nowrap' },
  viewProfile: { display: 'block', width: '100%', padding: '14px 18px', background: 'none', border: 'none', textAlign: 'left', fontSize: '15px', fontWeight: '500', color: '#1a1a1a', cursor: 'pointer', borderTop: '1px solid #eee' },
};

const appStyle = {
  container: { display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#fff' },
  sidebar: { width: '215px', minWidth: '215px', background: '#3CB371', padding: '18px 14px', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' },
  iconBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  toolsTitle: { color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
  toolItem: { display: 'flex', alignItems: 'center', gap: '11px', width: '100%', padding: '11px 13px', background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', borderRadius: '8px', marginBottom: '3px', textAlign: 'left', transition: 'background .15s' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px', minWidth: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1a1a1a' },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0, overflow: 'hidden' },
  welcomeContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', marginTop: '80px' },
  welcomeTitle: { fontSize: '26px', fontWeight: '600', color: '#1a1a1a', marginBottom: '28px', textAlign: 'center' },
  inputContainer: { display: 'flex', alignItems: 'center', background: 'white', border: '2px solid #e0e0e0', borderRadius: '25px', padding: '7px 14px', width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  chatInput: { flex: 1, border: 'none', outline: 'none', fontSize: '16px', padding: '9px 5px', color: '#1a1a1a', background: 'transparent' },
  sendBtn: { background: 'white', border: '2px solid #3CB371', borderRadius: '8px', padding: '7px 11px', color: '#3CB371', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' },
  conversationContainer: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', height: '100%', margin: '0 auto', minHeight: 0 },
  messagesContainer: { flex: 1, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '14px', minHeight: 0, scrollbarWidth: 'none', msOverflowStyle: 'none' },
  messageRow: { display: 'flex', width: '100%' },
  messageBubble: { padding: '13px 17px', borderRadius: '18px', fontSize: '15px', lineHeight: '1.55', maxWidth: '70%' },
  // User bubble: deep teal — high contrast, readable at any brightness
  userBubble: { background: '#1A7A4A', color: '#ffffff', borderBottomRightRadius: '5px', fontWeight: '500' },
  assistantBubble: { background: '#2C2C2C', color: '#f5f5f5', borderBottomLeftRadius: '5px' },
  dot: { width: '8px', height: '8px', background: '#aaa', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', display: 'inline-block' },
};
