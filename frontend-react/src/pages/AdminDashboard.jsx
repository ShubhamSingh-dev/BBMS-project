import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ─────────────── MOCK DATA ─────────────── */
const STATS = { totalUnits: 116, pendingRequests: 3, expiringSoon: 2, activeDonors: 5247 };

const OVERVIEW_CARDS = [
  { icon: "🩸", value: "116", label: "Total Units in Stock", sub: "+12 from last week", subColor: "#6c47ff" },
  { icon: "🕐", value: "3", label: "Pending Requests", sub: "2 urgent", subColor: "#6c47ff" },
  { icon: "⏳", value: "2", label: "Units Expiring Soon", sub: "In 7 days", subColor: "#22c55e" },
  { icon: "🤲", value: "5,247", label: "Active Donors", sub: "+342 this month", subColor: "#6c47ff" },
];

const SYSTEM_OVERVIEW = [
  { value: "100K+", label: "Total Lives Saved" },
  { value: "500+", label: "Cities Covered" },
  { value: "200+", label: "Hospital Partners" },
  { value: "45min", label: "Avg Response Time" },
];

const RECENT_ACTIVITY = [
  { time: "10:30 AM", event: "🩸 New Donation", details: "Rajesh K. donated O+ at City Hospital" },
  { time: "9:45 AM", event: "📋 Request Fulfilled", details: "REQ-2024-00123 completed" },
  { time: "9:00 AM", event: "🏥 Hospital Registered", details: "Apollo Hospital joined the network" },
  { time: "8:15 AM", event: "👤 New Donor", details: "Priya S. registered as donor" },
  { time: "Yesterday", event: "🚨 Emergency Request", details: "Critical O- request fulfilled" },
];

const INVENTORY = [
  { bloodType: "A+", units: 42 }, { bloodType: "O-", units: 15 },
  { bloodType: "B+", units: 30 }, { bloodType: "AB+", units: 22 },
  { bloodType: "A-", units: 12 }, { bloodType: "O+", units: 48 },
  { bloodType: "B-", units: 10 }, { bloodType: "AB-", units: 8 },
];

const EXPIRING = [
  { bloodType: "B+", units: "5 units", expiry: "March 25, 2024", status: "Urgent", urgent: true },
  { bloodType: "AB-", units: "3 units", expiry: "March 27, 2024", status: "Urgent", urgent: true },
  { bloodType: "A+", units: "8 units", expiry: "March 28, 2024", status: "Soon", urgent: false },
];

const REQUESTS = [
  { id: "R001", patient: "Alice Williams", blood: "A+", urgency: "Urgent", status: "Pending", statusColor: "#22c55e" },
  { id: "R002", patient: "Bob Miller", blood: "O-", urgency: "Critical", status: "Matched", statusColor: "#22c55e" },
  { id: "R003", patient: "Charlie Davis", blood: "B+", urgency: "Normal", status: "Fulfilled", statusColor: "#6b7280" },
  { id: "R004", patient: "Diana Garcia", blood: "AB+", urgency: "Urgent", status: "Pending", statusColor: "#22c55e" },
  { id: "R005", patient: "Edward Wilson", blood: "A+", urgency: "Critical", status: "Pending", statusColor: "#22c55e" },
];

const DONOR_STATS = [
  { icon: "👥", value: "5,247", label: "Total Registered Donors" },
  { icon: "✅", value: "4,892", label: "Active Donors" },
  { icon: "📅", value: "342", label: "New This Month" },
  { icon: "📈", value: "23%", label: "Growth Rate" },
];

const DONORS_BY_GROUP = [
  { type: "O+", count: "1,245" }, { type: "A+", count: "987" },
  { type: "B+", count: "654" }, { type: "AB+", count: "321" },
  { type: "O-", count: "412" }, { type: "A-", count: "298" },
];

