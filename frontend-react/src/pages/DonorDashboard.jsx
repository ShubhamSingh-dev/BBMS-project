import { useState } from "react";

/* ════════════════════════════════════════════
   DESIGN TOKENS — Royal Blue × Cyan × Amber
════════════════════════════════════════════ */
const C = {
  primary: "#1e40af",
  primaryDim: "#1e3a8a",
  primaryContainer: "#3b82f6",
  primaryLight: "#93c5fd",
  onPrimary: "#eff6ff",
  cyan: "#0891b2",
  cyanLight: "#22d3ee",
  amber: "#d97706",
  amberLight: "#fbbf24",
  amberContainer: "#fef3c7",
  surface: "#f0f4ff",
  surfaceLow: "#e8edf8",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#d1d9f0",
  onSurface: "#0f172a",
  onSurfaceVariant: "#475569",
  outlineVariant: "#94a3b8",
  danger: "#dc2626",
  success: "#059669",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body,html{font-family:'Plus Jakarta Sans',sans-serif;background:${C.surface};color:${C.onSurface};}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-thumb{background:${C.surfaceHigh};border-radius:10px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .fade-in{animation:fadeUp 0.38s ease both;}
  @keyframes dashAnim{from{stroke-dashoffset:300;}to{stroke-dashoffset:0;}}
  .chart-line{stroke-dasharray:300;animation:dashAnim 1.6s ease forwards;}
  @keyframes ringFill{from{stroke-dashoffset:251;}}
  .ring-fill{animation:ringFill 1.2s ease forwards;}
  @keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(59,130,246,0.55));}50%{filter:drop-shadow(0 0 10px rgba(59,130,246,0.9));}}
  .glow-pulse{animation:glowPulse 2.5s ease-in-out infinite;}
  input:focus,select:focus,textarea:focus{outline:none;}
  button{transition:opacity 0.15s,transform 0.15s;}
  button:hover{opacity:0.88;}
`;

/* ── SHARED HELPERS ── */
const card = (extra = {}) => ({
  background: C.surfaceLowest, borderRadius: 18,
  padding: "22px 26px",
  boxShadow: "0 2px 12px rgba(30,58,138,0.08)",
  border: `1px solid ${C.surfaceLow}`, ...extra,
});
const Pill = ({ text, color, bg, style = {} }) => (
  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: bg, color, display: "inline-block", ...style }}>{text}</span>
);
const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 24, cursor: "pointer", background: checked ? C.primaryContainer : C.surfaceHigh, position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.25s" }} />
  </div>
);
const LineChart = ({ data, color, fill }) => (
  <svg viewBox="0 0 400 120" width="100%" height="100%" preserveAspectRatio="none">
    <defs>
      <linearGradient id={`g${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0.01" />
      </linearGradient>
    </defs>
    <line x1="0" y1="40" x2="400" y2="40" stroke={C.outlineVariant} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="5 5" />
    <line x1="0" y1="80" x2="400" y2="80" stroke={C.outlineVariant} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="5 5" />
    <path d={fill} fill={`url(#g${color.replace("#", "")})`} />
    <path className="chart-line" d={data} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="400" cy={parseFloat(data.split("T").pop().split(",")[1])} r="5" fill={color} className="glow-pulse" />
  </svg>
);
const Ring = ({ pct, color, label, value }) => {
  const r = 40, circ = 2 * Math.PI * r, offset = circ - circ * pct;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 8px" }}>
        <svg viewBox="0 0 96 96" width={96} height={96} style={{ transform: "rotate(-90deg)" }}>
          <circle cx="48" cy="48" r={r} fill="transparent" stroke={C.surfaceHigh} strokeWidth="8" />
          <circle className="ring-fill" cx="48" cy="48" r={r} fill="transparent" stroke={color} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: C.onSurface }}>{value}</div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 800, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</div>
    </div>
  );
};
const TH = { padding: "11px 14px", textAlign: "left", fontSize: 12, color: C.onSurfaceVariant, fontWeight: 700, borderBottom: `1px solid ${C.surfaceLow}`, background: C.surface, textTransform: "uppercase", letterSpacing: "0.07em" };
const TD = { padding: "13px 14px", fontSize: 13, color: C.onSurface, borderBottom: `1px solid ${C.surface}` };

