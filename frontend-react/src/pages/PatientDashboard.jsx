import { useState } from "react";

/* ─────────────────────── MOCK DATA ─────────────────────── */
const USER = { name: "Jane Doe", bloodGroup: "A+", patientId: "PAT-2024-00123" };

const BLOOD_STOCK = [
  { group: "A+", qty: 25, status: "Available", statusColor: "#16a34a", statusBg: "#dcfce7", trend: "+3", trendUp: true },
  { group: "O-", qty: 8, status: "Low", statusColor: "#f59e0b", statusBg: "#fef3c7", trend: "-2", trendUp: false },
  { group: "B+", qty: 15, status: "Moderate", statusColor: "#f59e0b", statusBg: "#fef3c7", trend: "-- Stable", trendUp: null },
  { group: "AB+", qty: 12, status: "Moderate", statusColor: "#f59e0b", statusBg: "#fef3c7", trend: "+1", trendUp: true },
  { group: "A-", qty: 9, status: "Low", statusColor: "#f59e0b", statusBg: "#fef3c7", trend: "-3", trendUp: false },
  { group: "B-", qty: 6, status: "Low", statusColor: "#f59e0b", statusBg: "#fef3c7", trend: "-- Stable", trendUp: null },
  { group: "AB-", qty: 4, status: "Critical", statusColor: "#ef4444", statusBg: "#fee2e2", trend: "-1", trendUp: false },
  { group: "O+", qty: 42, status: "Available", statusColor: "#16a34a", statusBg: "#dcfce7", trend: "+8", trendUp: true },
];

const NOTIFICATIONS = [
  { icon: "🩸", title: "Your blood group (A+) has 42 units available", desc: "Stock levels updated 2 hours ago. Multiple hospitals have supply.", time: "2 hours ago", tag: "important", tagColor: "#ef4444", tagBg: "#fee2e2" },
  { icon: "👤", title: "Donor found for your request", desc: "Rajesh K. • Verified donor • Available now • O+ (Compatible)", time: "30 mins ago", tag: "3 km away", tagColor: "#6b7280", tagBg: "#f3f4f6" },
  { icon: "🏥", title: "City Hospital has new stock", desc: "15 units of A+ added to inventory", time: "5 hours ago", tag: null },
];

const PENDING_ACTIONS = [
  { icon: "📋", title: "Confirm transfusion consent", desc: "Required before procedure", badge: "Urgent", badgeColor: "#ef4444", badgeBg: "#fee2e2" },
  { icon: "📅", title: "Schedule post-transfusion check", desc: "Recommended within 7 days", badge: "Due soon", badgeColor: "#f59e0b", badgeBg: "#fef3c7" },
  { icon: "📄", title: "Update medical history", desc: "Last updated 3 months ago", badge: null },
];

const EMERGENCY_CONTACTS = [
  { name: "John Doe", relation: "Spouse" },
  { name: "Sarah Doe", relation: "Daughter" },
];

const SETTINGS_LINKS = ["Edit Profile", "Medical History", "Account Settings", "Privacy & Security"];

const MY_REQUESTS = [
  { id: "REQ-2024-00123", blood: "A+", qty: "2 units", date: "Today, 10:30 AM", status: "Processing", statusColor: "#6366f1", statusBg: "#e0e7ff", eta: "2:00 PM" },
  { id: "REQ-2024-00122", blood: "A+", qty: "1 unit", date: "Mar 15, 2024", status: "Completed", statusColor: "#16a34a", statusBg: "#dcfce7", eta: "Mar 15, 4:30 PM" },
  { id: "REQ-2024-00120", blood: "O+", qty: "3 units", date: "Mar 10, 2024", status: "Completed", statusColor: "#16a34a", statusBg: "#dcfce7", eta: "Mar 10, 6:00 PM" },
  { id: "REQ-2024-00118", blood: "A+", qty: "2 units", date: "Mar 5, 2024", status: "Cancelled", statusColor: "#9ca3af", statusBg: "#f3f4f6", eta: "-" },
];

