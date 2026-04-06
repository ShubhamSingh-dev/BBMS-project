import { useState } from "react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";

/* ═══════════════════════ MOCK DATA ═══════════════════════ */
const TEAL = "#10b981";
const TEAL_DARK = "#0d9488";
const TEAL_LIGHT = "#2dd4bf";

const HERO_STATS = [
    { icon: "🩸", value: "116", label: "Total Units" },
    { icon: "🕐", value: "5", label: "Pending Requests" },
    { icon: "⏳", value: "2", label: "Expiring Soon" },
    { icon: "🤲", value: "342", label: "Active Donors" },
];

// ── INVENTORY ──
const INV_CARDS = [
    { icon: "🩸", value: "116", label: "Total Units", sub: "+12 from last week", subColor: TEAL },
    { icon: "📈", value: "85%", label: "Utilization Rate", sub: "↑ +5%", subColor: TEAL },
    { icon: "⏳", value: "2", label: "Expiring Soon", sub: "In 7 days", subColor: "#22c55e" },
    { icon: "🚚", value: "8", label: "Incoming Orders", sub: "+3 today", subColor: TEAL },
];

const BLOOD_STOCK = [
    { type: "A+", units: 42, status: "Available", sColor: "#16a34a", sBg: "#dcfce7", trend: "↑ +5", up: true },
    { type: "O-", units: 15, status: "Moderate", sColor: "#f59e0b", sBg: "#fef3c7", trend: "↓ -2", up: false },
    { type: "B+", units: 30, status: "Moderate", sColor: "#f59e0b", sBg: "#fef3c7", trend: "≈ Stable", up: null },
    { type: "AB+", units: 22, status: "Moderate", sColor: "#f59e0b", sBg: "#fef3c7", trend: "↑ +3", up: true },
    { type: "A-", units: 12, status: "Low", sColor: "#ef4444", sBg: "#fee2e2", trend: "↓ -1", up: false },
    { type: "O+", units: 48, status: "Available", sColor: "#16a34a", sBg: "#dcfce7", trend: "↑ +8", up: true },
    { type: "B-", units: 10, status: "Low", sColor: "#ef4444", sBg: "#fee2e2", trend: "↓ -3", up: false },
    { type: "AB-", units: 8, status: "Critical", sColor: "#dc2626", sBg: "#fee2e2", trend: "↓ -2", up: false },
];

const STORAGE = [
    { type: "A+", batch: "BAT-2403-01", collected: "Mar 10, 2024", expiry: "Apr 07, 2024", loc: "Freezer A-12", status: "Good", sColor: "#16a34a", sBg: "#dcfce7" },
    { type: "O+", batch: "BAT-2403-05", collected: "Mar 12, 2024", expiry: "Apr 09, 2024", loc: "Freezer B-04", status: "Good", sColor: "#16a34a", sBg: "#dcfce7" },
    { type: "B+", batch: "BAT-2403-08", collected: "Mar 5, 2024", expiry: "Apr 02, 2024", loc: "Freezer C-07", status: "⚠ Expiring Soon", sColor: "#f59e0b", sBg: "#fef3c7" },
    { type: "AB-", batch: "BAT-2402-15", collected: "Feb 28, 2024", expiry: "Mar 28, 2024", loc: "Freezer D-03", status: "! Critical", sColor: "#dc2626", sBg: "#fee2e2" },
];

const ORDERS = [
    { id: "ORD-001", blood: "A-", units: "10 units", date: "Mar 22, 2024", status: "In Transit", sColor: "#3b82f6", sBg: "#eff6ff" },
    { id: "ORD-002", blood: "B-", units: "8 units", date: "Mar 23, 2024", status: "Processing", sColor: "#f59e0b", sBg: "#fef3c7" },
    { id: "ORD-003", blood: "AB-", units: "5 units", date: "Mar 24, 2024", status: "Confirmed", sColor: "#16a34a", sBg: "#dcfce7" },
];

// ── REQUESTS ──
const REQ_CARDS = [
    { icon: "🕐", value: "5", label: "Pending Requests", sub: "2 Urgent", subColor: "#ef4444" },
    { icon: "✅", value: "12", label: "Fulfilled This Week", sub: "↑ +3", subColor: TEAL },
    { icon: "⚡", value: "45min", label: "Avg Response Time", sub: "↓ -5min", subColor: TEAL },
    { icon: "📊", value: "94%", label: "Fulfillment Rate", sub: "↑ +2%", subColor: TEAL },
];

