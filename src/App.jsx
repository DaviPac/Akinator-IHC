import { useState, useEffect, useRef } from "react";

// ── Paleta ─────────────────────────────────────────────────────────────────────
const C = {
  bg: "#FFF5F0", primary: "#E8634A", primaryLight: "#FFAB94",
  primaryDark: "#C04B34", sim: "#4CAF82", nao: "#E05C5C",
  card: "#F7C5B5", tab: "#F0D0C5", text: "#3D1F15", textLight: "#7A4030",
  purple: "#9B59B6", purpleLight: "#D7BDE2", blue: "#2980B9",
  blueLight: "#AED6F1", yellow: "#F0C040", yellowLight: "#FAE5A0",
  pink: "#E05C8A",
};

// ── "Banco de dados" em memória ────────────────────────────────────────────────
const DB = { users: [] };

// SIM / NÃO sempre presentes no topo de cada categoria
const SIM_NAO = [
  { id: "sim", label: "SIM", emoji: "👍", color: C.sim },
  { id: "nao", label: "NÃO", emoji: "👎", color: C.nao },
];

// ── Dados das categorias (SIM/NÃO injetados dinamicamente) ────────────────────
const CATEGORIES = {
  basico: {
    label: "BÁSICO", icon: "🏠", color: C.primary,
    groups: [
      {
        title: "Respostas",
        items: [
          { id: "ajuda",    label: "AJUDA",    emoji: "🆘", color: C.primary },
          { id: "pare",     label: "PARE",     emoji: "🛑", color: C.nao },
          { id: "falar",    label: "FALAR",    emoji: "🗣️", color: C.blue },
        ],
      },
      {
        title: "Necessidades",
        items: [
          { id: "fome",     label: "FOME",     emoji: "🍔", color: "#D4872E" },
          { id: "sede",     label: "SEDE",     emoji: "💧", color: C.blue },
          { id: "banheiro", label: "BANHEIRO", emoji: "🚽", color: C.primary },
          { id: "dor",      label: "DOR",      emoji: "🤕", color: C.nao },
          { id: "sono",     label: "SONO",     emoji: "💤", color: C.purple },
          { id: "frio",     label: "FRIO",     emoji: "🥶", color: C.blueLight },
          { id: "calor",    label: "CALOR",    emoji: "🥵", color: C.primary },
        ],
      },
      {
        title: "Lugares",
        items: [
          { id: "casa",     label: "CASA",     emoji: "🏡", color: C.yellow },
          { id: "escola",   label: "ESCOLA",   emoji: "🏫", color: C.blue },
          { id: "medico",   label: "MÉDICO",   emoji: "🏥", color: C.nao },
        ],
      },
    ],
  },

  sentimentos: {
    label: "SENTIMENTOS", icon: "❤️", color: C.pink,
    groups: [
      {
        title: "😊 Positivos",
        items: [
          { id: "feliz",     label: "FELIZ",     emoji: "😁", color: C.sim },
          { id: "empolgado", label: "EMPOLGADO", emoji: "🤩", color: "#F39C12" },
          { id: "calmo",     label: "CALMO",     emoji: "😌", color: "#27AE60" },
          { id: "surpreso",  label: "SURPRESO",  emoji: "😲", color: C.yellow },
          { id: "amando",    label: "AMANDO",    emoji: "🥰", color: C.pink },
        ],
      },
      {
        title: "😐 Neutros",
        items: [
          { id: "cansado",   label: "CANSADO",   emoji: "🥱", color: C.purple },
          { id: "entediado", label: "ENTEDIADO", emoji: "😐", color: "#7F8C8D" },
          { id: "confuso",   label: "CONFUSO",   emoji: "🧐", color: "#8E44AD" },
          { id: "com-sono",  label: "COM SONO",  emoji: "😴", color: "#5D6D7E" },
        ],
      },
      {
        title: "😔 Difíceis",
        items: [
          { id: "triste",     label: "TRISTE",     emoji: "😢", color: C.blue },
          { id: "medo",       label: "MEDO",       emoji: "😱", color: C.nao },
          { id: "ansioso",    label: "ANSIOSO",    emoji: "😥", color: "#E67E22" },
          { id: "preocupado", label: "PREOCUPADO", emoji: "😨", color: "#E74C3C" },
          { id: "chateado",   label: "CHATEADO",   emoji: "😠", color: "#C0392B" },
          { id: "com-dor",    label: "COM DOR",    emoji: "😣", color: C.nao },
        ],
      },
    ],
  },

  comida: {
    label: "COMIDA", icon: "🍽️", color: "#D4872E",
    groups: [
      {
        title: "🥩 Refeições",
        items: [
          { id: "carne",    label: "CARNE",    emoji: "🥩", color: "#C0392B" },
          { id: "frango",   label: "FRANGO",   emoji: "🍗", color: "#E67E22" },
          { id: "arroz",    label: "ARROZ",    emoji: "🍚", color: "#AEB6BF" },
          { id: "feijao",   label: "FEIJÃO",   emoji: "🫘", color: "#784212" },
          { id: "ovo",      label: "OVO",      emoji: "🥚", color: "#F9E79F" },
          { id: "macarrao", label: "MACARRÃO", emoji: "🍝", color: "#E59866" },
          { id: "salada",   label: "SALADA",   emoji: "🥗", color: C.sim },
          { id: "sopa",     label: "SOPA",     emoji: "🍲", color: "#E67E22" },
        ],
      },
      {
        title: "🍕 Lanches",
        items: [
          { id: "hamburguer", label: "HAMBURGUER", emoji: "🍔", color: "#D4AC0D" },
          { id: "pizza",      label: "PIZZA",      emoji: "🍕", color: C.primary },
          { id: "batata",     label: "BATATA",     emoji: "🍟", color: C.yellow },
          { id: "pipoca",     label: "PIPOCA",     emoji: "🍿", color: "#F4D03F" },
          { id: "sanduiche",  label: "SANDUÍCHE",  emoji: "🥪", color: "#A04000" },
        ],
      },
      {
        title: "🍎 Frutas & Doces",
        items: [
          { id: "fruta",   label: "FRUTA",   emoji: "🍎", color: "#E74C3C" },
          { id: "bolo",    label: "BOLO",    emoji: "🎂", color: C.pink },
          { id: "sorvete", label: "SORVETE", emoji: "🍦", color: "#AED6F1" },
          { id: "chocolate",label:"CHOCOLATE",emoji: "🍫", color: "#784212" },
        ],
      },
      {
        title: "🥤 Bebidas",
        items: [
          { id: "agua",  label: "ÁGUA",  emoji: "💧", color: C.blue },
          { id: "suco",  label: "SUCO",  emoji: "🥤", color: "#27AE60" },
          { id: "leite", label: "LEITE", emoji: "🥛", color: "#D5D8DC" },
          { id: "cafe",  label: "CAFÉ",  emoji: "☕", color: "#784212" },
        ],
      },
    ],
  },

  atividades: {
    label: "ATIVIDADES", icon: "⚽", color: "#27AE60",
    groups: [
      {
        title: "🎮 Entretenimento",
        items: [
          { id: "tv",     label: "TV",     emoji: "📺", color: C.blue },
          { id: "musica", label: "MÚSICA", emoji: "🎵", color: C.purple },
          { id: "jogar",  label: "JOGAR",  emoji: "🎮", color: C.blue },
          { id: "livro",  label: "LIVRO",  emoji: "📚", color: "#8B4513" },
          { id: "desenho",label: "DESENHO",emoji: "🎨", color: C.yellow },
        ],
      },
      {
        title: "🏠 Rotina",
        items: [
          { id: "brincar", label: "BRINCAR", emoji: "🧩", color: "#E74C3C" },
          { id: "dormir",  label: "DORMIR",  emoji: "🛏️", color: C.purple },
          { id: "banho",   label: "BANHO",   emoji: "🛁", color: C.blue },
          { id: "passear", label: "PASSEAR", emoji: "🚶", color: C.sim },
          { id: "exercicio",label:"EXERCÍCIO",emoji:"🏃", color: "#E67E22" },
        ],
      },
    ],
  },

  pessoas: {
    label: "PESSOAS", icon: "👥", color: "#16A085",
    groups: [
      {
        title: "👤 Eu & Você",
        items: [
          { id: "eu",      label: "EU",      emoji: "🙋", color: "#16A085" },
          { id: "voce",    label: "VOCÊ",    emoji: "👉", color: "#1ABC9C" },
          { id: "nos",     label: "NÓS",     emoji: "🤝", color: "#148F77" },
          { id: "ele-ela", label: "ELE/ELA", emoji: "🧑", color: "#117A65" },
        ],
      },
      {
        title: "👨‍👩‍👧 Família",
        items: [
          { id: "mae",   label: "MÃE",    emoji: "👩", color: "#E05C8A" },
          { id: "pai",   label: "PAI",    emoji: "👨", color: "#2980B9" },
          { id: "vovo",  label: "VOVÓ",   emoji: "👵", color: "#8E44AD" },
          { id: "vovo2", label: "VOVÔ",   emoji: "👴", color: "#6C3483" },
          { id: "irmao", label: "IRMÃO",  emoji: "👦", color: "#E67E22" },
          { id: "irma",  label: "IRMÃ",   emoji: "👧", color: "#E74C3C" },
          { id: "tio",   label: "TIO",    emoji: "🧔", color: "#1F618D" },
          { id: "tia",   label: "TIA",    emoji: "👩‍🦱", color: "#C0392B" },
        ],
      },
      {
        title: "🏫 Escola & Saúde",
        items: [
          { id: "professor",  label: "PROFESSOR",  emoji: "👨‍🏫", color: "#1A5276" },
          { id: "professora", label: "PROFESSORA", emoji: "👩‍🏫", color: "#154360" },
          { id: "amigo",      label: "AMIGO",      emoji: "😄",  color: "#27AE60" },
          { id: "medico",     label: "MÉDICO",     emoji: "👨‍⚕️", color: "#C0392B" },
          { id: "cuidador",   label: "CUIDADOR",   emoji: "🧑‍🤝‍🧑", color: "#16A085" },
        ],
      },
    ],
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  window.speechSynthesis.speak(u);
}

function darken(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - 30);
  const g = Math.max(0, ((n >> 8) & 0xff) - 30);
  const b = Math.max(0, (n & 0xff) - 30);
  return `rgb(${r},${g},${b})`;
}

