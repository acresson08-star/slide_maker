import { useState } from "react";

// ─── FORMATS ─────────────────────────────────────────────────────────────────
const FORMATS = [
  { id: "flycase", emoji: "🎸", label: "FLYCASE", sub: "Matériel & instruments", color: "#7C7A52" },
  { id: "zoom",    emoji: "🔍", label: "ZOOM",    sub: "Artiste méconnu",        color: "#4A6274" },
  { id: "icone",   emoji: "👑", label: "ICÔNE",   sub: "Artiste majeur",         color: "#C8402A" },
  { id: "vinyles", emoji: "📋", label: "10 VINYLES", sub: "Curation",            color: "#D9D0C1" },
];

const getFormat = (id) => FORMATS.find(f => f.id === id) || FORMATS[0];
const isDark = (color) => color !== "#D9D0C1";
const SLIDE_W = 400;
const SLIDE_H = 400;

// ─── SHELL & FOOTER ───────────────────────────────────────────────────────────
function SlideShell({ color, children }) {
  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, background: color,
      position: "relative", overflow: "hidden", flexShrink: 0,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      {children}
    </div>
  );
}

function Footer({ format, tc, num, total }) {
  return (
    <div style={{ position: "absolute", bottom: 16, left: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.08em", color: tc }}>STRATA</span>
      <span style={{ fontSize: 10, color: tc, opacity: 0.35 }}>{num}/{total}</span>
    </div>
  );
}

// ─── COVER ───────────────────────────────────────────────────────────────────
function CoverSlide({ data, format, total }) {
  const dark = isDark(format.color);
  const tc = dark ? "#fff" : "#1A1A1A";
  const muted = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.28)";
  const hasImg = !!data.image;
  return (
    <SlideShell color={format.color}>
      {/* Photo détourée */}
      {hasImg && (
        <img src={data.image} alt="" style={{
          position: "absolute", right: -10, bottom: 0,
          height: "90%", width: "auto", objectFit: "contain", objectPosition: "bottom right",
          filter: "grayscale(100%)", mixBlendMode: "multiply", pointerEvents: "none", zIndex: 1,
        }} />
      )}
      {/* Gradient pour lisibilité texte */}
      {hasImg && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 70%)", zIndex: 2, pointerEvents: "none" }} />
      )}
      <div style={{ position: "absolute", inset: 0, padding: "26px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 13 }}>{format.emoji}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: tc, opacity: 0.65, textTransform: "uppercase" }}>{format.label}</span>
        </div>
        <div style={{ maxWidth: hasImg ? "58%" : "90%" }}>
          <div style={{ fontSize: (data.title || "").length > 20 ? 30 : 40, fontWeight: 900, lineHeight: 1.05, color: tc, letterSpacing: "-0.025em", marginBottom: 12 }}>
            {data.title || "Titre du sujet"}
          </div>
          <div style={{ width: 32, height: 2.5, background: muted, marginBottom: 12 }} />
          <div style={{ fontSize: 13, lineHeight: 1.6, color: tc, opacity: 0.78 }}>
            {data.subtitle || "Sous-titre ou accroche de couverture"}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "0.08em", color: tc }}>STRATA</span>
          <span style={{ fontSize: 10, color: tc, opacity: 0.3 }}>1/{total}</span>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── LAYOUT : CITATION ───────────────────────────────────────────────────────
function LayoutQuote({ data, format, slideNum, total }) {
  const dark = isDark(format.color);
  const tc = dark ? "#fff" : "#1A1A1A";
  const bar = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)";
  const quote = data.text || "Une citation forte qui occupe tout l'espace.";
  const attr = data.title || "";
  return (
    <SlideShell color={format.color}>
      <div style={{ position: "absolute", top: 10, left: 16, fontSize: 160, lineHeight: 1, color: tc, opacity: 0.05, fontFamily: "Georgia, serif", userSelect: "none", pointerEvents: "none" }}>"</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "44px 28px 54px" }}>
        <div style={{ width: 3, height: 40, background: bar, marginBottom: 20, borderRadius: 2 }} />
        <div style={{ fontSize: quote.length > 100 ? 16 : quote.length > 60 ? 20 : 24, fontWeight: 800, lineHeight: 1.35, color: tc, letterSpacing: "-0.01em", fontStyle: "italic" }}>
          "{quote}"
        </div>
        {attr && (
          <div style={{ fontSize: 11, color: tc, opacity: 0.45, marginTop: 18, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            — {attr}
          </div>
        )}
      </div>
      <Footer format={format} tc={tc} num={slideNum} total={total} />
    </SlideShell>
  );
}

// ─── LAYOUT : SPLIT ──────────────────────────────────────────────────────────
function LayoutSplit({ data, format, slideNum, total }) {
  const dark = isDark(format.color);
  const tc = dark ? "#fff" : "#1A1A1A";
  const divider = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  return (
    <SlideShell color={format.color}>
      <div style={{ position: "absolute", left: "44%", top: 24, bottom: 52, width: 1, background: divider }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "42%", bottom: 52, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 16px 16px 24px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: tc, opacity: 0.4, textTransform: "uppercase", marginBottom: 14 }}>{format.emoji} {format.label}</div>
        <div style={{ fontSize: (data.title || "").length > 16 ? 22 : 28, fontWeight: 900, lineHeight: 1.1, color: tc, letterSpacing: "-0.02em" }}>
          {data.title || "Titre"}
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, width: "54%", bottom: 52, display: "flex", alignItems: "center", padding: "24px 22px 16px 16px" }}>
        <div style={{ fontSize: 13, lineHeight: 1.65, color: tc, opacity: 0.82 }}>
          {data.text || "Texte de contenu développé qui complète le titre à gauche."}
        </div>
      </div>
      <Footer format={format} tc={tc} num={slideNum} total={total} />
    </SlideShell>
  );
}

