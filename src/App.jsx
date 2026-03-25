import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C", icon: "📸" },
  { id: "linkedin",  label: "LinkedIn",  color: "#0A66C2", icon: "💼" },
  { id: "twitter",   label: "Twitter/X", color: "#1DA1F2", icon: "𝕏" },
  { id: "youtube",   label: "YouTube",   color: "#FF0000", icon: "▶" },
  { id: "tiktok",    label: "TikTok",    color: "#69C9D0", icon: "♪" },
  { id: "facebook",  label: "Facebook",  color: "#1877F2", icon: "f" },
];

const ACCOUNTS = [
  { id: 1, name: "TechCorp A.Ş.",     type: "company", avatar: "T", platforms: ["instagram","linkedin","facebook"] },
  { id: 2, name: "FinCloud Ltd.",      type: "company", avatar: "F", platforms: ["linkedin","twitter","youtube"] },
  { id: 3, name: "Kuzzat Altay",       type: "personal", avatar: "K", platforms: ["instagram","twitter","linkedin","tiktok","youtube"] },
];

const TEAM = [
  { id: 1, name: "Halil Doğan",     role: "Admin",   avatar: "H", email: "halil@company.com",   status: "active" },
  { id: 2, name: "Ayşe Kaya",       role: "Editor",  avatar: "A", email: "ayse@company.com",    status: "active" },
  { id: 3, name: "Mert Yılmaz",     role: "Editor",  avatar: "M", email: "mert@company.com",    status: "active" },
  { id: 4, name: "Selin Arslan",    role: "Viewer",  avatar: "S", email: "selin@company.com",   status: "inactive" },
];

const reachData = [
  { month: "Eki", ig: 42000, li: 18000, tw: 9000, yt: 55000 },
  { month: "Kas", ig: 47000, li: 21000, tw: 11000, yt: 62000 },
  { month: "Ara", ig: 51000, li: 19000, tw: 13000, yt: 58000 },
  { month: "Oca", ig: 58000, li: 24000, tw: 15000, yt: 71000 },
  { month: "Şub", ig: 62000, li: 27000, tw: 14000, yt: 79000 },
  { month: "Mar", ig: 71000, li: 31000, tw: 18000, yt: 88000 },
];

const engageData = [
  { day: "Pzt", rate: 4.2 },
  { day: "Sal", rate: 5.1 },
  { day: "Çar", rate: 3.8 },
  { day: "Per", rate: 6.3 },
  { day: "Cum", rate: 7.1 },
  { day: "Cmt", rate: 5.5 },
  { day: "Paz", rate: 4.9 },
];

const platformDist = [
  { name: "Instagram", value: 38, color: "#E1306C" },
  { name: "YouTube",   value: 28, color: "#FF0000" },
  { name: "LinkedIn",  value: 16, color: "#0A66C2" },
  { name: "Twitter/X", value: 10, color: "#1DA1F2" },
  { name: "TikTok",    value: 5,  color: "#69C9D0" },
  { name: "Facebook",  value: 3,  color: "#1877F2" },
];

const revenueData = [
  { month: "Eki", gelir: 42000, abone: 1120 },
  { month: "Kas", gelir: 48000, abone: 1340 },
  { month: "Ara", gelir: 45000, abone: 1280 },
  { month: "Oca", gelir: 53000, abone: 1560 },
  { month: "Şub", gelir: 61000, abone: 1720 },
  { month: "Mar", gelir: 68000, abone: 1950 },
];