// ── Campo de formulário ────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.textLight, marginBottom: 5 }}>{label}</div>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "13px 16px", boxSizing: "border-box",
          border: `2px solid ${error ? C.nao : focused ? C.primary : C.primaryLight}`,
          borderRadius: 14, fontSize: 15, fontFamily: "'Nunito', sans-serif",
          fontWeight: 600, color: C.text, background: "#fff", outline: "none",
          transition: "border-color 0.2s",
        }}
      />
      {error && <div style={{ color: C.nao, fontSize: 12, marginTop: 4, fontWeight: 600 }}>{error}</div>}
    </div>
  );
}

// ── Card de comunicação ────────────────────────────────────────────────────────
function CommCard({ item, onPress, big = false, isFav = false, onToggleFav = null }) {
  const [pressed, setPressed] = useState(false);
  const w = big ? 140 : 110;
  const h = big ? 120 : 100;
  const emojiSz = big ? 42 : 32;
  const fontSz = big ? 13 : 11;
  const bg = item.color || C.card;

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 150); onPress(item); }}
        style={{
          width: w, height: h,
          background: pressed ? darken(bg) : bg,
          border: "none", borderRadius: 18, cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 5,
          boxShadow: pressed ? "0 2px 4px rgba(0,0,0,0.15)" : "0 4px 14px rgba(0,0,0,0.18)",
          transform: pressed ? "scale(0.94)" : "scale(1)",
          transition: "all 0.12s ease",
          padding: 8,
        }}
      >
        <span style={{ fontSize: emojiSz, lineHeight: 1 }}>{item.emoji}</span>
        <span style={{
          fontSize: fontSz, fontWeight: 800, color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,0.45)",
          textAlign: "center", lineHeight: 1.2,
          fontFamily: "'Nunito', sans-serif", letterSpacing: 0.3,
        }}>{item.label}</span>
      </button>
      {onToggleFav && (
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(item); }}
          style={{
            position: "absolute", top: 4, right: 4,
            background: isFav ? "rgba(255,200,0,0.85)" : "rgba(0,0,0,0.28)",
            border: "none", borderRadius: "50%",
            width: 22, height: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, padding: 0, lineHeight: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            transition: "background 0.15s",
          }}
          title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          {isFav ? "⭐" : "☆"}
        </button>
      )}
    </div>
  );
}

// ── Barra SIM / NÃO fixa no topo ──────────────────────────────────────────────
function SimNaoBar({ onPress }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "10px 14px",
      background: "rgba(255,255,255,0.92)",
      borderTop: `2px solid ${C.primaryLight}`,
      position: "sticky", bottom: 0, zIndex: 10,
      backdropFilter: "blur(6px)",
    }}>
      {SIM_NAO.map(item => (
        <CommCard key={item.id} item={item} onPress={onPress} big />
      ))}
    </div>
  );
}

