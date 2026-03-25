import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  { id: 1, name: "Kuzzat Altay",  type: "personal", avatar: "K", platforms: ["instagram","twitter","youtube","facebook","linkedin"] },
  { id: 2, name: "Bilginomist",   type: "company",  avatar: "B", platforms: ["instagram","youtube","facebook","twitter","tiktok"] },
  { id: 3, name: "CYDEO",         type: "company",  avatar: "C", platforms: ["instagram","linkedin","twitter","youtube","tiktok","facebook"] },
  { id: 4, name: "PlanckVPN",     type: "company",  avatar: "P", platforms: ["instagram","linkedin","twitter","youtube","tiktok","facebook"] },
  { id: 5, name: "NurPN",         type: "company",  avatar: "N", platforms: ["instagram","linkedin","twitter","youtube","tiktok","facebook"] },
];

const TEAM = [
  { id: 1, name: "Halil",        role: "Admin",   avatar: "H", email: "halil@cydeo.com",        status: "active" },
  { id: 2, name: "Kuzzat Altay", role: "Admin",   avatar: "K", email: "kuzzat@bilginomist.com", status: "active" },
  { id: 3, name: "Editör 1",     role: "Editor",  avatar: "E", email: "editor1@cydeo.com",      status: "active" },
  { id: 4, name: "Editör 2",     role: "Viewer",  avatar: "E", email: "editor2@cydeo.com",      status: "inactive" },
];

const reachData = [];

const engageData = [];

const platformDist = [
  { name: "Instagram", value: 0, color: "#E1306C" },
  { name: "YouTube",   value: 0, color: "#FF0000" },
  { name: "LinkedIn",  value: 0, color: "#0A66C2" },
  { name: "Twitter/X", value: 0, color: "#1DA1F2" },
  { name: "TikTok",    value: 0, color: "#69C9D0" },
  { name: "Facebook",  value: 0, color: "#1877F2" },
];

const revenueData = [];

const CALENDAR_POSTS = [];