// ─── LAYOUT : ÉDITORIAL ──────────────────────────────────────────────────────
function LayoutEditorial({ data, format, slideNum, total }) {
  const dark = isDark(format.color);
  const tc = dark ? "#fff" : "#1A1A1A";
  const muted = dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.25)";
  const text = data.text || "Un texte éditorial développé, idéal pour l'analyse ou le contexte historique.";
  return (
    <SlideShell color={format.color}>
      <div style={{ position: "absolute", inset: 0, padding: "26px 26px 52px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: tc, opacity: 0.4, textTransform: "uppercase" }}>{format.emoji} {format.label}</span>
          {data.title && <span style={{ fontSize: 10, fontWeight: 700, color: tc, opacity: 0.32, letterSpacing: "0.06em", textTransform: "uppercase", maxWidth: "50%", textAlign: "right" }}>{data.title}</span>}
        </div>
        <div>
          <div style={{ width: 30, height: 2.5, background: muted, marginBottom: 16 }} />
          <div style={{ fontSize: text.length > 200 ? 13 : text.length > 130 ? 15 : 18, lineHeight: 1.68, color: tc, fontWeight: 450 }}>
            {text}
          </div>
        </div>
      </div>
      <Footer format={format} tc={tc} num={slideNum} total={total} />
    </SlideShell>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTASlide({ ctaText, format, total }) {
  const dark = isDark(format.color);
  const tc = dark ? "#fff" : "#1A1A1A";
  const muted = dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.28)";
  return (
    <SlideShell color={format.color}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ position: "absolute", top: `${10 + i * 18}%`, left: 0, right: 0, height: 1, background: dark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, padding: "28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ width: 48, height: 48, background: tc, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
          <span style={{ fontWeight: 900, fontSize: 20, color: format.color }}>S</span>
        </div>
        <div style={{ fontSize: (ctaText || "").length > 40 ? 22 : 28, fontWeight: 900, lineHeight: 1.15, color: tc, letterSpacing: "-0.02em", marginBottom: 12, whiteSpace: "pre-line" }}>
          {ctaText || "Si tu as aimé,\nsuivez @strata"}
        </div>
        <div style={{ width: 30, height: 2.5, background: muted, marginBottom: 14 }} />
        <div style={{ fontSize: 12, color: tc, opacity: 0.5, lineHeight: 1.6 }}>
          Musique, culture, découvertes.<br />Chaque semaine sur Strata.
        </div>
        <div style={{ position: "absolute", bottom: 18, left: 28, right: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.08em", color: tc }}>STRATA</span>
          <span style={{ fontSize: 11, color: tc, opacity: 0.35, fontWeight: 600 }}>@strata.media</span>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── LAYOUTS CONFIG ───────────────────────────────────────────────────────────
const LAYOUTS = [
  {
    id: "quote",
    name: "Citation",
    emoji: "❝",
    Component: LayoutQuote,
    fields: ["text_quote", "title_attr"],
  },
  {
    id: "split",
    name: "Split",
    emoji: "⬛",
    Component: LayoutSplit,
    fields: ["title", "text"],
  },
  {
    id: "editorial",
    name: "Éditorial",
    emoji: "📰",
    Component: LayoutEditorial,
    fields: ["title_opt", "text_long"],
  },
];

const getLayout = (id) => LAYOUTS.find(l => l.id === id) || LAYOUTS[0];

// ─── LAYOUT PICKER ────────────────────────────────────────────────────────────
function LayoutPicker({ value, onChange, accent }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {LAYOUTS.map(l => {
        const active = value === l.id;
        return (
          <button
            key={l.id}
            onClick={() => onChange(l.id)}
            style={{
              flex: 1,
              padding: "7px 6px",
              borderRadius: 7,
              border: `2px solid ${active ? accent : "#252525"}`,
              background: active ? accent + "20" : "transparent",
              color: active ? "#fff" : "#505050",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textAlign: "center",
              transition: "all 0.12s",
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 2 }}>{l.emoji}</div>
            {l.name}
          </button>
        );
      })}
    </div>
  );
}

// ─── PLACEHOLDER CONTENT ─────────────────────────────────────────────────────
const PUNK_PLACEHOLDER = {
  cover: {
    title: "Le Punk Rock des années 2000",
    subtitle: "Après le grunge, une nouvelle vague de rage et d'énergie brute a tout remis à zéro.",
  },
  slides: [
    { layoutId: "quote",    title: "Billie Joe Armstrong, Green Day", text: "On ne cherchait pas à plaire. On cherchait à survivre. La musique était notre seule sortie." },
    { layoutId: "split",    title: "Un renouveau inattendu",          text: "Au tournant des années 2000, le punk semblait enterré. En quelques mois, The Strokes, The Hives et Sum 41 ont tout remis en question." },
    { layoutId: "editorial", title: "",                                text: "Ce n'était pas du punk au sens historique — pas de Clash, pas de Ramones. Mais l'énergie y était. Des groupes comme Blink-182 et New Found Glory ont transformé la rébellion en hymnes de vestiaires, portés par une génération qui grandissait avec MTV et le skate. Le punk 2000 était à la fois commercial et sincère, paradoxe que personne n'a jamais vraiment résolu." },
  ],
  cta: "Si tu as aimé,\nsuivez @strata",
};

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
function Section({ label, accent, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
        <div style={{ width: 3, height: 15, background: accent, borderRadius: 2 }} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ background: "#161616", border: "1px solid #1F1F1F", borderRadius: 12, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ color: "#505050", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { width: "100%", background: "#0F0F0F", border: "1px solid #252525", borderRadius: 7, padding: "8px 11px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" };
const taStyle = { ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.55 };
const btnSec = { background: "none", border: "1px solid #252525", color: "#505050", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 };

function Input({ value, onChange, placeholder }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />;
}
function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={taStyle} />;
}

// ─── CONTENT EDITOR ──────────────────────────────────────────────────────────
let uid = 100;
const freshSlide = (overrides = {}) => ({ id: Date.now() + uid++, layoutId: "quote", title: "", text: "", ...overrides });

function ContentEditor({ slides, onChange, format }) {
  const total = slides.length + 2;
  const add = () => onChange([...slides, freshSlide()]);
  const remove = (i) => onChange(slides.filter((_, idx) => idx !== i));
  const update = (i, val) => onChange(slides.map((s, idx) => idx === i ? val : s));

  return (
    <Section label="② → CONTENU" accent={format.color}>
      {slides.map((slide, i) => {
        const layout = getLayout(slide.layoutId);
        const { Component, fields } = layout;

        return (
          <div key={slide.id} style={{ marginBottom: i < slides.length - 1 ? 28 : 0 }}>
            {/* Slide header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.07em" }}>SLIDE {i + 2}/{total}</span>
              {slides.length > 1 && <button onClick={() => remove(i)} style={btnSec}>Supprimer</button>}
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
              {/* Preview */}
              <Component data={slide} format={format} slideNum={i + 2} total={total} />

              {/* Controls */}
              <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Layout picker */}
                <Field label="TYPE DE SLIDE">
                  <LayoutPicker
                    value={slide.layoutId}
                    onChange={v => update(i, { ...slide, layoutId: v })}
                    accent={format.color}
                  />
                </Field>

                {/* Dynamic fields based on layout */}
                {fields.includes("text_quote") && (
                  <Field label="CITATION">
                    <Textarea value={slide.text} onChange={v => update(i, { ...slide, text: v })} placeholder="La citation exacte…" rows={3} />
                  </Field>
                )}
                {fields.includes("title_attr") && (
                  <Field label="ATTRIBUTION">
                    <Input value={slide.title} onChange={v => update(i, { ...slide, title: v })} placeholder="Nom, source" />
                  </Field>
                )}
                {fields.includes("title") && (
                  <Field label="TITRE">
                    <Input value={slide.title} onChange={v => update(i, { ...slide, title: v })} placeholder="Titre court et fort" />
                  </Field>
                )}
                {fields.includes("text") && (
                  <Field label="TEXTE">
                    <Textarea value={slide.text} onChange={v => update(i, { ...slide, text: v })} placeholder="2-3 phrases…" rows={3} />
                  </Field>
                )}
                {fields.includes("title_opt") && (
                  <Field label="TITRE (optionnel)">
                    <Input value={slide.title} onChange={v => update(i, { ...slide, title: v })} placeholder="Optionnel" />
                  </Field>
                )}
                {fields.includes("text_long") && (
                  <Field label="TEXTE">
                    <Textarea value={slide.text} onChange={v => update(i, { ...slide, text: v })} placeholder="Texte éditorial développé, 4-5 phrases…" rows={5} />
                  </Field>
                )}
              </div>
            </div>

            {i < slides.length - 1 && <div style={{ height: 1, background: "#1E1E1E", margin: "24px 0 0" }} />}
          </div>
        );
      })}

      <button onClick={add} style={{ width: "100%", padding: "12px", background: "none", border: "1.5px dashed #252525", borderRadius: 10, color: "#383838", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginTop: slides.length ? 20 : 0 }}>
        + Ajouter une slide de contenu
      </button>
    </Section>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function StrataApp() {
  const [formatId, setFormatId] = useState("icone");
  const [cover, setCover] = useState({ ...PUNK_PLACEHOLDER.cover });
  const [content, setContent] = useState(
    PUNK_PLACEHOLDER.slides.map(s => ({ id: Date.now() + uid++, ...s }))
  );
  const [ctaText, setCtaText] = useState(PUNK_PLACEHOLDER.cta);
  const [tip, setTip] = useState(false);

  const format = getFormat(formatId);
  const total = content.length + 2;

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F0F", color: "#fff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* HEADER */}
      <div style={{ borderBottom: "1px solid #1A1A1A", padding: "15px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0F0F0F", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 900, fontSize: 13, color: "#000" }}>S</span>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: "0.08em" }}>STRATA</div>
            <div style={{ fontSize: 9, color: "#404040", letterSpacing: "0.06em" }}>SLIDE MAKER · {total} SLIDES</div>
          </div>
        </div>
        <button onClick={() => setTip(v => !v)} style={{ background: "#fff", border: "none", color: "#000", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em" }}>
          Exporter
        </button>
      </div>

      {tip && (
        <div style={{ background: "#0D1A0D", border: "1px solid #1E3A1E", margin: "14px 24px", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "#7BC87B", lineHeight: 1.8 }}>
            <b>Mac :</b> Cmd+Shift+4 → sélectionner la zone de la slide<br />
            <b>Windows :</b> Win+Shift+S → sélectionner la zone<br />
            <b>Chrome :</b> Clic droit sur la slide → Inspecter → Ctrl+Shift+P → "Capture node screenshot"
          </div>
        </div>
      )}

      <div style={{ padding: "20px 24px" }}>

        {/* FORMAT */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#444", letterSpacing: "0.1em", marginBottom: 10 }}>FORMAT DU CAROUSEL</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => setFormatId(f.id)} style={{
                padding: "7px 13px", borderRadius: 8,
                border: `2px solid ${formatId === f.id ? f.color : "#1E1E1E"}`,
                background: formatId === f.id ? f.color + "18" : "transparent",
                color: formatId === f.id ? "#fff" : "#505050",
                cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
              }}>
                {f.emoji} {f.label}
                <span style={{ display: "block", fontSize: 9, opacity: 0.5, marginTop: 1 }}>{f.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* COVER */}
        <Section label="① COVER" accent={format.color}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
            <CoverSlide data={cover} format={format} total={total} />
            <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 13 }}>
              <Field label="TITRE PRINCIPAL">
                <Input value={cover.title} onChange={v => setCover({ ...cover, title: v })} placeholder="Neil Young" />
              </Field>
              <Field label="ACCROCHE">
                <Textarea value={cover.subtitle} onChange={v => setCover({ ...cover, subtitle: v })} placeholder="Sous-titre ou accroche…" rows={2} />
              </Field>
              <Field label="PHOTO (PNG sans fond — optionnel)">
                {cover.image ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={cover.image} alt="" style={{ height: 44, borderRadius: 6, border: "1px solid #2A2A2A" }} />
                    <button onClick={() => setCover({ ...cover, image: null })} style={btnSec}>Retirer</button>
                  </div>
                ) : (
                  <div
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setCover({ ...cover, image: ev.target.result }); r.readAsDataURL(f); }}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById("cover-img").click()}
                    style={{ border: "1.5px dashed #2E2E2E", borderRadius: 8, padding: "13px", textAlign: "center", cursor: "pointer", color: "#555", fontSize: 11, letterSpacing: "0.04em" }}
                  >
                    Glisser un PNG ou cliquer pour importer
                    <input id="cover-img" type="file" accept="image/png,image/webp" style={{ display: "none" }}
                      onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setCover({ ...cover, image: ev.target.result }); r.readAsDataURL(f); }} />
                  </div>
                )}
              </Field>
            </div>
          </div>
        </Section>

        {/* CONTENT */}
        <ContentEditor slides={content} onChange={setContent} format={format} />

        {/* CTA */}
        <Section label="DERNIÈRE SLIDE — CTA" accent={format.color}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
            <CTASlide ctaText={ctaText} format={format} total={total} />
            <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 13 }}>
              <Field label="TEXTE D'ACCROCHE">
                <Textarea value={ctaText} onChange={v => setCtaText(v)} placeholder={"Si tu as aimé,\nsuivez @strata"} rows={3} />
              </Field>
              <div style={{ fontSize: 11, color: "#353535", lineHeight: 1.6 }}>Handle @strata.media et baseline automatiques.</div>
            </div>
          </div>
        </Section>

      </div>

      <div style={{ padding: "0 24px 32px", fontSize: 10, color: "#242424", textAlign: "center" }}>
        STRATA SLIDE MAKER · Citation · Split · Éditorial
      </div>
    </div>
  );
}