/* ════════════════════════════════════════════
   SETTINGS PAGE
════════════════════════════════════════════ */
const SettingsPage = ({ onClose, theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState("Profile");
  const [profile, setProfile] = useState({ name: "Alex Thorne", bloodType: "O+", email: "alex.thorne@life4u.com", phone: "+91 98765 43210", dob: "1994-06-15", weight: "72", address: "Ahmedabad, Gujarat" });
  const [notifs, setNotifs] = useState({ email: true, sms: true, push: false, donation: true, rewards: true, emergency: false });
  const [appSettings, setAppSettings] = useState({ darkMode: theme === "dark", language: "English (IN)" });
  const [savedAt, setSavedAt] = useState("Apr 06, 2026");
  const [saveFlash, setSaveFlash] = useState(false);

  const sections = [
    { name: "Profile", icon: "👤" },
    { name: "Security", icon: "🛡️" },
    { name: "Notifications", icon: "🔔" },
    { name: "Privacy", icon: "🔒" },
    { name: "Appearance", icon: "🎨" },
    { name: "Help", icon: "❓" },
  ];

  const inp = { width: "100%", padding: "12px 16px", borderRadius: 12, background: C.surface, border: `1px solid ${C.surfaceLow}`, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, fontWeight: 500, color: C.onSurface };
  const lbl = { fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.onSurfaceVariant, marginBottom: 6, display: "block" };
  const sc = { ...card(), marginBottom: 0 };

  const handleSave = () => {
    setSavedAt("Apr 06, 2026 — just now"); setSaveFlash(true);
    if (appSettings.darkMode) setTheme("dark"); else setTheme("light");
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Profile": return (
        <div className="fade-in" style={sc}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 22 }}>🪪</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.onSurface }}>Account Information</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, padding: "16px 20px", background: C.surface, borderRadius: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 20, flexShrink: 0 }}>AX</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: C.onSurface }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: C.primary, fontWeight: 700, marginTop: 2 }}>{profile.bloodType} · Active Donor</div>
            </div>
            <button style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 999, background: C.surfaceLowest, border: `1px solid ${C.surfaceLow}`, cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: 13, color: C.primary }}>📷 Change Photo</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["Full Name", "name", "text"], ["Phone Number", "phone", "tel"], ["Date of Birth", "dob", "date"], ["Weight (kg)", "weight", "number"], ["Location", "address", "text"]].map(([l, k, t]) => (
              <div key={k}><label style={lbl}>{l}</label><input style={inp} type={t} value={profile[k]} onChange={e => setProfile({ ...profile, [k]: e.target.value })} /></div>
            ))}
            <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Email Address</label><input style={inp} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
            <div><label style={lbl}>Blood Type</label>
              <select style={{ ...inp, cursor: "pointer" }} value={profile.bloodType} onChange={e => setProfile({ ...profile, bloodType: e.target.value })}>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      );
      case "Notifications": return (
        <div className="fade-in" style={sc}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 22 }}>🔔</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.onSurface }}>Notification Preferences</span>
          </div>
          {[
            { key: "email", icon: "📧", label: "Email Notifications", desc: "Appointment reminders and blood drive alerts via email." },
            { key: "sms", icon: "💬", label: "SMS Alerts", desc: "Urgent blood type requests sent to your phone." },
            { key: "push", icon: "📱", label: "Push Notifications", desc: "App updates about rewards and milestones." },
            { key: "donation", icon: "📅", label: "Donation Reminders", desc: "Reminders when you are eligible to donate again." },
            { key: "rewards", icon: "⭐", label: "Reward Updates", desc: "Alerts when you earn points or reach a new tier." },
            { key: "emergency", icon: "🚨", label: "Emergency Alerts", desc: "Critical blood shortage notifications in your area." },
          ].map(n => (
            <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 14, marginBottom: 6, background: notifs[n.key] ? `${C.primary}08` : "transparent", border: `1px solid ${notifs[n.key] ? `${C.primary}20` : "transparent"}`, transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: notifs[n.key] ? `${C.primaryContainer}20` : C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{n.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: C.onSurface }}>{n.label}</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 2, maxWidth: 320 }}>{n.desc}</div>
                </div>
              </div>
              <Toggle checked={notifs[n.key]} onChange={v => setNotifs({ ...notifs, [n.key]: v })} />
            </div>
          ))}
        </div>
      );
      case "Appearance": return (
        <div className="fade-in" style={sc}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 22 }}>🎨</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.onSurface }}>App Settings & Appearance</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, padding: "16px 18px", borderRadius: 14, background: C.surface, border: `1px solid ${C.surfaceLow}` }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.onSurface }}>🌙 Dark Mode</div>
              <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 2 }}>Switch to a darker theme for low-light usage</div>
            </div>
            <Toggle checked={appSettings.darkMode} onChange={v => setAppSettings({ ...appSettings, darkMode: v })} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={lbl}>Language</label>
            <select style={{ ...inp, cursor: "pointer" }} value={appSettings.language} onChange={e => setAppSettings({ ...appSettings, language: e.target.value })}>
              {["English (IN)", "English (US)", "Hindi", "Gujarati", "Marathi", "Tamil"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ padding: "16px 18px", borderRadius: 14, background: `${C.primaryContainer}12`, border: `1px solid ${C.primaryContainer}30` }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: C.primary, marginBottom: 8 }}>💾 Storage Usage</div>
            <div style={{ height: 6, background: C.surfaceHigh, borderRadius: 99, marginBottom: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "12%", background: `linear-gradient(90deg,${C.primaryDim},${C.primaryContainer})`, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 12, color: C.onSurfaceVariant }}>1.2 GB of 10 GB used</div>
          </div>
        </div>
      );
      case "Security": return (
        <div className="fade-in" style={sc}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.onSurface }}>Security Settings</span>
          </div>
          {[
            { icon: "🔑", label: "Change Password", desc: "Last changed 45 days ago" },
            { icon: "📱", label: "Two-Factor Authentication", desc: "Add an extra layer of security", badge: "Recommended" },
            { icon: "💻", label: "Active Sessions", desc: "2 devices currently signed in" },
            { icon: "🔔", label: "Login Alerts", desc: "Get notified of new sign-ins" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 16px", borderRadius: 14, marginBottom: 8, background: C.surface, cursor: "pointer", border: `1px solid ${C.surfaceLow}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.surfaceLowest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>{item.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: C.onSurface }}>{item.label}</span>
                    {item.badge && <Pill text={item.badge} color={C.primary} bg={`${C.primaryContainer}20`} />}
                  </div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant }}>{item.desc}</div>
                </div>
              </div>
              <span style={{ color: C.outlineVariant, fontSize: 20 }}>›</span>
            </div>
          ))}
        </div>
      );
      case "Privacy": return (
        <div className="fade-in" style={sc}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 22 }}>🔒</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.onSurface }}>Privacy Controls</span>
          </div>
          {[
            { label: "Share Profile in Leaderboard", desc: "Allow your name to appear in the community top donors list" },
            { label: "Share Anonymous Health Data", desc: "Help improve blood donation research with anonymised data" },
            { label: "Location Access", desc: "Allow Life4U to find nearby donation camps" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 16px", borderRadius: 14, marginBottom: 8, background: C.surface, border: `1px solid ${C.surfaceLow}` }}>
              <div style={{ maxWidth: 340 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.onSurface }}>{item.label}</div>
                <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 3 }}>{item.desc}</div>
              </div>
              <Toggle checked={true} onChange={() => { }} />
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 14, background: `${C.primaryContainer}10`, display: "flex", alignItems: "center", gap: 12, border: `1px solid ${C.primaryContainer}25` }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <span style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.5 }}>Your data is encrypted and never sold. Read our <span style={{ color: C.primary, fontWeight: 700, cursor: "pointer" }}>Privacy Policy</span>.</span>
          </div>
        </div>
      );
      case "Help": return (
        <div className="fade-in" style={sc}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 22 }}>❓</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.onSurface }}>Help & Support</span>
          </div>
          {[
            { icon: "💬", label: "Live Chat Support", desc: "Talk to a donor support agent now" },
            { icon: "📧", label: "Email Support", desc: "support@life4u.com" },
            { icon: "📄", label: "FAQs", desc: "Find answers to common questions" },
            { icon: "🐛", label: "Report a Problem", desc: "Something wrong? Let us know" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 16px", borderRadius: 14, marginBottom: 8, background: C.surface, cursor: "pointer", border: `1px solid ${C.surfaceLow}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.surfaceLowest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: C.onSurface }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
              <span style={{ color: C.outlineVariant, fontSize: 20 }}>›</span>
            </div>
          ))}
        </div>
      );
      default: return <div />;
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: C.surface, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", boxShadow: "0 2px 12px rgba(30,58,138,0.08)", position: "sticky", top: 0, zIndex: 10, borderBottom: `1px solid ${C.surfaceLow}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🩸</div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.04em", color: C.onSurface }}>Life<span style={{ color: C.primary }}>4U</span></span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Dashboard", "History", "Centers", "Rewards"].map(n => (
            <span key={n} style={{ fontSize: 14, fontWeight: 600, color: C.onSurfaceVariant, cursor: "pointer" }} onClick={onClose}>{n}</span>
          ))}
        </div>
        <button onClick={onClose} style={{ padding: "8px 20px", borderRadius: 999, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, border: "none", color: C.onPrimary, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", width: "100%", padding: "32px 24px", gap: 28, flex: 1 }}>
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "14px 16px", background: C.surfaceLowest, borderRadius: 16, border: `1px solid ${C.surfaceLow}` }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>AX</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, color: C.onSurface }}>Alex Thorne</div>
              <div style={{ fontSize: 11, color: C.primary, fontWeight: 700 }}>O+ · Gold Donor</div>
            </div>
          </div>
          {sections.map(s => (
            <div key={s.name} onClick={() => setActiveSection(s.name)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, marginBottom: 4, cursor: "pointer", background: activeSection === s.name ? `${C.primary}12` : "transparent", color: activeSection === s.name ? C.primary : C.onSurfaceVariant, fontWeight: activeSection === s.name ? 800 : 600, fontSize: 14, transition: "all 0.2s" }}>
              <span style={{ fontSize: 17 }}>{s.icon}</span> {s.name}
            </div>
          ))}
          <div style={{ height: 1, background: C.surfaceLow, margin: "14px 0" }} />
          <div onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, cursor: "pointer", color: C.danger, fontWeight: 700, fontSize: 14 }}>
            <span style={{ fontSize: 17 }}>🚪</span> Sign Out
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 26 }}>
            <h1 style={{ fontWeight: 900, fontSize: 30, letterSpacing: "-0.04em", marginBottom: 6, color: C.onSurface }}>Account Settings</h1>
            <p style={{ color: C.onSurfaceVariant, fontSize: 14 }}>Manage your donor profile and application preferences.</p>
          </div>
          {renderSection()}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, padding: "18px 0", borderTop: `1px solid ${C.surfaceLow}` }}>
            <span style={{ fontSize: 13, color: C.onSurfaceVariant }}>Last saved: {savedAt}</span>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ padding: "11px 24px", borderRadius: 999, background: C.surface, border: `1px solid ${C.surfaceLow}`, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: 14, color: C.onSurfaceVariant, cursor: "pointer" }}>Discard</button>
              <button onClick={handleSave} style={{ padding: "11px 24px", borderRadius: 999, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 14, color: C.onPrimary, cursor: "pointer", boxShadow: `0 6px 20px ${C.primary}35`, transform: saveFlash ? "scale(0.97)" : "scale(1)", transition: "all 0.15s" }}>
                {saveFlash ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("light");
  const [selectedDay, setSelectedDay] = useState(6);
  const [selectedSlot, setSelectedSlot] = useState("09:15 AM");
  const [selectedCenter, setSelectedCenter] = useState("Downtown Life4U Hub");
  const [checks, setChecks] = useState({ healthy: true, meal: true, hydrated: false, weight: true, tattoo: true, travel: true });
  const allChecked = Object.values(checks).every(Boolean);

  const isDark = theme === "dark";
  const bg = isDark ? "#0d1117" : C.surface;
  const cardBg = isDark ? "#1a2236" : C.surfaceLowest;
  const surfLow = isDark ? "#1e2d45" : C.surfaceLow;
  const textMain = isDark ? "#e2e8f0" : C.onSurface;
  const textSub = isDark ? "#94a3b8" : C.onSurfaceVariant;
  const crd = (extra = {}) => ({ ...card(), background: cardBg, border: `1px solid ${surfLow}`, ...extra });

  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "impact", label: "Impact", icon: "❤️" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "rewards", label: "Rewards", icon: "⭐" },
  ];
  const timeSlots = ["08:30 AM", "09:15 AM", "10:00 AM", "11:30 AM", "01:45 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
  const centers = ["Downtown Life4U Hub", "Westside Pulse Station", "North City Health Centre"];

  const hemoPath = "M0,95 C40,80 80,60 120,45 S180,35 230,55 S310,20 400,30";
  const hemoFill = hemoPath + " L400,120 L0,120 Z";
  const pulsePath = "M0,70 C50,75 90,60 140,65 S200,78 260,68 S340,60 400,63";
  const pulseFill = pulsePath + " L400,120 L0,120 Z";
  const ironPath = "M0,55 C60,50 110,58 170,52 S240,45 300,50 S370,48 400,49";
  const ironFill = ironPath + " L400,120 L0,120 Z";
  const bpPath = "M0,48 C50,52 100,44 160,47 S230,50 290,42 S360,40 400,44";
  const bpFill = bpPath + " L400,120 L0,120 Z";

  /* ── HOME ── */
  const HomeTab = () => (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 28 }}>
        {/* Greeting */}
        <div style={{ ...crd({ padding: "32px 36px" }), position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 280 }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: `${C.primaryContainer}10`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, right: 60, width: 140, height: 140, borderRadius: "50%", background: `${C.cyan}07`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: C.primary, marginBottom: 12 }}>👋 Welcome back, Alex</div>
            <h1 style={{ fontWeight: 900, fontSize: 44, letterSpacing: "-0.04em", lineHeight: 1.1, color: textMain }}>Your generosity<br /><span style={{ color: C.primary }}>changes lives.</span></h1>
            <p style={{ color: textSub, fontSize: 14, marginTop: 12, maxWidth: 380, lineHeight: 1.6 }}>Every donation matters. You've made a real, measurable difference in 12 lives.</p>
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-end", position: "relative", zIndex: 1, marginTop: 28 }}>
            {[["12", "Lives Impacted"], ["18", "Total Donations"], ["Gold", "Current Tier"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.04em", color: textMain }}>{v}</div>
                <div style={{ fontSize: 12, color: textSub, marginTop: 2, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Health Snapshot */}
        <div style={{ ...crd({ background: surfLow, padding: "22px" }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: textMain }}>🩺 Health Snapshot</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 18 }}>
            <Ring pct={0.76} color={C.primary} label="Hemoglobin" value="14.2" />
            <Ring pct={0.66} color={C.cyan} label="BP Level" value="118/75" />
          </div>
          <div style={{ background: cardBg, borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", border: `1px solid ${C.surfaceLow}` }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Blood Type</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>O+</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Next Eligible</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: textMain }}>Apr 28, 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Journey */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.04em", color: textMain, marginBottom: 4 }}>Donation Journey</h2>
            <p style={{ fontSize: 13, color: textSub }}>Track your recent donation as it makes its way to those in need.</p>
          </div>
          <Pill text="Batch #L4U-8921" color={C.onSurfaceVariant} bg={surfLow} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { day: "Day 0", label: "Donated", icon: "🫀", done: true, hl: true, desc: "Successful donation at Downtown Center." },
            { day: "Day 1", label: "Tested", icon: "🔬", done: true, hl: false, desc: "Blood type verification complete." },
            { day: "Day 2", label: "Transported", icon: "🚚", done: false, hl: false, desc: "Delivery to St. Mary's Hospital network." },
            { day: "Day 3", label: "Saved a Life!", icon: "❤️", done: false, hl: false, desc: "Transfusion completed. You made the difference." },
          ].map((s, i) => (
            <div key={i} style={{ borderRadius: 18, padding: "22px 20px", background: s.hl ? `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})` : cardBg, opacity: s.done ? 1 : 0.52, position: "relative", border: s.hl ? "none" : `1px solid ${surfLow}`, boxShadow: s.hl ? `0 8px 24px ${C.primary}30` : "none" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: s.hl ? "rgba(239,246,255,0.7)" : s.done ? C.primary : textSub, marginBottom: 14 }}>{s.day}</div>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 15, color: s.hl ? "#fff" : textMain, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: s.hl ? "rgba(239,246,255,0.8)" : textSub, lineHeight: 1.55 }}>{s.desc}</div>
              {s.done && <span style={{ position: "absolute", top: 16, right: 16, fontSize: 16 }}>{s.hl ? "✅" : "✔️"}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Camps + Leaderboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 22 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontWeight: 900, fontSize: 24, letterSpacing: "-0.04em", color: textMain }}>Nearby Donation Camps</h2>
            <button onClick={() => setActiveTab("appointments")} style={{ color: C.primary, fontWeight: 800, fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>View Map →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Central Plaza Hub", dist: "0.8 km", tag: "Emergency Need", tagColor: C.danger, time: "Closes 8 PM" },
              { name: "Riverside Wellness", dist: "2.4 km", tag: "O+ Specialized", tagColor: C.amber, time: "Open 24/7" },
              { name: "North City Health Centre", dist: "5.1 km", tag: "All Blood Types", tagColor: C.cyan, time: "Closes 6 PM" },
            ].map(c => (
              <div key={c.name} style={{ ...crd({ padding: "18px 20px" }), display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${C.primaryContainer}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>🏥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Pill text={c.tag} color={c.tagColor} bg={`${c.tagColor}14`} />
                    <span style={{ fontSize: 12, color: textSub, fontWeight: 600 }}>{c.dist}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: textMain }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: textSub, marginTop: 2 }}>{c.time}</div>
                </div>
                <button onClick={() => setActiveTab("appointments")} style={{ padding: "9px 18px", borderRadius: 24, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, border: "none", color: C.onPrimary, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Book</button>
              </div>
            ))}
          </div>
        </div>
        {/* Leaderboard */}
        <div style={{ ...crd({ background: surfLow, padding: "22px" }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: textMain }}>🏆 Top Donors</span>
          </div>
          <div style={{ background: `${C.primaryContainer}18`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderLeft: `3px solid ${C.primary}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 11 }}>AX</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Rank</div>
                <div style={{ fontWeight: 900, fontSize: 13, color: textMain }}>Alex Thorne</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.primary }}>#42</div>
              <div style={{ fontSize: 10, color: textSub, fontWeight: 700 }}>Global</div>
            </div>
          </div>
          {[["🥇", "SJ", "Sarah Jenkins", "48"], ["🥈", "MV", "Marcus V.", "42"], ["🥉", "ER", "Elena Rodriguez", "39"], ["4", "JP", "James Patel", "35"]].map(([rank, init, name, count]) => (
            <div key={rank} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px", borderBottom: `1px solid ${C.surfaceHigh}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{rank}</span>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: surfLow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: textSub }}>{init}</div>
                <span style={{ fontWeight: 700, fontSize: 13, color: textMain }}>{name}</span>
              </div>
              <Pill text={count} color={C.primary} bg={`${C.primary}12`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── IMPACT ── */
  const ImpactTab = () => (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 20, marginBottom: 28 }}>
        <div style={{ borderRadius: 20, padding: "44px 40px", background: `linear-gradient(135deg,${C.primaryDim} 0%,${C.primary} 55%,${C.primaryContainer} 100%)`, color: "#fff", minHeight: 360, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 0, top: 0, padding: 32, opacity: 0.07, fontSize: 140 }}>❤️</div>
          <div style={{ position: "absolute", right: -40, bottom: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.7, marginBottom: 14 }}>Monthly Achievement</div>
            <h1 style={{ fontWeight: 900, fontSize: 56, letterSpacing: "-0.04em", lineHeight: 0.95, margin: 0 }}>3 Lives Saved<br /><span style={{ opacity: 0.85 }}>This Month</span></h1>
            <p style={{ marginTop: 22, opacity: 0.9, fontSize: 14, maxWidth: 400, lineHeight: 1.65 }}>Your recent platelet donation has been processed and delivered to three pediatric patients.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
            <div style={{ display: "flex" }}>
              {["P1", "P2", "P3"].map((p, i) => (
                <div key={p} style={{ width: 42, height: 42, borderRadius: "50%", background: `rgba(255,255,255,${0.18 + i * 0.05})`, border: "3px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, marginLeft: i > 0 ? -10 : 0 }}>{p}</div>
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>Recent recipient updates available</span>
          </div>
        </div>
        <div style={crd({ padding: "24px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Donor Loyalty</div>
              <div style={{ fontWeight: 900, fontSize: 22, color: textMain }}>Gallon Club</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.amberContainer, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏅</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
            <span style={{ color: textMain }}>Next: Diamond Elite</span>
            <span style={{ color: C.primary }}>85%</span>
          </div>
          <div style={{ height: 8, background: surfLow, borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "85%", background: `linear-gradient(90deg,${C.primaryDim},${C.primaryContainer})`, borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 13, color: textSub, lineHeight: 1.6, marginBottom: 22 }}>Just 2 more plasma donations to unlock Diamond Elite tier.</p>
          <button onClick={() => setActiveTab("rewards")} style={{ width: "100%", padding: "13px 0", borderRadius: 14, background: surfLow, border: `1px solid ${C.surfaceLow}`, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 14, color: C.primary, cursor: "pointer" }}>🎁 View Perks Library</button>
        </div>
      </div>

      {/* Biometrics */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.04em", color: textMain }}>Biometric Status</h2>
            <p style={{ color: textSub, fontSize: 13, marginTop: 4 }}>Your vitals over the last 6 months of giving.</p>
          </div>
          <div style={{ display: "flex", background: surfLow, padding: 4, borderRadius: 999, border: `1px solid ${C.surfaceLow}` }}>
            {["6 Months", "1 Year"].map((l, i) => (
              <button key={l} style={{ padding: "7px 18px", borderRadius: 999, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer", background: i === 0 ? cardBg : "transparent", color: i === 0 ? textMain : textSub, boxShadow: i === 0 ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Hemoglobin Level", value: "14.2", unit: "g/dL", badge: "+2.4% vs last", bc: "#059669", bb: "#ecfdf5", path: hemoPath, fill: hemoFill, color: C.primary },
            { title: "Avg Resting Pulse", value: "68", unit: "BPM", badge: "Optimal", bc: C.cyan, bb: `${C.cyan}15`, path: pulsePath, fill: pulseFill, color: C.cyan },
            { title: "Iron / Ferritin", value: "88", unit: "µg/L", badge: "Stable", bc: C.success, bb: "#ecfdf5", path: ironPath, fill: ironFill, color: C.success },
            { title: "Blood Pressure", value: "118/75", unit: "mmHg", badge: "Normal", bc: C.amber, bb: C.amberContainer, path: bpPath, fill: bpFill, color: C.amber },
          ].map(ch => (
            <div key={ch.title} style={crd({ padding: "22px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: textSub, marginBottom: 6 }}>{ch.title}</div>
                  <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: "-0.04em", color: textMain }}>{ch.value} <span style={{ fontSize: 13, fontWeight: 600, color: textSub }}>{ch.unit}</span></div>
                </div>
                <Pill text={ch.badge} color={ch.bc} bg={ch.bb} />
              </div>
              <div style={{ height: 110, width: "100%" }}><LineChart data={ch.path} fill={ch.fill} color={ch.color} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(l => (
                  <span key={l} style={{ fontSize: 10, fontWeight: 800, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronicle */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.04em", color: textMain }}>Donation Chronicle</h2>
          <button style={{ color: C.primary, fontWeight: 800, fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>📥 Download History</button>
        </div>
        {[
          { icon: "🩸", color: C.primary, bg: `${C.primary}12`, type: "Platelet Donation", sub: "High-Impact Procedure", loc: "Metropolitan Donor Center", date: "Mar 14, 2026", status: "Verified Impact", sc: "#059669", sb: "#ecfdf5" },
          { icon: "🩺", color: C.cyan, bg: `${C.cyan}12`, type: "Whole Blood", sub: "Routine Donation", loc: "Riverside Regional Hospital", date: "Jan 22, 2026", status: "Completed", sc: textSub, sb: surfLow },
          { icon: "💧", color: C.amber, bg: C.amberContainer, type: "Plasma Donation", sub: "Critical Supply — Pediatric", loc: "Downtown Life4U Hub", date: "Nov 05, 2025", status: "Verified Impact", sc: "#059669", sb: "#ecfdf5" },
          { icon: "🩸", color: C.primary, bg: `${C.primary}12`, type: "Whole Blood", sub: "Emergency Response", loc: "Central Plaza Hub", date: "Aug 30, 2025", status: "Completed", sc: textSub, sb: surfLow },
        ].map((item, i) => (
          <div key={i} style={{ ...crd({ padding: "18px 22px", marginBottom: 10, background: i % 2 === 0 ? surfLow : cardBg }), display: "flex", alignItems: "center", gap: 18, cursor: "pointer" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: textMain }}>{item.type}</div>
              <div style={{ fontSize: 12, color: textSub, marginTop: 2 }}>{item.sub}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: textSub }}>
              <span>📍</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{item.loc}</span>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: textMain }}>{item.date}</div>
              <Pill text={item.status} color={item.sc} bg={item.sb} style={{ marginTop: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── APPOINTMENTS ── */
  const AppointmentsTab = () => {
    const checkItems = [
      { key: "healthy", label: "Feeling healthy and well today?" },
      { key: "meal", label: "Had a full meal in the last 4 hours?" },
      { key: "hydrated", label: "Stayed hydrated with water or juice?" },
      { key: "weight", label: "Over 50 kg in weight?" },
      { key: "tattoo", label: "No new tattoos or piercings in 12 months?" },
      { key: "travel", label: "No significant travel abroad recently?" },
    ];
    return (
      <div className="fade-in">
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: C.primary, marginBottom: 12 }}>📅 Reservation Portal</div>
          <h1 style={{ fontWeight: 900, fontSize: 48, letterSpacing: "-0.04em", lineHeight: 0.95, color: textMain }}>Make an Impact.<br /><span style={{ color: C.primary }}>Schedule Your Gift.</span></h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 26, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

            {/* Step 1 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.onPrimary, fontWeight: 900, fontSize: 17, flexShrink: 0 }}>01</div>
                <h2 style={{ fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em", color: textMain }}>📍 Select Donation Center</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {centers.map((c, i) => (
                  <div key={c} onClick={() => setSelectedCenter(c)} style={{ padding: "16px 18px", borderRadius: 16, cursor: "pointer", border: `2px solid ${selectedCenter === c ? C.primary : "transparent"}`, background: selectedCenter === c ? cardBg : surfLow, transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: textMain }}>{c}</span>
                      {i === 0 && <Pill text="Nearest" color={C.primary} bg={`${C.primary}14`} />}
                    </div>
                    <div style={{ fontSize: 12, color: textSub }}>{["8am – 8pm · 0.8 km", "9am – 6pm · 4.2 km", "7am – 9pm · 5.1 km"][i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.onPrimary, fontWeight: 900, fontSize: 17, flexShrink: 0 }}>02</div>
                <h2 style={{ fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em", color: textMain }}>📅 Pick a Date & Time</h2>
              </div>
              <div style={{ ...crd({ background: surfLow }), display: "flex", flexDirection: "row", gap: 28 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontWeight: 900, fontSize: 15, color: textMain }}>April 2026</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["‹", "›"].map(ic => <button key={ic} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", fontSize: 16, color: textSub, fontWeight: 700 }}>{ic}</button>)}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, textAlign: "center", marginBottom: 8 }}>
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} style={{ fontSize: 10, fontWeight: 800, color: textSub }}>{d}</span>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                    <div style={{ height: 34 }} />
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                      <div key={d} onClick={() => setSelectedDay(d)} style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: 13, cursor: d < 6 ? "default" : "pointer", fontWeight: selectedDay === d ? 900 : 500, background: selectedDay === d ? C.primary : "transparent", color: selectedDay === d ? "#fff" : d < 6 ? C.outlineVariant : textMain, transition: "all 0.15s" }}>{d}</div>
                    ))}
                  </div>
                </div>
                <div style={{ width: 190 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: textMain, marginBottom: 14 }}>🕐 Available Slots</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)} style={{ padding: "9px 6px", borderRadius: 12, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", background: selectedSlot === slot ? C.primary : cardBg, color: selectedSlot === slot ? "#fff" : textMain, boxShadow: selectedSlot === slot ? `0 4px 14px ${C.primary}40` : "none", transform: selectedSlot === slot ? "scale(1.04)" : "scale(1)", transition: "all 0.2s" }}>{slot}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.onPrimary, fontWeight: 900, fontSize: 17, flexShrink: 0 }}>03</div>
                <h2 style={{ fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em", color: textMain }}>⚡ Eligibility Check</h2>
              </div>
              <div style={crd({ padding: "24px" })}>
                <p style={{ color: textSub, marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>Quick verification to ensure you're ready to donate today.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {checkItems.map(item => (
                    <label key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderRadius: 13, background: checks[item.key] ? `${C.primary}08` : "transparent", cursor: "pointer", transition: "background 0.2s", border: `1px solid ${checks[item.key] ? `${C.primary}18` : "transparent"}` }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: textMain }}>{item.label}</span>
                      <input type="checkbox" checked={checks[item.key]} onChange={e => setChecks({ ...checks, [item.key]: e.target.checked })} style={{ width: 18, height: 18, accentColor: C.primary, cursor: "pointer" }} />
                    </label>
                  ))}
                </div>
                {allChecked ? (
                  <div style={{ marginTop: 18, padding: "15px 18px", borderRadius: 14, background: "#ecfdf5", border: "1.5px solid #6ee7b7", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 26 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 15, color: "#065f46" }}>You are eligible to donate blood! 🎉</div>
                      <div style={{ fontSize: 13, color: "#047857", marginTop: 2 }}>All checks passed. You're ready for your appointment.</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 18, padding: "13px 18px", borderRadius: 14, background: "#fff7ed", border: "1.5px solid #fed7aa", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 22 }}>ℹ️</span>
                    <div style={{ fontSize: 13, color: "#9a3412" }}>Please confirm all checks before booking your appointment.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Summary */}
          <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={crd({ padding: "22px" })}>
              <div style={{ fontWeight: 900, fontSize: 18, color: textMain, marginBottom: 22 }}>📋 Booking Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 22 }}>
                {[
                  { icon: "📍", label: "Center", val: selectedCenter, sub: centers.indexOf(selectedCenter) === 0 ? "421 Neon Way, Suite 100" : "Downtown Location" },
                  { icon: "📅", label: "Date", val: `Apr ${String(selectedDay).padStart(2, "0")}, 2026`, sub: "Ahmedabad, Gujarat" },
                  { icon: "🕐", label: "Time", val: selectedSlot, sub: "Approx. 30–45 min session" },
                  { icon: "⚡", label: "Status", val: allChecked ? "Eligible to Donate ✓" : "Complete checks first", sub: allChecked ? "All checks passed" : "See Eligibility Check", color: allChecked ? C.success : textSub },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.cyan}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>{row.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: C.primary, marginBottom: 3 }}>{row.label}</div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: row.color || textMain }}>{row.val}</div>
                      <div style={{ fontSize: 12, color: textSub, marginTop: 1 }}>{row.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${surfLow}`, paddingTop: 18 }}>
                <button disabled={!allChecked} style={{ width: "100%", padding: "15px 0", borderRadius: 999, background: allChecked ? `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})` : C.surfaceHigh, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 15, color: allChecked ? C.onPrimary : C.outlineVariant, cursor: allChecked ? "pointer" : "not-allowed", boxShadow: allChecked ? `0 8px 24px ${C.primary}35` : "none", transition: "all 0.2s" }}>
                  {allChecked ? "✅ Confirm Booking" : "Complete All Checks"}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: textSub, marginTop: 10, lineHeight: 1.5 }}>By confirming, you agree to our donor safety protocols.</p>
              </div>
            </div>
            <div style={{ borderRadius: 18, padding: "22px", background: `linear-gradient(135deg,${C.amberLight},${C.amber})`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -10, bottom: -10, opacity: 0.12, fontSize: 90 }}>🎁</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontWeight: 900, fontSize: 17, color: "#1c1400", marginBottom: 6 }}>🎁 Booking Reward</div>
                <p style={{ fontSize: 13, color: "#3d2c00", lineHeight: 1.5, marginBottom: 10 }}>Earn <strong>500 Life Points</strong> when you complete this appointment!</p>
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.35)", padding: "4px 12px", borderRadius: 99, color: "#3d2c00" }}>Active Booster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── REWARDS ── */
  const RewardsTab = () => (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 20, marginBottom: 28 }}>
        <div style={{ ...crd({ padding: "32px 36px" }), position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 0, top: 0, opacity: 0.04, fontSize: 200 }}>⭐</div>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: C.primary, marginBottom: 14 }}>⭐ Rewards Hub</div>
            <h1 style={{ fontWeight: 900, fontSize: 50, letterSpacing: "-0.04em", lineHeight: 1, color: textMain }}>1,840<br /><span style={{ color: C.primary }}>Life Points</span></h1>
            <p style={{ color: textSub, marginTop: 14, maxWidth: 360, fontSize: 14, lineHeight: 1.6 }}>Redeem for health perks, priority bookings, and community badges.</p>
            <div style={{ display: "flex", gap: 32, marginTop: 24 }}>
              {[["Gold", "Current Tier"], ["250", "Points to Platinum"], ["18", "Donations Made"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontWeight: 900, fontSize: 24, color: textMain }}>{v}</div>
                  <div style={{ fontSize: 12, color: textSub, marginTop: 2, fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                <span>Gold</span><span>Platinum (2,090 pts)</span>
              </div>
              <div style={{ height: 8, background: surfLow, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "88%", background: `linear-gradient(90deg,${C.primaryDim},${C.primaryContainer})`, borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "🔥", label: "Active Streak", val: "6 Months", bg: `linear-gradient(135deg,${C.amberLight},${C.amber})`, tc: "#1c1400" },
            { icon: "🎁", label: "Points Redeemed", val: "560 pts", bg: cardBg, tc: textMain },
            { icon: "✅", label: "Badges Earned", val: "7 Badges", bg: cardBg, tc: textMain },
          ].map(s => (
            <div key={s.label} style={{ ...crd({ background: s.bg, padding: "18px 20px" }), display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: s.tc === textMain ? textSub : `${s.tc}bb`, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: s.tc }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.04em", color: textMain, marginBottom: 18 }}>🎁 Perks Catalog</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { icon: "🏥", color: C.primary, label: "Free Health Checkup", desc: "Complete physical at any partner clinic.", pts: 400, can: true },
            { icon: "☕", color: C.amber, label: "Café Voucher", desc: "₹500 voucher at partner café chain.", pts: 200, can: true },
            { icon: "👕", color: C.cyan, label: "Life4U Merch Kit", desc: "Exclusive T-shirt, hoodie & tote bag.", pts: 600, can: true },
            { icon: "⚡", color: C.primary, label: "Priority Booking Pass", desc: "Skip the queue — book slots 7 days ahead.", pts: 150, can: true },
            { icon: "🧘", color: C.success, label: "Wellness Day Pass", desc: "One complimentary day at wellness centre.", pts: 800, can: false, lm: "Need Platinum" },
            { icon: "🎟", color: C.amber, label: "Annual Gala Ticket", desc: "Attend our annual donor recognition gala.", pts: 1200, can: false, lm: "Need Platinum" },
          ].map(p => (
            <div key={p.label} style={crd({ padding: "22px", cursor: "pointer" })}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${p.color}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 26 }}>{p.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 15, color: textMain, marginBottom: 6 }}>{p.label}</div>
              <div style={{ fontSize: 13, color: textSub, marginBottom: 18, lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900, color: C.primary, fontSize: 15 }}>{p.pts} pts</span>
                <button style={{ padding: "7px 16px", borderRadius: 999, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 12, cursor: p.can ? "pointer" : "default", background: p.can ? `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})` : surfLow, color: p.can ? C.onPrimary : textSub }}>
                  {p.can ? "Redeem" : p.lm}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.04em", color: textMain, marginBottom: 18 }}>🏅 Your Badges</h2>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { icon: "🩸", label: "First Drop", bg: `${C.primary}14`, earned: true },
            { icon: "🔥", label: "5 Streak", bg: `${C.amberLight}30`, earned: true },
            { icon: "🏅", label: "Gold Status", bg: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, earned: true },
            { icon: "❤️", label: "Life Saver", bg: "#ecfdf5", earned: true },
            { icon: "💉", label: "Rare Type", bg: `${C.cyan}14`, earned: true },
            { icon: "🎖", label: "10 Donations", bg: C.amberContainer, earned: true },
            { icon: "🏆", label: "Top 50", bg: `${C.amber}22`, earned: true },
            { icon: "🔒", label: "Locked", bg: C.surfaceHigh, earned: false },
          ].map(b => (
            <div key={b.label} style={{ textAlign: "center", opacity: b.earned ? 1 : 0.4 }}>
              <div style={{ width: 62, height: 62, borderRadius: 18, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 28, boxShadow: b.earned ? "0 4px 14px rgba(0,0,0,0.08)" : "none" }}>{b.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: textMain }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabContent = { home: <HomeTab />, impact: <ImpactTab />, appointments: <AppointmentsTab />, rewards: <RewardsTab /> };

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ minHeight: "100vh", background: bg, color: textMain, fontFamily: "Plus Jakarta Sans, sans-serif" }}>

        {showSettings && <SettingsPage onClose={() => setShowSettings(false)} theme={theme} setTheme={setTheme} />}

        {/* NAVBAR */}
        <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", boxShadow: "0 2px 12px rgba(30,58,138,0.08)", borderBottom: `1px solid ${C.surfaceLow}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setActiveTab("home")}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🩸</div>
              <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.04em", color: C.onSurface }}>Life<span style={{ color: C.primary }}>4U</span></span>
            </div>
            <div style={{ display: "flex", gap: 4, background: C.surface, padding: 4, borderRadius: 999, border: `1px solid ${C.surfaceLow}` }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 999, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", background: activeTab === t.id ? C.surfaceLowest : "transparent", color: activeTab === t.id ? C.primary : C.onSurfaceVariant, transition: "all 0.2s", boxShadow: activeTab === t.id ? "0 2px 10px rgba(30,58,138,0.1)" : "none" }}>
                  <span style={{ fontSize: 16 }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setActiveTab("appointments")} style={{ padding: "10px 22px", borderRadius: 999, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, border: "none", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 13, color: C.onPrimary, cursor: "pointer", boxShadow: `0 4px 16px ${C.primary}30` }}>
                🩸 Donate Now
              </button>
              <button onClick={() => setShowSettings(true)} style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, boxShadow: `0 2px 8px ${C.primary}30`, position: "relative" }}>
                AX
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
              </button>
            </div>
          </div>
        </nav>

        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 40px 80px" }}>
          {tabContent[activeTab]}
        </main>

        {/* FOOTER */}
        <footer style={{ background: C.onSurface, color: "#fff", marginTop: 40 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40, marginBottom: 44 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.primaryDim},${C.primaryContainer})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🩸</div>
                  <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.04em" }}>Life<span style={{ color: C.primaryLight }}>4U</span></span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6, maxWidth: 200 }}>Connecting generous donors to those who need it most. Every drop is a gift of life.</p>
                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  {["🌐", "💬", "📧"].map(ic => <div key={ic} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15 }}>{ic}</div>)}
                </div>
              </div>
              {[
                { title: "For Donors", items: [["Dashboard", "home"], ["My Impact", "impact"], ["Appointments", "appointments"], ["Rewards", "rewards"]] },
                { title: "Resources", items: [["Eligibility Guide", null], ["Find a Camp", null], ["Blood Types", null], ["Emergency Requests", null]] },
                { title: "Life4U", items: [["About Us", null], ["Partner Hospitals", null], ["Careers", null], ["Support", null]] },
              ].map((col, ci) => (
                <div key={ci}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>{col.title}</div>
                  {col.items.map(([l, tab]) => (
                    <div key={l} onClick={() => tab && setActiveTab(tab)} style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 10, cursor: "pointer", fontWeight: 600 }}>{l}</div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2026 Life4U. All rights reserved. Saving lives, every day.</p>
              <div style={{ display: "flex", gap: 22 }}>
                {["Privacy Policy", "Terms of Use", "Cookie Settings"].map(l => <span key={l} style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>{l}</span>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}