const TOP_DONORS = [
  { rank: "🥇", name: "Rajesh Kumar", blood: "O+", donations: 12, points: "6,000" },
  { rank: "🥈", name: "Priya Sharma", blood: "A+", donations: 10, points: "5,000" },
  { rank: "🥉", name: "Amit Patel", blood: "B+", donations: 8, points: "4,000" },
  { rank: "4", name: "Neha Singh", blood: "O-", donations: 7, points: "3,500" },
  { rank: "5", name: "Vikram Mehta", blood: "AB+", donations: 6, points: "3,000" },
];

const HOSPITAL_STATS = [
  { icon: "🏥", value: "248", label: "Total Hospitals" },
  { icon: "✅", value: "235", label: "Active Partners" },
  { icon: "🏙️", value: "150+", label: "Cities Covered" },
  { icon: "📋", value: "12", label: "New Requests" },
];

const HOSPITALS = [
  { name: "City Hospital", reg: "HOS-00123", location: "Mumbai, Maharashtra", contact: "022-12345678" },
  { name: "Apollo Hospital", reg: "HOS-00124", location: "Delhi, NCR", contact: "011-23456789" },
  { name: "Fortis Healthcare", reg: "HOS-00125", location: "Bangalore, Karnataka", contact: "080-34567890" },
  { name: "Max Super Specialty", reg: "HOS-00126", location: "Chennai, Tamil Nadu", contact: "044-45678901" },
  { name: "Medanta Hospital", reg: "HOS-00127", location: "Gurugram, Haryana", contact: "0124-56789012" },
  { name: "Kokilaben Hospital", reg: "HOS-00128", location: "Mumbai, Maharashtra", contact: "022-67890123" },
  { name: "Manipal Hospital", reg: "HOS-00129", location: "Bangalore, Karnataka", contact: "080-78901234" },
  { name: "Lilavati Hospital", reg: "HOS-00130", location: "Mumbai, Maharashtra", contact: "022-89012345" },
];

const DONATION_TREND = [
  { month: "Jan", Donations: 265 }, { month: "Feb", Donations: 310 },
  { month: "Feb", Donations: 295 }, { month: "Mar", Donations: 410 },
  { month: "Apr", Donations: 410 }, { month: "May", Donations: 410 },
  { month: "Jun", Donations: 410 }, { month: "Jul", Donations: 410 },
];

const ANALYTICS_WEBSITE = [
  { value: "12,847", label: "Monthly Visitors" },
  { value: "3,241", label: "New Registrations" },
  { value: "847", label: "Donations Online" },
  { value: "68%", label: "Mobile Users" },
];

const FULFILLMENT = [
  { value: "94%", label: "Emergency Requests" },
  { value: "88%", label: "Routine Requests" },
  { value: "45min", label: "Avg Response Time" },
  { value: "98%", label: "Donor Satisfaction" },
];

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    border: "1px solid #f0f0f0",
  },
  statCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    borderLeft: "3px solid #7c5cfc",
    flex: 1,
  },
  tableHead: {
    background: "#fafafa",
    borderBottom: "1px solid #f0f0f0",
    color: "#9ca3af",
    fontWeight: 600,
    fontSize: 13,
    padding: "12px 16px",
    textAlign: "left",
  },
  tableCell: {
    padding: "14px 16px",
    borderBottom: "1px solid #f8f8f8",
    fontSize: 14,
    color: "#374151",
  },
};