// ── Seção com título e grupo de cards ─────────────────────────────────────────
function CardGroup({ group, onPress, favoriteIds = [], onToggleFav = null, catColor = C.primaryLight }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 4, height: 18, borderRadius: 3,
          background: catColor, flexShrink: 0,
        }} />
        <span style={{
          fontSize: 13, fontWeight: 800, color: C.text,
          textTransform: "uppercase", letterSpacing: 0.8,
          fontFamily: "'Nunito', sans-serif",
        }}>{group.title}</span>
        <div style={{ flex: 1, height: 1.5, background: `${catColor}30`, borderRadius: 1 }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {group.items.map(item => (
          <CommCard key={item.id} item={item} onPress={onPress}
            isFav={favoriteIds.includes(item.id)}
            onToggleFav={onToggleFav} />
        ))}
      </div>
    </div>
  );
}

function TabBtn({ label, icon, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 14px 7px 10px", borderRadius: 22, border: "none",
      background: active ? `linear-gradient(135deg, ${color}, ${color}cc)` : "#fff",
      color: active ? "#fff" : C.textLight,
      fontWeight: 800, fontSize: 12, cursor: "pointer",
      whiteSpace: "nowrap",
      boxShadow: active
        ? `0 4px 14px ${color}55, 0 1px 3px rgba(0,0,0,0.12)`
        : "0 2px 6px rgba(0,0,0,0.10)",
      transform: active ? "translateY(-1px) scale(1.04)" : "scale(1)",
      transition: "all 0.18s ease",
      fontFamily: "'Nunito', sans-serif",
      display: "flex", alignItems: "center", gap: 6,
      flexShrink: 0,
      outline: active ? "none" : `2px solid ${color}30`,
      outlineOffset: -2,
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
        background: active ? "rgba(255,255,255,0.28)" : `${color}22`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 13,
      }}>{icon}</span>
      {label}
    </button>
  );
}

function IconBtn({ icon, label, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      background: color, border: "none", borderRadius: 12,
      padding: "6px 10px", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "'Nunito', sans-serif" }}>{label}</span>
    </button>
  );
}