const COMMENTS = [];

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
          { label: "Toplam Erişim",    value: 0, delta: null, prefix: "", suffix: "" },
          { label: "Planlanan İçerik", value: 0, delta: null, prefix: "", suffix: " post" },
          { label: "Ort. Etkileşim",  value: "0", delta: null, prefix: "", suffix: "%" },
          { label: "Aktif Hesaplar",  value: 5,  delta: null, prefix: "", suffix: "" },
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
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "instagram", account_id: "", scheduled_date: "", scheduled_time: "", status: "draft" });

  useEffect(() => {
    fetchPosts();
    supabase.from("accounts").select("*").then(({ data }) => setAccounts(data || []));
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase.from("posts").select("*, accounts(name)").order("scheduled_date", { ascending: true });
    setPosts(data || []);
    setLoading(false);
  }

  async function addPost() {
    if (!form.title || !form.account_id) return;
    await supabase.from("posts").insert([form]);
    setForm({ title: "", platform: "instagram", account_id: "", scheduled_date: "", scheduled_time: "", status: "draft" });
    setShowForm(false);
    fetchPosts();
  }

  async function deletePost(id) {
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  }

  const statusColor = s => s === "scheduled" ? S.green : s === "draft" ? S.accent : S.textMuted;
  const statusLabel = s => s === "scheduled" ? "Planlandı" : s === "draft" ? "Taslak" : s;
  const inputStyle = { background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 13, fontFamily: "Bricolage Grotesque, sans-serif", width: "100%", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>İçerik Takvimi</div>
          <div style={{ fontSize: 13, color: S.textMuted, marginTop: 4 }}>{posts.length} planlanmış içerik</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: S.accent, color: "#000", fontWeight: 700, fontSize: 13,
          border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer",
          fontFamily: "Bricolage Grotesque, sans-serif",
        }}>+ Yeni İçerik</button>
      </div>

      {showForm && (
        <Card>
          <SectionTitle>Yeni İçerik Ekle</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Başlık *</div>
              <input style={inputStyle} placeholder="İçerik başlığı..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Platform *</div>
              <select style={inputStyle} value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Hesap *</div>
              <select style={inputStyle} value={form.account_id} onChange={e => setForm({...form, account_id: e.target.value})}>
                <option value="">Hesap seç...</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Tarih</div>
              <input style={inputStyle} type="date" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Saat</div>
              <input style={inputStyle} type="time" value={form.scheduled_time} onChange={e => setForm({...form, scheduled_time: e.target.value})} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Durum</div>
              <select style={inputStyle} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="draft">Taslak</option>
                <option value="scheduled">Planlandı</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={addPost} style={{ background: S.accent, color: "#000", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "Bricolage Grotesque, sans-serif" }}>Kaydet</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: S.textMuted, fontSize: 13, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "Bricolage Grotesque, sans-serif" }}>İptal</button>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: S.textMuted }}>Yükleniyor...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: S.textMuted }}>Henüz içerik eklenmedi. "+ Yeni İçerik" ile başlayın.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${S.border}` }}>
                {["Platform", "İçerik Başlığı", "Hesap", "Tarih", "Saat", "Durum", ""].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: S.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? "transparent" : `${S.surface2}80` }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{platformIcon(p.platform)}</span>
                      <span style={{ fontSize: 12, color: platformColor(p.platform), fontWeight: 500 }}>{platformLabel(p.platform)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500 }}>{p.title}</td>
                  <td style={{ padding: "14px 20px" }}><Badge color={S.blue}>{p.accounts?.name || "—"}</Badge></td>
                  <td style={{ padding: "14px 20px", fontSize: 12, fontFamily: "Fira Code, monospace", color: S.textMuted }}>{p.scheduled_date || "—"}</td>
                  <td style={{ padding: "14px 20px", fontSize: 12, fontFamily: "Fira Code, monospace", color: S.accent }}>{p.scheduled_time ? p.scheduled_time.slice(0,5) : "—"}</td>
                  <td style={{ padding: "14px 20px" }}><Badge color={statusColor(p.status)}>{statusLabel(p.status)}</Badge></td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => deletePost(p.id)} style={{ background: "transparent", border: "none", color: S.textMuted, cursor: "pointer", fontSize: 16 }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
          const followers = { instagram: 0, linkedin: 0, twitter: 0, youtube: 0, tiktok: 0, facebook: 0 };
          const growth    = { instagram: "—", linkedin: "—", twitter: "—", youtube: "—", tiktok: "—", facebook: "—" };
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
          { label: "Aylık Gelir",          value: "0 ₺",   delta: null, color: S.green },
          { label: "Aktif Abone",          value: "0",     delta: null, color: S.blue },
          { label: "Ort. Müşteri Değeri",  value: "0 ₺",   delta: null, color: S.accent },
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
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "viewer" });

  useEffect(() => { fetchTeam(); }, []);

  async function fetchTeam() {
    setLoading(true);
    const { data } = await supabase.from("team_members").select("*").order("created_at");
    setTeam(data || []);
    setLoading(false);
  }

  async function addMember() {
    if (!form.name || !form.email) return;
    await supabase.from("team_members").insert([{ ...form, status: "active" }]);
    setForm({ name: "", email: "", role: "viewer" });
    setShowForm(false);
    fetchTeam();
  }

  const roleColor = r => r === "admin" ? S.accent : r === "editor" ? S.blue : S.textMuted;
  const inputStyle = { background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 13, fontFamily: "Bricolage Grotesque, sans-serif", width: "100%", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Kullanıcı Yönetimi</div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: S.accent, color: "#000", fontWeight: 700, fontSize: 13,
          border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer",
          fontFamily: "Bricolage Grotesque, sans-serif",
        }}>+ Kullanıcı Ekle</button>
      </div>

      {showForm && (
        <Card>
          <SectionTitle>Yeni Kullanıcı</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Ad Soyad *</div>
              <input style={inputStyle} placeholder="Ad Soyad" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>E-posta *</div>
              <input style={inputStyle} placeholder="email@firma.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Rol</div>
              <select style={inputStyle} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={addMember} style={{ background: S.accent, color: "#000", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "Bricolage Grotesque, sans-serif" }}>Kaydet</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: S.textMuted, fontSize: 13, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "Bricolage Grotesque, sans-serif" }}>İptal</button>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ color: S.textMuted, textAlign: "center", padding: 40 }}>Yükleniyor...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {team.map(u => (
            <Card key={u.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: `${S.accent}22`,
                border: `1px solid ${S.accent}44`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, fontWeight: 700, color: S.accent, flexShrink: 0,
              }}>{u.name[0].toUpperCase()}</div>
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
      )}
    </div>
  );
}

function PageSEO() {
  const keywords = [
    { word: "bilginomist",          pos: 1,  vol: 1800, trend: "up" },
    { word: "cydeo it kursu",       pos: 2,  vol: 3200, trend: "up" },
    { word: "planck vpn",           pos: 3,  vol: 2100, trend: "up" },
    { word: "kuzzat altay",         pos: 1,  vol: 4400, trend: "stable" },
    { word: "nurpn güvenli vpn",    pos: 5,  vol: 1500, trend: "up" },
    { word: "online it eğitimi",    pos: 11, vol: 6600, trend: "down" },
  ];
  const trendColor = t => t === "up" ? S.green : t === "down" ? S.red : S.textMuted;
  const trendIcon  = t => t === "up" ? "↑" : t === "down" ? "↓" : "→";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>SEO Metrikleri</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Ort. Sıralama",    value: "—",  delta: null, color: S.textMuted },
          { label: "Organik Trafik",   value: "0",  delta: null, color: S.textMuted },
          { label: "Takip Edilen KW",  value: "0",  delta: null, color: S.blue },
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