const ACTIVE_REQS = [
    { id: "REQ-001", patient: "Alice Williams", blood: "A+", qty: "2 units", urgency: "Urgent", urgColor: "#f59e0b", urgBg: "#fef3c7", requested: "10:30 AM", status: "Pending", sColor: "#f59e0b", sBg: "#fef3c7", action: "Process" },
    { id: "REQ-002", patient: "Bob Miller", blood: "O-", qty: "3 units", urgency: "Critical", urgColor: "#ef4444", urgBg: "#fee2e2", requested: "9:45 AM", status: "Matched", sColor: "#16a34a", sBg: "#dcfce7", action: "Dispatch" },
    { id: "REQ-003", patient: "Charlie Davis", blood: "B+", qty: "1 unit", urgency: "Urgent", urgColor: "#f59e0b", urgBg: "#fef3c7", requested: "Yesterday", status: "Pending", sColor: "#f59e0b", sBg: "#fef3c7", action: "Process" },
    { id: "REQ-004", patient: "Diana Garcia", blood: "AB+", qty: "2 units", urgency: "Urgent", urgColor: "#f59e0b", urgBg: "#fef3c7", requested: "Yesterday", status: "Pending", sColor: "#f59e0b", sBg: "#fef3c7", action: "Process" },
    { id: "REQ-005", patient: "Edward Wilson", blood: "A+", qty: "4 units", urgency: "Critical", urgColor: "#ef4444", urgBg: "#fee2e2", requested: "Mar 20", status: "Matched", sColor: "#16a34a", sBg: "#dcfce7", action: "Dispatch" },
];

const COMPLETED_REQS = [
    { id: "REQ-098", patient: "John Smith", blood: "O+", fulfilled: "Mar 20, 2024", donor: "Rajesh K." },
    { id: "REQ-097", patient: "Maria Lopez", blood: "A-", fulfilled: "Mar 19, 2024", donor: "Priya S." },
    { id: "REQ-096", patient: "David Kim", blood: "B+", fulfilled: "Mar 18, 2024", donor: "Amit P." },
    { id: "REQ-095", patient: "Sarah Johnson", blood: "AB+", fulfilled: "Mar 17, 2024", donor: "Neha S." },
];

// ── DONORS ──
const DONOR_CARDS = [
    { icon: "👥", value: "342", label: "Registered Donors", sub: "+28 this month", subColor: TEAL },
    { icon: "✅", value: "185", label: "Active Donors", sub: "54% Active", subColor: TEAL },
    { icon: "🩸", value: "12", label: "Donations This Week", sub: "↑ +3", subColor: TEAL },
    { icon: "📅", value: "8", label: "Scheduled Appointments", sub: "Next: Tomorrow", subColor: TEAL },
];

const DONORS_DIR = [
    { id: "DON-1001", name: "Rajesh Kumar", blood: "O+", lastDon: "Mar 15, 2024", total: 12 },
    { id: "DON-1002", name: "Priya Sharma", blood: "A+", lastDon: "Mar 10, 2024", total: 10 },
    { id: "DON-1003", name: "Amit Patel", blood: "B+", lastDon: "Mar 5, 2024", total: 8 },
    { id: "DON-1004", name: "Neha Singh", blood: "O-", lastDon: "Feb 28, 2024", total: 7 },
    { id: "DON-1005", name: "Vikram Mehta", blood: "AB+", lastDon: "Feb 20, 2024", total: 6 },
    { id: "DON-1006", name: "Anjali Desai", blood: "A-", lastDon: "Mar 12, 2024", total: 5 },
];

const APPOINTMENTS = [
    { name: "Rajesh Kumar", blood: "O+", datetime: "Mar 22, 2024 • 10:00 AM", status: "Confirmed", sColor: "#16a34a", sBg: "#dcfce7" },
    { name: "Priya Sharma", blood: "A+", datetime: "Mar 23, 2024 • 2:30 PM", status: "Confirmed", sColor: "#16a34a", sBg: "#dcfce7" },
    { name: "Amit Patel", blood: "B+", datetime: "Mar 25, 2024 • 11:00 AM", status: "Pending", sColor: "#f59e0b", sBg: "#fef3c7" },
];

const DONOR_REQUESTS = [
    { id: "REQ-001", blood: "A+", found: "Yes", donor: "Rajesh Kumar", status: "Matched", sColor: "#16a34a", sBg: "#dcfce7", eta: "30 min" },
    { id: "REQ-002", blood: "O-", found: "Yes", donor: "Neha Singh", status: "Matched", sColor: "#16a34a", sBg: "#dcfce7", eta: "45 min" },
    { id: "REQ-003", blood: "B+", found: "Pending", donor: "Searching...", status: "Finding Donor", sColor: "#f59e0b", sBg: "#fef3c7", eta: "—" },
];