// ── Tela Principal ─────────────────────────────────────────────────────────────
function MainScreen({ user, initialTab, onAkinator, onHelp, onCreateCard, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState(initialTab || "basico");
  const [feedback, setFeedback] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  function handleCard(item) {
    speak(item.label);
    setFeedback(item);
  }

  const savedCards = user.savedCards || [];
  const favoriteCards = user.favoriteCards || [];
  const categoryCards = user.categoryCards || {};
  const customCategories = user.customCategories || {};
  const favoriteIds = favoriteCards.map(c => c.id);

  function handleToggleFav(item) {
    const alreadyFav = favoriteCards.find(c => c.id === item.id);
    const newFavs = alreadyFav
      ? favoriteCards.filter(c => c.id !== item.id)
      : [...favoriteCards, item];
    user.favoriteCards = newFavs;
    onUpdateUser({ ...user });
  }

  const activeCat = CATEGORIES[activeTab];

  const tabsRef = useRef(null);
  const [tabsFade, setTabsFade] = useState({ left: false, right: true });

  function handleTabsScroll() {
    const el = tabsRef.current;
    if (!el) return;
    setTabsFade({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
  }

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const check = () => setTabsFade({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
    check();
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: C.primary, padding: "10px 14px 8px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)", flexShrink: 0,
      }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>🗣️ Comunicação</div>
          <div style={{ color: C.primaryLight, fontSize: 12, fontWeight: 600 }}>Olá, {user.name.split(" ")[0]}! 👋</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <IconBtn icon="❓" label="Ajuda" onClick={onHelp} color={C.yellow} />
          <IconBtn icon="✨" label="Akinator" onClick={onAkinator} color={C.purple} />
          <IconBtn icon="➕" label="Criar" onClick={onCreateCard} color={C.sim} />
          <button onClick={() => setShowProfile(true)} style={{
            background: "rgba(255,255,255,0.25)", border: "none",
            borderRadius: 12, width: 44, height: 44, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 1,
          }}>
            <span style={{ fontSize: 18 }}>👤</span>
            <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>Perfil</span>
          </button>
        </div>
      </div>

      {/* Feedback bar */}
      <div style={{
        background: feedback ? (feedback.color || C.card) : C.tab,
        padding: "9px 16px", display: "flex", alignItems: "center",
        gap: 10, minHeight: 50, transition: "background 0.3s", flexShrink: 0,
      }}>
        {feedback ? (
          <>
            <span style={{ fontSize: 26 }}>{feedback.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{feedback.label}</div>
            </div>
            <button onClick={() => speak(feedback.label)} style={{
              background: "rgba(255,255,255,0.3)", border: "none",
              borderRadius: 10, padding: "5px 10px", cursor: "pointer",
              color: "#fff", fontWeight: 700, fontSize: 12,
            }}>🔊 Ouvir</button>
          </>
        ) : (
          <div style={{ color: C.textLight, fontWeight: 600, fontSize: 13 }}>👆 Toque em um card para comunicar</div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ position: "relative", flexShrink: 0, background: C.tab, borderBottom: `3px solid ${C.primaryLight}` }}>
        <div ref={tabsRef} className="scroll-x-styled" style={{
          display: "flex", overflowX: "auto", padding: "8px 10px", gap: 7,
          alignItems: "center", scrollSnapType: "x proximity",
        }}>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <TabBtn key={key} label={cat.label} icon={cat.icon}
              active={activeTab === key} color={cat.color} onClick={() => setActiveTab(key)} />
          ))}
          {Object.values(customCategories).map(cat => (
            <TabBtn key={cat.key} label={cat.label} icon={cat.icon}
              active={activeTab === cat.key} color={cat.color}
              onClick={() => setActiveTab(cat.key)} />
          ))}
          {savedCards.length > 0 && (
            <TabBtn label="SALVOS" icon="📌" active={activeTab === "salvos"}
              color={C.yellow} onClick={() => setActiveTab("salvos")} />
          )}
          {favoriteCards.length > 0 && (
            <TabBtn label="FAVORITOS" icon="⭐" active={activeTab === "favoritos"}
              color="#E6A817" onClick={() => setActiveTab("favoritos")} />
          )}
          {/* Espaço extra no fim para o fade não cortar o último item */}
          <div style={{ width: 10, flexShrink: 0 }} />
        </div>
        {/* Fade esquerdo */}
        <div style={{
          pointerEvents: "none", position: "absolute", left: 0, top: 0, bottom: 0, width: 36,
          background: `linear-gradient(to right, ${C.tab}, transparent)`,
          opacity: tabsFade.left ? 1 : 0, transition: "opacity 0.2s",
        }} />
        {/* Fade direito + seta indicadora */}
        <div style={{
          pointerEvents: "none", position: "absolute", right: 0, top: 0, bottom: 0, width: 48,
          background: `linear-gradient(to left, ${C.tab} 40%, transparent)`,
          opacity: tabsFade.right ? 1 : 0, transition: "opacity 0.2s",
          display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
        }}>
          <span style={{ fontSize: 14, color: C.textLight, fontWeight: 800 }}>›</span>
        </div>
      </div>

      {/* Conteúdo com scroll */}
      <div className="scroll-styled" style={{ flex: 1, overflowY: "auto", background: C.bg }}>
        {/* Banner da aba ativa */}
        {activeTab === "salvos" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: `linear-gradient(90deg, ${C.yellow}18, transparent)`,
            borderBottom: `2px solid ${C.yellow}28`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: `${C.yellow}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>📌</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#B8860B", letterSpacing: 0.3 }}>SALVOS</div>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>{savedCards.length} card{savedCards.length !== 1 ? "s" : ""} salvos</div>
            </div>
          </div>
        )}
        {activeTab === "favoritos" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: "linear-gradient(90deg, #E6A81718, transparent)",
            borderBottom: "2px solid #E6A81728",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "#E6A81728",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>⭐</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#B8860B", letterSpacing: 0.3 }}>FAVORITOS</div>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>{favoriteCards.length} card{favoriteCards.length !== 1 ? "s" : ""} favoritos</div>
            </div>
          </div>
        )}
        {customCategories[activeTab] && (() => { const cc = customCategories[activeTab]; return (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: `linear-gradient(90deg, ${cc.color}18, transparent)`,
            borderBottom: `2px solid ${cc.color}28`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: `${cc.color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>{cc.icon}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: cc.color, letterSpacing: 0.3 }}>{cc.label}</div>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>{(categoryCards[activeTab] || []).length} card{(categoryCards[activeTab] || []).length !== 1 ? "s" : ""}</div>
            </div>
          </div>
        ); })()}
        {activeCat && activeTab !== "salvos" && activeTab !== "favoritos" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px 10px",
            background: `linear-gradient(90deg, ${activeCat.color}18, transparent)`,
            borderBottom: `2px solid ${activeCat.color}28`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: `${activeCat.color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>{activeCat.icon}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: activeCat.color, letterSpacing: 0.3 }}>
                {activeCat.label}
              </div>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>
                {activeCat.groups.reduce((acc, g) => acc + g.items.length, 0)} cards disponíveis
              </div>
            </div>
          </div>
        )}
        <div style={{ padding: "12px 14px 8px" }}>
          {activeTab === "salvos" ? (
            savedCards.length === 0
              ? <div style={{ color: C.textLight, textAlign: "center", marginTop: 40, fontSize: 15 }}>Nenhum card salvo ainda.</div>
              : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {savedCards.map(item => (
                    <CommCard key={item.id} item={item} onPress={handleCard}
                      isFav={favoriteIds.includes(item.id)}
                      onToggleFav={handleToggleFav} />
                  ))}
                </div>
              )
          ) : activeTab === "favoritos" ? (
            favoriteCards.length === 0
              ? <div style={{ color: C.textLight, textAlign: "center", marginTop: 40, fontSize: 15 }}>Nenhum card favoritado ainda.</div>
              : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {favoriteCards.map(item => (
                    <CommCard key={item.id} item={item} onPress={handleCard}
                      isFav={true}
                      onToggleFav={handleToggleFav} />
                  ))}
                </div>
              )
          ) : activeCat ? (
            <>
              {activeCat.groups.map((group, i) => (
                <CardGroup key={i} group={group} onPress={handleCard}
                  favoriteIds={favoriteIds}
                  onToggleFav={handleToggleFav}
                  catColor={activeCat.color} />
              ))}
              {(categoryCards[activeTab] || []).length > 0 && (
                <CardGroup
                  group={{ title: "✏️ Meus Cards", items: categoryCards[activeTab] }}
                  onPress={handleCard}
                  favoriteIds={favoriteIds}
                  onToggleFav={handleToggleFav}
                  catColor={activeCat.color} />
              )}
            </>
          ) : customCategories[activeTab] ? (
            (categoryCards[activeTab] || []).length === 0
              ? <div style={{ color: C.textLight, textAlign: "center", marginTop: 40, fontSize: 15 }}>Nenhum card nesta categoria ainda.</div>
              : (
                <CardGroup
                  group={{ title: "✏️ Meus Cards", items: categoryCards[activeTab] }}
                  onPress={handleCard}
                  favoriteIds={favoriteIds}
                  onToggleFav={handleToggleFav}
                  catColor={customCategories[activeTab].color} />
              )
          ) : null}
        </div>
        {/* SIM / NÃO fixos no rodapé de TODAS as categorias */}
        <SimNaoBar onPress={handleCard} />
      </div>

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)}
          onLogout={onLogout} onUpdate={onUpdateUser} />
      )}
    </div>
  );
}

// ── Modal de Perfil ────────────────────────────────────────────────────────────
function ProfileModal({ user, onClose, onLogout, onUpdate }) {
  const [tab, setTab] = useState("info");
  const [name, setName] = useState(user.name);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const e = {};
    if (!name.trim()) e.name = "Nome obrigatório";
    if (newPass && newPass.length < 6) e.newPass = "Mínimo 6 caracteres";
    if (newPass && newPass !== confirmPass) e.confirmPass = "Senhas não coincidem";
    if (Object.keys(e).length) { setErrors(e); return; }
    user.name = name.trim();
    if (newPass) user.password = newPass;
    onUpdate({ ...user });
    setSaved(true); setNewPass(""); setConfirmPass("");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(61,31,21,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "24px 24px 0 0",
        width: "100%", maxHeight: "85%", overflowY: "auto",
        padding: 24, boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
      }}>
        <div style={{ width: 40, height: 4, background: "#ddd", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px", fontSize: 36,
            boxShadow: `0 4px 15px ${C.primary}55`,
          }}>👤</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.text }}>{user.name}</div>
          <div style={{ fontSize: 13, color: C.textLight }}>{user.email}</div>
          <div style={{ marginTop: 6, fontSize: 12, color: C.textLight }}>📌 {(user.savedCards || []).length} salvos &nbsp;·&nbsp; ⭐ {(user.favoriteCards || []).length} favoritos</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["info","edit"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px", borderRadius: 12, border: "none",
              background: tab === t ? C.primary : C.tab,
              color: tab === t ? "#fff" : C.textLight,
              fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            }}>{t === "info" ? "ℹ️ Informações" : "✏️ Editar"}</button>
          ))}
        </div>
        {tab === "info" && (
          <div>
            {[["👤","Nome",user.name],["📧","E-mail",user.email],["📌","Cards salvos",`${(user.savedCards||[]).length}`],["⭐","Favoritos",`${(user.favoriteCards||[]).length}`]].map(([icon,lbl,val]) => (
              <div key={lbl} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:C.bg, borderRadius:12, marginBottom:8, border:`1.5px solid ${C.primaryLight}` }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.textLight, textTransform:"uppercase" }}>{lbl}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{val}</div>
                </div>
              </div>
            ))}
            <button onClick={() => { onLogout(); onClose(); }} style={{ width:"100%", padding:"14px", marginTop:16, background:C.nao, border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"'Nunito', sans-serif", boxShadow:`0 4px 15px ${C.nao}44` }}>🚪 Sair da conta</button>
          </div>
        )}
        {tab === "edit" && (
          <div>
            {saved && <div style={{ background:"#d4edda", border:`2px solid ${C.sim}`, borderRadius:12, padding:"10px 14px", marginBottom:14, color:"#155724", fontWeight:700, fontSize:14, textAlign:"center" }}>✅ Alterações salvas!</div>}
            <Field label="Nome" value={name} onChange={e => { setName(e.target.value); setErrors({}); }} placeholder="Seu nome" error={errors.name} />
            <Field label="Nova senha (opcional)" type="password" value={newPass} onChange={e => { setNewPass(e.target.value); setErrors({}); }} placeholder="Deixe em branco para não alterar" error={errors.newPass} />
            {newPass && <Field label="Confirmar nova senha" type="password" value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setErrors({}); }} placeholder="Repita a nova senha" error={errors.confirmPass} />}
            <button onClick={handleSave} style={{ width:"100%", padding:"14px", marginTop:4, background:`linear-gradient(135deg, ${C.sim}, #2e7d4f)`, border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>💾 Salvar alterações</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Akinator ───────────────────────────────────────────────────────────────────
const AKINATOR_TREE = {
  pergunta: "Você quer alguma coisa?", num: 1,
  sim: {
    pergunta: "É algo para comer ou beber? 🍽️", num: 2,
    sim: {
      pergunta: "É algo doce? 🍭", num: 3,
      sim: {
        pergunta: "Dá para levar no bolso? 🤏", num: 4,
        sim: {
          pergunta: "Você mastiga e depois joga fora?", num: 5,
          sim: { resposta: "Você quer um chiclete! 🍬", cardLabel: "CHICLETE", cardEmoji: "🍬", cardCategory: "comida" },
          nao: { resposta: "Você quer uma bala! 🍡", cardLabel: "BALA", cardEmoji: "🍡", cardCategory: "comida" },
        },
        nao: {
          pergunta: "É gelado? 🧊", num: 5,
          sim: { resposta: "Você quer sorvete! 🍦", cardLabel: "SORVETE", cardEmoji: "🍦", cardCategory: "comida" },
          nao: { resposta: "Você quer um bolo! 🎂", cardLabel: "BOLO", cardEmoji: "🎂", cardCategory: "comida" },
        },
      },
      nao: {
        pergunta: "É algo para beber? 💧", num: 4,
        sim: {
          pergunta: "É gelado? 🧊", num: 5,
          sim: { resposta: "Você quer água gelada ou suco! 🥤", cardLabel: "SUCO", cardEmoji: "🥤", cardCategory: "comida" },
          nao: { resposta: "Você quer uma bebida quente! ☕", cardLabel: "BEBIDA QUENTE", cardEmoji: "☕", cardCategory: "comida" },
        },
        nao: {
          pergunta: "É uma refeição completa? 🍽️", num: 5,
          sim: { resposta: "Você quer almoço ou jantar! 🍽️", cardLabel: "ALMOÇO", cardEmoji: "🍽️", cardCategory: "comida" },
          nao: { resposta: "Você quer um lanche! 🥪", cardLabel: "LANCHE", cardEmoji: "🥪", cardCategory: "comida" },
        },
      },
    },
    nao: {
      pergunta: "Você quer fazer alguma atividade? 🎯", num: 3,
      sim: {
        pergunta: "É dentro de casa? 🏠", num: 4,
        sim: {
          pergunta: "Envolve uma tela? 📺", num: 5,
          sim: { resposta: "Você quer assistir TV ou jogar! 📺🎮", cardLabel: "TV/JOGAR", cardEmoji: "📺", cardCategory: "atividades" },
          nao: { resposta: "Você quer brincar ou desenhar! 🧩🎨", cardLabel: "BRINCAR", cardEmoji: "🧩", cardCategory: "atividades" },
        },
        nao: { resposta: "Você quer passear ou brincar fora! 🌳", cardLabel: "PASSEAR", cardEmoji: "🌳", cardCategory: "atividades" },
      },
      nao: {
        pergunta: "É sobre como você está se sentindo? ❤️", num: 4,
        sim: { resposta: "Vá para Sentimentos para me contar! ❤️", cardLabel: "SENTIMENTO", cardEmoji: "❤️", cardCategory: "sentimentos" },
        nao: { resposta: "Use os cards para me ajudar 😊", cardLabel: "AJUDA", cardEmoji: "😊", cardCategory: null },
      },
    },
  },
  nao: { resposta: "Tudo bem! Estou aqui se precisar. 😊", cardLabel: "TUDO BEM", cardEmoji: "😊", cardCategory: null },
};

// ── Seletor de categoria ───────────────────────────────────────────────────────
const CUSTOM_CAT_COLORS = ["#8E44AD", "#16A085", "#2980B9", "#E67E22", "#C0392B", "#1ABC9C"];

function CategoryPicker({ value, onChange, customCategories = {}, onAddCategory }) {
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");

  const builtinOptions = [
    { key: null, icon: "📌", label: "Salvos", color: C.yellow },
    ...Object.entries(CATEGORIES).map(([key, cat]) => ({ key, icon: cat.icon, label: cat.label, color: cat.color })),
  ];
  const customOptions = Object.values(customCategories);
  const allOptions = [...builtinOptions, ...customOptions];

  function handleAdd() {
    const name = newName.trim().toUpperCase();
    if (!name) return;
    const key = "cat_" + Date.now();
    const color = CUSTOM_CAT_COLORS[Object.keys(customCategories).length % CUSTOM_CAT_COLORS.length];
    const cat = { key, label: name, icon: "🏷️", color };
    onAddCategory(cat);
    onChange(key);
    setNewName("");
    setShowInput(false);
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: showInput ? 8 : 0 }}>
        {allOptions.map(opt => {
          const active = value === opt.key;
          return (
            <button key={opt.key ?? "none"} onClick={() => onChange(opt.key)} style={{
              padding: "6px 11px", borderRadius: 16, border: "none", cursor: "pointer",
              background: active ? opt.color : "#f0ece8",
              color: active ? "#fff" : C.textLight,
              fontWeight: 700, fontSize: 12,
              boxShadow: active ? `0 3px 8px ${opt.color}55` : "none",
              transition: "all 0.15s", fontFamily: "'Nunito', sans-serif",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
        {!showInput && (
          <button onClick={() => setShowInput(true)} style={{
            padding: "6px 11px", borderRadius: 16, border: `2px dashed ${C.primaryLight}`,
            background: "transparent", color: C.textLight, fontWeight: 700, fontSize: 12,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span>➕</span><span>Nova</span>
          </button>
        )}
      </div>
      {showInput && (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value.toUpperCase())}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setShowInput(false); setNewName(""); } }}
            placeholder="Nome da categoria..."
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 12,
              border: `2px solid ${C.primaryLight}`, fontSize: 13,
              fontFamily: "'Nunito', sans-serif", fontWeight: 700,
              color: C.text, outline: "none", background: "#fff",
            }}
          />
          <button onClick={handleAdd} style={{
            background: C.sim, border: "none", borderRadius: 10,
            width: 34, height: 34, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>✓</button>
          <button onClick={() => { setShowInput(false); setNewName(""); }} style={{
            background: "#e0dbd8", border: "none", borderRadius: 10,
            width: 34, height: 34, cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>✕</button>
        </div>
      )}
    </div>
  );
}

function AkinatorScreen({ onBack, onSaveCard, onGoTab, customCategories, onAddCategory }) {
  const [phase, setPhase] = useState("intro");
  const [node, setNode] = useState(AKINATOR_TREE);
  const [history, setHistory] = useState([]);
  const [saveCat, setSaveCat] = useState(null);

  function start() { setNode(AKINATOR_TREE); setHistory([]); setPhase("question"); setSaveCat(null); speak(AKINATOR_TREE.pergunta); }
  function answer(resp) {
    const next = node[resp];
    setHistory(h => [...h, node]);
    if (next.resposta) {
      setPhase("result");
      setNode(next);
      setSaveCat(next.cardCategory ?? null);
      speak(next.resposta);
    } else {
      setNode(next);
      speak(next.pergunta);
    }
  }
  function goBack() {
    if (history.length === 0) { setPhase("intro"); return; }
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setNode(prev);
    if (history.length === 1) setPhase("question");
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg, fontFamily:"'Nunito', sans-serif" }}>
      <div style={{ background:C.purple, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 3px 10px rgba(0,0,0,0.2)" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.25)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontWeight:700, cursor:"pointer" }}>← Voltar</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>✨ Modo Akinator</div>
      </div>
      {phase === "question" && (
        <div style={{ padding:"8px 16px", background:C.purpleLight }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.purple, marginBottom:3 }}>Pergunta {node.num}</div>
          <div style={{ height:7, background:"rgba(255,255,255,0.6)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", background:C.purple, width:`${((node.num||1)/6)*100}%`, borderRadius:4, transition:"width 0.4s" }} />
          </div>
        </div>
      )}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        {phase === "intro" && (
          <div style={{ background:"#fff", borderRadius:24, padding:32, textAlign:"center", maxWidth:340, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", border:`3px solid ${C.purpleLight}` }}>
            <div style={{ fontSize:80, marginBottom:12 }}>🧞</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.purple, marginBottom:8 }}>Bem-vindo(a)!</div>
            <div style={{ color:C.textLight, fontSize:14, marginBottom:24, lineHeight:1.6 }}>Vou descobrir o que você quer! Responda apenas com <b>SIM</b> ou <b>NÃO</b>.</div>
            <button onClick={start} style={{ background:C.purple, color:"#fff", border:"none", borderRadius:16, padding:"14px 32px", fontWeight:800, fontSize:18, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>Quero começar! 🚀</button>
          </div>
        )}
        {phase === "question" && (
          <div style={{ background:"#fff", borderRadius:24, padding:28, textAlign:"center", maxWidth:360, width:"100%", boxShadow:"0 8px 30px rgba(0,0,0,0.12)", border:`3px solid ${C.purpleLight}` }}>
            <div style={{ fontSize:56, marginBottom:10 }}>🧞‍♂️</div>
            <div style={{ fontSize:19, fontWeight:700, color:C.text, marginBottom:24, lineHeight:1.4 }}>{node.pergunta}</div>
            <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:14 }}>
              {[["SIM","👍",C.sim,"sim"],["NÃO","👎",C.nao,"nao"]].map(([l,e,col,key]) => (
                <button key={key} onClick={() => answer(key)} style={{ background:col, border:"none", borderRadius:16, width:110, height:80, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, cursor:"pointer", boxShadow:`0 4px 12px ${col}55`, fontFamily:"'Nunito', sans-serif" }}>
                  <span style={{ fontSize:30 }}>{e}</span>
                  <span style={{ color:"#fff", fontWeight:800, fontSize:17 }}>{l}</span>
                </button>
              ))}
            </div>
            {history.length > 0 && <button onClick={goBack} style={{ background:"transparent", border:`2px solid ${C.textLight}`, borderRadius:12, padding:"8px 20px", color:C.textLight, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'Nunito', sans-serif" }}>↩️ Voltar</button>}
          </div>
        )}
        {phase === "result" && (
          <div style={{ background:"#fff", borderRadius:24, padding:24, textAlign:"center", maxWidth:360, width:"100%", boxShadow:"0 8px 30px rgba(0,0,0,0.12)", border:`3px solid ${C.sim}` }}>
            <div style={{ fontSize:56, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.sim, marginBottom:8 }}>Descobri!</div>
            <div style={{ fontSize:16, color:C.text, lineHeight:1.5, marginBottom:18 }}>{node.resposta}</div>

            {/* Seletor de categoria */}
            <div style={{ textAlign:"left", marginBottom:18 }}>
              <div style={{ fontSize:12, fontWeight:800, color:C.textLight, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Salvar em qual categoria?</div>
              <CategoryPicker value={saveCat} onChange={setSaveCat} customCategories={customCategories} onAddCategory={onAddCategory} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={() => {
                const card = { id:Date.now(), label: node.cardLabel || "CARD", emoji: node.cardEmoji || "⭐", color:C.purple, category: saveCat };
                onSaveCard(card);
                onGoTab(saveCat || "salvos");
              }} style={{ background:C.yellow, color:C.text, border:"none", borderRadius:14, padding:"12px 20px", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Nunito', sans-serif", boxShadow:`0 4px 12px ${C.yellow}55` }}>📌 Salvar esse card</button>
              <button onClick={start} style={{ background:C.purple, color:"#fff", border:"none", borderRadius:14, padding:"12px 20px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>🔄 Tentar de novo</button>
              <button onClick={onBack} style={{ background:"transparent", color:C.textLight, border:`2px solid ${C.textLight}`, borderRadius:14, padding:"10px 20px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>← Voltar ao início</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tela Ajuda ─────────────────────────────────────────────────────────────────
function HelpScreen({ onBack }) {
  const tips = [
    { icon:"👆", title:"Toque nos cards", desc:"Toque em qualquer card colorido para comunicar. O sistema fala em voz alta." },
    { icon:"👍👎", title:"SIM e NÃO sempre visíveis", desc:"Os botões SIM e NÃO ficam fixos no topo de todas as categorias." },
    { icon:"❤️", title:"Sentimentos organizados", desc:"Emoções agrupadas em Positivas, Neutras e Difíceis para facilitar a escolha." },
    { icon:"🍽️", title:"Categoria COMIDA", desc:"Alimentos organizados em Refeições, Lanches, Frutas & Doces e Bebidas." },
    { icon:"✨", title:"Modo Akinator", desc:"O assistente descobre o que você quer com perguntas de SIM/NÃO." },
    { icon:"📌", title:"Salvar Cards", desc:"No Akinator ou ao criar, salve cards na aba 📌 Salvos." },
    { icon:"⭐", title:"Favoritar Cards", desc:"Toque na estrelinha em qualquer card para adicioná-lo à aba ⭐ Favoritos." },
    { icon:"➕", title:"Criar Card", desc:"Crie seu próprio card com emoji, nome e cor." },
    { icon:"👤", title:"Perfil", desc:"Edite seu nome, senha ou saia da conta." },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", fontFamily:"'Nunito', sans-serif" }}>
      <div style={{ background:C.yellow, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.4)", border:"none", borderRadius:10, padding:"6px 12px", color:C.text, fontWeight:700, cursor:"pointer" }}>← Voltar</button>
        <div style={{ fontWeight:800, fontSize:18, color:C.text }}>❓ Central de Ajuda</div>
      </div>
      <div className="scroll-styled" style={{ flex:1, overflowY:"auto", padding:16, background:C.bg, display:"flex", flexDirection:"column", gap:10 }}>
        {tips.map((t,i) => (
          <div key={i} style={{ background:"#fff", borderRadius:16, padding:14, display:"flex", gap:12, boxShadow:"0 3px 10px rgba(0,0,0,0.06)", border:`2px solid ${C.yellowLight}` }}>
            <span style={{ fontSize:30, flexShrink:0 }}>{t.icon}</span>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:C.text, marginBottom:2 }}>{t.title}</div>
              <div style={{ color:C.textLight, fontSize:13, lineHeight:1.5 }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tela Criar Card ────────────────────────────────────────────────────────────
function CreateCardScreen({ onBack, onSave, onGoTab, customCategories, onAddCategory }) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("😊");
  const [color, setColor] = useState(C.primary);
  const [category, setCategory] = useState(null);
  const emojis = ["😊","🎉","🌟","🏃","💊","🌈","🐶","🎁","🏖️","🎵","🌙","☀️","🍕","💪","🎈","🤝"];
  const colors = [C.primary, C.sim, C.nao, C.purple, C.blue, C.yellow, C.pink, "#27AE60"];

  function handleSave() {
    if (!label.trim()) return;
    onSave({ id: Date.now(), label, emoji, color, category });
    onGoTab(category || "salvos");
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", fontFamily:"'Nunito', sans-serif" }}>
      <div style={{ background:C.sim, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.3)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontWeight:700, cursor:"pointer" }}>← Voltar</button>
        <div style={{ fontWeight:800, fontSize:18, color:"#fff" }}>➕ Criar Novo Card</div>
      </div>
      <div className="scroll-styled" style={{ flex:1, overflowY:"auto", padding:16, background:C.bg }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.textLight, marginBottom:8 }}>PRÉVIA</div>
          <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:120, height:110, gap:6, background:color, borderRadius:18, boxShadow:"0 4px 15px rgba(0,0,0,0.2)" }}>
            <span style={{ fontSize:38 }}>{emoji}</span>
            <span style={{ color:"#fff", fontWeight:800, fontSize:13, textAlign:"center", textShadow:"0 1px 3px rgba(0,0,0,0.4)" }}>{label || "CARD"}</span>
          </div>
        </div>
        <Field label="Nome do card" value={label} onChange={e => setLabel(e.target.value.toUpperCase())} placeholder="Ex: ÁGUA, CALOR..." />
        <div style={{ marginBottom:14 }}>
          <div style={{ fontWeight:700, color:C.text, marginBottom:8, fontSize:13 }}>Emoji</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {emojis.map(e => <button key={e} onClick={() => setEmoji(e)} style={{ width:44, height:44, fontSize:24, border: emoji===e ? `3px solid ${C.primary}` : "2px solid transparent", borderRadius:10, background: emoji===e ? C.primaryLight : "#fff", cursor:"pointer" }}>{e}</button>)}
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontWeight:700, color:C.text, marginBottom:8, fontSize:13 }}>Cor</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {colors.map(cl => <button key={cl} onClick={() => setColor(cl)} style={{ width:42, height:42, background:cl, border: color===cl ? `3px solid ${C.text}` : "3px solid transparent", borderRadius:12, cursor:"pointer", boxShadow:"0 2px 6px rgba(0,0,0,0.2)" }} />)}
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontWeight:700, color:C.text, marginBottom:8, fontSize:13 }}>Categoria <span style={{ fontWeight:600, color:C.textLight }}>(opcional)</span></div>
          <CategoryPicker value={category} onChange={setCategory} customCategories={customCategories} onAddCategory={onAddCategory} />
        </div>
        <button onClick={handleSave} style={{ width:"100%", padding:"15px", background: label.trim() ? C.sim : "#ccc", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor: label.trim() ? "pointer" : "not-allowed", fontFamily:"'Nunito', sans-serif" }}>💾 Salvar Card</button>
      </div>
    </div>
  );
}

// ── Tela Login ─────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  function handleLogin() {
    // Aceita qualquer credencial, inclusive em branco
    const key = email.trim().toLowerCase() || "anonimo";
    let user = DB.users.find(u => u.email === key);
    if (!user) {
      // Cria conta automaticamente se não existir
      const displayName = email.trim() ? email.trim().split("@")[0] : "Visitante";
      user = { name: displayName, email: key, password, savedCards: [], favoriteCards: [], categoryCards: {}, customCategories: {} };
      DB.users.push(user);
    }
    onLogin(user);
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:`linear-gradient(160deg, ${C.primaryLight} 0%, ${C.bg} 45%)`, padding:24, justifyContent:"center" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:64, marginBottom:8 }}>🗣️</div>
        <div style={{ fontSize:26, fontWeight:900, color:C.primaryDark, letterSpacing:-0.5 }}>Tela de Comunicação</div>
        <div style={{ fontSize:14, color:C.textLight, fontWeight:600, marginTop:4 }}>Entre para continuar</div>
      </div>
      <div style={{ background:"#fff", borderRadius:24, padding:28, boxShadow:"0 12px 40px rgba(232,99,74,0.18)", animation: shake ? "shake 0.4s ease" : "none" }}>
        <Field label="E-mail" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} placeholder="seu@email.com" error={errors.email} />
        <Field label="Senha" type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }} placeholder="••••••" error={errors.password} />
        <button onClick={handleLogin} style={{ width:"100%", padding:"15px", background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", fontFamily:"'Nunito', sans-serif", boxShadow:`0 6px 20px ${C.primary}55`, marginTop:4 }}>Entrar →</button>
        <div style={{ textAlign:"center", marginTop:18 }}>
          <span style={{ color:C.textLight, fontSize:14 }}>Não tem conta? </span>
          <button onClick={onGoRegister} style={{ background:"none", border:"none", color:C.primary, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>Cadastre-se</button>
        </div>
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

// ── Tela Cadastro ──────────────────────────────────────────────────────────────
function RegisterScreen({ onRegister, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleRegister() {
    const resolvedName = name.trim() || "Visitante";
    const resolvedEmail = (email.trim().toLowerCase() || "user_" + Date.now()) ;
    const user = { name: resolvedName, email: resolvedEmail, password, savedCards:[], favoriteCards:[], categoryCards:{}, customCategories:{} };
    DB.users.push(user);
    setSuccess(true);
    setTimeout(() => onRegister(user), 1200);
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:`linear-gradient(160deg, ${C.blueLight} 0%, ${C.bg} 45%)`, padding:24, justifyContent:"center", overflowY:"auto" }}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:52, marginBottom:6 }}>✨</div>
        <div style={{ fontSize:24, fontWeight:900, color:C.text }}>Criar conta</div>
        <div style={{ fontSize:14, color:C.textLight, fontWeight:600 }}>Junte-se à Tela de Comunicação</div>
      </div>
      <div style={{ background:"#fff", borderRadius:24, padding:28, boxShadow:"0 12px 40px rgba(41,128,185,0.15)" }}>
        {success ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:60 }}>🎉</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.sim, marginTop:10 }}>Cadastro realizado!</div>
            <div style={{ color:C.textLight, fontSize:14, marginTop:6 }}>Entrando automaticamente...</div>
          </div>
        ) : (
          <>
            <Field label="Nome" value={name} onChange={e => { setName(e.target.value); setErrors({}); }} placeholder="Seu nome completo" error={errors.name} />
            <Field label="E-mail" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} placeholder="seu@email.com" error={errors.email} />
            <Field label="Senha" type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }} placeholder="Mínimo 6 caracteres" error={errors.password} />
            <Field label="Confirmar senha" type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setErrors({}); }} placeholder="Repita a senha" error={errors.confirm} />
            <button onClick={handleRegister} style={{ width:"100%", padding:"15px", background:`linear-gradient(135deg, ${C.blue}, #1a5276)`, border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", fontFamily:"'Nunito', sans-serif", boxShadow:`0 6px 20px ${C.blue}55`, marginTop:4 }}>Criar minha conta →</button>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <span style={{ color:C.textLight, fontSize:14 }}>Já tem conta? </span>
              <button onClick={onGoLogin} style={{ background:"none", border:"none", color:C.primary, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>Entrar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [authScreen, setAuthScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("main");
  const [pendingTab, setPendingTab] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(link);

    // Scrollbar estilizada
    const style = document.createElement("style");
    style.textContent = `
      /* Scrollbar vertical (cards) */
      .scroll-styled::-webkit-scrollbar { width: 6px; }
      .scroll-styled::-webkit-scrollbar-track { background: transparent; }
      .scroll-styled::-webkit-scrollbar-thumb {
        background: #FFAB94;
        border-radius: 99px;
      }
      .scroll-styled::-webkit-scrollbar-thumb:hover { background: #E8634A; }

      /* Scrollbar horizontal (tabs) */
      .scroll-x-styled::-webkit-scrollbar { height: 3px; }
      .scroll-x-styled::-webkit-scrollbar-track { background: transparent; }
      .scroll-x-styled::-webkit-scrollbar-thumb {
        background: #E8634A55;
        border-radius: 99px;
      }
      /* Firefox */
      .scroll-styled { scrollbar-width: thin; scrollbar-color: #FFAB94 transparent; }
      .scroll-x-styled { scrollbar-width: thin; scrollbar-color: #E8634A55 transparent; }
    `;
    document.head.appendChild(style);
    if (DB.users.length === 0) {
      DB.users.push({ name:"Usuário Demo", email:"demo@demo.com", password:"123456", savedCards:[], favoriteCards:[], categoryCards:{}, customCategories:{} });
    }
  }, []);

  function handleSaveCard(card) {
    if (!user) return;
    if (!user.savedCards.find(c => c.id === card.id)) {
      user.savedCards = [...user.savedCards, card];
    }
    const isBuiltin = card.category && CATEGORIES[card.category];
    const isCustom = card.category && (user.customCategories || {})[card.category];
    if (isBuiltin || isCustom) {
      const catCards = user.categoryCards || {};
      const existing = catCards[card.category] || [];
      if (!existing.find(c => c.id === card.id)) {
        user.categoryCards = { ...catCards, [card.category]: [...existing, card] };
      }
    }
    setUser({ ...user });
  }

  function handleAddCategory(cat) {
    if (!user) return;
    user.customCategories = { ...(user.customCategories || {}), [cat.key]: cat };
    setUser({ ...user });
  }

  const appStyle = {
    width:"100%", maxWidth:480,
    height:"100vh", maxHeight:780,
    margin:"0 auto",
    background:C.bg, borderRadius:24,
    overflow:"hidden",
    boxShadow:"0 20px 60px rgba(0,0,0,0.25)",
    display:"flex", flexDirection:"column",
    position:"relative", fontFamily:"'Nunito', sans-serif",
  };

  if (!user) {
    return (
      <div style={appStyle}>
        {authScreen === "login"
          ? <LoginScreen onLogin={u => setUser(u)} onGoRegister={() => setAuthScreen("register")} />
          : <RegisterScreen onRegister={u => setUser(u)} onGoLogin={() => setAuthScreen("login")} />
        }
      </div>
    );
  }

  return (
    <div style={appStyle}>
      {screen === "main" && (
        <MainScreen user={user}
          initialTab={pendingTab}
          onAkinator={() => setScreen("akinator")}
          onHelp={() => setScreen("help")}
          onCreateCard={() => setScreen("create")}
          onLogout={() => { setUser(null); setScreen("main"); setPendingTab(null); }}
          onUpdateUser={u => setUser(u)}
        />
      )}
      {screen === "akinator" && <AkinatorScreen onBack={() => setScreen("main")} onSaveCard={handleSaveCard} onGoTab={tab => { setPendingTab(tab); setScreen("main"); }} customCategories={user.customCategories || {}} onAddCategory={handleAddCategory} />}
      {screen === "help" && <HelpScreen onBack={() => setScreen("main")} />}
      {screen === "create" && <CreateCardScreen onBack={() => setScreen("main")} onSave={handleSaveCard} onGoTab={tab => { setPendingTab(tab); setScreen("main"); }} customCategories={user.customCategories || {}} onAddCategory={handleAddCategory} />}
    </div>
  );
}