const HISTORY = [
  { id: "TRX-2024-00122", date: "Mar 15, 2024", blood: "A+", qty: "1 unit", hospital: "City Hospital", delivery: "4:30 PM" },
  { id: "TRX-2024-00120", date: "Mar 10, 2024", blood: "O+", qty: "3 units", hospital: "City Hospital", delivery: "6:00 PM" },
  { id: "TRX-2024-00115", date: "Mar 1, 2024", blood: "A+", qty: "2 units", hospital: "City Hospital", delivery: "3:15 PM" },
  { id: "TRX-2024-00108", date: "Feb 20, 2024", blood: "B+", qty: "1 unit", hospital: "General Hospital", delivery: "2:30 PM" },
  { id: "TRX-2024-00095", date: "Feb 10, 2024", blood: "A+", qty: "2 units", hospital: "City Hospital", delivery: "5:45 PM" },
  { id: "TRX-2024-00082", date: "Feb 1, 2024", blood: "O-", qty: "1 unit", hospital: "City Hospital", delivery: "11:30 AM" },
];

const DOCUMENTS = [
  { icon: "📄", name: "Prescription_Doctor_Sharma.jpg", uploaded: "Mar 10, 2024", size: "1.2 MB" },
  { icon: "📋", name: "Medical_History_Summary.pdf", uploaded: "Mar 5, 2024", size: "4.1 MB" },
  { icon: "🪪", name: "ID_Proof_Aadhar.pdf", uploaded: "Feb 28, 2024", size: "0.8 MB" },
];

const STATUS_STEPS = ["Submitted", "Processing", "Approved", "Completed"];
const STATUS_MEANING = [
  { label: "Submitted", color: "#9ca3af" },
  { label: "Processing", color: "#6366f1" },
  { label: "Approved", color: "#f59e0b" },
  { label: "In Transit", color: "#3b82f6" },
  { label: "Completed", color: "#22c55e" },
  { label: "Cancelled", color: "#ef4444" },
];

/* ─────────────────────── STYLES ─────────────────────── */
const card = {
  background: "#fff",
  borderRadius: 16,
  padding: "20px 24px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  border: "1px solid #f0f0f0",
};
const TH = { padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#f87171", fontWeight: 600, borderBottom: "1px solid #f0f0f0" };
const TD = { padding: "13px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8f8f8" };

/* ─────────────────────── HERO ─────────────────────── */
const Hero = ({ isDashboard }) => (
  <div style={{
    background: "linear-gradient(135deg, #ff6b6b 0%, #ef4444 50%, #f43f5e 100%)",
    borderRadius: 20, padding: "32px 36px", marginBottom: 20, position: "relative", overflow: "hidden",
  }}>
    {/* Decorative cross */}
    <div style={{
      position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)",
      fontSize: 120, color: "rgba(255,255,255,0.1)", pointerEvents: "none",
    }}>✚</div>

    <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 28, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
      {isDashboard ? "🏥" : "🩸"} Welcome back, {USER.name}
    </h1>
    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 18px" }}>
      {isDashboard
        ? "Manage your health requests and track blood availability here."
        : "Manage your blood requests and track status in real-time"}
    </p>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {isDashboard ? (
        <>
          <Badge icon="🩸" text={`Blood Group: ${USER.bloodGroup}`} />
          <Badge icon="🛡️" text="Priority Status" />
          <Badge icon="🕐" text="Last Updated: 2 min ago" />
        </>
      ) : (
        <Badge icon="🪪" text={`Patient ID: ${USER.patientId}  •  Blood Group: ${USER.bloodGroup}`} />
      )}
    </div>
  </div>
);

const Badge = ({ icon, text }) => (
  <span style={{
    background: "rgba(255,255,255,0.2)", color: "#fff",
    borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500,
    backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)",
    display: "flex", alignItems: "center", gap: 6,
  }}>{icon} {text}</span>
);