/* ─────────────── SUB-COMPONENTS ─────────────── */
const HeroStatCard = ({ icon, value, label }) => (
  <div style={{
    background: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.2)",
    flex: 1,
    minWidth: 120,
  }}>
    <span style={{ fontSize: 22 }}>{icon}</span>
    <div>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const SectionCard = ({ title, children, style }) => (
  <div style={{ ...S.card, marginBottom: 20, ...style }}>
    {title && <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1f2937", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>{title}</h3>}
    {children}
  </div>
);

/* ─────────────── TAB CONTENTS ─────────────── */
const OverviewTab = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
      {OVERVIEW_CARDS.map((c, i) => (
        <div key={i} style={{ ...S.card, borderLeft: "3px solid #7c5cfc" }}>
          <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: "#1f2937" }}>{c.value}</div>
          <div style={{ color: "#6b7280", fontSize: 13, margin: "4px 0" }}>{c.label}</div>
          <div style={{ color: c.subColor, fontSize: 12, fontWeight: 600 }}>⬆ {c.sub}</div>
        </div>
      ))}
    </div>

    <SectionCard title="📊 System Overview">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {SYSTEM_OVERVIEW.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontWeight: 800, fontSize: 28, color: "#7c5cfc" }}>{s.value}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard title="🕑 Recent Activity">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Time", "Event", "Details"].map(h => (
              <th key={h} style={S.tableHead}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECENT_ACTIVITY.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...S.tableCell, color: "#6b7280", width: 110 }}>{r.time}</td>
              <td style={S.tableCell}>{r.event}</td>
              <td style={S.tableCell}>{r.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  </div>
);