const CALENDAR_POSTS = [
  { id: 1, title: "Yeni Ürün Lansmanı", platform: "instagram", account: "TechCorp A.Ş.", date: "21 Mar", time: "10:00", status: "scheduled" },
  { id: 2, title: "CEO Röportajı", platform: "youtube",   account: "Kuzzat Altay",  date: "21 Mar", time: "14:00", status: "scheduled" },
  { id: 3, title: "Pazar Trendleri", platform: "linkedin",  account: "FinCloud Ltd.", date: "22 Mar", time: "09:30", status: "draft" },
  { id: 4, title: "Behind the Scenes", platform: "tiktok",   account: "Kuzzat Altay",  date: "22 Mar", time: "18:00", status: "scheduled" },
  { id: 5, title: "Q1 Başarıları",    platform: "twitter",   account: "TechCorp A.Ş.", date: "23 Mar", time: "11:00", status: "draft" },
  { id: 6, title: "Ürün Demo Videosu", platform: "youtube",  account: "FinCloud Ltd.", date: "24 Mar", time: "16:00", status: "scheduled" },
  { id: 7, title: "Takipçi Q&A",      platform: "instagram", account: "Kuzzat Altay",  date: "25 Mar", time: "20:00", status: "scheduled" },
];

const COMMENTS = [
  { id: 1, author: "emre_tech",    platform: "instagram", text: "Harika içerik, devamını bekliyoruz!", time: "2s önce",   status: "new",      sentiment: "pos" },
  { id: 2, author: "selin.yilmaz", platform: "linkedin",  text: "Bu konuyu daha detaylı anlatır mısınız?", time: "15d önce", status: "new",      sentiment: "neu" },
  { id: 3, author: "mehmet_44",    platform: "youtube",   text: "Video biraz uzun olmuş ama güzel.", time: "1s önce",   status: "replied",  sentiment: "neu" },
  { id: 4, author: "tech_lover99", platform: "twitter",   text: "Bunu paylaşmak zorundayım 🔥",       time: "3s önce",   status: "new",      sentiment: "pos" },
  { id: 5, author: "anon_user",    platform: "facebook",  text: "Reklam gibi hissettirdi açıkçası.", time: "5s önce",   status: "flagged",  sentiment: "neg" },
];

// ── STYLES / TOKENS ───────────────────────────────────────────────────────────
const S = {
  bg:        "#08080D",
  surface:   "#0F0F18",
  surface2:  "#14141F",
  border:    "#1E1E2E",
  border2:   "#252535",
  accent:    "#F5B942",
  accentDim: "#F5B94222",
  text:      "#E8E8F0",
  textMuted: "#6B6B8A",
  textDim:   "#3A3A55",
  green:     "#22C55E",
  red:       "#EF4444",
  blue:      "#3B82F6",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&family=Fira+Code:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${S.bg}; color: ${S.text}; font-family: 'Bricolage Grotesque', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${S.surface}; }
  ::-webkit-scrollbar-thumb { background: ${S.border2}; border-radius: 2px; }
  .mono { font-family: 'Fira Code', monospace; }