// ── ANALYTICS ──
const USAGE_TREND = [
    { month: "Jan", "Units Used": 50 }, { month: "Feb", "Units Used": 61 },
    { month: "Feb", "Units Used": 49 }, { month: "Mar", "Units Used": 49 },
    { month: "Apr", "Units Used": 49 }, { month: "May", "Units Used": 49 },
    { month: "Jun", "Units Used": 49 }, { month: "Jul", "Units Used": 49 },
];

const BLOOD_DIST = BLOOD_STOCK.map(b => ({ name: b.type, Units: b.units }));

const KPI = [
    { value: "94%", label: "Request Fulfillment Rate" },
    { value: "45min", label: "Avg Response Time" },
    { value: "342", label: "Active Donors" },
    { value: "85%", label: "Inventory Utilization" },
];

const PERF_METRICS = [
    { metric: "Total Requests", thisMonth: "48", lastMonth: "42", change: "+14%", pos: true },
    { metric: "Fulfilled Requests", thisMonth: "45", lastMonth: "38", change: "+18%", pos: true },
    { metric: "Donations Received", thisMonth: "52", lastMonth: "44", change: "+18%", pos: true },
    { metric: "Emergency Response", thisMonth: "38min", lastMonth: "45min", change: "-16%", pos: false },
    { metric: "Donor Satisfaction", thisMonth: "96%", lastMonth: "92%", change: "+4%", pos: true },
];