const InventoryTab = () => (
  <div>
    <SectionCard title="🩸 Blood Stock Levels">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {INVENTORY.map((item) => (
          <div key={item.bloodType} style={{ textAlign: "center", padding: "16px 10px", border: "1px solid #f0f0f0", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 28, color: "#7c5cfc" }}>{item.units}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{item.bloodType}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={INVENTORY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="bloodType" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "rgba(124,92,252,0.05)" }} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
          <Bar dataKey="units" fill="#7c5cfc" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </SectionCard>

    <SectionCard title="Expiring Soon (Next 7 Days)">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Blood Type", "Units", "Expiry Date", "Status"].map(h => (
              <th key={h} style={S.tableHead}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EXPIRING.map((e, i) => (
            <tr key={i}>
              <td style={{ ...S.tableCell, fontWeight: 700 }}>{e.bloodType}</td>
              <td style={S.tableCell}>{e.units}</td>
              <td style={S.tableCell}>{e.expiry}</td>
              <td style={S.tableCell}>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: e.urgent ? "#fff7ed" : "#fef9c3",
                  color: e.urgent ? "#f59e0b" : "#ca8a04",
                }}>
                  {e.urgent ? "⚠️" : "🗓️"} {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  </div>
);

const RequestsTab = () => (
  <SectionCard title="📋 Recent Blood Requests">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Request ID", "Patient", "Blood Type", "Urgency", "Status", "Actions"].map(h => (
            <th key={h} style={S.tableHead}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {REQUESTS.map((r, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
            <td style={{ ...S.tableCell, fontWeight: 700 }}>{r.id}</td>
            <td style={S.tableCell}>{r.patient}</td>
            <td style={{ ...S.tableCell, fontWeight: 700, color: "#7c5cfc" }}>{r.blood}</td>
            <td style={S.tableCell}>{r.urgency}</td>
            <td style={S.tableCell}>
              <span style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: r.status === "Fulfilled" ? "#f3f4f6" : "#dcfce7",
                color: r.status === "Fulfilled" ? "#6b7280" : "#16a34a",
              }}>{r.status}</span>
            </td>
            <td style={S.tableCell}>
              <button style={{
                padding: "6px 20px", borderRadius: 20, border: "1.5px solid #ef4444",
                background: "#fff", color: "#ef4444", fontWeight: 600, fontSize: 13,
                cursor: "pointer",
              }}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </SectionCard>
);

const DonorsTab = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
      {DONOR_STATS.map((d, i) => (
        <div key={i} style={{ ...S.card, borderLeft: "3px solid #7c5cfc" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{d.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: "#1f2937" }}>{d.value}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{d.label}</div>
        </div>
      ))}
    </div>

    <SectionCard title="🩸 Donors by Blood Group">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {DONORS_BY_GROUP.map((d, i) => (
          <div key={i} style={{ textAlign: "center", padding: "16px 10px", border: "1px solid #f0f0f0", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 26, color: "#7c5cfc" }}>{d.count}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{d.type} Donors</div>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard title="🏆 Top Donors">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Rank", "Donor Name", "Blood Type", "Donations", "Points"].map(h => (
              <th key={h} style={S.tableHead}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TOP_DONORS.map((d, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...S.tableCell, fontSize: 18 }}>{d.rank}</td>
              <td style={{ ...S.tableCell, fontWeight: 600 }}>{d.name}</td>
              <td style={{ ...S.tableCell, fontWeight: 700, color: "#7c5cfc" }}>{d.blood}</td>
              <td style={S.tableCell}>{d.donations}</td>
              <td style={{ ...S.tableCell, fontWeight: 700 }}>{d.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  </div>
);

const HospitalsTab = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
      {HOSPITAL_STATS.map((h, i) => (
        <div key={i} style={{ ...S.card, borderLeft: "3px solid #7c5cfc" }}>
          <div style={{ fontSize: 26, marginBottom: 8 }}>{h.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: "#1f2937" }}>{h.value}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{h.label}</div>
        </div>
      ))}
    </div>

    <SectionCard title="🏥 Hospital Partners Directory">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Hospital Name", "Registration No.", "Location", "Contact", "Status"].map(h => (
              <th key={h} style={S.tableHead}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOSPITALS.map((h, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...S.tableCell, fontWeight: 600 }}>{h.name}</td>
              <td style={{ ...S.tableCell, color: "#6b7280" }}>{h.reg}</td>
              <td style={S.tableCell}>{h.location}</td>
              <td style={S.tableCell}>{h.contact}</td>
              <td style={S.tableCell}>
                <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#dcfce7", color: "#16a34a" }}>Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  </div>
);

const AnalyticsTab = () => (
  <div>
    <SectionCard title="📈 Donation Trends (Monthly)">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={DONATION_TREND} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis domain={[240, 430]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Donations" stroke="#7c5cfc" strokeWidth={2.5} dot={{ r: 4, fill: "#7c5cfc" }} activeDot={{ r: 6 }} fill="rgba(124,92,252,0.1)" />
        </LineChart>
      </ResponsiveContainer>
    </SectionCard>

    <SectionCard title="🌐 Website Analytics">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {ANALYTICS_WEBSITE.map((a, i) => (
          <div key={i} style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontWeight: 800, fontSize: 28, color: "#7c5cfc" }}>{a.value}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{a.label}</div>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard title="📊 Request Fulfillment Rate">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {FULFILLMENT.map((f, i) => (
          <div key={i} style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontWeight: 800, fontSize: 28, color: "#7c5cfc" }}>{f.value}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{f.label}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

const SettingsTab = () => {
  const sysSettings = [
    { label: "System Status", value: "● Operational", valueColor: "#16a34a" },
    { label: "Last Backup", value: "Today, 3:00 AM", valueColor: "#7c5cfc" },
    { label: "API Status", value: "✅ Connected", valueColor: "#7c5cfc" },
    { label: "Version", value: "v2.5.0", valueColor: "#7c5cfc" },
  ];
  const security = [
    { label: "Admin Users", value: "3 Active", valueColor: "#7c5cfc" },
    { label: "Last Login", value: "Today, 9:15 AM", valueColor: "#7c5cfc" },
    { label: "2FA Status", value: "✅ Enabled", valueColor: "#7c5cfc" },
    { label: "Failed Attempts", value: "0 Today", valueColor: "#7c5cfc" },
  ];

  const InfoGrid = ({ items }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: "20px 16px", border: "1px solid #f0f0f0", borderRadius: 12, textAlign: "center" }}>
          <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>{it.label}</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: it.valueColor }}>{it.value}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <SectionCard title="⚙️ System Settings">
        <InfoGrid items={sysSettings} />
      </SectionCard>
      <SectionCard title="🔒 Security & Access">
        <InfoGrid items={security} />
      </SectionCard>
    </div>
  );
};

/* ─────────────── TABS CONFIG ─────────────── */
const TABS = [
  { key: "overview", label: "Overview", icon: "🌐" },
  { key: "inventory", label: "Inventory", icon: "🩸" },
  { key: "requests", label: "Requests", icon: "📋" },
  { key: "donors", label: "Donors", icon: "👥" },
  { key: "hospitals", label: "Hospitals", icon: "🏥" },
  { key: "analytics", label: "Analytics", icon: "📈" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "inventory": return <InventoryTab />;
      case "requests": return <RequestsTab />;
      case "donors": return <DonorsTab />;
      case "hospitals": return <HospitalsTab />;
      case "analytics": return <AnalyticsTab />;
      case "settings": return <SettingsTab />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>

      {/* Emergency Banner */}
      <div style={{
        background: "linear-gradient(90deg, #ef4444, #f87171)",
        color: "#fff", padding: "10px 24px",
        display: "flex", alignItems: "center", gap: 16,
        fontSize: 13, fontWeight: 500,
      }}>
        <span>⚠️ Emergency Need?</span>
        <span style={{ textDecoration: "underline", cursor: "pointer", fontWeight: 700 }}>
          Click Here for Immediate Blood Request
        </span>
        <span style={{ opacity: 0.7 }}>• 24/7 Helpline: 1800-123-4567</span>
      </div>

      {/* Navbar */}
      <nav style={{
        background: "#fff", padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 20, color: "#ef4444" }}>
          🩸 Life4U
        </div>
        <button style={{
          background: "#ef4444", color: "#fff", border: "none",
          borderRadius: 24, padding: "8px 24px", fontWeight: 700,
          fontSize: 14, cursor: "pointer",
        }}>Logout</button>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* Hero Banner */}
        <div style={{
          background: "linear-gradient(135deg, #5b21b6 0%, #7c5cfc 50%, #a78bfa 100%)",
          borderRadius: 20, padding: "28px 32px", marginBottom: 20,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: 60, top: 20, width: 120, height: 120, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: 20, top: 60, width: 70, height: 70, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              👑 Administrator Dashboard
            </h1>
            <span style={{
              background: "rgba(255,255,255,0.18)", color: "#fff",
              borderRadius: 24, padding: "7px 16px", fontSize: 13, fontWeight: 600,
              backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)",
            }}>
              🛡️ Super Admin • Full Access
            </span>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <HeroStatCard icon="🩸" value={STATS.totalUnits} label="Total Units" />
            <HeroStatCard icon="🕐" value={STATS.pendingRequests} label="Pending Requests" />
            <HeroStatCard icon="⏳" value={STATS.expiringSoon} label="Expiring Soon" />
            <HeroStatCard icon="🤲" value={STATS.activeDonors.toLocaleString()} label="Active Donors" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "10px 16px",
          display: "flex", gap: 6, marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "9px 18px", borderRadius: 10, border: "none",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                background: activeTab === tab.key
                  ? "linear-gradient(135deg, #5b21b6, #7c5cfc)"
                  : "transparent",
                color: activeTab === tab.key ? "#fff" : "#6b7280",
                transition: "all 0.15s",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTab()}

        {/* Footer */}
        <footer style={{
          background: "#111827", borderRadius: 16,
          padding: "36px 32px 20px", marginTop: 24, color: "#9ca3af",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 24 }}>
            <div>
              <div style={{ color: "#ef4444", fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🩸 Life4U</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
                Saving lives, one pint at a time. We connect donors with those in need through technology and compassion.
              </p>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Quick Links</div>
              {["About Us", "Why Donate", "Become a Donor", "Contact"].map(l => (
                <div key={l} style={{ marginBottom: 8, fontSize: 13, cursor: "pointer" }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Legal</div>
              {["Privacy Policy", "Terms of Service", "Medical Disclaimer"].map(l => (
                <div key={l} style={{ marginBottom: 8, fontSize: 13, cursor: "pointer" }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Follow Us</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["f", "𝕏", "📷", "in"].map((s, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "#374151", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, cursor: "pointer",
                  }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #374151", paddingTop: 16, textAlign: "center", fontSize: 12 }}>
            © 2026 Life4U. All rights reserved. | Made with ❤️ for humanity
          </div>
        </footer>
      </div>
    </div>
  );
}