/* ─────────────────────── TAB NAV ─────────────────────── */
const TabNav = ({ active, onChange }) => (
  <div style={{
    background: "#fff", borderRadius: 14, padding: "10px 16px",
    display: "flex", gap: 6, marginBottom: 20,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  }}>
    {[{ key: "myRequests", icon: "📋", label: "My Requests" },
    { key: "history", icon: "🕑", label: "History" },
    { key: "documents", icon: "📁", label: "Documents" }].map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding: "9px 20px", borderRadius: 10, border: "none",
        fontWeight: 600, fontSize: 13, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6,
        background: active === t.key ? "linear-gradient(135deg, #ef4444, #f43f5e)" : "transparent",
        color: active === t.key ? "#fff" : "#6b7280",
        transition: "all 0.15s",
      }}>{t.icon} {t.label}</button>
    ))}
  </div>
);

/* ─────────────────────── PINK FOOTER CTA ─────────────────────── */
const FooterCTA = ({ onNavigate }) => (
  <div style={{
    background: "linear-gradient(135deg, #ff6b6b, #ef4444)",
    borderRadius: 20, padding: "28px 24px", marginTop: 20,
  }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
      {[
        { icon: "➕", label: "New Request", desc: "Create a new blood request", action: "myRequests" },
        { icon: "🚑", label: "Emergency", desc: "Urgent blood requirement", action: null },
        { icon: "📊", label: "Dashboard", desc: "View your health stats", action: "dashboard" },
      ].map((item, i) => (
        <div key={i} onClick={() => item.action && onNavigate(item.action)}
          style={{ background: "#fff", borderRadius: 14, padding: "24px 16px", textAlign: "center", cursor: item.action ? "pointer" : "default" }}>
          <div style={{ fontSize: 28, color: "#ef4444", marginBottom: 10 }}>{item.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{item.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────── MY REQUESTS TAB ─────────────────────── */
const MyRequestsTab = () => {
  const currentReq = MY_REQUESTS[0];
  const currentStep = 1; // Processing = index 1

  return (
    <div>
      {/* Current Request Card */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: "#1f2937", margin: "0 0 8px" }}>Current Request</h3>
            <span style={{ background: "#fee2e2", color: "#ef4444", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600 }}>
              Request ID: REQ-2024-00123
            </span>
          </div>
          <span style={{ background: "#e0e7ff", color: "#6366f1", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600 }}>
            🔄 Processing
          </span>
        </div>

        {/* Details Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28, padding: "16px 0", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
          {[
            { icon: "🩸", label: "Blood Type", value: "A+", valueStyle: { color: "#ef4444", fontWeight: 800, fontSize: 22 } },
            { icon: "📦", label: "Quantity", value: "2 units", valueStyle: { fontWeight: 700, fontSize: 16 } },
            { icon: "📅", label: "Requested", value: "Today, 10:30 AM", valueStyle: { fontWeight: 700, fontSize: 14 } },
            { icon: "🏥", label: "Hospital", value: "City Hospital, Ward 3", valueStyle: { fontWeight: 700, fontSize: 14 } },
          ].map((d, i) => (
            <div key={i}>
              <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>{d.icon} {d.label}</div>
              <div style={d.valueStyle}>{d.value}</div>
            </div>
          ))}
        </div>

        {/* Progress Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24, padding: "8px 0" }}>
          {STATUS_STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: done ? "#ef4444" : active ? "#fff" : "#f0f0f0",
                    border: active ? "2.5px solid #6366f1" : done ? "none" : "2px solid #e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                    boxShadow: active ? "0 0 0 4px rgba(99,102,241,0.15)" : "none",
                  }}>
                    {done ? "✓" : active ? "🔄" : "⚬"}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: active || done ? 700 : 400, color: active ? "#1f2937" : done ? "#1f2937" : "#9ca3af", marginTop: 6, whiteSpace: "nowrap" }}>{step}</div>
                  {(done || active) && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{i === 0 ? "10:30 AM" : "11:00 AM"}</div>}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? "#ef4444" : "#f0f0f0", margin: "0 8px", marginBottom: 30 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Next Step */}
        <div style={{
          background: "#fff5f5", borderRadius: 12, padding: "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20, border: "1px solid #fee2e2",
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937", marginBottom: 4 }}>ℹ️ Next Step</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>We'll notify you when donors are found and the blood is ready</div>
          </div>
          <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 16 }}>
            ⏱ ETA: Today, 2:00 PM
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "10px 20px", borderRadius: 24, background: "#ef4444", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            👁 View Details
          </button>
          <button style={{ padding: "10px 20px", borderRadius: 24, background: "#fff", color: "#ef4444", border: "1.5px solid #ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            ✕ Cancel Request
          </button>
          <button style={{ padding: "10px 20px", borderRadius: 24, background: "#ef4444", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            🚑 Emergency Request
          </button>
        </div>
      </div>

      {/* My Blood Requests Table */}
      <div style={card}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1f2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          ≡ My Blood Requests
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Request ID", "Blood Type", "Quantity", "Requested Date", "Status", "ETA"].map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MY_REQUESTS.map((r, i) => (
              <tr key={i}>
                <td style={{ ...TD, fontWeight: 700 }}>{r.id}</td>
                <td style={{ ...TD, fontWeight: 700, color: "#ef4444" }}>{r.blood}</td>
                <td style={TD}>{r.qty}</td>
                <td style={TD}>{r.date}</td>
                <td style={TD}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: r.statusBg, color: r.statusColor }}>{r.status}</span>
                </td>
                <td style={{ ...TD, color: "#6b7280" }}>{r.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─────────────────────── HISTORY TAB ─────────────────────── */
const HistoryTab = () => (
  <div style={card}>
    <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1f2937", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
      🕑 Previous Transaction History
    </h3>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#fafafa" }}>
          {["Transaction ID", "Date", "Blood Type", "Quantity", "Hospital", "Status", "Delivery Time"].map(h => (
            <th key={h} style={TH}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {HISTORY.map((h, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
            <td style={{ ...TD, fontWeight: 700 }}>{h.id}</td>
            <td style={TD}>{h.date}</td>
            <td style={{ ...TD, fontWeight: 700, color: "#ef4444" }}>{h.blood}</td>
            <td style={TD}>{h.qty}</td>
            <td style={TD}>{h.hospital}</td>
            <td style={TD}>
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#dcfce7", color: "#16a34a" }}>Delivered</span>
            </td>
            <td style={{ ...TD, color: "#6b7280" }}>{h.delivery}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* Summary */}
    <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 16, paddingTop: 16, fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
      📊 <strong>Total Transactions:</strong>&nbsp;6 Completed &nbsp;|&nbsp;
      <strong>Total Units Received:</strong>&nbsp;10 units &nbsp;|&nbsp;
      <strong>Last Donation:</strong>&nbsp;Mar 15, 2024
    </div>
  </div>
);

/* ─────────────────────── DOCUMENTS TAB ─────────────────────── */
const DocumentsTab = () => {
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      {/* Status Legend */}
      <div style={{
        ...card, marginBottom: 20, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "14px 20px",
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1f2937", display: "flex", alignItems: "center", gap: 6 }}>
          ℹ️ Status Meaning
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {STATUS_MEANING.map((s, i) => (
            <span key={i} style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Documents Card */}
      <div style={card}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1f2937", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          📁 My Medical Documents
        </h3>

        {/* Upload Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          style={{
            border: `2px dashed ${dragging ? "#ef4444" : "#fca5a5"}`,
            borderRadius: 16, padding: "40px 20px", textAlign: "center",
            background: dragging ? "#fff5f5" : "#fff9f9",
            cursor: "pointer", marginBottom: 24, transition: "all 0.2s",
          }}
        >
          <div style={{ fontSize: 40, color: "#ef4444", marginBottom: 12 }}>☁️</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1f2937", marginBottom: 8 }}>Click to Upload Documents</div>
          <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 4 }}>
            Upload prescription, reports, ID proof, or any medical documents
          </div>
          <div style={{ color: "#9ca3af", fontSize: 12 }}>Supported formats: PDF, JPG, PNG, DOC (Max 10MB)</div>
        </div>

        {/* File List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DOCUMENTS.map((doc, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", borderRadius: 12, border: "1px solid #f0f0f0",
              background: "#fafafa",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>{doc.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937", marginBottom: 3 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Uploaded: {doc.uploaded} • {doc.size}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  👁 View
                </button>
                <button style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Secure notice */}
        <div style={{ marginTop: 20, padding: "12px 16px", background: "#f0fdf4", borderRadius: 10, fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 8 }}>
          🛡️ <strong>Secure Storage:</strong> Your documents are encrypted and securely stored. Only authorized medical staff can access them.
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── DASHBOARD VIEW ─────────────────────── */
const DashboardView = ({ onNavigate }) => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
      {/* LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Blood Availability */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              🩸 Current Blood Availability
            </h3>
            <span style={{ background: "#fee2e2", color: "#ef4444", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>● LIVE</span>
          </div>

          {/* Your Blood Group Highlight */}
          <div style={{
            background: "#fff5f5", border: "1px solid #fee2e2", borderRadius: 12,
            padding: "14px 16px", marginBottom: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13, color: "#1f2937" }}>
              ⭐ Your Blood Group (A+)
            </div>
            <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>Priority</span>
          </div>
          <div style={{
            background: "#fff5f5", borderRadius: 12, padding: "16px",
            display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 12, background: "#ef4444",
              color: "#fff", fontWeight: 800, fontSize: 22,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>A+</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#1f2937" }}>25 <span style={{ fontWeight: 400, fontSize: 13, color: "#6b7280" }}>units available</span></div>
              <div style={{ fontSize: 12, color: "#6b7280", margin: "4px 0" }}>🏥 City Hospital • 2 km away</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Stock Level</span>
                <div style={{ flex: 1, height: 6, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: "50%", height: "100%", background: "#ef4444", borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 12, color: "#6b7280" }}>50%</span>
              </div>
            </div>
          </div>

          {/* Complete Blood Stock Table */}
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1f2937", marginBottom: 10 }}>⊞ Complete Blood Stock</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Blood Group", "Quantity", "Status", "Trend"].map(h => (
                  <th key={h} style={{ ...TH, color: "#9ca3af", fontSize: 12, padding: "8px 10px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOOD_STOCK.map((b, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, padding: "10px", fontWeight: 700, color: "#ef4444" }}>{b.group}</td>
                  <td style={{ ...TD, padding: "10px" }}>{b.qty} units</td>
                  <td style={{ ...TD, padding: "10px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: b.statusBg, color: b.statusColor }}>{b.status}</span>
                  </td>
                  <td style={{ ...TD, padding: "10px", color: b.trendUp === true ? "#16a34a" : b.trendUp === false ? "#ef4444" : "#6b7280", fontSize: 12, fontWeight: 600 }}>
                    {b.trendUp === true ? "↑" : b.trendUp === false ? "↓" : ""} {b.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", margin: 0 }}>🔔 Notifications & Alerts</h3>
            <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>2 New</span>
          </div>
          {NOTIFICATIONS.map((n, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, padding: "14px 0",
              borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid #f0f0f0" : "none",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#fff5f5",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937", marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{n.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>🕐 {n.time}</span>
                  {n.tag && <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: n.tagBg, color: n.tagColor }}>{n.tag}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Pending Actions */}
        <div style={card}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            🕐 Pending Actions
          </h3>
          {PENDING_ACTIONS.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 14px", borderRadius: 12, background: "#fafafa",
              marginBottom: 10, border: "1px solid #f0f0f0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{a.desc}</div>
                </div>
              </div>
              {a.badge && (
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.badgeBg, color: a.badgeColor, whiteSpace: "nowrap", marginLeft: 8 }}>{a.badge}</span>
              )}
            </div>
          ))}
        </div>

        {/* Upcoming Appointment */}
        <div style={{
          background: "linear-gradient(135deg, #ff6b6b, #ef4444)",
          borderRadius: 16, padding: "22px 24px", color: "#fff",
        }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            📅 Upcoming
          </div>
          <div style={{ fontWeight: 800, fontSize: 36, marginBottom: 4 }}>10:00 AM</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 16 }}>Tomorrow • March 20, 2024</div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>
            📍 Ward 3, Bed 12 • City Hospital
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              🔄 Reschedule
            </button>
            <button style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              🗺 Directions
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div style={card}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            📞 Emergency Contacts
          </h3>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {EMERGENCY_CONTACTS.map((c, i) => (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.relation}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>📞</span>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>💬</span>
                </div>
              </div>
            ))}
          </div>
          {[{ icon: "👤", label: "Blood Bank Helpline", number: "1800-XXX-XXXX" },
          { icon: "🚑", label: "Hospital Emergency", number: "(011) 2345-6789" }].map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "#fafafa", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{c.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#ef4444" }}>{c.number}</div>
                </div>
              </div>
              <span style={{ fontSize: 18, color: "#ef4444", cursor: "pointer" }}>📞</span>
            </div>
          ))}
        </div>

        {/* Settings Links */}
        <div style={card}>
          {SETTINGS_LINKS.map((link, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 0", borderBottom: i < SETTINGS_LINKS.length - 1 ? "1px solid #f0f0f0" : "none",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                {["👤", "🏥", "⚙️", "🛡️"][i]} {link}
              </span>
              <span style={{ color: "#9ca3af" }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer style={{ background: "#111827", borderRadius: 16, padding: "32px 32px 20px", marginTop: 24, color: "#9ca3af" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 20 }}>
        <div>
          <div style={{ color: "#ef4444", fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🩸 Life4U</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>Saving lives, one pint at a time.</p>
        </div>
        {[{ title: "Quick Links", items: ["About Us", "Why Donate", "Become a Donor", "Contact"] },
        { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Medical Disclaimer"] }].map((col, i) => (
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
        © 2026 Life4U. All rights reserved.
      </div>
    </footer>
  </div>
);

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
export default function PatientDashboard() {
  const [view, setView] = useState("dashboard"); // "dashboard" | "myRequests" | "history" | "documents"

  const isDashboard = view === "dashboard";
  const isTabView = !isDashboard;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>

      {/* Emergency Banner */}
      <div style={{ background: "linear-gradient(90deg, #ef4444, #f87171)", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
        <span>⚠️ Emergency Need?</span>
        <span style={{ textDecoration: "underline", fontWeight: 700, cursor: "pointer" }}>Click Here for Immediate Blood Request</span>
        <span style={{ opacity: 0.8 }}>• 24/7 Helpline: 1800-123-4567</span>
      </div>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 20, color: "#ef4444", cursor: "pointer" }}
          onClick={() => setView("dashboard")}>
          🩸 Life4U
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => setView("dashboard")} style={{ background: "none", border: "none", fontWeight: 600, fontSize: 14, color: view === "dashboard" ? "#ef4444" : "#374151", cursor: "pointer" }}>Dashboard</button>
          <button onClick={() => setView("myRequests")} style={{ background: "none", border: "none", fontWeight: 600, fontSize: 14, color: "#374151", cursor: "pointer" }}>Request Details</button>
          <button style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 24, padding: "8px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            ↪ Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* Hero */}
        <Hero isDashboard={isDashboard} />

        {/* Tab Nav (only for non-dashboard views) */}
        {isTabView && <TabNav active={view} onChange={setView} />}

        {/* Content */}
        {isDashboard && <DashboardView onNavigate={setView} />}
        {view === "myRequests" && <><MyRequestsTab /><FooterCTA onNavigate={setView} /></>}
        {view === "history" && <><HistoryTab /><FooterCTA onNavigate={setView} /></>}
        {view === "documents" && <><DocumentsTab /><FooterCTA onNavigate={setView} /></>}
      </div>
    </div>
  );
}