`;

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
function Badge({ children, color = S.accent, style = {} }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "2px 8px", borderRadius: 4, border: `1px solid ${color}44`,
      color, background: `${color}18`, ...style,
    }}>{children}</span>
  );
}

function Stat({ label, value, delta, prefix = "", suffix = "" }) {
  const pos = delta?.startsWith("+");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, color: S.textMuted, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "Fira Code, monospace" }}>
        {prefix}{typeof value === "number" ? value.toLocaleString("tr") : value}{suffix}
      </span>
      {delta && (
        <span style={{ fontSize: 12, color: pos ? S.green : S.red, fontWeight: 600 }}>
          {delta} <span style={{ color: S.textMuted, fontWeight: 400 }}>son 30 gün</span>
        </span>
      )}
    </div>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: S.surface, border: `1px solid ${S.border}`,
      borderRadius: 12, padding: "20px 24px",
      cursor: onClick ? "pointer" : "default",
      transition: "border-color 0.2s",
      ...style,
    }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = S.border2)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = S.border)}
    >{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: S.text }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: S.border }} />
    </div>
  );
}

const platformColor = id => PLATFORMS.find(p => p.id === id)?.color || "#888";
const platformIcon  = id => PLATFORMS.find(p => p.id === id)?.icon || "•";
const platformLabel = id => PLATFORMS.find(p => p.id === id)?.label || id;

// ── PAGES ─────────────────────────────────────────────────────────────────────

function PageDashboard() {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString("tr") : p.value}</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Toplam Erişim",    value: 340000, delta: "+18%", prefix: "", suffix: "" },
          { label: "Planlanan İçerik", value: 47,     delta: "+12",  prefix: "", suffix: " post" },
          { label: "Ort. Etkileşim",  value: "5.4",   delta: "+0.8%",prefix: "", suffix: "%" },
          { label: "Aktif Hesaplar",  value: 14,      delta: "+2",   prefix: "", suffix: "" },
        ].map(k => (
          <Card key={k.label}>
            <Stat {...k} />
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Platform Erişimi — Son 6 Ay</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={reachData}>
              <defs>
                {[["ig","#E1306C"],["li","#0A66C2"],["tw","#1DA1F2"],["yt","#FF0000"]].map(([k,c]) => (
                  <linearGradient key={k} id={`g_${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis dataKey="month" tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              {[["ig","#E1306C","Instagram"],["li","#0A66C2","LinkedIn"],["tw","#1DA1F2","Twitter"],["yt","#FF0000","YouTube"]].map(([k,c,n]) => (
                <Area key={k} type="monotone" dataKey={k} name={n} stroke={c} strokeWidth={2} fill={`url(#g_${k})`} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Platform Dağılımı</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={platformDist} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {platformDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {platformDist.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: S.textMuted, flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: S.text, fontFamily: "Fira Code, monospace", fontWeight: 500 }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Engagement + Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Günlük Etkileşim Oranı</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={engageData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis dataKey="day" tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8 }} />
              <Bar dataKey="rate" fill={S.accent} radius={[4, 4, 0, 0]} name="Etkileşim" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Yaklaşan İçerikler</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CALENDAR_POSTS.slice(0, 5).map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: `${platformColor(p.platform)}22`,
                  border: `1px solid ${platformColor(p.platform)}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                }}>{platformIcon(p.platform)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: S.textMuted }}>{p.account}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: S.textMuted, fontFamily: "Fira Code, monospace" }}>{p.date}</div>
                  <div style={{ fontSize: 11, color: S.accent, fontFamily: "Fira Code, monospace" }}>{p.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PageCalendar() {
  const statusColor = s => s === "scheduled" ? S.green : s === "draft" ? S.accent : S.textMuted;
  const statusLabel = s => s === "scheduled" ? "Planlandı" : s === "draft" ? "Taslak" : s;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>İçerik Takvimi</div>
          <div style={{ fontSize: 13, color: S.textMuted, marginTop: 4 }}>Mart 2026 — 7 planlanmış içerik</div>
        </div>
        <button style={{
          background: S.accent, color: "#000", fontWeight: 700, fontSize: 13,
          border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer",
          fontFamily: "Bricolage Grotesque, sans-serif",
        }}>+ Yeni İçerik</button>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${S.border}` }}>
              {["Platform", "İçerik Başlığı", "Hesap", "Tarih", "Saat", "Durum"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 600,
                  color: S.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CALENDAR_POSTS.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? "transparent" : `${S.surface2}80` }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{platformIcon(p.platform)}</span>
                    <span style={{ fontSize: 12, color: platformColor(p.platform), fontWeight: 500 }}>{platformLabel(p.platform)}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500 }}>{p.title}</td>
                <td style={{ padding: "14px 20px" }}>
                  <Badge color={S.blue}>{p.account}</Badge>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 12, fontFamily: "Fira Code, monospace", color: S.textMuted }}>{p.date}</td>
                <td style={{ padding: "14px 20px", fontSize: 12, fontFamily: "Fira Code, monospace", color: S.accent }}>{p.time}</td>
                <td style={{ padding: "14px 20px" }}>
                  <Badge color={statusColor(p.status)}>{statusLabel(p.status)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PageSocial() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Sosyal Medya Performansı</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {PLATFORMS.map(pl => {
          const followers = { instagram: 48200, linkedin: 12400, twitter: 9800, youtube: 31500, tiktok: 7200, facebook: 5600 };
          const growth    = { instagram: "+4.2%", linkedin: "+7.1%", twitter: "+2.3%", youtube: "+9.8%", tiktok: "+14.3%", facebook: "+1.1%" };
          return (
            <Card key={pl.id} style={{ borderTop: `3px solid ${pl.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: `${pl.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>{pl.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{pl.label}</div>
                  <div style={{ fontSize: 11, color: S.textMuted }}>Tüm hesaplar</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 4 }}>Takipçi</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Fira Code, monospace" }}>{followers[pl.id].toLocaleString("tr")}</div>
                  <div style={{ fontSize: 11, color: S.green, marginTop: 2 }}>{growth[pl.id]}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 4 }}>Bu Ay Post</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Fira Code, monospace" }}>{Math.floor(Math.random() * 20 + 8)}</div>
                  <div style={{ fontSize: 11, color: S.textMuted, marginTop: 2 }}>içerik</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PageRevenue() {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString("tr") : p.value}{p.name === "Gelir" ? " ₺" : ""}</strong>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Gelir & Aboneler</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Aylık Gelir", value: "68.000 ₺", delta: "+12%", color: S.green },
          { label: "Aktif Abone", value: "1.950",    delta: "+230", color: S.blue },
          { label: "Ort. Müşteri Değeri", value: "34,8 ₺", delta: "+4%", color: S.accent },
        ].map(k => (
          <Card key={k.label}>
            <div style={{ fontSize: 12, color: S.textMuted, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Fira Code, monospace" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.color, marginTop: 6 }}>{k.delta} <span style={{ color: S.textMuted, fontWeight: 400 }}>son ay</span></div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionTitle>Gelir & Abone Trendi</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
            <XAxis dataKey="month" tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k₺`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: S.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line yAxisId="left"  type="monotone" dataKey="gelir" stroke={S.accent} strokeWidth={2.5} dot={{ fill: S.accent, r: 4 }} name="Gelir" />
            <Line yAxisId="right" type="monotone" dataKey="abone" stroke={S.blue}   strokeWidth={2.5} dot={{ fill: S.blue, r: 4 }} name="Abone" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function PageComments() {
  const [comments, setComments] = useState(COMMENTS);
  const sentColor = s => s === "pos" ? S.green : s === "neg" ? S.red : S.textMuted;
  const sentLabel = s => s === "pos" ? "Pozitif" : s === "neg" ? "Negatif" : "Nötr";
  const statusColor = s => s === "new" ? S.accent : s === "replied" ? S.green : s === "flagged" ? S.red : S.textMuted;
  const statusLabel = s => ({ new: "Yeni", replied: "Yanıtlandı", flagged: "İşaretlendi" })[s] || s;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Yorum Moderasyonu</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map(c => (
          <Card key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: `${platformColor(c.platform)}22`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
            }}>{platformIcon(c.platform)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>@{c.author}</span>
                <Badge color={sentColor(c.sentiment)}>{sentLabel(c.sentiment)}</Badge>
                <Badge color={statusColor(c.status)}>{statusLabel(c.status)}</Badge>
                <span style={{ fontSize: 11, color: S.textMuted, marginLeft: "auto" }}>{c.time}</span>
              </div>
              <div style={{ fontSize: 13, color: S.textMuted }}>{c.text}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setComments(prev => prev.map(x => x.id === c.id ? { ...x, status: "replied" } : x))}
                style={{ background: `${S.green}22`, border: `1px solid ${S.green}44`, color: S.green, borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontFamily: "Bricolage Grotesque, sans-serif" }}
              >Yanıtla</button>
              <button
                onClick={() => setComments(prev => prev.map(x => x.id === c.id ? { ...x, status: "flagged" } : x))}
                style={{ background: `${S.red}22`, border: `1px solid ${S.red}44`, color: S.red, borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontFamily: "Bricolage Grotesque, sans-serif" }}
              >İşaretle</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PageUsers() {
  const roleColor = r => r === "Admin" ? S.accent : r === "Editor" ? S.blue : S.textMuted;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Kullanıcı Yönetimi</div>
        <button style={{
          background: S.accent, color: "#000", fontWeight: 700, fontSize: 13,
          border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer",
          fontFamily: "Bricolage Grotesque, sans-serif",
        }}>+ Kullanıcı Davet Et</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {TEAM.map(u => (
          <Card key={u.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: `${S.accent}22`,
              border: `1px solid ${S.accent}44`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 16, fontWeight: 700, color: S.accent, flexShrink: 0,
            }}>{u.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: S.textMuted }}>{u.email}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <Badge color={roleColor(u.role)}>{u.role}</Badge>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: u.status === "active" ? S.green : S.textMuted }} />
                <span style={{ fontSize: 11, color: S.textMuted }}>{u.status === "active" ? "Aktif" : "Pasif"}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PageSEO() {
  const keywords = [
    { word: "react eğitimi",       pos: 3,  vol: 4400, trend: "up" },
    { word: "javascript kursu",    pos: 7,  vol: 8100, trend: "up" },
    { word: "typescript öğren",    pos: 12, vol: 2900, trend: "stable" },
    { word: "frontend geliştirici",pos: 5,  vol: 3600, trend: "up" },
    { word: "bilginomist",         pos: 1,  vol: 1200, trend: "stable" },
    { word: "online it kursu",     pos: 18, vol: 6600, trend: "down" },
  ];
  const trendColor = t => t === "up" ? S.green : t === "down" ? S.red : S.textMuted;
  const trendIcon  = t => t === "up" ? "↑" : t === "down" ? "↓" : "→";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>SEO Metrikleri</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Ort. Sıralama", value: "7.6", delta: "−2.1", color: S.green },
          { label: "Organik Trafik", value: "18.400", delta: "+34%", color: S.green },
          { label: "Takip Edilen KW", value: "6", delta: "+1", color: S.blue },
        ].map(k => (
          <Card key={k.label}>
            <div style={{ fontSize: 12, color: S.textMuted, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Fira Code, monospace" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.color, marginTop: 6 }}>{k.delta}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px 0", fontSize: 14, fontWeight: 600 }}>Anahtar Kelimeler</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${S.border}` }}>
              {["Anahtar Kelime", "Sıralama", "Arama Hacmi", "Trend"].map(h => (
                <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 11, fontWeight: 600, color: S.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keywords.map((k, i) => (
              <tr key={k.word} style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? "transparent" : `${S.surface2}80` }}>
                <td style={{ padding: "12px 24px", fontSize: 13, fontWeight: 500 }}>{k.word}</td>
                <td style={{ padding: "12px 24px" }}>
                  <span style={{ fontFamily: "Fira Code, monospace", fontSize: 13, color: k.pos <= 5 ? S.green : k.pos <= 10 ? S.accent : S.textMuted, fontWeight: 600 }}>#{k.pos}</span>
                </td>
                <td style={{ padding: "12px 24px", fontFamily: "Fira Code, monospace", fontSize: 13 }}>{k.vol.toLocaleString("tr")}</td>
                <td style={{ padding: "12px 24px" }}>
                  <span style={{ color: trendColor(k.trend), fontWeight: 700 }}>{trendIcon(k.trend)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PageMedia() {
  const files = [
    { name: "kampanya-banner.png",   type: "image", size: "1.2 MB", date: "18 Mar" },
    { name: "intro-video.mp4",       type: "video", size: "48 MB",  date: "15 Mar" },
    { name: "logo-white.svg",        type: "image", size: "24 KB",  date: "10 Mar" },
    { name: "q1-raporu.pdf",         type: "pdf",   size: "3.4 MB", date: "5 Mar"  },
    { name: "sosyal-template.psd",   type: "file",  size: "18 MB",  date: "2 Mar"  },
    { name: "podcast-ep12.mp3",      type: "audio", size: "52 MB",  date: "28 Şub" },
  ];
  const typeIcon = t => ({ image: "🖼", video: "🎬", pdf: "📄", file: "📁", audio: "🎵" })[t] || "📄";
  const typeColor = t => ({ image: "#E1306C", video: "#FF0000", pdf: S.red, file: S.blue, audio: "#9333EA" })[t] || S.textMuted;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Medya Kütüphanesi</div>
        <button style={{
          background: S.accent, color: "#000", fontWeight: 700, fontSize: 13,
          border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer",
          fontFamily: "Bricolage Grotesque, sans-serif",
        }}>↑ Dosya Yükle</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {files.map(f => (
          <Card key={f.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: `${typeColor(f.type)}22`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
            }}>{typeIcon(f.type)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
              <div style={{ fontSize: 11, color: S.textMuted, marginTop: 3 }}>{f.size} · {f.date}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",     icon: "⬛" },
  { id: "calendar",   label: "İçerik Takvimi",icon: "📅" },
  { id: "social",     label: "Sosyal Medya",  icon: "📡" },
  { id: "revenue",    label: "Gelir & Aboneler", icon: "💰" },
  { id: "seo",        label: "SEO Metrikleri",icon: "🔍" },
  { id: "comments",   label: "Yorumlar",      icon: "💬" },
  { id: "media",      label: "Medya Kütüph.", icon: "🗂" },
  { id: "users",      label: "Kullanıcılar",  icon: "👥" },
];

const PAGE_MAP = {
  dashboard: PageDashboard,
  calendar:  PageCalendar,
  social:    PageSocial,
  revenue:   PageRevenue,
  seo:       PageSEO,
  comments:  PageComments,
  media:     PageMedia,
  users:     PageUsers,
};

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const ActivePage = PAGE_MAP[activePage] || PageDashboard;
  const activeNav  = NAV_ITEMS.find(n => n.id === activePage);

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 220, flexShrink: 0,
          background: S.surface, borderRight: `1px solid ${S.border}`,
          display: "flex", flexDirection: "column",
          padding: "0 0 16px",
        }}>
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${S.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: S.accent, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#000",
              }}>C</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Content Hub</div>
                <div style={{ fontSize: 10, color: S.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>v1.0 · Ekip</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map(item => {
              const isActive = item.id === activePage;
              return (
                <button key={item.id} onClick={() => setActivePage(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: isActive ? S.accentDim : "transparent",
                  color: isActive ? S.accent : S.textMuted,
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                  borderLeft: isActive ? `3px solid ${S.accent}` : "3px solid transparent",
                }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Accounts */}
          <div style={{ padding: "12px 10px", borderTop: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 10, color: S.textDim, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 12 }}>Hesaplar</div>
            {ACCOUNTS.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = S.surface2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 6, background: `${S.accent}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: S.accent, flexShrink: 0,
                }}>{a.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: S.textMuted }}>{a.platforms.length} platform</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <header style={{
            height: 60, flexShrink: 0,
            borderBottom: `1px solid ${S.border}`,
            display: "flex", alignItems: "center",
            padding: "0 28px", gap: 16, background: S.bg,
          }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: S.text }}>{activeNav?.label}</span>
            </div>
            <div style={{ display: "flex", align: "center", gap: 12 }}>
              <div style={{ fontSize: 11, color: S.textMuted, fontFamily: "Fira Code, monospace" }}>20 Mar 2026</div>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${S.accent}22`, border: `1px solid ${S.accent}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: S.accent, cursor: "pointer",
              }}>H</div>
            </div>
          </header>

          {/* Page Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
            <ActivePage />
          </div>
        </main>
      </div>
    </>
  );
}