/* ═══════════════════════ SHARED STYLES ═══════════════════════ */
const card = { background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0", marginBottom: 20 };
const TH = { padding: "11px 14px", textAlign: "left", fontSize: 13, color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #f0f0f0", background: "#fafafa" };
const TD = { padding: "13px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8f8f8" };

/* ═══════════════════════ SUB-COMPONENTS ═══════════════════════ */
const HeroStatCard = ({ icon, value, label }) => (
    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.2)", flex: 1 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, lineHeight: 1.1 }}>{value}</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>{label}</div>
        </div>
    </div>
);

const StatCards = ({ cards }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {cards.map((c, i) => (
            <div key={i} style={{ ...card, marginBottom: 0, borderLeft: `3px solid ${TEAL}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 26, color: "#1f2937", marginBottom: 4 }}>{c.value}</div>
                <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>{c.label}</div>
                <div style={{ color: c.subColor, fontSize: 12, fontWeight: 600 }}>{c.sub}</div>
            </div>
        ))}
    </div>
);

const SectionCard = ({ title, children, style }) => (
    <div style={{ ...card, ...style }}>
        {title && <h3 style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>{title}</h3>}
        {children}
    </div>
);

const TealBtn = ({ label }) => (
    <button style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: TEAL, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
        {label}
    </button>
);

const StatusPill = ({ text, sColor, sBg }) => (
    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: sBg, color: sColor }}>{text}</span>
);

/* ═══════════════════════ TAB: INVENTORY ═══════════════════════ */
const InventoryTab = () => (
    <div>
        <StatCards cards={INV_CARDS} />

        <SectionCard title="🩸 Current Blood Stock Levels">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Blood Type", "Units", "Status", "Trend", "Last Updated"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {BLOOD_STOCK.map((b, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{b.type}</td>
                            <td style={TD}>{b.units} units</td>
                            <td style={TD}><StatusPill text={b.status} sColor={b.sColor} sBg={b.sBg} /></td>
                            <td style={{ ...TD, color: b.up === true ? TEAL : b.up === false ? "#ef4444" : "#6b7280", fontWeight: 600 }}>{b.trend}</td>
                            <td style={{ ...TD, color: "#9ca3af" }}>Today, 9:00 AM</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>

        <SectionCard title="🗄 Storage & Expiry Details">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Blood Type", "Batch ID", "Collection Date", "Expiry Date", "Storage Location", "Status"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {STORAGE.map((s, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{s.type}</td>
                            <td style={{ ...TD, fontFamily: "monospace", fontSize: 12 }}>{s.batch}</td>
                            <td style={TD}>{s.collected}</td>
                            <td style={TD}>{s.expiry}</td>
                            <td style={TD}>{s.loc}</td>
                            <td style={TD}><StatusPill text={s.status} sColor={s.sColor} sBg={s.sBg} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>

        <SectionCard title="🚚 Incoming Orders from Blood Bank">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Order ID", "Blood Type", "Units", "Expected Date", "Status"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {ORDERS.map((o, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 700 }}>{o.id}</td>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{o.blood}</td>
                            <td style={TD}>{o.units}</td>
                            <td style={TD}>{o.date}</td>
                            <td style={TD}><StatusPill text={o.status} sColor={o.sColor} sBg={o.sBg} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>
    </div>
);

/* ═══════════════════════ TAB: REQUESTS ═══════════════════════ */
const RequestsTab = () => (
    <div>
        <StatCards cards={REQ_CARDS} />

        <SectionCard title="📋 Active Blood Requests">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Request ID", "Patient Name", "Blood Type", "Quantity", "Urgency", "Requested", "Status", "Actions"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {ACTIVE_REQS.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 700 }}>{r.id}</td>
                            <td style={TD}>{r.patient}</td>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{r.blood}</td>
                            <td style={TD}>{r.qty}</td>
                            <td style={TD}><StatusPill text={r.urgency} sColor={r.urgColor} sBg={r.urgBg} /></td>
                            <td style={{ ...TD, color: "#6b7280" }}>{r.requested}</td>
                            <td style={TD}><StatusPill text={r.status} sColor={r.sColor} sBg={r.sBg} /></td>
                            <td style={TD}><TealBtn label={r.action} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>

        <SectionCard title="🕑 Completed Requests (Last 7 Days)">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Request ID", "Patient", "Blood Type", "Fulfilled On", "Donor", "Status"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {COMPLETED_REQS.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 700 }}>{r.id}</td>
                            <td style={TD}>{r.patient}</td>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{r.blood}</td>
                            <td style={TD}>{r.fulfilled}</td>
                            <td style={TD}>{r.donor}</td>
                            <td style={TD}><StatusPill text="Fulfilled" sColor="#16a34a" sBg="#dcfce7" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>
    </div>
);

/* ═══════════════════════ TAB: DONORS ═══════════════════════ */
const DonorsTab = () => (
    <div>
        <StatCards cards={DONOR_CARDS} />

        <SectionCard title="≡ Registered Donors Directory">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Donor ID", "Name", "Blood Group", "Last Donation", "Total Donations", "Status", "Actions"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {DONORS_DIR.map((d, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontFamily: "monospace", fontSize: 12 }}>{d.id}</td>
                            <td style={{ ...TD, fontWeight: 600 }}>{d.name}</td>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{d.blood}</td>
                            <td style={TD}>{d.lastDon}</td>
                            <td style={TD}>{d.total}</td>
                            <td style={TD}><StatusPill text="Active" sColor="#16a34a" sBg="#dcfce7" /></td>
                            <td style={TD}><TealBtn label="Contact" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>

        <SectionCard title="📅 Upcoming Donor Appointments">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Donor Name", "Blood Group", "Date & Time", "Status", "Actions"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {APPOINTMENTS.map((a, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 600 }}>{a.name}</td>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{a.blood}</td>
                            <td style={TD}>{a.datetime}</td>
                            <td style={TD}><StatusPill text={a.status} sColor={a.sColor} sBg={a.sBg} /></td>
                            <td style={TD}><TealBtn label="Remind" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>

        <SectionCard title="🔔 Donor Requests & Responses">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Request ID", "Blood Type", "Donor Found", "Donor Name", "Status", "ETA"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {DONOR_REQUESTS.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 700 }}>{r.id}</td>
                            <td style={{ ...TD, fontWeight: 700, color: TEAL }}>{r.blood}</td>
                            <td style={TD}>{r.found}</td>
                            <td style={TD}>{r.donor}</td>
                            <td style={TD}><StatusPill text={r.status} sColor={r.sColor} sBg={r.sBg} /></td>
                            <td style={{ ...TD, fontWeight: 600 }}>{r.eta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>
    </div>
);

/* ═══════════════════════ TAB: ANALYTICS ═══════════════════════ */
const AnalyticsTab = () => (
    <div>
        <SectionCard title="📈 Blood Usage Trend (Monthly)">
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={USAGE_TREND} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[44, 64]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="Units Used" stroke={TEAL} strokeWidth={2.5} fill="url(#tealGrad)" dot={{ r: 4, fill: TEAL }} activeDot={{ r: 6 }} />
                </AreaChart>
            </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="📊 Blood Type Distribution">
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={BLOOD_DIST} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(16,185,129,0.05)" }} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
                    <Bar dataKey="Units" fill={TEAL} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="🎯 Key Performance Indicators">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {KPI.map((k, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "20px 0", border: "1px solid #f0f0f0", borderRadius: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 28, color: TEAL, marginBottom: 6 }}>{k.value}</div>
                        <div style={{ color: "#6b7280", fontSize: 13 }}>{k.label}</div>
                    </div>
                ))}
            </div>
        </SectionCard>

        <SectionCard title="📋 Hospital Performance Metrics">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Metric", "This Month", "Last Month", "Change"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                    {PERF_METRICS.map((m, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ ...TD, fontWeight: 500 }}>{m.metric}</td>
                            <td style={{ ...TD, fontWeight: 700 }}>{m.thisMonth}</td>
                            <td style={{ ...TD, color: "#6b7280" }}>{m.lastMonth}</td>
                            <td style={TD}>
                                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: m.pos ? "#dcfce7" : "#fee2e2", color: m.pos ? "#16a34a" : "#dc2626" }}>
                                    {m.change}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </SectionCard>
    </div>
);

/* ═══════════════════════ FOOTER ═══════════════════════ */
const Footer = () => (
    <footer style={{ background: "#111827", borderRadius: 16, padding: "32px 32px 20px", marginTop: 4, color: "#9ca3af" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 20 }}>
            <div>
                <div style={{ color: "#ef4444", fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🩸 Life4U</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 200 }}>Saving lives, one pint at a time.</p>
            </div>
            {[{ title: "Quick Links", items: ["About Us", "Why Donate", "Become a Donor", "Contact"] },
            { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Medical Disclaimer"] }
            ].map((col, i) => (
                <div key={i}>
                    <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>{col.title}</div>
                    {col.items.map(item => <div key={item} style={{ marginBottom: 8, fontSize: 13, cursor: "pointer" }}>{item}</div>)}
                </div>
            ))}
            <div>
                <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Follow Us</div>
                <div style={{ display: "flex", gap: 10 }}>
                    {["f", "𝕏", "📷", "in"].map((s, i) => (
                        <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer" }}>{s}</div>
                    ))}
                </div>
            </div>
        </div>
        <div style={{ borderTop: "1px solid #374151", paddingTop: 16, textAlign: "center", fontSize: 12 }}>
            © 2026 Life4U. All rights reserved. | Made with ❤️ for humanity
        </div>
    </footer>
);

/* ═══════════════════════ TABS CONFIG ═══════════════════════ */
const TABS = [
    { key: "inventory", icon: "📦", label: "Inventory" },
    { key: "requests", icon: "📋", label: "Requests" },
    { key: "donors", icon: "👥", label: "Donors" },
    { key: "analytics", icon: "📈", label: "Analytics" },
];

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
export default function HospitalDashboard() {
    const [activeTab, setActiveTab] = useState("inventory");

    const renderTab = () => {
        switch (activeTab) {
            case "inventory": return <InventoryTab />;
            case "requests": return <RequestsTab />;
            case "donors": return <DonorsTab />;
            case "analytics": return <AnalyticsTab />;
            default: return null;
        }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>

            {/* ── Emergency Banner ── */}
            <div style={{ background: "linear-gradient(90deg,#ef4444,#f87171)", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
                <span>⚠️ Emergency Need?</span>
                <span style={{ textDecoration: "underline", fontWeight: 700, cursor: "pointer" }}>Click Here for Immediate Blood Request</span>
                <span style={{ opacity: 0.8 }}>• 24/7 Helpline: 1800-123-4567</span>
            </div>

            {/* ── Navbar ── */}
            <nav style={{ background: "#fff", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 20, color: "#ef4444" }}>
                    🩸 Life4U
                </div>
                <button style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 24, padding: "8px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Logout
                </button>
            </nav>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

                {/* ── Hero Banner ── */}
                <div style={{
                    background: `linear-gradient(135deg, ${TEAL_DARK} 0%, ${TEAL} 55%, ${TEAL_LIGHT} 100%)`,
                    borderRadius: 20, padding: "28px 32px", marginBottom: 20,
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Decorative circles */}
                    <div style={{ position: "absolute", right: 80, top: 10, width: 130, height: 130, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
                    <div style={{ position: "absolute", right: 20, top: 50, width: 80, height: 80, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                            🏥 City Hospital Dashboard
                        </h1>
                        <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: 24, padding: "7px 16px", fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 6 }}>
                            🏢 Main Branch • Reg ID: HOS-00123
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {HERO_STATS.map((s, i) => <HeroStatCard key={i} {...s} />)}
                    </div>
                </div>

                {/* ── Tab Navigation ── */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "10px 16px", display: "flex", gap: 6, marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            padding: "9px 20px", borderRadius: 10, border: "none",
                            fontWeight: 600, fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6,
                            background: activeTab === tab.key ? `linear-gradient(135deg,${TEAL_DARK},${TEAL})` : "transparent",
                            color: activeTab === tab.key ? "#fff" : "#6b7280",
                            transition: "all 0.15s",
                        }}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                {renderTab()}

                <Footer />
            </div>
        </div>
    );
}