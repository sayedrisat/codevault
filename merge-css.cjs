const fs = require("fs");

const drawerCss = fs.readFileSync("src/styles/drawer.css", "utf8");

const newCss =
  `
.app-shell {
  --av-black: #050505;
  --av-blue: #2D7EFF;
  --av-cyan: #00F0FF;
  --av-white: #FFFFFF;
  --av-gray: #A0A0A0;
  --av-muted: #6b6b6b;
  --av-surface: #0D0D0D;
  --av-card: #111111;
  --av-danger: #e85d5d;
  --av-border: rgba(255,255,255,0.07);
  --font-display: 'Fraunces', serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Inter', sans-serif;

  display: flex;
  height: 100vh;
  background: var(--av-black);
  color: var(--av-white);
  font-family: var(--font-body);
  overflow: hidden;
  position: relative;
}

.app-shell *, .app-shell *::before, .app-shell *::after {
  box-sizing: border-box;
}

.noise {
  position: fixed; inset: 0; z-index: 999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Sidebar Shell Responsiveness */
.av-rail { display: none; }
.av-tree-panel { display: flex; }

@media (max-width: 860px) {
  .av-rail { display: flex; }
  .av-tree-panel { 
    display: none; 
    position: absolute;
    left: 68px; /* rail width */
    top: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: 10px 0 30px rgba(0,0,0,0.5);
  }
  .av-rail:hover + .av-tree-panel,
  .av-tree-panel:hover {
    display: flex;
  }
}

/* Rail */
.av-rail {
  width: 68px;
  flex-shrink: 0;
  background: var(--av-surface);
  border-right: 1px solid var(--av-border);
  flex-direction: column;
  align-items: center;
  padding: 18px 0;
  z-index: 51;
}
.av-rail-brand {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--av-blue), #1a4fb8);
  box-shadow: 0 0 18px rgba(45,126,255,0.45);
  margin-bottom: 26px;
  cursor: pointer;
}
.av-rail-nav { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.av-rail-btn {
  position: relative;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--av-gray); font-size: 17px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.av-rail-btn:hover { background: rgba(255,255,255,0.05); color: var(--av-white); }
.av-rail-btn.active {
  background: rgba(45,126,255,0.14);
  color: var(--av-blue);
}
.av-rail-btn.active::before {
  content: '';
  position: absolute; left: -18px; top: 50%; transform: translateY(-50%);
  width: 3px; height: 18px; border-radius: 3px;
  background: var(--av-blue);
  box-shadow: 0 0 8px rgba(45,126,255,0.7);
}
.av-rail-tip {
  position: absolute; left: 54px; top: 50%; transform: translateY(-50%) translateX(-4px);
  background: #161616; border: 1px solid var(--av-border);
  font-family: var(--font-mono); font-size: 11px; color: var(--av-white);
  padding: 6px 10px; border-radius: 6px; white-space: nowrap;
  opacity: 0; pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 60;
}
.av-rail-btn:hover .av-rail-tip { opacity: 1; transform: translateY(-50%) translateX(0); }
.av-rail-foot { display: flex; flex-direction: column; gap: 6px; align-items: center; }

/* Tree Panel */
.av-tree-panel {
  width: 250px;
  flex-shrink: 0;
  background: var(--av-surface);
  border-right: 1px solid var(--av-border);
  flex-direction: column;
  padding: 20px 14px;
  overflow-y: auto;
}
.av-tree-brand {
  display: flex; align-items: center; gap: 8px;
  padding: 2px 6px 18px;
  font-family: "Inter", sans-serif; font-weight: 700; font-size: 15px;
  letter-spacing: -0.01em;
}
.av-panel-label {
  font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  color: var(--av-muted); letter-spacing: 0.1em; text-transform: uppercase;
  margin: 0 6px 10px;
}
.av-tree { display: flex; flex-direction: column; gap: 1px; margin-bottom: 22px; }
.av-tree-row {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 8px;
  border-radius: 7px;
  font-family: var(--font-mono); font-size: 12.5px; color: var(--av-gray);
  cursor: pointer; border: none; background: transparent; width: 100%; text-align: left;
  transition: background 0.16s, color 0.16s;
}
.av-tree-row:hover { background: rgba(255,255,255,0.04); color: var(--av-white); }
.av-tree-row.active { background: rgba(45,126,255,0.12); color: var(--av-blue); }
.av-tree-icon {  text-align: center; font-size: 8px; opacity: 0.85; }
.av-tree-count {
  margin-left: auto; font-size: 9.5px; color: var(--av-muted);
  background: rgba(255,255,255,0.04); border-radius: 100px; padding: 1px 6px;
}

.av-collection-menu {
  position: absolute;
  top: 100%; right: 0;
  z-index: 20;
  min-width: 110px; padding: 5px;
  border: 1px solid var(--av-border); border-radius: 8px;
  background: #151515; box-shadow: 0 12px 30px rgba(0,0,0,0.45);
}
.av-collection-menu button {
  width: 100%; border: none; background: transparent; border-radius: 6px;
  padding: 7px 8px; color: var(--av-gray); cursor: pointer;
  font-family: var(--font-mono); font-size: 12px; text-align: left;
}
.av-collection-menu button:hover { color: var(--av-white); background: rgba(255,255,255,0.06); }
.av-collection-menu button.danger:hover { color: var(--av-danger); background: rgba(232,93,93,0.12); }
.av-collection-row { position: relative; }

.av-collection-editor {
  display: flex; flex-direction: column; gap: 6px; padding: 7px;
  border: 1px solid var(--av-border); border-radius: 8px; background: rgba(255,255,255,0.03);
}
.av-collection-editor input {
  width: 100%; border: 1px solid rgba(45,126,255,0.35); border-radius: 7px;
  background: rgba(0,0,0,0.3); color: var(--av-white); outline: none; padding: 7px 8px;
  font-family: var(--font-mono); font-size: 12px;
}
.av-collection-editor-actions { display: flex; gap: 6px; }
.av-collection-editor-actions button {
  flex: 1; border: 1px solid var(--av-border); border-radius: 7px;
  background: rgba(255,255,255,0.04); color: var(--av-gray); cursor: pointer;
  padding: 6px 7px; font-family: var(--font-mono); font-size: 11px;
}
.av-collection-editor-actions button:first-child { color: var(--av-white); background: rgba(45,126,255,0.18); border-color: rgba(45,126,255,0.35); }
.av-collection-error { font-family: var(--font-mono); font-size: 10px; color: var(--av-danger); }

.av-tag-row { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 4px; }
.av-tag-chip {
  font-family: var(--font-mono); font-size: 10.5px; color: var(--av-gray);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--av-border);
  border-radius: 100px; padding: 4px 10px;
  cursor: pointer; transition: all 0.18s;
}
.av-tag-chip:hover { color: var(--av-white); border-color: rgba(255,255,255,0.2); }
.av-tag-chip.active { color: var(--av-blue); border-color: rgba(45,126,255,0.45); background: rgba(45,126,255,0.15); }

/* Main Area */
.av-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }

.av-topbar {
  height: 64px; flex-shrink: 0;
  display: flex; align-items: center; gap: 20px;
  padding: 0 28px;
  border-bottom: 1px solid var(--av-border);
}
.av-topbar-title {
  font-family: var(--font-display); font-weight: 900; font-size: 24px;
  letter-spacing: -0.02em; flex-shrink: 0;
}
.av-topbar-search { position: relative; flex: 1; max-width: 420px; }
.av-topbar-search input {
  width: 100%; background: rgba(255,255,255,0.03);
  border: 1px solid var(--av-border); border-radius: 9px;
  padding: 9px 14px 9px 36px; font-family: var(--font-mono); font-size: 12.5px; color: var(--av-white);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.av-topbar-search input::placeholder { color: var(--av-muted); }
.av-topbar-search input:focus { border-color: rgba(45,126,255,0.5); box-shadow: 0 0 0 3px rgba(45,126,255,0.1); }
.av-topbar-search .av-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--av-muted); font-size: 14px; pointer-events: none; }

.av-topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.av-kbd-hint {
  font-family: var(--font-mono); font-size: 10.5px; color: var(--av-muted);
  border: 1px solid var(--av-border); border-radius: 6px; padding: 4px 8px;
  display: flex; align-items: center; gap: 4px;
}
.av-btn-new-collection {
  display: flex; align-items: center; gap: 7px;
  font-family: var(--font-mono); font-size: 12.5px; font-weight: 600;
  color: var(--av-white); background: var(--av-blue);
  border: none; border-radius: 8px; padding: 10px 16px;
  cursor: pointer; position: relative; overflow: hidden;
  transition: box-shadow 0.25s, transform 0.15s;
}
.av-btn-new-collection:hover { box-shadow: 0 0 20px rgba(45,126,255,0.5); }
.av-btn-new-collection:active { transform: scale(0.97); }

.av-view-toggle { display: flex; gap: 2px; background: rgba(255,255,255,0.03); border: 1px solid var(--av-border); border-radius: 8px; padding: 2px; flex-shrink: 0; }
.av-view-btn { border: none; background: transparent; color: var(--av-muted); font-size: 16px; padding: 5px 9px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
.av-view-btn.active { background: rgba(45,126,255,0.15); color: var(--av-blue); }

.av-content { flex: 1; overflow-y: auto; padding: 32px 36px 60px; position: relative; }
.av-content-glow {
  position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 320px;
  background: radial-gradient(ellipse, rgba(45,126,255,0.08) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}
.av-content-inner { position: relative; z-index: 1; }
.av-content-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 4px; }
.av-content-h1 { font-family: var(--font-display); font-weight: 900; font-size: 32px; letter-spacing: -0.02em; }
.av-view-all { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: var(--av-blue); cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 5px; transition: gap 0.2s; }
.av-view-all:hover { gap: 8px; }
.av-content-sub { color: var(--av-gray); font-size: 13.5px; margin-bottom: 28px; }

/* Collections View */
.av-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.av-coll-card {
  background: var(--av-card); border: 1px solid var(--av-border); border-radius: 14px;
  padding: 20px; position: relative; overflow: hidden; cursor: pointer;
  opacity: 0; transform: translateY(14px);
  animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s;
}
.av-coll-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--av-blue), transparent 85%); opacity: 0.7;
}
.av-coll-card.teal::after { background: linear-gradient(90deg, var(--av-cyan), transparent 85%); }
.av-coll-card.violet::after { background: linear-gradient(90deg, #8C6EFF, transparent 85%); }
@keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
.av-coll-card::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at var(--mx,50%) var(--my,-10%), rgba(45,126,255,0.10) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.4s; pointer-events: none;
}
.av-coll-card:hover::before { opacity: 1; }
.av-coll-card:hover {
  transform: translateY(-4px); border-color: rgba(45,126,255,0.35);
  box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(45,126,255,0.12);
}
.av-card-top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.av-card-icon {
  width: 42px; height: 42px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  color: var(--av-blue); background: linear-gradient(135deg, rgba(45,126,255,0.18), rgba(0,240,255,0.08));
  border: 1px solid rgba(45,126,255,0.25); box-shadow: 0 0 16px rgba(45,126,255,0.15);
}
.av-card-icon.teal { color: var(--av-cyan); background: linear-gradient(135deg, rgba(0,240,255,0.18), rgba(0,240,255,0.04)); border-color: rgba(0,240,255,0.28); box-shadow: 0 0 16px rgba(0,240,255,0.15); }
.av-card-icon.violet { color: #8C6EFF; background: linear-gradient(135deg, rgba(140,110,255,0.2), rgba(45,126,255,0.06)); border-color: rgba(140,110,255,0.3); box-shadow: 0 0 16px rgba(140,110,255,0.15); }
.av-card-menu { width: 26px; height: 26px; border-radius: 7px; border: none; background: transparent; color: var(--av-muted); display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer; transition: all 0.18s; opacity: 0; }
.av-coll-card:hover .av-card-menu { opacity: 1; }
.av-card-menu:hover { background: rgba(255,255,255,0.08); color: var(--av-white); }
.av-card-title { font-family: var(--font-body); font-weight: 600; font-size: 16.5px; margin-bottom: 8px; }
.av-card-desc {
  font-size: 13px; color: var(--av-gray); line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: 16px; min-height: 42px;
}
.av-card-meta {
  display: flex; align-items: center; gap: 14px;
  padding-top: 14px; border-top: 1px solid var(--av-border);
  font-family: var(--font-mono); font-size: 10.5px; color: var(--av-muted);
}
.av-meta-item { display: flex; align-items: center; gap: 5px; }
.av-dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--av-muted); }
.av-new-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  border: 1px dashed rgba(255,255,255,0.14); border-radius: 14px; min-height: 168px; cursor: pointer;
  transition: border-color 0.25s, background 0.25s;
  opacity: 0; transform: translateY(14px); animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
}
.av-new-card:hover { border-color: rgba(45,126,255,0.4); background: rgba(45,126,255,0.03); }
.av-plus {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--av-border);
  display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--av-gray); transition: all 0.25s;
}
.av-new-card:hover .av-plus { border-color: var(--av-blue); color: var(--av-blue); box-shadow: 0 0 16px rgba(45,126,255,0.3); }
.av-new-card span { font-family: var(--font-mono); font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; color: var(--av-gray); }
.av-new-card:hover span { color: var(--av-white); }

/* Detail View */
.av-back-btn {
  width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--av-border); background: rgba(255,255,255,0.03);
  color: var(--av-gray); font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; flex-shrink: 0;
}
.av-back-btn:hover { color: var(--av-white); border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
.av-detail-new-btn {
  display: flex; align-items: center; gap: 7px; font-family: var(--font-mono); font-size: 12px; font-weight: 600;
  color: var(--av-white); background: var(--av-blue); border: none; border-radius: 8px; padding: 9px 15px; cursor: pointer; transition: box-shadow 0.25s, transform 0.15s;
}
.av-detail-new-btn:hover { box-shadow: 0 0 18px rgba(45,126,255,0.5); }
.av-detail-new-btn:active { transform: scale(0.97); }

.av-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.av-grid.list-view { grid-template-columns: 1fr; }

/* Status bar */
.av-statusbar {
  height: 30px; flex-shrink: 0; border-top: 1px solid var(--av-border); display: flex; align-items: center; padding: 0 28px;
  font-family: var(--font-mono); font-size: 10.5px; color: var(--av-muted); gap: 18px;
}
.av-sync-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--av-cyan); box-shadow: 0 0 6px var(--av-cyan);
  animation: syncPulse 1.6s ease-in-out infinite;
}
@keyframes syncPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.av-statusbar-spacer { margin-left: auto; display: flex; gap: 18px; }

/* Modal */
.av-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
}
.av-modal-overlay.open { opacity: 1; pointer-events: auto; }
.av-modal {
  width: 440px; max-width: 92vw; background: var(--av-surface); border: 1px solid rgba(45,126,255,0.2);
  border-radius: 16px; padding: 26px; box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(45,126,255,0.06);
  transform: translateY(16px) scale(0.97); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.av-modal-overlay.open .av-modal { transform: translateY(0) scale(1); }
.av-modal h3 { font-family: var(--font-mono); font-size: 15px; font-weight: 600; margin-bottom: 18px; color: var(--av-white); }
.av-modal-field { margin-bottom: 14px; }
.av-modal-field label {
  display: block; font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  color: var(--av-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
}
.av-modal-field input, .av-modal-field textarea {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--av-border); border-radius: 8px;
  padding: 10px 12px; font-family: var(--font-body); font-size: 13.5px; color: var(--av-white); outline: none; transition: border-color 0.2s; resize: none;
}
.av-modal-field input:focus, .av-modal-field textarea:focus { border-color: rgba(45,126,255,0.5); }
.av-modal-foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

/* Keep styles used by SnippetCard */
.av-card {
  background: var(--av-card); border: 1px solid var(--av-border); border-radius: 12px; padding: 16px; cursor: pointer;
  position: relative; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s, opacity 0.2s;
  animation: avCardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
@keyframes avCardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.av-card:hover { transform: translateY(-3px); border-color: rgba(45,126,255,0.35); box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(45,126,255,0.1); }
.av-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.av-card-lang { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--av-blue); background: rgba(45,126,255,0.1); border-radius: 5px; padding: 3px 8px; }
.av-card-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.18s; }
.av-card:hover .av-card-actions { opacity: 1; }
.av-icon-btn { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: none; background: rgba(255,255,255,0.04); color: #e8e8e8; cursor: pointer; font-size: 18px; transition: all 0.18s; }
.av-icon-btn:hover { background: rgba(255,255,255,0.09); color: var(--av-white); }
.av-icon-btn.danger:hover { background: rgba(232,93,93,0.15); color: var(--av-danger); }
.av-card-title { font-family: var(--font-mono); font-size: 16px; font-weight: 600; color: var(--av-white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; margin-bottom: 6px; }
.av-card-favorite { color: #ff5d8f; flex-shrink: 0; font-size: 13px; line-height: 1; text-shadow: 0 0 10px rgba(255,93,143,0.45); }
.av-card-reason { font-size: 12px; color: var(--av-gray); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; min-height: 37px; }
.av-recall-card { display: grid; grid-template-columns: 1fr auto; gap: 8px 10px; align-items: center; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; background: rgba(255,255,255,0.025); padding: 10px; margin-bottom: 12px; }
.av-recall-card.due { border-color: rgba(0,240,255,0.26); background: rgba(0,240,255,0.055); }
.av-recall-kicker { display: block; color: var(--av-cyan); font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
.av-recall-card strong { display: block; color: var(--av-white); font-family: var(--font-mono); font-size: 12px; margin-bottom: 3px; }
.av-recall-card span:not(.av-recall-kicker) { color: var(--av-muted); font-size: 11px; }
.av-recall-progress { display: flex; gap: 4px; justify-content: flex-end; }
.av-recall-progress span { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.14); }
.av-recall-progress span.complete { background: var(--av-cyan); box-shadow: 0 0 10px rgba(0,240,255,0.45); }
.av-recall-action { grid-column: 1 / -1; border: 1px solid rgba(0,240,255,0.28); border-radius: 7px; background: rgba(0,240,255,0.08); color: var(--av-white); cursor: pointer; font-family: var(--font-mono); font-size: 11px; padding: 7px 9px; transition: all 0.16s; }
.av-recall-action:hover { border-color: rgba(0,240,255,0.5); background: rgba(0,240,255,0.14); }
.av-card-tags { display: flex; gap: 5px; flex-wrap: wrap; }
.av-card-tag { font-family: var(--font-mono); font-size: 10px; color: var(--av-gray); background: rgba(255,255,255,0.04); border-radius: 4px; padding: 3px 7px; }

\n` + drawerCss;

fs.writeFileSync("src/styles/app.css", newCss);
