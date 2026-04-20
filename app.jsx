const { useState, useEffect, useRef } = React;

// ─── Fonts ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=UnifrakturMaguntia&family=Pirata+One&family=IM+Fell+English:ital@0;1&family=IM+Fell+DW+Pica:ital@0;1&family=Uncial+Antiqua&display=swap";
document.head.appendChild(fontLink);

// Ensure mobile browsers use device width — without this they render at ~980px desktop
// width and scale everything down, making the whole app tiny regardless of CSS.
if (!document.querySelector('meta[name="viewport"]')) {
  const vp = document.createElement('meta');
  vp.name = 'viewport';
  vp.content = 'width=device-width, initial-scale=1';
  document.head.appendChild(vp);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  :root {
    --parchment: #c9a96e;
    --parchment-light: #e8d5a3;
    --parchment-dark: #8b6914;
    --blood: #8b1a1a;
    --blood-bright: #c0392b;
    --gold: #d4a017;
    --gold-bright: #f0c040;
    --ink: #1a1008;
    --ink-light: #2d1f0a;
    --stone: #2a2318;
    --stone-light: #3d3526;
    --glow: rgba(212,160,23,0.15);
    --slot-bg: rgba(10,8,4,0.7);
    --slot-border: #5a4a20;
    --slot-hover: rgba(212,160,23,0.2);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    overflow-x: hidden;
    background: #0d0a06;
  }

  body {
    background: #0d0a06;
    color: var(--parchment-light);
    font-family: 'Crimson Text', Georgia, serif;
    min-height: 100vh;
    overflow-x: hidden;
    max-width: 100%;
  }

  .app {
    width: 100%;
    overflow-x: hidden;
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 20% 10%, rgba(139,26,26,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 90%, rgba(139,105,20,0.06) 0%, transparent 50%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.005) 2px,
        rgba(255,255,255,0.005) 4px
      ),
      #0d0a06;
  }

  /* ── Creation Screen ── */
  .creation-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }

  .creation-panel {
    width: 100%;
    max-width: 480px;
    background: linear-gradient(160deg, #1e1608 0%, #120e06 100%);
    border: 1px solid var(--slot-border);
    border-radius: 2px;
    padding: 40px 32px;
    position: relative;
    box-shadow:
      0 0 60px rgba(0,0,0,0.8),
      inset 0 1px 0 rgba(212,160,23,0.1);
  }

  .creation-panel::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(212,160,23,0.08);
    pointer-events: none;
    border-radius: 1px;
  }

  .creation-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 22px;
    color: var(--gold);
    text-align: center;
    letter-spacing: 2px;
    margin-bottom: 6px;
    text-shadow: 0 0 20px rgba(212,160,23,0.4);
  }

  .creation-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    color: var(--parchment-dark);
    text-align: center;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 36px;
  }

  .field-label {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--parchment-dark);
    margin-bottom: 8px;
    display: block;
  }

  .text-input {
    width: 100%;
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--slot-border);
    color: var(--parchment-light);
    padding: 12px 16px;
    font-family: 'Crimson Text', serif;
    font-size: 18px;
    outline: none;
    border-radius: 1px;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 24px;
  }

  .text-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 12px rgba(212,160,23,0.15);
  }

  .class-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 32px;
  }

  .class-card {
    background: var(--slot-bg);
    border: 1px solid var(--slot-border);
    padding: 16px 8px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    border-radius: 1px;
    position: relative;
    overflow: hidden;
  }

  .class-card:hover {
    border-color: var(--gold);
    background: var(--slot-hover);
  }

  .class-card.selected {
    border-color: var(--gold-bright);
    background: rgba(212,160,23,0.12);
    box-shadow: 0 0 20px rgba(212,160,23,0.2);
  }

  .class-card.selected::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(212,160,23,0.05) 0%, transparent 100%);
  }

  .class-icon { font-size: 28px; margin-bottom: 8px; }

  .class-name {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--parchment-light);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .class-attr {
    font-size: 11px;
    color: var(--parchment-dark);
    font-style: italic;
  }

  .class-stats {
    font-size: 11px;
    color: var(--parchment-dark);
    margin-top: 8px;
    line-height: 1.6;
  }

  .btn-create {
    width: 100%;
    background: linear-gradient(180deg, #2a1f08 0%, #1a1305 100%);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 1px;
  }

  .btn-create:hover:not(:disabled) {
    background: linear-gradient(180deg, #3a2a0a 0%, #2a1f08 100%);
    box-shadow: 0 0 20px rgba(212,160,23,0.2);
    color: var(--gold-bright);
  }

  .btn-create:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* ── Main App Layout ── */
  .main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 16px;
    gap: 16px;
  }

  /* ── Header ── */
  .app-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 16px;
    background: linear-gradient(90deg, #1a1205 0%, #120e06 50%, #1a1205 100%);
    border: 1px solid var(--slot-border);
    border-radius: 1px;
  }

  /* Row 1: name left, buttons right */
  .header-row1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  /* Row 2: class · career · book + gold — smaller, dimmer */
  .header-row2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .hero-title-block { flex: 1; min-width: 0; }

  .hero-name-display {
    font-family: 'Cinzel Decorative', serif;
    font-size: 18px;
    color: var(--gold);
    text-shadow: 0 0 12px rgba(212,160,23,0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hero-class-display {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    color: var(--parchment-dark);
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gold-display {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(212,160,23,0.3);
    padding: 4px 10px;
    border-radius: 1px;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: var(--gold-bright);
    flex-shrink: 0;
  }

  .btn-header-save {
    padding: 6px 12px;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 1px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-header-save-quick {
    background: rgba(212,160,23,0.06);
    border: 1px solid rgba(90,74,32,0.5);
    color: var(--parchment-dark);
  }
  .btn-header-save-quick.saved {
    background: rgba(109,191,109,0.15);
    border-color: #6dbf6d;
    color: #6dbf6d;
  }
  .btn-header-save-slots {
    background: rgba(212,160,23,0.06);
    border: 1px solid var(--slot-border);
    color: var(--gold);
  }
  .btn-header-save-slots:hover { border-color: var(--gold); }
  .btn-header-new {
    background: transparent;
    border: 1px solid rgba(139,26,26,0.4);
    color: rgba(139,26,26,0.7);
  }
  .btn-header-new:hover { border-color: var(--blood-bright); color: var(--blood-bright); }

  .btn-action {
    background: linear-gradient(180deg, rgba(30,60,20,0.9), rgba(15,35,10,1));
    border: 1px solid #4a8a3a;
    color: #6dbf6d;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 1px;
    transition: all 0.2s;
    padding: 8px 16px;
  }
  .btn-action:hover:not(:disabled) {
    background: linear-gradient(180deg, rgba(50,90,35,0.9), rgba(30,60,20,1));
    box-shadow: 0 0 10px rgba(109,191,109,0.15);
    color: #8fdf8f;
  }
  .btn-action:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-reset {
    background: transparent;
    border: 1px solid rgba(139,26,26,0.4);
    color: rgba(139,26,26,0.7);
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 2px;
    padding: 6px 12px;
    cursor: pointer;
    margin-left: 12px;
    transition: all 0.2s;
    border-radius: 1px;
  }

  .btn-reset:hover {
    border-color: var(--blood-bright);
    color: var(--blood-bright);
  }

  /* ── Sheet Grid ── */
  .sheet-grid {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 16px;
  }

  @media (max-width: 640px) {
    .sheet-grid { grid-template-columns: 1fr; }
  }

  /* ── Panel ── */
  .panel {
    background: linear-gradient(160deg, #1a1407 0%, #110d05 100%);
    border: 1px solid var(--slot-border);
    border-radius: 1px;
    overflow: hidden;
  }

  .panel-header {
    background: linear-gradient(90deg, rgba(212,160,23,0.08) 0%, transparent 100%);
    border-bottom: 1px solid var(--slot-border);
    padding: 10px 16px;
    font-family: 'Cinzel', serif;
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--parchment-dark);
  }

  .panel-body { padding: 16px; }

  /* ── Stats Panel ── */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-block {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(90,74,32,0.4);
    padding: 10px 12px;
    border-radius: 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    position: relative;
    transition: all 0.2s;
  }

  .stat-block.primary {
    border-color: rgba(212,160,23,0.3);
    background: rgba(212,160,23,0.04);
  }

  .stat-label {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--parchment-dark);
  }

  .stat-value {
    font-family: 'Cinzel Decorative', serif;
    font-size: 22px;
    color: var(--parchment-light);
    line-height: 1;
  }

  .stat-block.primary .stat-value {
    color: var(--gold-bright);
    text-shadow: 0 0 8px rgba(212,160,23,0.3);
  }

  /* ── Health ── */
  .health-section { margin-bottom: 16px; }

  .health-bar-bg {
    height: 10px;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(139,26,26,0.3);
    border-radius: 1px;
    overflow: hidden;
    margin-top: 6px;
  }

  .health-bar-fill {
    height: 100%;
    transition: width 0.4s ease;
    background: linear-gradient(90deg, #5a0a0a 0%, #8b1a1a 50%, #c0392b 100%);
    box-shadow: 0 0 8px rgba(192,57,43,0.4);
  }

  .health-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }

  .health-label {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--parchment-dark);
    text-transform: uppercase;
  }

  .health-numbers {
    font-family: 'Cinzel Decorative', serif;
    font-size: 18px;
    color: var(--blood-bright);
    text-shadow: 0 0 8px rgba(192,57,43,0.3);
  }

  .health-btn-row {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  .health-input {
    flex: 1;
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--slot-border);
    color: var(--parchment-light);
    padding: 6px 10px;
    font-family: 'Crimson Text', serif;
    font-size: 16px;
    text-align: center;
    outline: none;
    border-radius: 1px;
    width: 60px;
  }

  .health-input:focus { border-color: var(--gold); }

  .btn-health {
    flex: 1;
    padding: 6px 10px;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 1px;
    transition: all 0.2s;
    border: 1px solid;
  }

  .btn-heal {
    background: rgba(20,60,20,0.4);
    border-color: rgba(40,120,40,0.4);
    color: #6dbf6d;
  }

  .btn-heal:hover { background: rgba(20,60,20,0.7); border-color: #6dbf6d; }

  .btn-damage {
    background: rgba(60,10,10,0.4);
    border-color: rgba(139,26,26,0.5);
    color: #c0392b;
  }

  .btn-damage:hover { background: rgba(80,10,10,0.7); border-color: #c0392b; }

  /* ── Paperdoll ── */
  /* Scale factor 1.5×: layout 300→450, height 390→585 */
  .paperdoll-layout {
    position: relative;
    width: 450px;
    height: 585px;
    flex-shrink: 0;
    transform-origin: top center;
  }

  /* Container needs explicit height so it doesn't collapse when layout is scaled */
  .paperdoll-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    max-width: 100%;
    /* Height = layout height × scale. Default scale = 1, so 585px */
    min-height: 585px;
    padding: 16px 8px 20px;
    background:
      radial-gradient(ellipse at 50% 40%, rgba(180,140,60,0.07) 0%, transparent 70%),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 18px,
        rgba(180,140,60,0.018) 18px,
        rgba(180,140,60,0.018) 19px
      ),
      linear-gradient(180deg, rgba(20,14,4,0.0) 0%, rgba(10,7,2,0.3) 100%);
    border-bottom: 1px solid rgba(90,74,32,0.25);
    overflow: hidden;
  }

  .paperdoll-figure {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    user-select: none;
    opacity: 0.2;
    filter: sepia(0.2) brightness(1.2);
  }

  .paperdoll-connectors {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: visible;
  }

  /* Slot size 58→87px (×1.5) */
  .eq-slot {
    position: absolute;
    width: 87px;
    height: 87px;
    background: linear-gradient(145deg, rgba(12,9,3,0.88), rgba(8,6,2,0.95));
    border: 1px solid var(--slot-border);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03);
  }

  .eq-slot:hover {
    border-color: var(--gold);
    background: linear-gradient(145deg, rgba(30,22,6,0.9), rgba(20,15,4,0.95));
    z-index: 10;
    box-shadow: 0 0 16px rgba(212,160,23,0.2), 0 2px 8px rgba(0,0,0,0.6);
  }

  .eq-slot.equipped {
    border-color: rgba(212,160,23,0.6);
    background: linear-gradient(145deg, rgba(25,18,4,0.9), rgba(12,9,2,0.95));
    box-shadow: 0 0 10px rgba(212,160,23,0.12), 0 2px 8px rgba(0,0,0,0.5);
  }

  .eq-slot.equipped:hover {
    border-color: var(--blood-bright);
    background: linear-gradient(145deg, rgba(35,8,8,0.9), rgba(20,5,5,0.95));
    box-shadow: 0 0 14px rgba(192,57,43,0.2), 0 2px 8px rgba(0,0,0,0.6);
  }

  .slot-icon { font-size: 28px; line-height: 1; }
  .slot-name {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 1px;
    color: var(--parchment-dark);
    text-transform: uppercase;
    margin-top: 4px;
    text-align: center;
    padding: 0 4px;
  }

  .slot-item-name {
    font-size: 10px;
    color: var(--gold);
    text-align: center;
    padding: 0 4px;
    line-height: 1.2;
    max-height: 36px;
    overflow: hidden;
  }

  /* Slot positions ×1.5
     Left col:  left 8→12px,  tops: 20→30, 110→165, 200→300, 290→435
     Center:    tops: 4→6, 94→141, 310→465, margin-left: -29→-44px
     Right col: right 8→12px, tops: 20→30, 110→165, 200→300, 290→435  */
  .slot-cloak   { top:  30px; left:  12px; }
  .slot-gloves  { top: 165px; left:  12px; }
  .slot-main    { top: 300px; left:  12px; }
  .slot-ring1   { top: 435px; left:  12px; }
  .slot-head    { top:   6px; left: 50%; margin-left: -44px; }
  .slot-chest   { top: 141px; left: 50%; margin-left: -44px; }
  .slot-feet    { top: 465px; left: 50%; margin-left: -44px; }
  .slot-neck    { top:  30px; right: 12px; }
  .slot-talisman{ top: 165px; right: 12px; }
  .slot-off     { top: 300px; right: 12px; }
  .slot-ring2   { top: 435px; right: 12px; }

  /* ── Tooltip ── */
  .slot-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #1a1208;
    border: 1px solid var(--gold);
    padding: 8px 12px;
    min-width: 140px;
    max-width: 200px;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8);
  }

  .tooltip-name {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .tooltip-stats {
    font-size: 12px;
    color: var(--parchment-light);
    line-height: 1.6;
  }

  .tooltip-stat-line { display: flex; justify-content: space-between; gap: 8px; }
  .tooltip-stat-key { color: var(--parchment-dark); font-size: 11px; }
  .tooltip-ability {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid rgba(90,74,32,0.3);
    font-size: 11px;
    color: var(--parchment);
    font-style: italic;
    line-height: 1.4;
  }
  .tooltip-ability-type {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--blood-bright);
    font-style: normal;
    text-transform: uppercase;
  }

  /* ── Backpack ── */
  .backpack-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    padding: 12px 16px 16px;
  }

  .backpack-slot {
    width: 52px;
    height: 52px;
    background: var(--slot-bg);
    border: 1px solid rgba(90,74,32,0.3);
    border-style: dashed;
    border-radius: 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .backpack-slot:hover { border-color: var(--gold); background: var(--slot-hover); border-style: solid; }
  .backpack-slot.filled { border-style: solid; border-color: rgba(212,160,23,0.4); background: rgba(212,160,23,0.05); }

  /* ── Item Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(2px);
  }

  .modal-panel {
    width: 100%;
    max-width: 440px;
    background: linear-gradient(160deg, #1e1608 0%, #120e06 100%);
    border: 1px solid var(--gold);
    border-radius: 1px;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,160,23,0.1);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: rgba(212,160,23,0.06);
    border-bottom: 1px solid var(--slot-border);
  }

  .modal-title {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--parchment-dark);
  }

  .btn-close {
    background: transparent;
    border: 1px solid rgba(90,74,32,0.4);
    color: var(--parchment-dark);
    width: 28px;
    height: 28px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    border-radius: 1px;
  }

  .btn-close:hover { border-color: var(--blood-bright); color: var(--blood-bright); }

  .modal-body { padding: 16px 20px; overflow-y: auto; flex: 1; }

  .modal-search {
    width: 100%;
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--slot-border);
    color: var(--parchment-light);
    padding: 10px 14px;
    font-family: 'Crimson Text', serif;
    font-size: 16px;
    outline: none;
    border-radius: 1px;
    margin-bottom: 12px;
  }

  .modal-search:focus { border-color: var(--gold); }
  .modal-search::placeholder { color: rgba(139,105,20,0.4); }

  .item-list { display: flex; flex-direction: column; gap: 6px; max-height: 340px; overflow-y: auto; }

  .item-row {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(90,74,32,0.3);
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 1px;
  }

  .item-row:hover { border-color: var(--gold); background: var(--slot-hover); }

  .item-row-name {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: var(--parchment-light);
    margin-bottom: 2px;
  }

  .item-row-stats {
    font-size: 12px;
    color: var(--parchment-dark);
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .stat-chip {
    color: var(--gold);
    font-size: 11px;
  }

  .item-row-ability {
    font-size: 11px;
    color: var(--blood-bright);
    font-style: italic;
    margin-top: 3px;
  }

  .btn-unequip {
    width: 100%;
    background: rgba(80,10,10,0.3);
    border: 1px solid rgba(139,26,26,0.4);
    color: var(--blood-bright);
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 2px;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 12px;
    transition: all 0.2s;
    border-radius: 1px;
  }

  .btn-unequip:hover { background: rgba(80,10,10,0.6); border-color: var(--blood-bright); }

  .divider {
    border: none;
    border-top: 1px solid rgba(90,74,32,0.3);
    margin: 12px 0;
  }

  /* ── Gold Edit ── */
  .gold-edit-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .gold-input {
    flex: 1;
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--slot-border);
    color: var(--gold-bright);
    padding: 6px 12px;
    font-family: 'Cinzel Decorative', serif;
    font-size: 16px;
    text-align: center;
    outline: none;
    border-radius: 1px;
    width: 80px;
  }

  .gold-input:focus { border-color: var(--gold); }

  .btn-gold {
    background: rgba(30,20,5,0.6);
    border: 1px solid rgba(212,160,23,0.3);
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-size: 11px;
    padding: 7px 14px;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 1px;
  }

  .btn-gold:hover { border-color: var(--gold-bright); color: var(--gold-bright); }

  .empty-slot-hint {
    font-size: 11px;
    color: rgba(90,74,32,0.4);
    font-style: italic;
    text-align: center;
    padding: 16px 0;
  }

  textarea { color-scheme: dark; }

  /* ── Combat ── */
  .combat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  @media (max-width: 600px) { .combat-grid { grid-template-columns: 1fr; } }

  .combatant-card {
    background: rgba(0,0,0,0.35);
    border: 1px solid var(--slot-border);
    border-radius: 1px;
    padding: 12px 14px;
  }
  .combatant-card.hero-card { border-color: rgba(212,160,23,0.4); }
  .combatant-card.foe-card  { border-color: rgba(139,26,26,0.4); }

  .combatant-label {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .hero-card .combatant-label  { color: var(--gold); }
  .foe-card  .combatant-label  { color: var(--blood-bright); }

  .combat-stat-row {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .combat-stat-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
    min-width: 48px;
  }

  .combat-stat-input label {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--parchment-dark);
    text-transform: uppercase;
  }

  .combat-stat-input input {
    width: 100%;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(90,74,32,0.5);
    color: var(--parchment-light);
    font-family: 'Cinzel Decorative', serif;
    font-size: 20px;
    text-align: center;
    padding: 4px 2px;
    outline: none;
    border-radius: 1px;
    transition: border-color 0.2s;
  }
  .combat-stat-input input:focus { border-color: var(--gold); }

  .hp-bar-mini {
    height: 6px;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(139,26,26,0.3);
    border-radius: 1px;
    overflow: hidden;
    margin-top: 4px;
  }
  .hp-bar-mini-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
  .hero-card .hp-bar-mini-fill { background: linear-gradient(90deg,#5a0a0a,#8b1a1a,#c0392b); }
  .foe-card  .hp-bar-mini-fill { background: linear-gradient(90deg,#3a0808,#700000,#a00000); }

  .foe-input {
    width: 100%;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(90,74,32,0.5);
    color: var(--parchment-light);
    padding: 6px 10px;
    font-family: 'Crimson Text', serif;
    font-size: 16px;
    outline: none;
    border-radius: 1px;
    margin-bottom: 8px;
  }
  .foe-input:focus { border-color: var(--gold); }

  .dice-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 10px 0;
    flex-wrap: wrap;
  }

  .die {
    width: 48px;
    height: 48px;
    background: linear-gradient(145deg, #2a1f08, #1a1205);
    border: 2px solid var(--slot-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel Decorative', serif;
    font-size: 22px;
    color: var(--parchment-light);
    transition: all 0.15s;
    cursor: default;
    user-select: none;
  }
  .die.rolling {
    animation: dieRoll 0.4s ease-out;
    border-color: var(--gold);
    color: var(--gold-bright);
  }
  .die.six {
    border-color: var(--gold-bright);
    color: var(--gold-bright);
    box-shadow: 0 0 8px rgba(212,160,23,0.3);
  }
  .die.interactive {
    cursor: pointer;
    border-color: rgba(212,160,23,0.7);
    animation: diePulse 1s ease-in-out infinite;
  }
  .die.interactive:hover {
    border-color: var(--gold-bright);
    background: linear-gradient(145deg, #3a2f10, #2a1f08);
    transform: scale(1.15);
    box-shadow: 0 0 12px rgba(212,160,23,0.5);
  }
  .die.interactive-foe {
    cursor: pointer;
    border-color: rgba(192,57,43,0.7);
    animation: diePulseFoe 1s ease-in-out infinite;
  }
  .die.interactive-foe:hover {
    border-color: var(--blood-bright);
    background: linear-gradient(145deg, #3a1010, #2a0808);
    transform: scale(1.15);
    box-shadow: 0 0 12px rgba(192,57,43,0.5);
  }
  .die.selected-for-swap {
    border-color: #4a9eff;
    background: linear-gradient(145deg, #102040, #081828);
    box-shadow: 0 0 12px rgba(74,158,255,0.5);
  }
  .die.selected-for-feint {
    border-color: var(--gold-bright);
    background: linear-gradient(145deg, #3a2f10, #2a1f08);
    box-shadow: 0 0 10px rgba(212,160,23,0.4);
    opacity: 1;
  }
  .die.deselected-for-feint {
    opacity: 0.45;
    cursor: pointer;
  }
  .die.interactive-damage {
    cursor: pointer;
    border-color: rgba(192,57,43,0.7);
    animation: diePulseFoe 1s ease-in-out infinite;
  }
  .die.interactive-damage:hover {
    border-color: var(--blood-bright);
    transform: scale(1.15);
    box-shadow: 0 0 12px rgba(192,57,43,0.5);
  }
  @keyframes diePulse {
    0%,100% { box-shadow: 0 0 4px rgba(212,160,23,0.3); }
    50%      { box-shadow: 0 0 14px rgba(212,160,23,0.7); }
  }
  @keyframes diePulseFoe {
    0%,100% { box-shadow: 0 0 4px rgba(192,57,43,0.3); }
    50%      { box-shadow: 0 0 14px rgba(192,57,43,0.6); }
  }

  @keyframes dieRoll {
    0%   { transform: rotate(-15deg) scale(0.9); opacity:0.5; }
    50%  { transform: rotate(8deg)  scale(1.1); opacity:1; }
    100% { transform: rotate(0deg)  scale(1);   opacity:1; }
  }

  .btn-roll {
    flex: 1;
    padding: 12px;
    background: linear-gradient(180deg, rgba(40,30,8,0.8), rgba(20,15,4,0.9));
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 1px;
    transition: all 0.2s;
  }
  .btn-roll:hover:not(:disabled) {
    background: linear-gradient(180deg, rgba(60,45,10,0.9), rgba(40,30,8,1));
    box-shadow: 0 0 12px rgba(212,160,23,0.2);
    color: var(--gold-bright);
  }
  .btn-roll:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-roll-blood {
    flex: 1;
    padding: 12px;
    background: linear-gradient(180deg, rgba(50,8,8,0.8), rgba(30,5,5,0.9));
    border: 1px solid var(--blood-bright);
    color: var(--blood-bright);
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 1px;
    transition: all 0.2s;
  }
  .btn-roll-blood:hover:not(:disabled) {
    background: linear-gradient(180deg, rgba(80,10,10,0.9), rgba(50,8,8,1));
    box-shadow: 0 0 10px rgba(192,57,43,0.2);
  }
  .btn-roll-blood:disabled { opacity: 0.35; cursor: not-allowed; }

  .combat-phase-header {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--parchment-dark);
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(90,74,32,0.25);
  }

  .combat-result-banner {
    padding: 12px 16px;
    border-radius: 1px;
    font-family: 'Cinzel', serif;
    font-size: 15px;
    letter-spacing: 1px;
    text-align: center;
    margin: 8px 0;
  }
  .result-hero   { background: rgba(212,160,23,0.08); border: 1px solid rgba(212,160,23,0.4); color: var(--gold); }
  .result-foe    { background: rgba(139,26,26,0.08);  border: 1px solid rgba(139,26,26,0.4);  color: var(--blood-bright); }
  .result-tie    { background: rgba(60,50,20,0.08);   border: 1px solid rgba(90,74,32,0.4);   color: var(--parchment-dark); }
  .result-victory { background: rgba(20,80,20,0.1);  border: 1px solid rgba(40,160,40,0.4);  color: #6dbf6d; }
  .result-defeat  { background: rgba(80,10,10,0.1);  border: 1px solid rgba(139,26,26,0.5);  color: var(--blood-bright); }

  .combat-log {
    max-height: 320px;
    overflow-y: auto;
    padding: 10px 12px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(90,74,32,0.25);
    border-radius: 1px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .log-entry {
    font-size: 20px;
    line-height: 1.5;
    padding: 4px 0;
    border-bottom: 1px solid rgba(90,74,32,0.1);
    color: var(--parchment-light);
  }
  .log-entry:last-child { border-bottom: none; }
  .log-round  { font-family: 'Cinzel',serif; font-size:14px; color:var(--parchment-dark); letter-spacing:2px; text-transform:uppercase; padding-top:6px; }
  .log-roll   { color: var(--parchment); }
  .log-hit    { color: var(--blood-bright); }
  .log-heal   { color: #6dbf6d; }
  .log-passive{ color: #cc8800; }
  .log-win    { color: var(--gold); font-family:'Cinzel',serif; font-size:16px; }

  .passive-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 1px;
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 2px 2px 2px 0;
    cursor: pointer;
    transition: all 0.15s;
  }
  .passive-tag.active   { background: rgba(204,136,0,0.15); border: 1px solid rgba(204,136,0,0.5); color: #cc8800; }
  .passive-tag.inactive { background: rgba(0,0,0,0.3); border: 1px solid rgba(90,74,32,0.3); color: var(--parchment-dark); }

  /* ── Challenge Test ── */
  .challenge-panel {
    max-width: 480px;
    margin: 0 auto;
  }
  .challenge-result-num {
    font-family: 'Cinzel Decorative', serif;
    font-size: 48px;
    text-align: center;
    line-height: 1;
    margin: 16px 0 8px;
  }
  .challenge-vs {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--parchment-dark);
    text-align: center;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
  ::-webkit-scrollbar-thumb { background: var(--slot-border); border-radius: 2px; }

  /* ── Viewport safeguard — caps layout to physical screen even if viewport meta fires late ── */
  .app      { max-width: 100vw; }
  .main-layout { max-width: min(900px, 100vw); }
  .tab-bar  { max-width: 100%; }
  .sheet-grid, .panel, .panel-body { max-width: 100%; }

  /* ── Mobile Breakpoints ── */
  @media (max-width: 640px) {
    .main-layout { padding: 8px; gap: 10px; }

    /* Header — two-row layout scales naturally, just tighten padding */
    .app-header { padding: 8px 12px; gap: 4px; }
    .hero-name-display { font-size: 16px; }
    .hero-class-display { font-size: 10px; letter-spacing: 1px; }
    .gold-display { padding: 4px 8px; font-size: 12px; }
    .btn-header-save { padding: 5px 9px; font-size: 9px; }

    /* Tab bar — scrollable, large enough to tap */
    .tab-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; gap: 0; padding-bottom: 2px; }
    .tab-bar::-webkit-scrollbar { height: 2px; }
    /* Mobile tabs: equal-width flex, compressed font so all 6 fit on ~360px without scrolling */
    .tab-btn {
      padding: 9px 6px !important;
      font-size: 9px !important;
      letter-spacing: 0.5px !important;
      white-space: nowrap;
      flex: 1 1 0 !important;   /* equal width, all 6 share the row */
      min-width: 0 !important;
    }

    /* Sheet grid → single column */

    /* Paperdoll — transform scale keeps all absolute slot positions valid.
       Available width ≈ screen - 16px padding = ~344px. Scale = 344/450 ≈ 0.765.
       Container min-height = 585 × 0.765 ≈ 448px to avoid collapse. */
    .paperdoll-layout {
      transform: scale(0.765) !important;
      transform-origin: top center !important;
      width: 450px !important;
      height: 585px !important;
    }
    .paperdoll-container { min-height: 448px !important; padding: 8px 4px 12px !important; }

    /* Stats grid */
    .stat-value { font-size: 20px !important; }
    .stat-label { font-size: 10px !important; }

    /* Health — keep readable, don't shrink */
    .health-numbers { font-size: 18px !important; }
    .health-btn-row { gap: 5px; }
    .btn-health { font-size: 12px !important; padding: 6px 8px !important; }
    .health-input { width: 54px !important; font-size: 16px !important; }

    /* Panel */
    .panel-body { padding: 10px; }
    .panel-header { font-size: 12px; padding: 8px 12px; letter-spacing: 2px; }

    /* Combat — keep stat numbers large for readability */
    .combat-stat-row { gap: 4px !important; }
    .combat-stat-input input { width: 48px !important; font-size: 18px !important; }
    .combat-stat-input label { font-size: 10px !important; }
    .foe-input { font-size: 14px !important; }

    /* Dice — keep large for tap targets and readability */
    .dice-row { gap: 8px !important; flex-wrap: wrap; }
    .die { width: 48px !important; height: 48px !important; font-size: 22px !important; min-width: 48px; min-height: 48px; }

    /* Roll buttons */
    .btn-roll { font-size: 13px !important; padding: 12px !important; }
    .btn-roll-blood { font-size: 13px !important; padding: 12px !important; }

    /* Combat phase / result */
    .combat-phase-header { font-size: 13px !important; }
    .combat-result-banner { font-size: 14px !important; }

    /* Combat log — keep at 20px, just ensure it scrolls well */
    .combat-log { max-height: 280px; }
    .log-entry { font-size: 18px !important; }
    .log-round { font-size: 13px !important; }
    .log-win { font-size: 15px !important; }

    /* Modals */
    .modal-overlay { padding: 8px !important; }
    .modal-panel { max-width: 100% !important; max-height: 90vh; }
    .modal-body { padding: 12px !important; }

    /* Backpack */
    .backpack-row { gap: 5px !important; }
    .backpack-slot { width: 52px !important; height: 52px !important; min-width: 48px; min-height: 48px; }

    /* Notes textarea */
    textarea { font-size: 16px !important; }

    /* Passive tags */
    .passive-tag { font-size: 11px !important; padding: 4px 10px !important; }

    /* Slot positions rescale automatically via paperdoll-layout scale */
  }

  @media (max-width: 400px) {
    /* Narrow phones ≈ 320px usable. Scale = 320/450 ≈ 0.71. Height = 585 × 0.71 ≈ 415px */
    .paperdoll-layout {
      transform: scale(0.71) !important;
      transform-origin: top center !important;
      width: 450px !important;
      height: 585px !important;
    }
    .paperdoll-container { min-height: 415px !important; }
    .hero-name-display { font-size: 14px; }
    /* On very narrow screens keep log slightly smaller to fit more entries */
    .log-entry { font-size: 16px !important; }
    .tab-btn { padding: 8px 4px !important; font-size: 8.5px !important; letter-spacing: 0px !important; }
  }

  /* ── Tap Tooltip overlay (mobile ability descriptions) ── */
  .tap-tip-overlay {
    position: fixed;
    inset: 0;
    z-index: 9000;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0 12px 24px;
    animation: tapTipFade 0.14s ease;
  }
  @keyframes tapTipFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .tap-tip-box {
    background: linear-gradient(160deg,#1e1608,#120e06);
    border: 1px solid var(--slot-border);
    border-radius: 2px;
    padding: 18px 20px 14px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 -4px 40px rgba(0,0,0,0.7);
  }
  .tap-tip-name {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: var(--gold);
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .tap-tip-type {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--parchment-dark);
    margin-bottom: 8px;
  }
  .tap-tip-desc {
    font-family: 'Crimson Text', serif;
    font-size: 16px;
    color: var(--parchment-light);
    line-height: 1.6;
  }
  .tap-tip-close {
    margin-top: 14px;
    width: 100%;
    padding: 10px;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(90,74,32,0.4);
    color: var(--parchment-dark);
    cursor: pointer;
    border-radius: 1px;
  }
`;

// ─── Tap Tooltip component ─────────────────────────────────────────────────────
// On desktop, native `title` tooltips appear on hover.
// On mobile/touch, `title` never shows. This overlay appears on long-press (500ms)
// or double-tap of any ability button.
function TapTooltipOverlay({ name, typeLabel, desc, onClose }) {
  return (
    <div className="tap-tip-overlay" onPointerDown={onClose}>
      <div className="tap-tip-box" onPointerDown={e=>e.stopPropagation()}>
        {typeLabel && <div className="tap-tip-type">{typeLabel}</div>}
        <div className="tap-tip-name">{name}</div>
        <div className="tap-tip-desc">{desc || 'No description available.'}</div>
        <button className="tap-tip-close" onClick={onClose}>✕ Dismiss</button>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Per book rules: ALL heroes start with 0 in all attributes and 30 health.
// Class determines which attribute the player focuses on building — not starting values.
// Per book rules (Player Guide): Warrior +15H, Mage +10H, Rogue +5H on top of base 30
const CLASS_DEFAULTS = {
  // All heroes start at 30 health per the rules.
  // Path health bonuses (Warrior +15, Mage +10, Rogue +5) are applied when
  // the player selects their base career in the Abilities tab.
  warrior: { speed: 0, brawn: 0, magic: 0, armour: 0, health: 30, maxHealth: 30 },
  mage:    { speed: 0, brawn: 0, magic: 0, armour: 0, health: 30, maxHealth: 30 },
  rogue:   { speed: 0, brawn: 0, magic: 0, armour: 0, health: 30, maxHealth: 30 },
};

const CLASS_INFO = {
  warrior: { label: "Warrior", main: "Brawn" },
  mage:    { label: "Mage",    main: "Magic" },
  rogue:   { label: "Rogue",   main: "Speed" },
};

// ─── Career Data (Legion of Shadow — Book 1) ─────────────────────────────────
// Each career grants specific abilities automatically when selected.
// abilities[] entries match names in ABILITY_DB for tooltip lookup.
const CAREER_DATA = {
  // ── Warrior path ──────────────────────────────────────────────────────────
  Warrior: {
    path: 'warrior',
    healthBonus: 15,  // 30 base + 15 = 45 total (applied when career is selected)
    abilities: [],
    hint: '+15 Health (warrior path bonus)',
  },
  Gladiator: {
    path: 'warrior',
    healthBonus: 0,
    abilities: [
      { name: 'Blood Rage',  type: 'mo' },
      { name: 'Head butt',   type: 'co' },
    ],
    hint: 'Blood Rage (mo), Head butt (co)',
  },
  Berserker: {
    path: 'warrior',
    healthBonus: 0,
    abilities: [
      { name: 'Seeing Red',    type: 'pa' },
      { name: 'Raining Blows', type: 'mo' },
    ],
    hint: 'Seeing Red (pa), Raining Blows (mo)',
  },
  Ranger: {
    path: 'warrior',
    healthBonus: 0,
    abilities: [
      { name: "Lay of the Land",  type: 'sp' },
      { name: "Nature's Revenge", type: 'co' },
    ],
    hint: "Lay of the Land (sp), Nature's Revenge (co)",
  },
  Cavalier: {
    path: 'warrior',
    healthBonus: 0,
    abilities: [
      { name: 'Shield Spin', type: 'pa' },
      { name: 'Shield Wall', type: 'co' },
    ],
    hint: 'Shield Spin (pa), Shield Wall (co) — requires shield',
  },
  'Shadow Ranger': {
    path: 'warrior',
    healthBonus: 0,
    abilities: [
      { name: 'Black Rain',  type: 'co' },
      { name: 'Thorn Fist',  type: 'co' },
    ],
    hint: 'Black Rain (co), Thorn Fist (co)',
  },
  Inquisitor: {
    path: 'warrior',
    healthBonus: 0,
    abilities: [
      { name: 'Cleansing Light', type: 'pa' },
      { name: 'Avenging Spirit', type: 'co' },
    ],
    hint: 'Cleansing Light (pa), Avenging Spirit (co)',
  },
  // ── Mage path ─────────────────────────────────────────────────────────────
  Mage: {
    path: 'mage',
    healthBonus: 10,  // 30 base + 10 = 40 total (applied when career is selected)
    abilities: [],
    hint: '+10 Health (mage path bonus)',
  },
  Alchemist: {
    path: 'mage',
    healthBonus: 0,
    abilities: [
      { name: 'Good Taste',   type: 'pa' },
      { name: 'Midas Touch',  type: 'pa' },
    ],
    hint: 'Good Taste (pa), Midas Touch (pa)',
  },
  Pyromancer: {
    path: 'mage',
    healthBonus: 0,
    abilities: [
      { name: 'Ignite', type: 'co' },
      { name: 'Burn',   type: 'pa' },
    ],
    hint: 'Ignite (co), Burn (pa)',
  },
  Medic: {
    path: 'mage',
    healthBonus: 0,
    abilities: [
      { name: 'Mend',        type: 'mo' },
      { name: 'Tourniquet',  type: 'mo' },
    ],
    hint: 'Mend (mo), Tourniquet (mo)',
  },
  Icelock: {
    path: 'mage',
    healthBonus: 0,
    abilities: [
      { name: 'Ice Shards',  type: 'co' },
      { name: 'Ice Shield',  type: 'mo' },
    ],
    hint: 'Ice Shards (co), Ice Shield (mo)',
  },
  Necromancer: {
    path: 'mage',
    healthBonus: 0,
    abilities: [
      { name: 'Shades',    type: 'pa' },
      { name: 'Sacrifice', type: 'co' },
    ],
    hint: 'Shades (pa), Sacrifice (co)',
  },
  // ── Rogue path ─────────────────────────────────────────────────────────────
  Rogue: {
    path: 'rogue',
    healthBonus: 5,   // 30 base + 5 = 35 total (applied when career is selected)
    abilities: [],
    hint: '+5 Health (rogue path bonus)',
  },
  Pickpocket: {
    path: 'rogue',
    healthBonus: 0,
    abilities: [
      { name: 'Patchwork Pauper', type: 'pa' },
      { name: 'Loot Master',      type: 'pa' },
    ],
    hint: 'Patchwork Pauper (pa), Loot Master (pa)',
  },
  Witchfinder: {
    path: 'rogue',
    healthBonus: 0,
    abilities: [
      { name: 'Judgement',  type: 'co' },
      { name: 'Execution',  type: 'sp' },
    ],
    hint: 'Judgement (co), Execution (sp) — requires sword',
  },
  Assassin: {
    path: 'rogue',
    healthBonus: 0,
    abilities: [
      { name: 'First Strike',    type: 'pa' },
      { name: 'Deadly Poisons',  type: 'pa' },
    ],
    hint: 'First Strike (pa), Deadly Poisons (pa) — requires dagger',
  },
  Shadowstalker: {
    path: 'rogue',
    healthBonus: 0,
    abilities: [
      { name: 'Shadow Speed', type: 'mo' },
      { name: 'Shadow Fury',  type: 'co' },
    ],
    hint: 'Shadow Speed (mo), Shadow Fury (co)',
  },
  Swordsmaster: {
    path: 'rogue',
    healthBonus: 0,
    abilities: [
      { name: 'Swift Strikes',   type: 'pa' },
      { name: 'Ambidextrous',    type: 'pa' },
    ],
    hint: 'Swift Strikes (pa), Ambidextrous (pa) — requires swords',
  },
};

// ─── Book & Quest Data ────────────────────────────────────────────────────────
// Quests are empty by default — players add them via "+ Add Quest" in the Quests tab.
const BOOKS = [
  {
    id: 'los',
    title: 'The Legion of Shadow',
    subtitle: 'Book 1',
    careers: Object.keys(CAREER_DATA),
    acts: [
      { label: 'Act 1 — Tithebury Cross',       quests: [] },
      { label: 'Act 2 — Mistwood & Black Marsh', quests: [] },
      { label: 'Act 3 — The Bone Fields',        quests: [] },
    ]
  },
  {
    id: 'hof',
    title: 'The Heart of Fire',
    subtitle: 'Book 2',
    careers: [
      'Warrior','Brigand','Ranger','Drake','Inquisitor',
      'Mage','Pariah','Druid','Runecaster','Acolyte',
      'Rogue','Thief','Venommancer','Pilgrim','Monk',
    ],
    acts: [
      { label: 'Act 1 — Fenstone Moors', quests: [] },
      { label: 'Act 2 — Terral Jungle',  quests: [] },
      { label: 'Act 3 — Tartarus',       quests: [] },
    ]
  },
  {
    id: 'eowf',
    title: "The Eye of Winter's Fury",
    subtitle: 'Book 3',
    careers: [
      'Warrior','Skald','Shieldmaiden','Warden','Berserker',
      'Mage','Stormcaller','Sentinel','Arcanist',
      'Rogue','Trickster','Corsair','Plague Doctor',
    ],
    acts: [
      { label: 'Act 1 — Skardfall',               quests: [] },
      { label: "Act 2 — North Face & World's End", quests: [] },
      { label: 'Act 3',                            quests: [] },
    ]
  },
  {
    id: 'rods',
    title: 'The Raiders of Dune Sea',
    subtitle: 'Book 4',
    careers: [
      'Warrior','Sentinel','Beastmaster','Dervish','Dark Templar',
      'Mage','Diviner','Aeronaut','Summoner',
      'Rogue','Buccaneer','Tomb Robber','Tick Tock',
    ],
    acts: [
      { label: 'Act 1 — The Badlands', quests: [] },
      { label: 'Act 2 — The Dune Sea',  quests: [] },
      { label: 'Act 3',                 quests: [] },
    ]
  },
  {
    id: 'wor',
    title: 'The Wrath of Ragnarok',
    subtitle: 'Book 5',
    careers: [],
    acts: [
      { label: 'Act 1', quests: [] },
      { label: 'Act 2', quests: [] },
      { label: 'Act 3', quests: [] },
    ]
  },
  {
    id: 'tot',
    title: 'Tides of Terror',
    subtitle: 'Book 6',
    careers: [],
    acts: [
      { label: 'Act 1', quests: [] },
      { label: 'Act 2', quests: [] },
      { label: 'Act 3', quests: [] },
    ]
  },
];

const CLASS_ICONS = {
  warrior: (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="2" x2="16" y2="30"/>
      <line x1="9" y1="11" x2="23" y2="11"/>
      <polygon points="13,2 16,2 19,2 18,10 14,10" fill="currentColor" opacity="0.35"/>
      <rect x="14" y="22" width="4" height="6" rx="1"/>
    </svg>
  ),
  mage: (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="28" x2="16" y2="10"/>
      <circle cx="16" cy="7" r="4"/>
      <path d="M12 7 L4 14 M20 7 L28 14"/>
      <path d="M10 20 Q16 14 22 20"/>
      <circle cx="16" cy="7" r="1.5" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  rogue: (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="28" x2="26" y2="6"/>
      <path d="M26 6 L22 6 L26 10 Z" fill="currentColor" opacity="0.4"/>
      <line x1="9" y1="11" x2="21" y2="23"/>
      <circle cx="7" cy="25" r="2.5"/>
    </svg>
  ),
};

// Slot icons — 3D rendered style: warm bronze/leather, top-lit, volumetric forms
const SLOT_ICONS = {

  // Helm — cylindrical bucket helm, top-lit, viewed slightly from above
  head: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="helmTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c8a96e"/>
          <stop offset="40%" stopColor="#8b6835"/>
          <stop offset="100%" stopColor="#3d2a10"/>
        </linearGradient>
        <linearGradient id="helmSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a1a08"/>
          <stop offset="35%" stopColor="#7a5628"/>
          <stop offset="65%" stopColor="#9a7040"/>
          <stop offset="100%" stopColor="#2e1c08"/>
        </linearGradient>
      </defs>
      {/* Cylinder body */}
      <path d="M6 13 L6 24 Q6 28 16 28 Q26 28 26 24 L26 13 Z" fill="url(#helmSide)"/>
      {/* Rim top ellipse */}
      <ellipse cx="16" cy="13" rx="10" ry="3.5" fill="url(#helmTop)"/>
      {/* Brow ridge */}
      <path d="M6 17 Q16 20 26 17" fill="none" stroke="#c8a96e" strokeWidth="1.2" opacity="0.6"/>
      {/* Visor slot */}
      <path d="M9 19 L23 19 L23 21 Q16 22.5 9 21 Z" fill="#1a0d04" opacity="0.8"/>
      {/* Highlight */}
      <ellipse cx="12" cy="13" rx="3" ry="1.2" fill="white" opacity="0.18"/>
    </svg>
  ),

  // Necklace — teardrop pendant, warm gold, gem highlight
  necklace: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="gemGrad" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#e8c87a"/>
          <stop offset="50%" stopColor="#a07030"/>
          <stop offset="100%" stopColor="#4a2e0e"/>
        </linearGradient>
        <linearGradient id="chainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6a4e20"/>
          <stop offset="50%" stopColor="#c8a060"/>
          <stop offset="100%" stopColor="#6a4e20"/>
        </linearGradient>
      </defs>
      {/* Chain arc */}
      <path d="M8 5 Q16 12 24 5" fill="none" stroke="url(#chainGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Chain drop */}
      <line x1="16" y1="12" x2="16" y2="16" stroke="#b08040" strokeWidth="1.4"/>
      {/* Pendant body */}
      <path d="M16 16 C12 18 10 22 11 25 C12 28 14 30 16 30 C18 30 20 28 21 25 C22 22 20 18 16 16Z" fill="url(#gemGrad)"/>
      {/* Gem highlight */}
      <ellipse cx="14" cy="20" rx="1.5" ry="2.5" fill="white" opacity="0.35" transform="rotate(-15 14 20)"/>
      {/* Rim */}
      <path d="M16 16 C12 18 10 22 11 25 C12 28 14 30 16 30 C18 30 20 28 21 25 C22 22 20 18 16 16Z" fill="none" stroke="#e8c060" strokeWidth="0.6" opacity="0.5"/>
    </svg>
  ),

  // Cloak — hooded cloak draped from above, like the first item in the reference image
  cloak: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="cloakG" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#9a7840"/>
          <stop offset="30%" stopColor="#6a5028"/>
          <stop offset="70%" stopColor="#3d2e14"/>
          <stop offset="100%" stopColor="#1e1508"/>
        </linearGradient>
        <linearGradient id="cloakTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8a060"/>
          <stop offset="100%" stopColor="#5a3e18"/>
        </linearGradient>
      </defs>
      {/* Hood top — lit from above */}
      <path d="M10 4 Q16 2 22 4 Q24 6 24 9 Q22 7 16 7 Q10 7 8 9 Q8 6 10 4Z" fill="url(#cloakTop)"/>
      {/* Hood shadow inside */}
      <path d="M11 7 Q16 9 21 7 Q20 11 16 12 Q12 11 11 7Z" fill="#1a0d04" opacity="0.6"/>
      {/* Main body flowing down */}
      <path d="M8 9 Q4 14 4 20 L5 28 Q10 30 16 30 Q22 30 27 28 L28 20 Q28 14 24 9 Q22 10 16 10 Q10 10 8 9Z" fill="url(#cloakG)"/>
      {/* Left shoulder highlight */}
      <path d="M8 9 Q6 12 5 16 Q7 14 10 13 Q9 11 8 9Z" fill="#b89050" opacity="0.5"/>
      {/* Right shoulder highlight */}
      <path d="M24 9 Q26 12 27 16 Q25 14 22 13 Q23 11 24 9Z" fill="#b89050" opacity="0.4"/>
      {/* Fold lines */}
      <path d="M14 14 Q13 20 12 28" fill="none" stroke="#1e1508" strokeWidth="0.8" opacity="0.5"/>
      <path d="M18 14 Q19 20 20 28" fill="none" stroke="#1e1508" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  ),

  // Chest armour — sculpted pauldrons and breastplate, like 2nd item in reference
  chest: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="chestG" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#c0946a"/>
          <stop offset="40%" stopColor="#7a5432"/>
          <stop offset="100%" stopColor="#2e1c0a"/>
        </linearGradient>
        <linearGradient id="chestMid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a1808"/>
          <stop offset="50%" stopColor="#a07040"/>
          <stop offset="100%" stopColor="#2a1808"/>
        </linearGradient>
      </defs>
      {/* Left pauldron */}
      <path d="M3 8 Q3 5 6 5 L10 5 Q13 5 14 8 L14 14 Q10 15 6 14 Q3 13 3 10Z" fill="url(#chestG)"/>
      <path d="M3 8 Q5 7 9 7 Q12 7 14 8" fill="none" stroke="#d4a860" strokeWidth="0.8" opacity="0.6"/>
      {/* Right pauldron */}
      <path d="M29 8 Q29 5 26 5 L22 5 Q19 5 18 8 L18 14 Q22 15 26 14 Q29 13 29 10Z" fill="url(#chestG)"/>
      <path d="M29 8 Q27 7 23 7 Q20 7 18 8" fill="none" stroke="#d4a860" strokeWidth="0.8" opacity="0.6"/>
      {/* Neck guard */}
      <path d="M13 5 Q16 3 19 5 L18 8 Q16 7 14 8Z" fill="#b08040" opacity="0.8"/>
      {/* Main breastplate */}
      <path d="M6 14 Q6 12 8 12 L14 12 L16 14 L18 12 L24 12 Q26 12 26 14 L26 26 Q26 29 16 29 Q6 29 6 26Z" fill="url(#chestMid)"/>
      {/* Central ridge */}
      <path d="M16 14 L16 28" stroke="#c89050" strokeWidth="0.8" opacity="0.5"/>
      {/* Top highlight */}
      <path d="M8 12 Q16 10 24 12 Q16 14 8 12Z" fill="#d4a060" opacity="0.3"/>
      {/* Breast lines */}
      <path d="M7 18 Q16 20 25 18" fill="none" stroke="#c89050" strokeWidth="0.6" opacity="0.35"/>
      <path d="M7 22 Q16 24 25 22" fill="none" stroke="#c89050" strokeWidth="0.6" opacity="0.25"/>
    </svg>
  ),

  // Gauntlets — articulated leather/metal gloves, like the image
  gloves: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="gloveG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a07848"/>
          <stop offset="50%" stopColor="#6a4e28"/>
          <stop offset="100%" stopColor="#2e1c08"/>
        </linearGradient>
      </defs>
      {/* Cuff */}
      <path d="M5 16 Q5 13 8 13 L24 13 Q27 13 27 16 L27 20 Q27 22 24 22 L8 22 Q5 22 5 20Z" fill="url(#gloveG)"/>
      {/* Cuff top highlight */}
      <path d="M5 16 Q16 14 27 16 Q16 18 5 16Z" fill="#c89050" opacity="0.3"/>
      {/* Finger 1 */}
      <path d="M8 13 Q7 10 8 7 Q10 7 10 10 L10 13Z" fill="#8a6030"/>
      <path d="M9 7 Q10 6 10 7" fill="none" stroke="#c89050" strokeWidth="0.6" opacity="0.6"/>
      {/* Finger 2 */}
      <path d="M11 13 Q10 9 11 6 Q13 6 13 9 L13 13Z" fill="#9a6e38"/>
      <path d="M12 6 Q13 5 13 6" fill="none" stroke="#c89050" strokeWidth="0.6" opacity="0.6"/>
      {/* Finger 3 */}
      <path d="M14 13 Q13 9 14 6 Q16 6 16 9 L16 13Z" fill="#9a6e38"/>
      {/* Finger 4 */}
      <path d="M17 13 Q16 9 17 6 Q19 6 19 9 L19 13Z" fill="#8a6030"/>
      {/* Thumb */}
      <path d="M22 13 Q24 11 25 9 Q27 9 26 12 L24 13Z" fill="#8a6030"/>
      {/* Knuckle highlights */}
      <path d="M8 11 Q12 10 16 11 Q13 12 8 11Z" fill="#c89050" opacity="0.25"/>
      {/* Cuff detail line */}
      <path d="M6 18 L26 18" stroke="#c89050" strokeWidth="0.7" opacity="0.4"/>
    </svg>
  ),

  // Main hand — longsword with detailed hilt, diamond cross-section blade
  mainHand: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="bladeG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6a5020"/>
          <stop offset="40%" stopColor="#e0d0a0"/>
          <stop offset="60%" stopColor="#c0b080"/>
          <stop offset="100%" stopColor="#3a2810"/>
        </linearGradient>
        <linearGradient id="hiltG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a2810"/>
          <stop offset="50%" stopColor="#c89040"/>
          <stop offset="100%" stopColor="#3a2810"/>
        </linearGradient>
      </defs>
      {/* Blade — diamond cross section */}
      <polygon points="16,2 17.2,18 16,19 14.8,18" fill="url(#bladeG)"/>
      {/* Blade edge highlight */}
      <line x1="16" y1="2" x2="16" y2="19" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      {/* Crossguard */}
      <path d="M8 18 Q8 17 9 17 L23 17 Q24 17 24 18 L24 20 Q24 21 23 21 L9 21 Q8 21 8 20Z" fill="url(#hiltG)"/>
      {/* Crossguard highlight */}
      <path d="M8 18 Q16 17 24 18 Q16 19 8 18Z" fill="white" opacity="0.2"/>
      {/* Grip */}
      <path d="M14 21 Q13 21 13 22 L13 27 Q13 28 14 28 L18 28 Q19 28 19 27 L19 22 Q19 21 18 21Z" fill="#5a3818"/>
      {/* Grip wrapping */}
      <line x1="13" y1="23" x2="19" y2="23" stroke="#a07030" strokeWidth="0.8" opacity="0.6"/>
      <line x1="13" y1="25" x2="19" y2="25" stroke="#a07030" strokeWidth="0.8" opacity="0.6"/>
      {/* Pommel */}
      <ellipse cx="16" cy="29.5" rx="3.5" ry="2" fill="url(#hiltG)"/>
      <ellipse cx="15" cy="29" rx="1" ry="0.7" fill="white" opacity="0.2"/>
    </svg>
  ),

  // Left hand — heater shield with visible surface detail
  leftHand: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="shieldG" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#b09060"/>
          <stop offset="40%" stopColor="#7a5830"/>
          <stop offset="100%" stopColor="#2a1808"/>
        </linearGradient>
      </defs>
      {/* Shield body */}
      <path d="M5 4 L27 4 L27 18 Q27 28 16 31 Q5 28 5 18Z" fill="url(#shieldG)"/>
      {/* Surface bevel */}
      <path d="M7 6 L25 6 L25 18 Q25 26 16 29 Q7 26 7 18Z" fill="none" stroke="#c8a050" strokeWidth="0.7" opacity="0.4"/>
      {/* Top surface highlight */}
      <path d="M5 4 L27 4 L25 6 L7 6Z" fill="#d4b070" opacity="0.35"/>
      {/* Left face highlight */}
      <path d="M5 4 L7 6 L7 18 Q7 22 10 26 Q7 22 5 18Z" fill="#c0a060" opacity="0.3"/>
      {/* Boss */}
      <ellipse cx="16" cy="16" rx="5" ry="5" fill="#6a4820" stroke="#c8a050" strokeWidth="0.8"/>
      <ellipse cx="16" cy="16" rx="3" ry="3" fill="#3a2410"/>
      <ellipse cx="14.5" cy="14.5" rx="1.2" ry="1.2" fill="#d4b060" opacity="0.4"/>
    </svg>
  ),

  // Talisman — glowing amulet/orb on a short chain
  talisman: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <radialGradient id="orbG" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f0d890"/>
          <stop offset="50%" stopColor="#c89040"/>
          <stop offset="100%" stopColor="#3a2010"/>
        </radialGradient>
        <linearGradient id="chainG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c8a050"/>
          <stop offset="100%" stopColor="#6a4820"/>
        </linearGradient>
      </defs>
      {/* Chain links */}
      <path d="M16 3 L16 10" stroke="url(#chainG2)" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="16" cy="5" rx="2.5" ry="1.5" fill="none" stroke="#c8a050" strokeWidth="1"/>
      {/* Orb */}
      <circle cx="16" cy="20" r="10" fill="url(#orbG)"/>
      {/* Orb rim */}
      <circle cx="16" cy="20" r="10" fill="none" stroke="#e0c060" strokeWidth="0.8" opacity="0.6"/>
      {/* Highlight */}
      <ellipse cx="12" cy="15" rx="3.5" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 12 15)"/>
      {/* Rune glow centre */}
      <circle cx="16" cy="20" r="3" fill="#ffe080" opacity="0.25"/>
    </svg>
  ),

  // Ring 1 — band with raised faceted gem
  ring1: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a840"/>
          <stop offset="50%" stopColor="#8a5e20"/>
          <stop offset="100%" stopColor="#3a2008"/>
        </linearGradient>
        <linearGradient id="gem1G" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#e8d080"/>
          <stop offset="50%" stopColor="#a07830"/>
          <stop offset="100%" stopColor="#3a2408"/>
        </linearGradient>
      </defs>
      {/* Band */}
      <path d="M10 19 Q10 28 16 28 Q22 28 22 19 Q22 13 16 13 Q10 13 10 19Z" fill="url(#ringG)"/>
      <path d="M13 19 Q13 24 16 24 Q19 24 19 19 Q19 15 16 15 Q13 15 13 19Z" fill="#1a0e04" opacity="0.5"/>
      {/* Band highlight */}
      <path d="M10 19 Q11 16 16 15 Q21 16 22 19 Q20 17 16 17 Q12 17 10 19Z" fill="#e0c060" opacity="0.25"/>
      {/* Gem setting */}
      <path d="M13 13 L16 8 L19 13 L18 13 Q16 11 14 13Z" fill="url(#ringG)"/>
      {/* Gem facets */}
      <polygon points="16,5 20,10 16,12 12,10" fill="url(#gem1G)"/>
      <polygon points="16,5 20,10 16,8" fill="#f0e090" opacity="0.4"/>
      <line x1="16" y1="5" x2="16" y2="12" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  ),

  // Ring 2 — different gem cut (emerald/square)
  ring2: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="ring2G" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8a040"/>
          <stop offset="50%" stopColor="#7a5818"/>
          <stop offset="100%" stopColor="#2e1808"/>
        </linearGradient>
        <linearGradient id="gem2G" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#c0e090"/>
          <stop offset="40%" stopColor="#608040"/>
          <stop offset="100%" stopColor="#1a2e08"/>
        </linearGradient>
      </defs>
      {/* Band */}
      <path d="M10 19 Q10 28 16 28 Q22 28 22 19 Q22 13 16 13 Q10 13 10 19Z" fill="url(#ring2G)"/>
      <path d="M13 19 Q13 24 16 24 Q19 24 19 19 Q19 15 16 15 Q13 15 13 19Z" fill="#180e02" opacity="0.5"/>
      {/* Band highlight */}
      <path d="M10 19 Q11 16 16 15 Q21 16 22 19 Q20 17 16 17 Q12 17 10 19Z" fill="#d4b040" opacity="0.2"/>
      {/* Square gem */}
      <rect x="12" y="4" width="8" height="9" rx="0.5" fill="url(#gem2G)"/>
      {/* Gem inner facet */}
      <rect x="13.5" y="5.5" width="5" height="6" rx="0.3" fill="#90c060" opacity="0.3"/>
      {/* Gem highlight */}
      <path d="M12 4 L20 4 L18 6 L14 6Z" fill="white" opacity="0.25"/>
      {/* Setting prongs */}
      <line x1="12" y1="13" x2="11" y2="13" stroke="#c89040" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="13" x2="21" y2="13" stroke="#c89040" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  // Boots — pair of leather greaves/boots, like the last item in reference image
  feet: (
    <svg viewBox="0 0 32 32" width="24" height="24">
      <defs>
        <linearGradient id="bootG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a07848"/>
          <stop offset="50%" stopColor="#6a4e28"/>
          <stop offset="100%" stopColor="#2a1808"/>
        </linearGradient>
        <linearGradient id="bootTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a2410"/>
          <stop offset="50%" stopColor="#b08040"/>
          <stop offset="100%" stopColor="#3a2410"/>
        </linearGradient>
      </defs>
      {/* Left boot shaft */}
      <path d="M4 5 Q4 3 6 3 L12 3 Q14 3 14 5 L14 18 Q14 20 12 20 L6 20 Q4 20 4 18Z" fill="url(#bootG)"/>
      {/* Left shaft top rim */}
      <ellipse cx="9" cy="5" rx="5" ry="2" fill="url(#bootTop)"/>
      {/* Left boot foot */}
      <path d="M4 18 L4 22 Q4 24 6 24 L16 24 Q18 24 18 22 L18 20 L14 20 L14 18Z" fill="#7a5630"/>
      {/* Left sole */}
      <path d="M3 22 Q3 26 6 26 L17 26 Q20 26 19 23 L18 22Z" fill="#3a2010"/>
      {/* Left highlight */}
      <path d="M4 5 Q6 4 12 4 Q14 4 14 5 Q12 4 6 4Z" fill="white" opacity="0.2"/>

      {/* Right boot shaft */}
      <path d="M18 5 Q18 3 20 3 L26 3 Q28 3 28 5 L28 18 Q28 20 26 20 L20 20 Q18 20 18 18Z" fill="url(#bootG)"/>
      {/* Right shaft top rim */}
      <ellipse cx="23" cy="5" rx="5" ry="2" fill="url(#bootTop)"/>
      {/* Right boot foot */}
      <path d="M18 18 L18 20 L28 20 L28 18 L28 22 Q28 24 26 24 L16 24 Q14 24 14 22 L14 20 L18 20Z" fill="#7a5630"/>
      {/* Right sole */}
      <path d="M13 22 Q14 26 17 26 L27 26 Q29 26 29 23 L28 22Z" fill="#3a2010"/>
      {/* Right highlight */}
      <path d="M18 5 Q20 4 26 4 Q28 4 28 5 Q26 4 20 4Z" fill="white" opacity="0.2"/>
    </svg>
  ),
};

const SLOT_META = {
  head:     { label: "Head" },
  necklace: { label: "Neck" },
  cloak:    { label: "Cloak" },
  chest:    { label: "Chest" },
  gloves:   { label: "Gloves" },
  mainHand: { label: "Main" },
  leftHand: { label: "Off" },
  talisman: { label: "Talisman" },
  ring1:    { label: "Ring 1" },
  ring2:    { label: "Ring 2" },
  feet:     { label: "Feet" },
};

const SLOT_POSITIONS = {
  head:     "slot-head",
  necklace: "slot-neck",
  cloak:    "slot-cloak",
  chest:    "slot-chest",
  gloves:   "slot-gloves",
  mainHand: "slot-main",
  leftHand: "slot-off",
  talisman: "slot-talisman",
  ring1:    "slot-ring1",
  ring2:    "slot-ring2",
  feet:     "slot-feet",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeStats(base, equipment) {
  const totals = { ...base };
  Object.values(equipment).forEach(item => {
    if (!item || !item.stats) return;
    Object.entries(item.stats).forEach(([k, v]) => { totals[k] = (totals[k] || 0) + (parseInt(v) || 0); });
  });
  // maxHealth is never modified by equipment; guard against it being missing
  if (!totals.maxHealth) totals.maxHealth = totals.health || 30;
  return totals;
}

function createHero(name, cls, bookId) {
  return {
    id: crypto.randomUUID(),
    name,
    path: cls,
    bookId: bookId || 'los',
    career: null,
    baseAttributes: { ...CLASS_DEFAULTS[cls] },
    equipment: {
      head: null, chest: null, cloak: null, gloves: null,
      mainHand: null, leftHand: null, feet: null,
      talisman: null, necklace: null, ring1: null, ring2: null,
    },
    backpack: [null, null, null, null, null],
    gold: 10,
    specialAbilities: { speed: [], combat: [], passive: [], modifier: [] },
    notes: '',
    customQuests: [],       // [{ id, name, actNum }]
    completedQuests: {},   // { questId: true }
    progress: { act: 1, currentQuest: null, defeatedEnemies: [], unlockedCareers: [], completedQuests: [] },
    createdAt: Date.now(),
    lastModified: Date.now(),
  };
}

const ABILITY_TYPE_LABEL = { sp: "Speed", co: "Combat", mo: "Modifier", pa: "Passive" };

// ─── Once-per-combat ability set (module scope — not rebuilt on every call) ───
// Abilities with a hard once-per-combat rule (glossary confirmed or HP/magic cost
// implies 1 activation). matchesOnce() uses key.includes() so partial name matches
// work for abilities that appear with suffixes in custom entries.
const ONCE_PER_COMBAT = new Set([
  // ── Explicitly stated once per combat in glossary ──────────────────────────
  'gut ripper',    'fallen hero',    'cauterise',      'tourniquet',
  'second wind',   'eureka',         'stun',           'shackle',
  'adrenaline',    'charge',         'time shift',     'blood rage',
  'vampirism',     'meditation',     'haunt',           'bolt',
  'raining blows', 'dark pact',      'consume',         'shadow speed',
  'siphon',        'acid',           'sear',
  // ── Glossary default: once per combat for ALL (mo) abilities ──────────────
  // (co) abilities are handled by the type block — listed here only for display
  // clarity and as a reference. The matchesOnce() check only matters for (mo).
  // LoS (mo):
  'mend',          'dominate',       'fortitude',      'focus',
  'vanquish',      'savagery',       'bright shield',  'iron will',
  'might of stone','ice shield',     'second sight',   'martyr',
  'brain drain',   'shadow fury',    'disrupt',        'cripple',
  'rebound',       'steal',          'feint',          'surefooted',
  // HoF (mo):
  'agility',       'atonement',      'bless',          'blessed blades',
  'blood thief',   'bloody maiden',  'boneshaker',     'bright spark',
  "bull's eye",    'choke hold',     'cold snap',      'cruel twist',
  'cunning',       'darksilver',     'deceive',        'distraction',
  'fear',          'finesse',        'freeze',         'frost burn',
  'frost guard',   'ghost',          'hooked',         'ice slick',
  'insight',       'intimidate',     'malice',         'mental freeze',
  'mortal wound',  'pain barrier',   'parasite',       'protection',
  'reaper',        'recall',         'resolve',        'silver frost',
  'sixth sense',   'sneak',          'sure edge',      'tactics',
  'torrent',       'trickster',      'watchful',
  // HoF new:
  'ashes',         'charm offensive','compulsion',     'confound',
  'crawlers',      'faithful friend','high five',      'hypnotise',
  'last defence',  'magic tap',      'mangle',         'near death',
  'penance',       'purge',          'reaper',         'redemption',
  'refresh',       'roll with it',   'silver frost',   'spirit ward',
  'suppress',      'sure grip',      'underhand',      'unstoppable',
  'wisdom',        'wish master',
  // EoWF (mo) — same names as HoF where shared, plus new ones:
  'augment',       'blood oath',     'bull guard',     'conflagration',
  'crystal armour','cyclone',        'dogged determination', 'energy boost',
  'expertise',     'faithful friend','fortress',       'freerunner',
  'ghost',         'gluttony',       'gorilla rage',   'heartless',
  'mind fumble',   'paralysis',
  "pick 'n' mix",  'quick draw',     'resurrection',
  'sinking sand',  'slipstream',     'somersault',
  'throwing knives','tormented soul','usurper',        'volatile mix',
  'war paint',     'wild child',
  // Dune Sea (mo/sp):
  'boneshaker',    'charged shot',   'cunning',        'dark haze',
  'fire pact',     'frenzy',         'frost guard',    'gluttony',
  'inner focus',   'intimidate',     'life charge',    'magic tap',
  'malice',        'mind fumble',    'mortal wound',   'reckless',
  'recall',        'resolve',        'savagery',       'shadow well',
  'sinking sand',  'slipstream',     'sneak',          'somersault',
  'spring strike', 'torrent',        'trojan exploit', 'water jets',
]);
const matchesOnce = (k) => [...ONCE_PER_COMBAT].some(n => k.includes(n));

// ─── Full Ability Glossary ────────────────────────────────────────────────────
const ABILITY_DB = [
  { name:"Acid"                        , type:"mo" , book:"los"  , desc:"Add 1 to the result of each die you roll for your damage score, for the duration of the combat. (Note: if you have multiple items with acid, you can still only add 1 to the result.) Once per combat." },
  { name:"Acid"                        , type:"mo" , book:"hof"  , desc:"Add 1 to the result of each die you roll for your damage score, for the duration of the combat. (Note: if you have multiple items with acid, you can still only add 1 to the result.) Once per combat." },
  { name:"Acid"                        , type:"mo" , book:"eowf" , desc:"Add 1 to the result of each die you roll for your damage score, for the duration of the combat. (Note: if you have multiple items with acid, you can still only add 1 to the result.) Once per combat." },
  { name:"Acuity"                      , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast acuity: reduces an opponent's armour by 3 and restores 2 spent magic points." },
  { name:"Adrenaline"                  , type:"sp" , book:"los"  , desc:"Use this ability to increase your speed by 2 for two combat rounds." },
  { name:"Aftershock"                  , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, inflict 1 damage die to two adjacent opponents (must be next to each other on combat list), ignoring armour. Roll separately. Once per combat." },
  { name:"Agility"                     , type:"mo" , book:"eowf" , desc:"Change a [6] result to a [1] when rolling for attack speed. Once per combat." },
  { name:"Ambidextrous"                , type:"pa" , book:"los"  , desc:"You can equip main-hand swords in your left hand, and vice versa." },
  { name:"Anguish"                     , type:"pa" , book:"eowf" , desc:"Allows you to play curse and fear twice in the same combat." },
  { name:"Arcane feast"                , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, lower your opponent's magic by 2 and raise your own magic by 2 for the remainder of combat. Once per combat." },
  { name:"Armour breaker"              , type:"pa" , book:"rods" , desc:"At the start of each combat round, reduce one opponent's armour by 1." },
  { name:"Armour plating"              , type:"pa" , book:"eowf" , desc:"For every 2 points of toughness your transport has remaining (rounding down), increase your armour by 1 for the duration of a combat." },
  { name:"Ashes"                       , type:"sp" , book:"hof"  , desc:"Use at the start of combat to surround yourself with holy ashes. Increases your armour by 1 for the duration of the combat." },
  { name:"Astral manipulator"          , type:"pa" , book:"rods" , desc:"Minions in a passive stance cannot be targeted by opponents." },
  { name:"Astute guardian"             , type:"pa" , book:"rods" , desc:"While you have 6 or more armour, roll an extra damage die when playing counter, overpower, retaliation and sideswipe." },
  { name:"Atonement"                   , type:"mo" , book:"hof"  , desc:"Use at the end of a combat round to heal yourself and an ally for the total passive damage inflicted on an opponent that round (from bleed, barbs, disease, fire aura, thorns, venom). Once per combat." },
  { name:"Augment"                     , type:"mo" , book:"rods" , desc:"Spend 2 magic points to roll an extra die for your damage score, adding 2 to the die result." },
  { name:"Avenging Spirit"             , type:"co" , book:"los"  , desc:"When you take health damage from your opponent's damage score/damage dice, you can inflict damage back to them equal to your armour. This ability ignores your opponent's armour. (Note: you cannot use modifier abilities to increase this damage.)" },
  { name:"Back draft"                  , type:"co" , book:"hof"  , desc:"When your opponent's damage score causes health damage, immediately retaliate by inflicting 2 damage dice back to them, ignoring armour. Once per combat." },
  { name:"Backfire"                    , type:"co" , book:"los"  , desc:"Instead of rolling for a damage score when you have won a round, you can use the Backfire ability. This automatically inflicts 3 damage dice to your opponent, but it also does 2 damage dice to your hero, ignoring armour." },
  { name:"Backlash"                    , type:"pa" , book:"rods" , desc:"For each point of magic you spend, automatically inflict 2 damage to an opponent of your choosing, ignoring armour." },
  { name:"Backstab"                    , type:"co" , book:"hof"  , desc:"(Requires a dagger in main or left hand.) If you or an ally play an immobilise, knockdown, stun or webbed ability, automatically backstab the affected opponent for 2 damage dice ignoring armour. You can still roll for damage if you won the round." },
  { name:"Banshee wail"                , type:"co" , book:"los"  , desc:"Use this ability to stop your opponent rolling for damage when they have won a round." },
  { name:"Barbs"                       , type:"pa" , book:"los"  , desc:"At the end of every combat round, you automatically inflict 1 damage to all of your opponents. This ability ignores armour." },
  { name:"Barter"                      , type:"pa" , book:"rods" , desc:"When dealing with vendors and quartermasters, reduce all costs for items you wish to buy by 20 silver." },
  { name:"Beep! Beep!"                 , type:"pa" , book:"los"  , desc:"Whenever you discover gold on your travels, you may automatically double the amount. Gold that is given to you by another character (for example, as a reward) cannot be doubled." },
  { name:"Beguile"                     , type:"mo" , book:"hof"  , desc:"You may use one of your speed abilities twice in the same combat, even if its description states it can only be used once." },
  { name:"Best laid plans"             , type:"pa" , book:"eowf" , desc:"See entry 547 for full description. Once per combat." },
  { name:"Black Rain"                  , type:"co" , book:"los"  , desc:"(requires a bow in the left hand). Instead of rolling for a damage score after winning a round, you can use Black Rain to shower your enemies with dark magic. Roll 1 damage die and apply the result to each of your opponents, ignoring their armour." },
  { name:"Blade finesse"               , type:"pa" , book:"rods" , desc:"(Requires a sword in the main hand.) For each [6] result for your damage score, add 1 to your score." },
  { name:"Bleed"                       , type:"pa" , book:"los"  , desc:"If your damage dice/damage score causes health damage to your opponent, they continue to take a further point of damage at the end of each combat round. This damage ignores armour." },
  { name:"Bless"                       , type:"mo" , book:"hof"  , desc:"Cast at any time on yourself or an ally to heal 6 health and increase magic or brawn by 1 for the remainder of combat. Once per combat." },
  { name:"Blessed blades"              , type:"mo" , book:"hof"  , desc:"(Requires a sword in main and left hand.) Heal yourself for the total brawn modifier of your two weapons. Once per combat." },
  { name:"Blessed bullets"             , type:"co" , book:"hof"  , desc:"While Virgil is your companion, use instead of rolling for damage: inflicts 3 damage dice to a single opponent ignoring armour and reduces their speed by 1 next round. Does not count toward hexed ability quota. Once per combat." },
  { name:"Blind"                       , type:"sp" , book:"hof"  , desc:"(See webbed.) Once per combat." },
  { name:"Blind strike"                , type:"co" , book:"hof"  , desc:"If you or an ally play an immobilise, knockdown, stun or webbed ability, immediately inflict 2 damage dice to the affected opponent ignoring armour. Can still roll for damage if you won the round. Once per combat." },
  { name:"Blinding rays"               , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast blinding rays: deals 4 damage to any three opponents ignoring armour, and reduces their speed by 1 for the next round." },
  { name:"Blink"                       , type:"co" , book:"hof"  , desc:"(See dodge.) Once per combat." },
  { name:"Blizzard"                    , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, cast blizzard: causes 2 damage dice to two adjacent opponents ignoring armour (roll separately). At the end of the next round, each also suffers an extra die of damage." },
  { name:"Blood frenzy"                , type:"pa" , book:"eowf" , desc:"If a bleed effect is in play, raise your speed by 1." },
  { name:"Blood hail"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage after winning, shower enemies with arrows: roll 2 damage dice and apply to each opponent ignoring armour. Opponents already inflicted with bleed take an extra 4 damage. Once per combat." },
  { name:"Blood mark"                  , type:"pa" , book:"rods" , desc:"Choose an opponent before combat begins. For the duration of combat, that opponent takes 1 extra damage from bleed." },
  { name:"Blood oath"                  , type:"mo" , book:"eowf" , desc:"Sacrifice 4 health to roll an extra die for damage. Once per combat." },
  { name:"Blood Rage"                  , type:"mo" , book:"los"  , desc:"If you win two consecutive combat rounds and cause health damage in both rounds, you automatically go into a Blood Rage. This increases your brawn by 2 for the remainder of the combat." },
  { name:"Blood thief"                 , type:"mo" , book:"hof"  , desc:"For every [6] you roll for damage, instantly restore 4 health. Cannot exceed starting health." },
  { name:"Blood-sworn set"             , type:"pa" , book:"hof"  , desc:"If wearing all three blood-sworn items (head, gloves, chest), sacrifice 4 health to use an ability you haven't used yet. Does not count toward hexed quota. Can be used multiple times." },
  { name:"Bloody maiden"               , type:"mo" , book:"eowf" , desc:"Add 2 to each die you roll for damage for one combat round. Once per combat." },
  { name:"Bolt"                        , type:"co" , book:"los"  , desc:"Instead of rolling for damage, you can 'charge up' your wand. When you win your next round of combat you can then release the charge. This allows you to inflict 3 damage dice to one opponent, ignoring their armour." },
  { name:"Boneshaker"                  , type:"mo" , book:"eowf" , desc:"Reroll all of your opponent's speed dice. Once per combat." },
  { name:"Brain Drain"                 , type:"mo" , book:"los"  , desc:"You may spend magic to increase your damage score. For each magic point you spend, you may increase your damage score by 1 for one round. You can spend up to a maximum of 5 magic points (increasing your damage score by 5). Your magic is restored at the end of the combat." },
  { name:"Bright shield"               , type:"mo" , book:"los"  , desc:"Use this ability to raise your armour by 4 for one combat round." },
  { name:"Bright spark"                , type:"mo" , book:"hof"  , desc:"Re-roll any dice for your damage score for the duration of combat. Must accept re-rolled results." },
  { name:"Brittle edge"                , type:"pa" , book:"eowf" , desc:"Each time an opponent wins a round and rolls for a damage score, they immediately take 2 damage ignoring armour (regardless of whether they cause health damage)." },
  { name:"Broken bond"                 , type:"pa" , book:"rods" , desc:"When your mastiff is defeated in combat, immediately deal 1 die of damage plus 2 to an opponent of your choosing, ignoring armour." },
  { name:"Broken trust"                , type:"pa" , book:"hof"  , desc:"To use Virgil's blessed bullets, roll a die. On [6] use it normally. On [1]–[5] the ability fails and you cannot retry until next round." },
  { name:"Brutality"                   , type:"co" , book:"los"  , desc:"This ability stops your opponent from rolling for damage, after they have won a round, and automatically inflicts 2 damage dice, ignoring armour, to your opponent." },
  { name:"Bull guard"                  , type:"mo" , book:"rods" , desc:"For each damaged opponent, gain 1 armour for the duration of one combat round." },
  { name:"Bull's Eye"                  , type:"mo" , book:"los"  , desc:"You may fire an arrow/bullet at your opponent before combat starts, automatically inflicting 1 damage die, ignoring armour. Bull's Eye will also inflict any harmful passive abilities you have, such as Venom and Bleed. (Note: An assassin using First Strike cannot use this ability.)" },
  { name:"Bulwark"                     , type:"co" , book:"rods" , desc:"Instead of rolling for damage, inflict damage to one opponent equal to your current armour, ignoring your opponent's armour." },
  { name:"Burn"                        , type:"pa" , book:"los"  , desc:"All opponents who have suffered health damage from Ignite automatically lose 1 health at the end of every combat round. This ability ignores armour." },
  { name:"Burn (Raiders)"              , type:"co" , book:"rods" , desc:"Instead of rolling for damage, deal 3 damage to an opponent, ignoring armour." },
  { name:"Call of nature set"          , type:"pa" , book:"hof"  , desc:"If equipped with both items from the call of nature set (ring and gloves), you can use the wild child ability." },
  { name:"Cat's Speed"                 , type:"sp" , book:"los"  , desc:"This ability allows you to roll an extra die to determine your attack speed for one round of combat." },
  { name:"Cauterise"                   , type:"mo" , book:"los"  , desc:"This ability can be used any time in combat to remove all Venom, Bleed and Disease effects that your hero is currently inflicted with. You can only use it once in combat — and once used, your hero is again susceptible to these effects." },
  { name:"Channel"                     , type:"mo" , book:"hof"  , desc:"Sacrifice 2 magic to increase your damage score by 4 for one round. Can be used once per item with channel. Magic restored at end of combat." },
  { name:"Chaotic catalyst"            , type:"co" , book:"eowf" , desc:"See entry 484 for full description. Once per combat." },
  { name:"Charge"                      , type:"sp" , book:"los"  , desc:"In the first round of combat, you may increase your speed by 2." },
  { name:"Charged shot"                , type:"mo" , book:"rods" , desc:"Spend 1 magic point to increase your damage score by 4." },
  { name:"Charm"                       , type:"mo" , book:"los"  , desc:"You may re-roll one of your hero's die once any time during a combat. You must accept the result of the second roll. If you have multiple items with the Charm ability, each one gives you a re-roll." },
  { name:"Charm offensive"             , type:"co" , book:"hof"  , desc:"For each item with charm you are wearing, add 2 to your damage score. Once per combat." },
  { name:"Cheat death"                 , type:"pa" , book:"rods" , desc:"When you lose your last point of health, immediately inflict 1 damage die to an opponent of your choosing ignoring armour. Then raise your health to 3." },
  { name:"Chill Touch"                 , type:"sp" , book:"los"  , desc:"Use this ability to reduce your opponent's speed by 2 for one combat round." },
  { name:"Choke hold"                  , type:"mo" , book:"eowf" , desc:"If you play a combat ability and cause health damage, immediately inflict 2 damage dice to your opponent and lower their speed by 1 for the next round. Once per combat." },
  { name:"Cistene's chattels set"      , type:"pa" , book:"hof"  , desc:"If equipped with both items from the Cistene's chattels set (necklace and spell book), you can use the miracle ability." },
  { name:"Cleansing Light"             , type:"pa" , book:"los"  , desc:"Automatically heals the hero for 2 health at the end of each combat round." },
  { name:"Cleave"                      , type:"co" , book:"los"  , desc:"Instead of rolling for a damage score after winning a round, you can use Cleave. Roll 1 damage die and apply the result to each of your opponents, ignoring their armour." },
  { name:"Click Your Heels"            , type:"sp" , book:"los"  , desc:"Raise your speed by 2 for one combat round." },
  { name:"Clymonistra Set"             , type:"pa" , book:"los"  , desc:"If your hero is wearing both pieces of Clymonistra's Set (necklace and ring) then you gain Vampirism. When you inflict damage on your opponent, you can heal yourself for half the amount of health that your opponent has lost, rounding up." },
  { name:"Cold snap"                   , type:"mo" , book:"eowf" , desc:"Reroll any die for damage, adding 2 to the result. Once per combat." },
  { name:"Combustion"                  , type:"co" , book:"rods" , desc:"Instead of rolling for damage, inflict 2 damage dice to your opponent ignoring armour. At the end of the next round, they take a further damage die, ignoring armour." },
  { name:"Command"                     , type:"co" , book:"los"  , desc:"When an opponent wins a combat round, use the Command power to instantly halt their attack, allowing you to roll for damage instead, as if you had won the combat round." },
  { name:"Compulsion"                  , type:"co" , book:"hof"  , desc:"Roll an extra die for damage. However, lower your speed by 2 for the next combat round. Once per combat." },
  { name:"Conflagration"               , type:"mo" , book:"rods" , desc:"Sacrifice your fire sprite at any time to inflict 1 damage die to a single opponent, ignoring armour. Removes the fire sprite from play." },
  { name:"Confound"                    , type:"co" , book:"hof"  , desc:"Avoid damage from your opponent when they win a round. Also inflicts 1 damage die back ignoring armour, and lowers their brawn and magic by 1 for the remainder of combat. Once per combat." },
  { name:"Constrictor"                 , type:"sp" , book:"hof"  , desc:"(See webbed.) Once per combat." },
  { name:"Consume"                     , type:"mo" , book:"los"  , desc:"Reduce the result of each of your opponent's die results for attack speed by 1 (to a minimum of 1)." },
  { name:"Convulsions"                 , type:"pa" , book:"hof"  , desc:"If your damage score causes health damage, the opponent suffers convulsions: in all future rounds they lose the round if they roll a double for attack speed, even if their result is higher." },
  { name:"Corona"                      , type:"pa" , book:"rods" , desc:"Whenever you spend 3 or more magic points in one round, raise your armour by 1 for the duration of combat." },
  { name:"Corrode"                     , type:"co" , book:"hof"  , desc:"If your damage score causes health damage, lower the opponent's armour by 2 for the remainder of combat. Once per combat." },
  { name:"Corruption"                  , type:"co" , book:"los"  , desc:"If your damage score causes health damage to your opponent, you can inflict Corruption on them, reducing either their brawn or magic by 2 points for the remainder of the combat." },
  { name:"Counter"                     , type:"co" , book:"hof"  , desc:"If your opponent wins a round, lower their damage score by 2 and inflict 1 damage die back ignoring armour. Once per combat." },
  { name:"Coup de grace"               , type:"pa" , book:"hof"  , desc:"When an opponent is reduced to 10 health or less, immediately reduce them to zero. Once per combat." },
  { name:"Courage"                     , type:"sp" , book:"los"  , desc:"Use this ability to increase your speed by 4 for one combat round." },
  { name:"Crawlers"                    , type:"sp" , book:"hof"  , desc:"Cover your opponent in creepy-crawlies, lowering their speed by 1 for two combat rounds. Once per combat." },
  { name:"Creeping cold"               , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, cast creeping cold on one opponent: does 1 damage at end of every round. For each [6] you roll for subsequent damage scores, creeping cold increases by 1. Once per combat." },
  { name:"Cripple"                     , type:"co" , book:"los"  , desc:"If your damage score causes health damage to your opponent, you can also Cripple them. This immediately lowers their speed score by 1 for the next three combat rounds." },
  { name:"Critical Strike"             , type:"mo" , book:"los"  , desc:"Change the result of all dice you have rolled for damage to a [6]." },
  { name:"Cruel twist"                 , type:"mo" , book:"hof"  , desc:"If you get a [6] result when rolling for damage, roll an extra die. Once per combat." },
  { name:"Crystal armour"              , type:"mo" , book:"eowf" , desc:"See entry 431 for full description. Once per combat." },
  { name:"Cunning"                     , type:"mo" , book:"hof"  , desc:"Raise your brawn score by 3 for one combat round. Once per combat." },
  { name:"Cure"                        , type:"pa" , book:"eowf" , desc:"Use at any time to remove two defeats from your hero sheet." },
  { name:"Curse"                       , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only." },
  { name:"Cutpurse"                    , type:"pa" , book:"hof"  , desc:"Each time you complete a combat, roll a die: [1]–[2] = 20 gold crowns; [3]–[4] = elixir of invisibility (1 use, grants vanish); [5]–[6] = flask of healing (1 use, restore 6 health)." },
  { name:"Cutthroat"                   , type:"pa" , book:"rods" , desc:"Each time you play evade, sidestep or vanish, increase your brawn by 1 for the duration of combat." },
  { name:"Cyclone"                     , type:"mo" , book:"rods" , desc:"When using cleave, roll two damage dice instead of one." },
  { name:"Dancing rapier"              , type:"pa" , book:"rods" , desc:"Add 1 to the result of each die you roll for damage." },
  { name:"Dark bond"                   , type:"pa" , book:"rods" , desc:"Each time the gloom shade takes health damage from an opponent's damage score, regain one spent magic point." },
  { name:"Dark Claw"                   , type:"pa" , book:"los"  , desc:"For every double that you roll (before or after a re-roll), your hero automatically inflicts 4 damage to their opponent, ignoring armour." },
  { name:"Dark distraction"            , type:"co" , book:"rods" , desc:"Use when you've lost a combat round to avoid taking damage. You may also inflict 1 damage die to an opponent of your choosing, ignoring armour." },
  { name:"Dark haze"                   , type:"pa" , book:"rods" , desc:"(Warp ability) Raise your brawn by 3 for one combat round. Speed is lowered by 1 in the next round. Costs 4 health to use." },
  { name:"Dark mending"                , type:"pa" , book:"rods" , desc:"Each time you cast heal or regrowth, inflict 3 damage to an opponent of your choosing, ignoring armour." },
  { name:"Dark Pact"                   , type:"co" , book:"los"  , desc:"Sacrifice 4 health to charge your strike with shadow energy, increasing your damage score by 4." },
  { name:"Darksilver"                  , type:"mo" , book:"eowf" , desc:"Sacrifice 2 health to raise your speed by 3 for one combat round. Once per combat." },
  { name:"Deadly dance"                , type:"sp" , book:"eowf" , desc:"Goad your opponent with dodges and feints: automatically lowers their speed by 2 for one round, but raises their brawn or magic by 1 for the remainder of combat. Can be used twice in the same combat (each use raises their stat again)." },
  { name:"Deadly Poisons"              , type:"pa" , book:"los"  , desc:"If you have the Venom special ability, its damage is increased by 1 (causing 3 points of damage instead of only 2). This ability stacks with Poison Mastery — if you have both, Venom deals 4 damage." },
  { name:"Deadsilver"                  , type:"co" , book:"rods" , desc:"Instead of rolling for damage, aim a deadsilver bullet: inflicts 3 damage dice to your opponent ignoring armour. Their speed is reduced by 2 for the next round." },
  { name:"Death from above"            , type:"pa" , book:"rods" , desc:"If you lose a combat round, roll a die. On [5] or [6] your attacking opponent takes damage equal to the brawn of your talon wing ignoring armour. This occurs before your opponent rolls for damage or any abilities are played." },
  { name:"Decay"                       , type:"pa" , book:"eowf" , desc:"Automatically inflict 1 damage to all opponents at the end of every combat round. Ignores armour." },
  { name:"Deceive"                     , type:"mo" , book:"los"  , desc:"You may swap one of your opponent's speed die for your own." },
  { name:"Deep Wound"                  , type:"co" , book:"los"  , desc:"You can use the Deep Wound ability to roll an extra die when determining your damage score." },
  { name:"Defender"                    , type:"pa" , book:"hof"  , desc:"In a team battle, take the damage that would be inflicted to an ally and apply it to yourself. Once per combat." },
  { name:"Deflect"                     , type:"co" , book:"los"  , desc:"This ability stops your opponent from rolling for damage, after they have won a round, and automatically inflicts 2 damage dice, ignoring armour, to your opponent." },
  { name:"Demolish"                    , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only. It also lowers their armour by 1 for the remainder of the combat." },
  { name:"Demon blood"                 , type:"pa" , book:"hof"  , desc:"Permanently increase health by 10. Hexed heroes may now use up to ten abilities in a single combat." },
  { name:"Demon claws"                 , type:"pa" , book:"hof"  , desc:"For every double you roll for attack speed, automatically inflict 4 damage to your opponent, ignoring armour." },
  { name:"Demon spines"                , type:"co" , book:"hof"  , desc:"(See retaliation.) Once per combat." },
  { name:"Dirge"                       , type:"co" , book:"hof"  , desc:"Stop your opponent rolling for damage when they win a round. Once per combat." },
  { name:"Disease"                     , type:"pa" , book:"los"  , desc:"If your damage dice/damage score causes health damage to your opponent, they continue to take 2 points of damage at the end of each combat round. This damage ignores armour." },
  { name:"Disrupt"                     , type:"co" , book:"los"  , desc:"If your damage score causes health damage to your opponent, you can also Disrupt them. This immediately lowers their magic score by 3 for the remainder of the combat." },
  { name:"Distraction"                 , type:"mo" , book:"eowf" , desc:"(See feint.) Once per combat." },
  { name:"Dodge"                       , type:"co" , book:"los"  , desc:"Use this ability when you have lost a combat round, to avoid taking damage from your opponent. (Note: You will still take damage from passive abilities such as Bleed or Venom)." },
  { name:"Dogged determination"        , type:"mo" , book:"eowf" , desc:"Reroll any or all of your hero's speed dice, accepting the rerolled results. Once per combat." },
  { name:"Dominate"                    , type:"mo" , book:"los"  , desc:"Change the result of one die you roll for damage to a [6]." },
  { name:"Doom"                        , type:"co" , book:"hof"  , desc:"If your damage score causes health damage, curse the opponent with the sigil of doom: lowers their armour, brawn and magic by 1 for the remainder of combat." },
  { name:"Double punch"                , type:"co" , book:"hof"  , desc:"(Requires a dagger in main and left hand.) Instead of rolling for damage, automatically inflict 2 damage dice plus the total brawn modifier of your two weapons to a single opponent, ignoring armour. Once per combat." },
  { name:"Dragon fire"                 , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, blast opponents with dragon fire: 3 damage dice to one chosen opponent and 1 damage die to all others, ignoring armour (roll separately). Once per combat." },
  { name:"Drake fire"                  , type:"co" , book:"eowf" , desc:"(See dragon fire.) Once per combat." },
  { name:"Dry ice"                     , type:"co" , book:"eowf" , desc:"See entry 484 for full description. Once per combat." },
  { name:"Ebony & Ivory Set"           , type:"pa" , book:"los"  , desc:"If your hero is equipped with both swords (Ebony and Ivory) then you may use the Cripple ability. If your damage score causes health damage to your opponent, you can also Cripple them. This immediately lowers their speed score by 1 for the next three combat rounds." },
  { name:"Elysium soaked"              , type:"pa" , book:"hof"  , desc:"Every time you use a modifier ability, roll a die. On [1] the ability fails and cannot be retried until next round. On [2]+ use it normally." },
  { name:"Embers"                      , type:"pa" , book:"los"  , desc:"Your Burn ability now does 2 damage to each opponent (instead of 1)." },
  { name:"Energy boost"                , type:"mo" , book:"rods" , desc:"Spend 2 magic points to increase the armour of your minion by 3." },
  { name:"Ensnare"                     , type:"co" , book:"los"  , desc:"If your opponent has used a Dodge ability (such as Evade, Vanish or Sidestep) you can immediately Ensnare them, allowing you to win back control of the round and roll for damage as normal (as if their ability had never been played)." },
  { name:"Eureka"                      , type:"mo" , book:"los"  , desc:"Use any time in combat to raise your speed, brawn or magic score by 1 for one combat round. You can only use this ability once per combat." },
  { name:"Evade"                       , type:"co" , book:"los"  , desc:"Use this ability when you have lost a combat round, to avoid taking damage from your opponent. (Note: You will still take damage from passive abilities such as Bleed or Venom)." },
  { name:"Eviscerate"                  , type:"pa" , book:"eowf" , desc:"(Death move) Automatically defeat all opponents with 5 health or less. Once per combat." },
  { name:"Evocation"                   , type:"co" , book:"rods" , desc:"If your minion is currently in play, add its current magic to your damage score." },
  { name:"Execution"                   , type:"sp" , book:"los"  , desc:"(requires a sword in the main hand). Once an opponent's health is equal to or less than your speed score, you may automatically 'execute' them at the start of the combat round, reducing their health to zero. (Note: You can only execute a single opponent in each combat round.)" },
  { name:"Expertise"                   , type:"mo" , book:"los"  , desc:"If, after winning a round, your opponent uses an ability that would strike back at you (such as Sideswipe, Retaliation, Riposte, Overpower, Deflect and Brutality) you can ignore the damage." },
  { name:"Exploit"                     , type:"pa" , book:"hof"  , desc:"For each [1] your opponent rolls for attack speed, automatically inflict 1 damage back to them, ignoring armour." },
  { name:"Faith"                       , type:"pa" , book:"hof"  , desc:"Each time you roll a double, automatically heal 2 health. Cannot exceed starting health." },
  { name:"Faith and duty set"          , type:"pa" , book:"hof"  , desc:"If equipped with both swords from the faith and duty set, you can use the redemption ability." },
  { name:"Faithful friend"             , type:"mo" , book:"hof"  , desc:"Summon a faithful hound, increasing your damage score by 2 for one combat round. Once per combat." },
  { name:"Fallen Hero"                 , type:"mo" , book:"los"  , desc:"Use this ability to raise your brawn by 3 for one combat round and heal 10 health." },
  { name:"Far sight"                   , type:"pa" , book:"rods" , desc:"If the talon wing is your pet, you automatically win the first round of combat without rolling for attack speed." },
  { name:"Fast aid"                    , type:"pa" , book:"rods" , desc:"Whenever you play evade, gloom, sidestep or vanish, heal 3 health." },
  { name:"Fatal Blow"                  , type:"co" , book:"los"  , desc:"Use Fatal Blow to ignore half of your opponent's armour, rounding up." },
  { name:"Fear"                        , type:"mo" , book:"hof"  , desc:"Lowers your opponent's damage score by 2 for one combat round. Once per combat." },
  { name:"Fearless"                    , type:"sp" , book:"los"  , desc:"Use this ability to raise your speed by 2 for one combat round." },
  { name:"Feint"                       , type:"mo" , book:"los"  , desc:"You may re-roll some or all of your dice when rolling for attack speed." },
  { name:"Feral Fury"                  , type:"co" , book:"los"  , desc:"You can use Feral Fury to roll an extra die when determining your damage score." },
  { name:"Fiend's finest set"          , type:"pa" , book:"hof"  , desc:"If wearing both pieces of the night fiend set (gloves and hood), you can use the exploit ability." },
  { name:"Fiery temper"                , type:"pa" , book:"hof"  , desc:"Track all [6] results your opponent rolls for damage. For every two [6]s, your brawn increases by 2. Returns to normal at end of combat." },
  { name:"Finery of the Fallen"        , type:"pa" , book:"los"  , desc:"If your hero is wearing both pieces of the Fallen Set (gauntlets and chest) then you may use the Fallen Hero ability. Use this ability to raise your brawn by 3 for one combat round and heal 10 health." },
  { name:"Finesse"                     , type:"mo" , book:"hof"  , desc:"Re-roll one die for damage, adding 2 to the result. Once per combat." },
  { name:"Fire Aura"                   , type:"pa" , book:"los"  , desc:"You are surrounded by magical flames. All opponents take 1 damage, ignoring armour, at the end of every combat round." },
  { name:"Fire boost"                  , type:"pa" , book:"rods" , desc:"While the fire sprite is in play, your fire abilities are more powerful: add 1 to each die rolled for back draft, combustion, immolation and fireball." },
  { name:"Fire pact"                   , type:"co" , book:"rods" , desc:"Sacrifice 3 health to charge your attack with fire magic, increasing your damage score by 3." },
  { name:"Fire shield"                 , type:"pa" , book:"hof"  , desc:"Your fire shield protects you from some opponents' attacks. See combat descriptions for when to use this." },
  { name:"Fire starter"                , type:"pa" , book:"rods" , desc:"At the start of each combat round, inflict 2 damage to an opponent of your choosing, ignoring armour." },
  { name:"Fireball"                    , type:"co" , book:"rods" , desc:"Instead of rolling for damage, blast an opponent with a fireball: inflicts 3 damage dice to a single opponent and 3 damage to any adjacent opponents, ignoring armour." },
  { name:"First blood"                 , type:"pa" , book:"eowf" , desc:"Before the first combat round, automatically inflict 4 damage to one chosen opponent, ignoring armour. Also inflicts harmful passives such as bleed and venom." },
  { name:"First Cut"                   , type:"pa" , book:"los"  , desc:"This ability allows you to inflict 1 health damage to your opponent before combat begins. This will also inflict any harmful passive abilities you may have, such as Venom and Bleed. (This ability cannot be used by assassins.)" },
  { name:"First Strike"                , type:"pa" , book:"los"  , desc:"(requires a dagger in the main hand). Before combat begins you may automatically inflict 1 damage die to an opponent, ignoring armour. This will also inflict any harmful passive abilities you have, such as Venom and Bleed." },
  { name:"Fists of the tempest"        , type:"co" , book:"rods" , desc:"Instead of rolling for damage, spend 2 magic points to shape the wind into powerful fists of magic: roll three damage dice and assign each to one or more opponents ignoring armour. Each opponent struck lowers their armour by 2 for the remainder of combat." },
  { name:"Flurry"                      , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, shower enemies with daggers: roll 1 damage die and apply to each opponent ignoring armour. Once per combat." },
  { name:"Focus"                       , type:"mo" , book:"los"  , desc:"Use any time in combat to raise your magic score by 3 for one combat round." },
  { name:"Focused strike"              , type:"co" , book:"hof"  , desc:"(Requires a fist or fist weapon in each hand.) Ignore your opponent's armour and apply full damage score to their health. Once per combat." },
  { name:"Forked strike"               , type:"co" , book:"rods" , desc:"Instead of rolling for damage, bring down a lightning strike: roll a die for each opponent — on [3]+ they take 2 damage dice ignoring armour (roll separately)." },
  { name:"Fortitude"                   , type:"mo" , book:"los"  , desc:"Use any time in combat to raise your brawn or armour score by 3 for one combat round." },
  { name:"Fortress"                    , type:"mo" , book:"rods" , desc:"Raise your armour by 6 for one combat round and inflict 4 damage to an opponent of your choosing, ignoring their armour." },
  { name:"Freerunner"                  , type:"mo" , book:"rods" , desc:"Increase your attack speed result by 3. If you win the round, raise your brawn by 2 until end of round." },
  { name:"Freeze"                      , type:"mo" , book:"eowf" , desc:"Ignore passive damage you would ordinarily suffer at the end of a combat round for two rounds. Once per combat." },
  { name:"Frenzy"                      , type:"sp" , book:"eowf" , desc:"Increase your speed by 3 for one combat round. Once per combat." },
  { name:"From shadows"                , type:"pa" , book:"rods" , desc:"(Warp ability) Inflict damage equal to the speed and brawn of your main hand weapon to any two opponents, ignoring armour. Costs 4 health to use." },
  { name:"Frost burn"                  , type:"mo" , book:"eowf" , desc:"Add 2 to your damage score. Once per combat." },
  { name:"Frost guard"                 , type:"mo" , book:"eowf" , desc:"Raise your armour score by 3 for one combat round and lower all opponents' speed by 1 for the next round. Once per combat." },
  { name:"Frost hound"                 , type:"pa" , book:"eowf" , desc:"(Death move, requires Syn's heart.) When you defeat an opponent, transform the corpse into a frost hound. The hound attacks another single opponent, inflicting 2 damage per round ignoring armour. Once per combat." },
  { name:"Frostbite"                   , type:"co" , book:"hof"  , desc:"If your damage score causes health damage, lower your opponent's speed by 1 for the next two combat rounds. Once per combat." },
  { name:"Furious sweep"               , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, roll 2 damage dice and apply to each opponent ignoring armour. Your speed is lowered by 1 for the next round. Once per combat." },
  { name:"Gambit"                      , type:"pa" , book:"eowf" , desc:"Each time you play a death move ability, roll a die. On [6] regain a speed or modifier ability you've already used, allowing you to use it again." },
  { name:"Getaway"                     , type:"pa" , book:"eowf" , desc:"If defeated in combat, roll a die. On [5] or [6] you do not need to record the defeat on your hero sheet." },
  { name:"Ghost"                       , type:"mo" , book:"rods" , desc:"Ignore passive damage you would ordinarily suffer at the end of a combat round. If you are a mage, also restores 1 spent magic point." },
  { name:"Glimmer dust"                , type:"co" , book:"rods" , desc:"Use when you've lost a combat round to avoid taking damage. You can also heal 4 health." },
  { name:"Gloom"                       , type:"co" , book:"rods" , desc:"Use when you've lost a combat round to avoid taking damage. You can also restore a warp ability you have already used." },
  { name:"Gluttony"                    , type:"mo" , book:"rods" , desc:"Sacrifice 6 health to increase your damage score by 3." },
  { name:"Good Taste"                  , type:"pa" , book:"los"  , desc:"Each time you use a backpack item to increase your magic in combat, roll 1 die and add the result to the item's benefit." },
  { name:"Gorilla rage"                , type:"mo" , book:"hof"  , desc:"Each time you play a combat ability, roll a die. On [6] raise your brawn or magic by 1 for the duration of combat." },
  { name:"Gouge"                       , type:"pa" , book:"hof"  , desc:"Increases the damage caused by the bleed ability by 1." },
  { name:"Gouge"                       , type:"co" , book:"eowf" , desc:"Increases the damage caused by the bleed ability by 1. Once per combat." },
  { name:"Greater heal"                , type:"mo" , book:"hof"  , desc:"Cast any time to heal yourself or an ally for 8 health. Once per item with this ability per combat." },
  { name:"Greater healing"             , type:"mo" , book:"rods" , desc:"Once per combat, Valya heals you for 8 health. Cannot exceed starting health." },
  { name:"Guardian"                    , type:"pa" , book:"rods" , desc:"Each time an opponent's damage score inflicts health damage to your pet, they take 2 damage in return, ignoring armour." },
  { name:"Gut Ripper"                  , type:"mo" , book:"los"  , desc:"Change the result of all dice you have rolled for damage to a [6]. You can only use this ability once per combat." },
  { name:"Hamstring"                   , type:"co" , book:"los"  , desc:"If your opponent has used a Dodge ability (such as Evade, Sidestep or Vanish), you can immediately use your Hamstring ability to cancel their Dodge, allowing you to roll for damage as normal (as if the Dodge ability had never been played)." },
  { name:"Haste"                       , type:"sp" , book:"los"  , desc:"This ability allows you to roll an extra die to determine your attack speed for one round of combat." },
  { name:"Haunt"                       , type:"co" , book:"los"  , desc:"Instead of rolling for a damage score, you can cast Haunt. This summons a vengeful spirit to attack a single opponent. They will take 2 damage, ignoring armour, at the end of every combat round, until your hero rolls a double (for speed or damage). Then the spirit is dispelled." },
  { name:"Head Butt"                   , type:"co" , book:"los"  , desc:"Use this ability to prevent your opponent from rolling for damage. This automatically ends the combat round." },
  { name:"Headshot"                    , type:"pa" , book:"hof"  , desc:"Once an opponent's health is reduced to 5 or less, automatically headshot them reducing their health to zero. Once per combat." },
  { name:"Heal"                        , type:"mo" , book:"los"  , desc:"You may instantly restore 4 health during a combat. This ability can only be used once per combat. If you have multiple items with the Heal ability, each one can be used to restore 4 health." },
  { name:"Healing spring"              , type:"co" , book:"rods" , desc:"Instead of rolling for damage, summon a healing spring: restores 4 health to your hero, then a further 1 health at end of every round." },
  { name:"Heart steal"                 , type:"pa" , book:"eowf" , desc:"Whenever you use piercing or deep wound in combat, automatically roll an extra die for damage." },
  { name:"Heartless"                   , type:"mo" , book:"hof"  , desc:"Raise your brawn or magic score by 2 for one combat round. Once per combat." },
  { name:"Heavy blow"                  , type:"co" , book:"hof"  , desc:"(See deep wound.) Once per combat." },
  { name:"High five"                   , type:"mo" , book:"hof"  , desc:"Change the result of any die you have rolled for your hero to a [5]. Once per combat." },
  { name:"Holy protector"              , type:"pa" , book:"hof"  , desc:"Each undead opponent takes 1 point of damage at the end of every combat round, ignoring armour." },
  { name:"Hooked"                      , type:"mo" , book:"hof"  , desc:"Save one die result from your attack speed roll to use in the next combat round. Cannot change or re-roll the saved die. Once per combat." },
  { name:"Hurricane rush"              , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, become a reckless whirlwind: inflict 2 damage dice to each opponent ignoring armour (roll separately), but for every opponent you hit take 1 damage in return ignoring armour. Once per combat." },
  { name:"Hypnotise"                   , type:"mo" , book:"hof"  , desc:"All of your opponent's [6] results for their damage score can be re-rolled. Must accept re-rolled results." },
  { name:"Ice edge"                    , type:"pa" , book:"eowf" , desc:"Any [6] result for your damage score will lower your opponent's speed by 1 in the next combat round." },
  { name:"Ice hooks"                   , type:"pa" , book:"eowf" , desc:"Scale sheer and treacherous surfaces. You will be told when to use this ability." },
  { name:"Ice mantle"                  , type:"pa" , book:"eowf" , desc:"Permanently raise your armour by 2. Also immune to any effects or abilities that would lower your armour in combat." },
  { name:"Ice Shards"                  , type:"co" , book:"los"  , desc:"If you win a combat round, instead of rolling for a damage score, you can shower a single opponent with Ice Shards. This automatically does damage equal to your magic score, ignoring your opponent's armour." },
  { name:"Ice Shield"                  , type:"mo" , book:"los"  , desc:"Use this ability to add 1 die to your armour score for one combat round." },
  { name:"Ice slick"                   , type:"mo" , book:"eowf" , desc:"If you roll a [6] for attack speed, roll an extra die. Once per combat." },
  { name:"Ignite"                      , type:"co" , book:"los"  , desc:"If you win a combat round, instead of rolling for a damage score, you can cast Ignite. Roll 2 damage dice and apply the result to each of your opponents, ignoring their armour. It also causes them to burn. (Note: You cannot use modifier abilities to increase this damage.)" },
  { name:"Immobilise"                  , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only." },
  { name:"Immolation"                  , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, cast immolation: roll 1 damage die and apply to any two opponents ignoring armour. Also lowers their armour by 1 for the remainder of combat. Once per combat." },
  { name:"Immolation"                  , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast immolation: roll 1 damage die and apply the result to any two opponents, ignoring armour." },
  { name:"Impale"                      , type:"co" , book:"los"  , desc:"A penetrating blow that increases your damage score by 3. In the next combat round, your opponent's speed is lowered by 1." },
  { name:"Improved misdirection"       , type:"co" , book:"rods" , desc:"(Warp ability) Use when you've lost a combat round to avoid taking damage. Raise your speed by 2 in the next round. Costs 4 health to use." },
  { name:"Indomitable"                 , type:"pa" , book:"hof"  , desc:"You are immune to any effects or abilities that would lower your brawn in combat." },
  { name:"Inner focus"                 , type:"mo" , book:"rods" , desc:"Raise your speed, brawn or magic score by 1 for one combat round." },
  { name:"Innovation"                  , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast innovation: inflicts 4 damage to any two opponents ignoring armour, and restores up to 2 spent magic points." },
  { name:"Insight"                     , type:"mo" , book:"hof"  , desc:"Cast any time to lower your opponent's armour by 2 for two combat rounds. Once per combat." },
  { name:"Insulated"                   , type:"pa" , book:"hof"  , desc:"Protects you from some opponents' lightning attacks. See combat descriptions." },
  { name:"Intimidate"                  , type:"mo" , book:"eowf" , desc:"Reroll all dice for attack speed for both yourself and your opponent. Must accept rerolled results. Once per combat." },
  { name:"Iron Will"                   , type:"mo" , book:"los"  , desc:"You may instantly increase your armour score by 3 for one combat round." },
  { name:"Judgement"                   , type:"co" , book:"los"  , desc:"When you take health damage from your opponent's damage score/damage dice, you can inflict damage back to your opponent equal to half your speed score, rounding up. This ability ignores armour." },
  { name:"Kick Start"                  , type:"pa" , book:"los"  , desc:"When you lose your last point of health, a magical shock automatically brings you back to life, restoring you to 15 health. This also removes all passive effects on your hero." },
  { name:"Knockdown"                   , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only." },
  { name:"Lash"                        , type:"co" , book:"eowf" , desc:"(See cleave.) Once per combat." },
  { name:"Last defence"                , type:"mo" , book:"hof"  , desc:"If your health is 10 or less, raise your brawn by 2." },
  { name:"Last Laugh"                  , type:"mo" , book:"los"  , desc:"You may force your opponent to re-roll all of their dice (for either their attack speed or for their damage score). You must accept the re-rolled results. (LoS: no stated limit. HoF/EoWF/Dune Sea: once per combat.)" },
  { name:"Last rites"                  , type:"pa" , book:"hof"  , desc:"Once an opponent has 15 or less health, instantly lower their speed and armour by 1 for the remainder of combat. Once per combat." },
  { name:"Lay of the Land"             , type:"sp" , book:"los"  , desc:"You can now use the natural features of the land to your advantage. Add one extra die when rolling for your attack speed, for one combat round only." },
  { name:"Leech"                       , type:"pa" , book:"los"  , desc:"Every time your damage score/damage dice causes health damage to your opponent, you may restore 2 health. This cannot take you above your maximum health." },
  { name:"Leech strike"                , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast leech strike: automatically inflicts 2 dice of damage to an opponent ignoring armour, and heals you for 4 health." },
  { name:"Ley line infusion"           , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, roll 1 die: [1] both you and opponent take 1 die damage each; [2]–[3] heal 5 health, opponent takes 1 die; [4]–[5] heal 8 health, opponent takes 1 die; [6] you and an ally both heal 8, opponent takes 1 die." },
  { name:"Lick your wounds"            , type:"pa" , book:"rods" , desc:"If the mastiff is in a passive stance, it may restore 4 health to itself at end of the round. Cannot exceed starting health." },
  { name:"Life charge"                 , type:"mo" , book:"rods" , desc:"Spend 1 magic point to heal yourself for 4 health." },
  { name:"Life Spark"                  , type:"pa" , book:"los"  , desc:"Every time you roll a double, you automatically heal 4 health. This cannot take you above your maximum health." },
  { name:"Lightning"                   , type:"pa" , book:"los"  , desc:"Every time you take health damage as a result of an opponent's damage score/damage dice, you automatically inflict 2 points of damage to them in return. This ability ignores armour. (Note: If you have multiple items with Lightning, you still only inflict 2 damage.)" },
  { name:"Lightning boost"             , type:"pa" , book:"rods" , desc:"While the lightning spark is in play, your lightning abilities are more powerful: increase the damage of forked strike, storm shock and shock blast by 3." },
  { name:"Lodestone attraction"        , type:"co" , book:"rods" , desc:"Replace your armour value with that of an opponent's until the end of the combat round." },
  { name:"Loot Master"                 , type:"pa" , book:"los"  , desc:"If you do not wish to choose a reward when you defeat an enemy, you may award yourself an extra 20 gold crowns instead." },
  { name:"Luck of the draw"            , type:"pa" , book:"rods" , desc:"(Requires a flintlock in the left hand.) Each time you play a modifier ability, immediately inflict 2 damage to an opponent of your choosing, ignoring their armour." },
  { name:"Magic tap"                   , type:"mo" , book:"hof"  , desc:"Raise your magic score by 2 for one combat round. If you roll a double (speed or damage), this spell is restored and can be used again." },
  { name:"Malefic runes"               , type:"pa" , book:"eowf" , desc:"For each opponent you defeat (reduced to zero health), raise your magic score by 1 for the remainder of combat." },
  { name:"Malice"                      , type:"mo" , book:"eowf" , desc:"Raise your brawn score by 3 for one combat round. Once per combat." },
  { name:"Mangle"                      , type:"mo" , book:"hof"  , desc:"For each [6] you roll for damage, add 2 to the result." },
  { name:"Mangle"                      , type:"pa" , book:"eowf" , desc:"For each [6] you roll for your damage score, you can add 2 to the result." },
  { name:"Martyr"                      , type:"mo" , book:"los"  , desc:"Instead of taking the result of your opponent's damage, you can choose to lose 5 health instead." },
  { name:"Meditation"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, cast meditation: automatically heals 1 health at the end of every combat round for the duration of combat." },
  { name:"Melt"                        , type:"co" , book:"hof"  , desc:"(See corrode.) Once per combat." },
  { name:"Melt armour"                 , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast melt armour: inflicts 2 damage dice to an opponent ignoring armour, and lowers their armour by 2 for the remainder of combat." },
  { name:"Mend"                        , type:"mo" , book:"los"  , desc:"You can cast this spell any time in combat to automatically heal yourself or an ally for 15 health." },
  { name:"Mental freeze"               , type:"mo" , book:"eowf" , desc:"Lower an opponent's magic score by 3 for two combat rounds. Once per combat." },
  { name:"Merciless"                   , type:"pa" , book:"los"  , desc:"You may add 1 to each die you roll for your damage score if your opponent has been inflicted with Bleed, Disease or Venom." },
  { name:"Midas Touch"                 , type:"pa" , book:"los"  , desc:"Every time you destroy an item of equipment (by replacing it with a new item) you gain 30 gold crowns. This ability does not work on backpack items." },
  { name:"Might of Stone"              , type:"mo" , book:"los"  , desc:"You may instantly increase your armour score by 3 for one combat round." },
  { name:"Mind flay"                   , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, cast mind flay: roll 1 damage die and apply to each opponent ignoring armour. For each opponent that takes damage, restore 2 health to your hero. Once per combat." },
  { name:"Mind fumble"                 , type:"mo" , book:"rods" , desc:"Spend 1 magic point to lower your opponent's damage score by 4." },
  { name:"Minor mirage"                , type:"co" , book:"rods" , desc:"Instead of rolling for damage, spend 1 magic point to cast a mirage on yourself or a minion. If the target is hit (lost a round), roll a die — on [6] the attack is ignored." },
  { name:"Miracle"                     , type:"pa" , book:"hof"  , desc:"Your bless ability now increases magic or brawn by 2 (instead of 1) for the remainder of combat." },
  { name:"Misdirection"                , type:"co" , book:"rods" , desc:"(Warp ability) Use when you've lost a combat round to avoid taking damage. Raise your speed by 1 in the next round. Costs 4 health to use." },
  { name:"Missionary's calling set"    , type:"pa" , book:"hof"  , desc:"If equipped with both items from the missionary's calling set (head and chest), you can use the penance ability." },
  { name:"Monkey mob"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, summon a monkey mob: causes 2 damage at end of each round to a single opponent, ignoring armour, for the duration of combat. Once per combat." },
  { name:"Mortal wound"                , type:"mo" , book:"eowf" , desc:"Raise your brawn score by 4 for one combat round. Once per combat." },
  { name:"Murder"                      , type:"pa" , book:"eowf" , desc:"(Death move) Inflict 1 damage to a chosen opponent at end of every round and lower their speed by 1 for the remainder of combat. Once per combat." },
  { name:"Nail gun"                    , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, use the nail gun: inflicts 2 damage dice to a single opponent ignoring armour, and reduces their armour by 2 for the remainder of combat. Once per combat." },
  { name:"Nature's Revenge"            , type:"co" , book:"los"  , desc:"Use this ability instead of rolling for a damage score, to automatically bind a single opponent in deadly thorns. This inflicts 2 damage dice to your opponent, ignoring armour. It also reduces their speed by 1 for the next combat round." },
  { name:"Near death"                  , type:"mo" , book:"hof"  , desc:"If your health is 10 or less, raise your magic by 2." },
  { name:"Necrosis"                    , type:"pa" , book:"eowf" , desc:"See entry 98 for full description." },
  { name:"Nightwalker Set"             , type:"pa" , book:"los"  , desc:"If your hero is wearing both pieces of Nightwalker Armour (chest and gloves) then you may use the Gut Ripper ability. Change the result of all dice you have rolled for damage to a [6]. You can only use Gut Ripper once per combat." },
  { name:"Overload"                    , type:"co" , book:"los"  , desc:"You can use the Overload ability to roll an extra die when determining your damage score." },
  { name:"Overpower"                   , type:"co" , book:"los"  , desc:"This ability stops your opponent from rolling for damage, after they have won a round, and automatically inflicts 2 damage dice, ignoring armour, to your opponent." },
  { name:"Pack spirit"                 , type:"mo" , book:"rods" , desc:"Spend an unused speed or combat ability (making it unavailable for the rest of combat) to boost the brawn of your mastiff by 1 for the remainder of combat. Can be used multiple times." },
  { name:"Packmaster"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, summon a molten hound: causes 2 damage at end of each round ignoring armour. Hound leaves when you roll a double. Once per combat." },
  { name:"Pagan's spirit set"          , type:"pa" , book:"hof"  , desc:"If equipped with both items from the pagan's spirit set (dagger and boots), you can use the vindicator ability." },
  { name:"Pain barrier"                , type:"mo" , book:"eowf" , desc:"Heal yourself for the total passive damage inflicted on a single opponent in the current round (e.g. bleed + disease = 3 health). Once per combat." },
  { name:"Pain sink"                   , type:"pa" , book:"eowf" , desc:"(See freeze.) Once per combat." },
  { name:"Paralysis"                   , type:"mo" , book:"rods" , desc:"If the metal scorpion is in aggressive stance and deals health damage to an opponent, that opponent's speed is lowered by 1 for the next combat round." },
  { name:"Parasite"                    , type:"mo" , book:"hof"  , desc:"(See steal.) Once per combat." },
  { name:"Parry"                       , type:"co" , book:"los"  , desc:"Use this ability to stop your opponent rolling for damage after they have won a round." },
  { name:"Patchwork Pauper"            , type:"pa" , book:"los"  , desc:"When replacing an item of equipment in your chest, feet, cloak or gloves locations on your hero sheet, you can keep the special ability from the old item but replace its name and attributes with those of the new item." },
  { name:"Penance"                     , type:"mo" , book:"hof"  , desc:"Spend 4 health to add one extra die when rolling for damage. Can be used before or after rolling. Once per combat." },
  { name:"Persuade"                    , type:"pa" , book:"eowf" , desc:"When selling items to vendors, increase the cost of the item by 10 gold crowns." },
  { name:"Petrify"                     , type:"pa" , book:"eowf" , desc:"(Death move; see murder.) Once per combat." },
  { name:"Phantom"                     , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, summon a phantom with 8 health that absorbs end-of-round damage to your hero. When it reaches zero health it is banished and outstanding passive damage passes back to your hero. Once per combat." },
  { name:"Pick 'n' mix"                , type:"mo" , book:"eowf" , desc:"Roll a die: [1]–[2] restore 2 health; [3]–[4] restore 4 health; [5]–[6] restore 6 health." },
  { name:"Piercing"                    , type:"co" , book:"los"  , desc:"Use Piercing to ignore your opponent's armour and apply your full damage score to their health." },
  { name:"Pillage"                     , type:"pa" , book:"hof"  , desc:"Each time you win a combat, roll two dice and automatically receive that amount of gold as a reward, in addition to any other gold." },
  { name:"Poison cloud"                , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, cast poison cloud: inflicts 1 damage to two adjacent opponents at end of every round for the duration of combat. Once per combat." },
  { name:"Poison Mastery"              , type:"pa" , book:"los"  , desc:"Health damage from the Venom special ability is increased by 1 (causing 3 points of health damage if used alone, or 4 if combined with Deadly Poisons)." },
  { name:"Pound"                       , type:"co" , book:"los"  , desc:"A mighty blow that increases your damage score by 3. However, in the next combat round, you must lower your speed by 1." },
  { name:"Power totem"                 , type:"co" , book:"eowf" , desc:"See entry 686 for full description. Once per combat." },
  { name:"Primal"                      , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, cast primal: automatically raise your own or an ally's brawn and magic by 2 for the remainder of the battle. Once per combat." },
  { name:"Prophecy"                    , type:"co" , book:"hof"  , desc:"Use when you've lost a combat round to avoid taking damage. Once per combat." },
  { name:"Protection"                  , type:"mo" , book:"eowf" , desc:"Turn an opponent's [6] result for their damage score into a [1]. Once per combat." },
  { name:"Prowler set"                 , type:"pa" , book:"hof"  , desc:"If wearing all three prowler items (head, gloves, chest), you may use evade, blind strike, backstab, sidestep and vanish without counting them toward your hexed ability quota." },
  { name:"Punch drunk"                 , type:"co" , book:"eowf" , desc:"When your opponent's damage score causes health damage, increase your armour by 4 for the next round only. Once per combat." },
  { name:"Puncture"                    , type:"co" , book:"los"  , desc:"Instead of rolling for a damage score, you can Puncture an opponent with a well-aimed arrow. This does 2 dice of damage, ignoring armour. It also reduces your opponent's armour by 1 for the remainder of the combat." },
  { name:"Purge"                       , type:"mo" , book:"hof"  , desc:"Cast on yourself or an ally to remove all disease and venom effects. Once per combat." },
  { name:"Quick cuts"                  , type:"pa" , book:"rods" , desc:"Each time you play a speed ability, inflict damage to one opponent equal to the brawn of your main hand weapon, ignoring armour." },
  { name:"Quick draw"                  , type:"mo" , book:"rods" , desc:"Before each combat begins, automatically inflict 2 damage to all opponents, ignoring armour. Note: does not inflict harmful passives." },
  { name:"Quicksilver"                 , type:"sp" , book:"los"  , desc:"Increase your speed by 2 for one combat round." },
  { name:"Radiance"                    , type:"sp" , book:"los"  , desc:"Dazzle your foes, temporarily blinding them. This lowers your opponent's speed by 2 for one combat round." },
  { name:"Raining Blows"               , type:"mo" , book:"los"  , desc:"Every time you get a [6] result when rolling for your damage score, you may automatically roll another die to add further damage. If you roll a [6] again, you may roll another die — and so on." },
  { name:"Rake"                        , type:"co" , book:"los"  , desc:"Instead of rolling for a damage score after winning a round, you can Rake an opponent. This inflicts 3 damage dice, ignoring armour. (Note: You cannot use modifiers with this ability.)" },
  { name:"Rallying call"               , type:"co" , book:"eowf" , desc:"(Requires a horn in the left hand.) Instead of rolling for damage, issue a rallying call: instantly restores 6 health and raises your brawn by 2 for the next round only. Once per combat." },
  { name:"Rapid pulse"                 , type:"pa" , book:"rods" , desc:"While your health is 10 or less, increase the damage effect of bleed on all affected opponents by 1." },
  { name:"Reaper"                      , type:"mo" , book:"hof"  , desc:"For each 5 health damage your damage score inflicts, heal 1 health (rounding down). Once per combat." },
  { name:"Rebound"                     , type:"co" , book:"los"  , desc:"When your opponent's damage score causes health damage, you can use Rebound to increase your speed by 2 for the next combat round." },
  { name:"Rebuke"                      , type:"pa" , book:"rods" , desc:"If your health is 10 or less, add 1 to each die you roll for your damage score." },
  { name:"Recall"                      , type:"mo" , book:"eowf" , desc:"Cast any time to restore a modifier ability you have already used. Once per combat." },
  { name:"Recharge"                    , type:"pa" , book:"eowf" , desc:"(Death move) Regain a speed or modifier ability you have already used, allowing you to use it again. Once per combat." },
  { name:"Reckless"                    , type:"sp" , book:"hof"  , desc:"Roll an extra die for attack speed. However, if you lose the round your opponent gets an extra damage die. Once per combat." },
  { name:"Recovery"                    , type:"pa" , book:"eowf" , desc:"(Death move) Immediately restore one modifier ability you have already used. Once per combat." },
  { name:"Recuperation"                , type:"pa" , book:"eowf" , desc:"(Death move) Gain 1 health at end of each combat round for the duration of combat. Once per combat." },
  { name:"Redemption"                  , type:"mo" , book:"hof"  , desc:"Raise your brawn by 2 for one combat round and heal 4 health. Once per combat." },
  { name:"Reflect"                     , type:"co" , book:"los"  , desc:"If your opponent is a vampire then you can use the magic mirror to Reflect any health damage that they would have inflicted, back onto the vampire." },
  { name:"Refresh"                     , type:"mo" , book:"hof"  , desc:"Restore an ability you or an ally has already used, allowing it to be used again. Once per combat." },
  { name:"Regrowth"                    , type:"mo" , book:"los"  , desc:"You may instantly restore 6 health anytime during combat. If you have multiple items with the Regrowth ability, each one can be used to restore 6 health." },
  { name:"Rend"                        , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast rend: inflicts 1 damage die plus the brawn or magic of your main hand weapon to your opponent ignoring armour, and lowers their armour by 1." },
  { name:"Resolve"                     , type:"mo" , book:"hof"  , desc:"Raise your own or an ally's armour by 4 for one combat round." },
  { name:"Resurrection"                , type:"mo" , book:"rods" , desc:"When your minion loses its last point of health, spend 3 magic to bring it back to life with its base magic, armour and health scores. Cannot be restored through other abilities once used." },
  { name:"Retaliation"                 , type:"co" , book:"los"  , desc:"When your opponent's damage score/damage dice causes health damage, you can immediately retaliate by inflicting 1 damage die back to them ignoring armour." },
  { name:"Retribution"                 , type:"co" , book:"rods" , desc:"When your opponent's damage score causes health damage, immediately retaliate by rolling 1 damage die and applying the result to any three opponents, ignoring armour." },
  { name:"Revenge"                     , type:"co" , book:"eowf" , desc:"When your opponent's damage score causes health damage, immediately retaliate by inflicting 1 damage die to all remaining opponents, ignoring armour. Once per combat." },
  { name:"Ricochet"                    , type:"co" , book:"rods" , desc:"Instead of rolling for damage, aim a bouncing bullet: roll a die for each opponent — [1] no damage; [2]–[4] 1 damage die; [5]–[6] 2 damage dice. Ignores armour." },
  { name:"Riposte"                     , type:"co" , book:"los"  , desc:"When your opponent's damage score/damage dice causes health damage, you can immediately retaliate by inflicting 1 damage die back to them ignoring armour." },
  { name:"Roll with it"                , type:"mo" , book:"hof"  , desc:"If you win a round, use the result of one of your attack speed dice for your damage score (adding brawn as normal). Once per combat." },
  { name:"Royal Regalia"               , type:"pa" , book:"los"  , desc:"If your hero is wearing both pieces of the Royal Regalia Set (shoulders and greaves) then you may use the Cripple ability. If your damage score causes health damage to your opponent, you can also Cripple them. This immediately lowers their speed score by 1 for the next three combat rounds." },
  { name:"Rust"                        , type:"co" , book:"los"  , desc:"If your damage score causes health damage to your opponent, you can also cast the spell Rust. This lowers your opponent's armour by 2 for the remainder of the combat." },
  { name:"Sacrifice"                   , type:"co" , book:"los"  , desc:"You may use this ability after an opponent has rolled their damage dice/damage score, to instantly sacrifice your Shades. The Shades absorb all the damage instead and you are unharmed. This destroys your Shades instantly." },
  { name:"Safe path"                   , type:"sp" , book:"hof"  , desc:"(See fearless.) Once per combat." },
  { name:"Salvation"                   , type:"pa" , book:"eowf" , desc:"Each time you use heal, regrowth or greater heal, increase its health benefit by 1." },
  { name:"Sand dance"                  , type:"co" , book:"rods" , desc:"(Requires a sword in main and/or left hand.) Deal damage to all opponents equal to the brawn value of any swords equipped. If you play a speed ability in the following round, it is free to use (can be used again)." },
  { name:"Savage arms set"             , type:"pa" , book:"hof"  , desc:"If equipped with both items from the savage arms set (main hand and left hand axe), you can use the mangle ability." },
  { name:"Savage call"                 , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, utter a savage call: automatically raise your brawn score by 2 for the remainder of the battle." },
  { name:"Savagery"                    , type:"mo" , book:"los"  , desc:"You may raise your brawn or magic score by 2 for one combat round." },
  { name:"Scalding geyser"             , type:"co" , book:"rods" , desc:"Instead of rolling for damage, summon a scalding geyser: automatically inflicts 4 damage to one opponent ignoring armour, then deals a further 1 damage at end of each round." },
  { name:"Scarab swarm"                , type:"co" , book:"rods" , desc:"Instead of rolling for damage after winning a round, unleash mechanical scarabs on one opponent: reduces their armour by 3 and they take 2 dice of damage ignoring armour." },
  { name:"Scarlet strikes"             , type:"pa" , book:"eowf" , desc:"(Death move) Automatically inflict damage equal to the brawn of your main and left hand weapons to all remaining opponents, ignoring armour. Once per combat." },
  { name:"Scythe"                      , type:"co" , book:"rods" , desc:"Instead of rolling for damage, deal 3 damage to three opponents, ignoring armour." },
  { name:"Sear"                        , type:"mo" , book:"los"  , desc:"Add 1 to the result of each die you roll for your damage score, for the duration of the combat. (Note: if you have multiple items with Sear, you can still only add 1 to the result.) Once per combat." },
  { name:"Sear"                        , type:"mo" , book:"hof"  , desc:"Add 1 to the result of each die you roll for your damage score, for the duration of the combat. (Note: if you have multiple items with Sear, you can still only add 1 to the result.) Once per combat." },
  { name:"Sear"                        , type:"mo" , book:"eowf" , desc:"Add 1 to the result of each die you roll for your damage score, for the duration of the combat. (Note: if you have multiple items with Sear, you can still only add 1 to the result.) Once per combat." },
  { name:"Searing mantle"              , type:"pa" , book:"hof"  , desc:"Your armour is coated in fire. Causes 1 damage to all opponents at end of every round for every 4 armour you are wearing." },
  { name:"Second Sight"                , type:"mo" , book:"los"  , desc:"Your reflexes are heightened. This lowers the result of each die your opponent rolls for damage by 2." },
  { name:"Second Skin"                 , type:"pa" , book:"los"  , desc:"You are immune to the Piercing ability. If an opponent uses Piercing, you may use armour as normal to absorb the damage." },
  { name:"Second Wind"                 , type:"mo" , book:"los"  , desc:"You may use Second Wind at any time to restore one speed ability that you or an ally has already played. This allows you/your ally to use that speed ability a second time in the same combat." },
  { name:"Seeing Red"                  , type:"pa" , book:"los"  , desc:"If your health is reduced to 20 or less, you may add 2 to your speed. If you are healed and your health rises above 20, you lose your bonus." },
  { name:"Seraph's protection"         , type:"pa" , book:"rods" , desc:"(Warp ability) Raise your armour by 3 and restore a charm ability you have already used. Costs 4 health to use." },
  { name:"Seraphim's symbols set"      , type:"pa" , book:"hof"  , desc:"If equipped with both items from the seraphim's symbols set (necklace and ring), you can use the tranquillity ability." },
  { name:"Shackle"                     , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only. You can only use this ability once per combat." },
  { name:"Shackles"                    , type:"sp" , book:"eowf" , desc:"(See webbed.) Once per combat." },
  { name:"Shades"                      , type:"pa" , book:"los"  , desc:"At the start of combat, you automatically summon a group of Shades to aid you. The Shades add 2 to each die of damage you roll, for the duration of the combat. Once the Shades have been summoned, they remain in play until you sacrifice them." },
  { name:"Shadow boost"                , type:"pa" , book:"rods" , desc:"While the gloom shade is in play, your shadow abilities are more powerful: dark pact can be used without sacrificing health; poison cloud can target three adjacent opponents; mind flay restores 2 health per opponent." },
  { name:"Shadow Fury"                 , type:"co" , book:"los"  , desc:"Use this ability to add the speed of both your weapons (main hand and left hand) to your damage score." },
  { name:"Shadow Speed"                , type:"mo" , book:"los"  , desc:"When rolling for your attack speed, all results of [1] can be changed to a [3]." },
  { name:"Shadow thorns"               , type:"pa" , book:"eowf" , desc:"(Death move) Summon barbed roots to tear at your opponents: 1 die of damage to each opponent (roll once, apply same damage to each). Once per combat." },
  { name:"Shadow well"                 , type:"pa" , book:"rods" , desc:"(Warp ability) Restore a modifier ability you have already used. Costs 4 health to use." },
  { name:"Shape shift"                 , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, let Nanuk take full control and shape shift into a bear: raises brawn by 3 and restores 4 health, but lowers armour to zero for the remainder of combat. Cannot use combat abilities while in bear form. Cannot revert until combat is over." },
  { name:"Shatter"                     , type:"co" , book:"hof"  , desc:"If your damage score causes health damage, reduce the opponent's armour by 2 for the remainder of combat. Once per combat." },
  { name:"Shield Spin"                 , type:"pa" , book:"los"  , desc:"(requires a shield in the left hand). Each time your opponent gets a [1] when rolling for attack speed, they are hit by your shield, taking 1 damage die, ignoring armour. They cannot use a re-roll to avoid this." },
  { name:"Shield Wall"                 , type:"co" , book:"los"  , desc:"(requires a shield in the left hand). Use this ability to double your armour score and inflict 1 damage die to your opponent, ignoring their armour." },
  { name:"Shock blast"                 , type:"co" , book:"eowf" , desc:"(See revenge.) Once per combat." },
  { name:"Shock blast (Raiders)"       , type:"co" , book:"rods" , desc:"Spend 2 magic points to inflict 2 dice of damage to one opponent ignoring armour, plus 1 extra damage for each point of armour they are wearing." },
  { name:"Shock treatment"             , type:"pa" , book:"hof"  , desc:"If an ally falls in battle, restore them to 10 health and remove all passive effects on that hero. Once per combat." },
  { name:"Shock!"                      , type:"co" , book:"los"  , desc:"If your damage score causes health damage to your opponent, you can also electrocute them with the Shock! ability. This inflicts 1 extra damage for every 2 points of armour your opponent is wearing, rounding up." },
  { name:"Shoulder charge"             , type:"co" , book:"eowf" , desc:"Use the result of one of your speed dice for your damage score (adding brawn or magic as normal). Once per combat." },
  { name:"Shroud burst"                , type:"pa" , book:"rods" , desc:"(Warp ability) Inflict 3 damage to all opponents, ignoring armour. Costs 4 health to use." },
  { name:"Shunt"                       , type:"co" , book:"hof"  , desc:"If your damage score causes health damage, reduce the opponent's speed by 2 for the next combat round. Once per combat." },
  { name:"Sidestep"                    , type:"co" , book:"los"  , desc:"Use this ability when you have lost a combat round, to avoid taking damage from your opponent. (Note: You will still take damage from passive abilities such as Bleed or Venom)." },
  { name:"Sideswipe"                   , type:"co" , book:"los"  , desc:"When your opponent's damage score/damage dice causes health damage, you can immediately retaliate by inflicting 1 damage die back to them ignoring armour." },
  { name:"Silver frost"                , type:"mo" , book:"hof"  , desc:"Freeze your opponent's attack speed dice, forcing them to use the same result in the next round. Once per combat." },
  { name:"Sinister schemes"            , type:"pa" , book:"rods" , desc:"Each time you use a warp ability, increase your speed and brawn by 1 for the duration of the current round." },
  { name:"Sinking sand"                , type:"mo" , book:"rods" , desc:"Spend 1 magic point to force an opponent to use their same attack speed result in the next round." },
  { name:"Siphon"                      , type:"mo" , book:"hof"  , desc:"All of your opponent's [6] results become [1] when rolling for their damage score." },
  { name:"Siphon"                      , type:"pa" , book:"eowf" , desc:"All of your opponent's [6] results become a [1] when rolling for their damage score." },
  { name:"Sixth sense"                 , type:"mo" , book:"rods" , desc:"Change an opponent's [6] result to a [1] at any time during combat." },
  { name:"Skewer"                      , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, skewer all opponents: roll 1 damage die and apply to each ignoring armour. Also lowers their speed by 1 for next round. Once per combat." },
  { name:"Slam"                        , type:"co" , book:"los"  , desc:"Use this ability to stop your opponent rolling for damage when they have won a round. In the next combat round, your opponent's speed is reduced by 1." },
  { name:"Slick"                       , type:"co" , book:"hof"  , desc:"If you win a round, use the total of your attack speed dice for your damage score (adding brawn as normal). Cannot use modifier abilities to alter these dice. Once per combat." },
  { name:"Slipstream"                  , type:"mo" , book:"rods" , desc:"Spend 1 magic point to win back a combat round you would have lost, allowing you to roll for damage instead." },
  { name:"Snake strike"                , type:"pa" , book:"hof"  , desc:"(Requires a snake in the left hand.) Before the first round, automatically inflict 2 damage dice to a single opponent ignoring armour. Also inflicts harmful passives such as bleed and venom." },
  { name:"Snakes Alive!"               , type:"sp" , book:"los"  , desc:"You may entangle your opponent in coils of dark magic, lowering their speed by 2 for one combat round." },
  { name:"Sneak"                       , type:"mo" , book:"hof"  , desc:"Change the result of one of your opponent's speed dice to a [1]. Once per combat." },
  { name:"Somersault"                  , type:"mo" , book:"rods" , desc:"Use one of your die results for your attack speed to replace a die you have rolled for your damage score." },
  { name:"Soul burst"                  , type:"pa" , book:"rods" , desc:"When you lose your last point of health, a magical shock brings you back to life, restoring you to 10 health." },
  { name:"Sound the charge!"           , type:"sp" , book:"eowf" , desc:"(Requires a horn in the left hand.) Roll an extra die for attack speed. If you win the round, also roll an extra die for damage. Once per combat." },
  { name:"Spark daggers"               , type:"pa" , book:"rods" , desc:"Before the first combat round, automatically inflict 2 damage to two opponents of your choosing, ignoring armour. Also inflicts harmful passives such as bleed and toxic blades." },
  { name:"Spark jolt"                  , type:"pa" , book:"rods" , desc:"At the end of every combat round, the lightning spark deals 1 damage to all opponents, ignoring armour." },
  { name:"Spectral claws"              , type:"co" , book:"eowf" , desc:"If you take health damage from your opponent's damage score, immediately strike back with 1 die of damage, ignoring armour. Once per combat." },
  { name:"Spider Sense"                , type:"co" , book:"los"  , desc:"Use this ability when you have lost a combat round, to avoid taking damage from your opponent. (Note: You will still take damage from passive abilities such as Bleed or Venom)." },
  { name:"Spin shot"                   , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, inflict 2 damage dice to your opponent ignoring armour, plus 3 extra damage for every speed point difference you have over your opponent this round. Once per combat." },
  { name:"Spindlesilk Set"             , type:"pa" , book:"los"  , desc:"If your hero is wearing all three pieces of Spindlesilk Armour (chest, boots and cloak) then you may use the Spider Sense ability. Use this ability when you have lost a combat round, to avoid taking damage from your opponent. (Note: You will still take damage from passive abilities such as Bleed or Venom)." },
  { name:"Spirit breaker"              , type:"co" , book:"eowf" , desc:"Once you have used take the bait, use in any subsequent round instead of rolling for damage: inflicts 3 damage dice ignoring armour and reduces opponent's armour by 2. Once per combat." },
  { name:"Spirit call"                 , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, summon a bear spirit: causes 2 damage at end of each round to one nominated opponent. Once per combat." },
  { name:"Spirit mark"                 , type:"co" , book:"hof"  , desc:"When your damage score causes health damage, mark the opponent with an ancestral rune. In subsequent rounds, increase your damage score by 2 against this opponent. Allies also benefit. Once per combat." },
  { name:"Spirit ward"                 , type:"mo" , book:"hof"  , desc:"Cast on yourself or an ally to raise armour by 6 for one combat round. Once per combat." },
  { name:"Splinters"                   , type:"co" , book:"eowf" , desc:"(See cleave.) Once per combat." },
  { name:"Spore Cloud"                 , type:"co" , book:"los"  , desc:"When your opponent's damage score/damage dice causes health damage, you can use Spore Cloud to inflict 2 damage dice back to them, ignoring armour." },
  { name:"Spring strike"               , type:"sp" , book:"rods" , desc:"For each damaged opponent, add 1 to your attack speed result." },
  { name:"Stagger"                     , type:"co" , book:"hof"  , desc:"If your damage score causes health damage, lower the opponent's armour to zero for the next round only. Once per combat." },
  { name:"Stake"                       , type:"pa" , book:"los"  , desc:"If your opponent is a vampire and their health is reduced to 10 or less, you may immediately Stake them. This reduces their health to zero and you automatically win the combat." },
  { name:"Stampede"                    , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, summon a stampede: chosen opponent takes 3 damage dice ignoring armour; the next opponent below them takes 2 damage dice; remaining opponents below them take 1 damage die. Once per combat." },
  { name:"Steadfast"                   , type:"pa" , book:"los"  , desc:"You are immune to Knockdown. If an opponent has this ability, you can ignore it." },
  { name:"Steal"                       , type:"mo" , book:"los"  , desc:"Use this ability any time in combat to automatically raise one of your attributes (speed, brawn, magic or armour) to match your opponent's. The effect wears off at the end of the combat round." },
  { name:"Stone rain"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, inflict 1 damage die ignoring armour. Each consecutive round it doubles (round 2: 2 dice, round 3: 4 dice). Ends if you use another ability or lose a round. Lasts up to three rounds. Once per combat." },
  { name:"Stone skin"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, activate stone skin: lowers your speed by 2. While active, if opponent wins a round roll a die — [1]–[2] their blow glances off and they don't roll for damage. Cannot use abilities other than trample. Remove by winning a round and not rolling for damage." },
  { name:"Storm shock"                 , type:"co" , book:"rods" , desc:"When your opponent's damage score causes health damage, immediately retaliate by inflicting 3 damage to all opponents, ignoring armour." },
  { name:"Stun"                        , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only. You can only use this ability once per combat." },
  { name:"Sunstroke"                   , type:"co" , book:"rods" , desc:"Spend 1 magic point to inflict 2 dice of damage to one opponent ignoring armour. Their speed is lowered by 1 for the next round." },
  { name:"Suppress"                    , type:"mo" , book:"hof"  , desc:"Reduce the result of your opponent's attack speed by 2 for one combat round. Once per combat." },
  { name:"Sure edge"                   , type:"mo" , book:"hof"  , desc:"(Requires an axe, sword, dagger or spear.) Add 1 to each die you roll for damage for the duration of combat." },
  { name:"Sure grip"                   , type:"mo" , book:"hof"  , desc:"All [1] results can be changed to [6] when rolling for attack speed." },
  { name:"Surefooted"                  , type:"mo" , book:"los"  , desc:"You may re-roll all your hero's speed dice. You must accept the result of the second roll." },
  { name:"Surge"                       , type:"co" , book:"los"  , desc:"A powerful attack that increases your magic score by 3. However, in the next combat round, you must lower your speed by 1." },
  { name:"Swamp Legs"                  , type:"sp" , book:"los"  , desc:"Reduce your opponent's speed by 1 for one combat round." },
  { name:"Sweet spot"                  , type:"pa" , book:"hof"  , desc:"Before combat begins, choose a number 1–6. Each time your opponent rolls that number for attack speed, they automatically take 2 damage." },
  { name:"Swift Strikes"               , type:"pa" , book:"los"  , desc:"(requires a sword in the main and left hand). For each [6] that you roll for your attack speed, you can inflict damage to any opponent, equal to the speed of your fastest weapon (either main or left hand). This ability ignores armour." },
  { name:"Tactics"                     , type:"mo" , book:"rods" , desc:"Reroll any die for damage, adding 2 to the result." },
  { name:"Take the bait"               , type:"co" , book:"eowf" , desc:"See entry 382 for full description. Once per combat." },
  { name:"Thorn Armour"                , type:"co" , book:"los"  , desc:"Use this ability to raise your armour by 3 for one combat round. It also inflicts 1 damage die, ignoring armour, to all your opponents (roll once and apply the same damage to each opponent)." },
  { name:"Thorn cage"                  , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, cast thorn cage: inflicts 1 damage die to one opponent ignoring armour, plus 1 damage at end of each round for the duration of combat. Once per combat." },
  { name:"Thorn Fist"                  , type:"co" , book:"los"  , desc:"When your opponent's damage score/damage dice causes health damage, you can immediately retaliate using your Thorn Fist. This inflicts 2 damage dice back to them, ignoring armour." },
  { name:"Thorn shield"                , type:"co" , book:"rods" , desc:"Raise your armour by 3 for one combat round and inflict 1 die of damage to an opponent of your choosing, ignoring their armour." },
  { name:"Thorns"                      , type:"pa" , book:"los"  , desc:"At the end of every combat round, you automatically inflict 1 damage to all of your opponents. This ability ignores armour." },
  { name:"Throwing knives"             , type:"mo" , book:"rods" , desc:"Before combat begins, automatically inflict 3 damage to one opponent, ignoring armour. Note: does not inflict your own passive abilities (such as bleed)." },
  { name:"Time Shift"                  , type:"sp" , book:"los"  , desc:"You may raise your speed to match your opponent's for three combat rounds. You cannot play another speed ability until Time Shift has faded." },
  { name:"Tome raider"                 , type:"pa" , book:"hof"  , desc:"Using the monocle you unlock hidden arcane secrets. Automatically add 2 magic to each spell book in your possession." },
  { name:"Tormented soul"              , type:"mo" , book:"eowf" , desc:"Sacrifice 4 health to instantly restore a speed or combat ability you have already used. Once per combat." },
  { name:"Torrent"                     , type:"mo" , book:"eowf" , desc:"When using cleave, lash or shadow thorns, roll two damage dice instead of one. Once per combat." },
  { name:"Torrent (Raiders)"           , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast torrent: automatically inflicts 8 damage to two opponents, ignoring armour." },
  { name:"Tourniquet"                  , type:"mo" , book:"los"  , desc:"This spell can be cast at any time to remove any Bleed, Venom and/or Disease effects that you or an ally have been inflicted with." },
  { name:"Toxic blades"                , type:"pa" , book:"rods" , desc:"(Requires a dagger in main and left hand.) If your damage dice or damage score causes health damage to an opponent, they continue to take a further point of damage at the end of each combat round. Ignores armour." },
  { name:"Toxicology"                  , type:"pa" , book:"hof"  , desc:"You are immune to all delirium, disease and venom effects." },
  { name:"Trample"                     , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, trample: roll 3 damage dice and apply to each opponent, ignoring armour. Once per combat." },
  { name:"Tranquillity"                , type:"pa" , book:"hof"  , desc:"You may heal 2 health per round when you use the meditation ability, instead of only 1." },
  { name:"Tremor strike"               , type:"sp" , book:"hof"  , desc:"Make the ground tremble beneath your enemies. Lowers opponents' speed by 2 for two combat rounds." },
  { name:"Trickster"                   , type:"mo" , book:"los"  , desc:"You may swap one of your opponent's speed die for your own." },
  { name:"Trojan exploit"              , type:"pa" , book:"rods" , desc:"(Warp ability) Raise your brawn or magic by 2 for one round and gain a charm special ability (lost at end of combat). Costs 4 health to use." },
  { name:"Turn up the heat"            , type:"pa" , book:"hof"  , desc:"Increase the damage caused by fire aura by 1. Allies in team battles also benefit." },
  { name:"Twin blade"                  , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, inflict the total of your attack speed dice to two adjacent opponents, ignoring armour. Once per combat." },
  { name:"Unbowed"                     , type:"pa" , book:"rods" , desc:"Each time you raise your armour in combat, restore your health by the same amount as the modifier." },
  { name:"Underhand"                   , type:"mo" , book:"hof"  , desc:"If you get a double for attack speed but your result is lower than your opponent's, use underhand to win the round. Once per combat." },
  { name:"Unshakeable"                 , type:"co" , book:"rods" , desc:"For each damaged opponent, raise your damage score result by 1." },
  { name:"Unstoppable"                 , type:"mo" , book:"hof"  , desc:"When an opponent wins a round, spend 5 health to automatically win it back and roll for damage. Once per combat." },
  { name:"Upper hand"                  , type:"pa" , book:"eowf" , desc:"(Death move) Automatically win the next combat round without rolling for attack speed. Once per combat." },
  { name:"Usurper"                     , type:"mo" , book:"los"  , desc:"(only usable in Hero vs Hero combat). Use any time during a combat to steal a speed or modifier ability that your opponent has already played. You may then play this ability against them during the combat, based on the ability's description." },
  { name:"Vampirism"                   , type:"mo" , book:"los"  , desc:"When you inflict damage on your opponent, you can heal yourself for half the amount of health that your opponent has lost, rounding up." },
  { name:"Vanish"                      , type:"co" , book:"los"  , desc:"Use Vanish to turn invisible for several seconds, avoiding your opponent's damage for one round." },
  { name:"Vanquish"                    , type:"mo" , book:"los"  , desc:"You may raise your brawn score by 2 for one combat round." },
  { name:"Veil"                        , type:"co" , book:"hof"  , desc:"Use when you've lost a combat round to avoid taking damage. You may also increase your speed by 1 for the next round. Once per combat." },
  { name:"Veiled strike"               , type:"pa" , book:"eowf" , desc:"Each time you use evade, sidestep or vanish, immediately inflict 1 damage die to a chosen opponent, ignoring armour." },
  { name:"Venom"                       , type:"pa" , book:"los"  , desc:"If your damage dice/damage score causes health damage to your opponent, they lose a further 2 health at the end of every combat round, for the remainder of the combat. This ability ignores armour." },
  { name:"Vigour mortis"               , type:"co" , book:"rods" , desc:"Raise your damage score by 2 and restore 4 health." },
  { name:"Vindicator"                  , type:"pa" , book:"hof"  , desc:"You may use your double-punch ability twice in the same combat, adding 2 to the result each time." },
  { name:"Virulence"                   , type:"co" , book:"rods" , desc:"Instead of rolling for damage, cast virulence: spread all passive effects currently on one opponent (such as bleed and toxic blades) to all other opponents." },
  { name:"Vital artery"                , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, inflict 1 damage die to a single opponent ignoring armour, then 1 point of damage at end of each round for the duration of combat. Once per combat." },
  { name:"Vitriol"                     , type:"pa" , book:"los"  , desc:"Use at the start of combat to coat your weapons in deadly bile. This does 1 damage to all opponents, including your hero, at the end of every combat round." },
  { name:"Volatile link"               , type:"pa" , book:"rods" , desc:"Your summoned minion has 3 extra health. When defeated, they explode, inflicting 1 damage die to all opponents ignoring armour (roll separately)." },
  { name:"Volatile mix"                , type:"mo" , book:"rods" , desc:"Roll dice as instructed: [1] reduce brawn and magic by 1 for the remainder of combat; [2] lose 1 health; [3] restore 2 health; [4] restore 4 health; [5] increase brawn and magic by 2 for this round; [6] restore 6 health." },
  { name:"Volcanism set"               , type:"pa" , book:"hof"  , desc:"If wearing all three volcanism items (head, gloves, chest), you can use back draft, fire aura, sear and fire shield without counting them toward your hexed ability quota." },
  { name:"Volley"                      , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, shower enemies with arrows: roll 1 damage die and apply to each opponent ignoring armour. Once per combat." },
  { name:"Vortex"                      , type:"co" , book:"hof"  , desc:"Cast vortex: at the start of each subsequent round, roll a die — [1]–[2] you are hit for 2 health; [3]+ each opponent is hit for 2 health. Stays in play for the rest of combat. Die result cannot be modified." },
  { name:"Vortex"                      , type:"co" , book:"eowf" , desc:"Cast vortex: at the start of each subsequent round, roll a die — [1]–[2] you are hit for 2 health; [3]+ each opponent is hit for 2 health. Stays in play for the rest of combat. Die result cannot be modified. Once per combat." },
  { name:"War paint"                   , type:"mo" , book:"hof"  , desc:"Raise your brawn or armour score by 3 for one combat round. Once per combat." },
  { name:"Warg strike"                 , type:"co" , book:"eowf" , desc:"Instead of rolling for damage, cast warg strike: roll 1 die — [1]–[2] opponent takes 2 damage dice; [3]–[4] 3 damage dice; [5]–[6] 3 damage dice plus 1 damage at end of every round. Ignores armour. Once per combat." },
  { name:"Watchful"                    , type:"mo" , book:"los"  , desc:"Use any time in combat to change an opponent's [6] result to a [1]." },
  { name:"Water jets"                  , type:"mo" , book:"rods" , desc:"Reroll all of your opponent's speed dice once per combat round." },
  { name:"Wave"                        , type:"co" , book:"hof"  , desc:"Assault enemies with a wave of mental energy: damage equal to your current magic score ignoring armour. Proportion amongst opponents, but no single opponent can take more than half your magic (rounding up). Once per combat." },
  { name:"Weaver"                      , type:"pa" , book:"hof"  , desc:"Each time you play a combat ability, heal 2 health." },
  { name:"Webbed"                      , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only." },
  { name:"Whirlwind"                   , type:"pa" , book:"rods" , desc:"Each time you use a speed ability, increase your brawn by 2 until the end of the combat round." },
  { name:"Wild child"                  , type:"mo" , book:"hof"  , desc:"Add 1 to your die result when using the ley line infusion ability." },
  { name:"Wind chill"                  , type:"pa" , book:"eowf" , desc:"Each time you play a speed ability, all opponents automatically take 2 damage ignoring armour." },
  { name:"Windblast"                   , type:"sp" , book:"los"  , desc:"This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only." },
  { name:"Windfall"                    , type:"co" , book:"eowf" , desc:"When your opponent's damage score causes health damage, restore one speed ability you have already used. Once per combat." },
  { name:"Winds of fate"               , type:"pa" , book:"rods" , desc:"Each time you use an ability that requires you to spend magic, roll a die. On [5] or [6] the ability can be used without spending any magic." },
  { name:"Windwalker"                  , type:"co" , book:"los"  , desc:"If you win a round, you can use all of your attack speed dice for your damage score (adding your brawn or magic as normal)." },
  { name:"Winged tormenter"            , type:"pa" , book:"rods" , desc:"Choose a target before combat begins. If the talon wing is in a passive stance, it deals 1 damage to the chosen target ignoring armour at the end of each round." },
  { name:"Wisdom"                      , type:"mo" , book:"hof"  , desc:"Raise your magic score by 2 for one combat round. Once per combat." },
  { name:"Wish master"                 , type:"sp" , book:"hof"  , desc:"At the start of a combat round, grow into a giant: speed lowered by 1 but magic and armour increased by 2 for the remainder of combat. Once per combat." },
  { name:"Wither"                      , type:"co" , book:"hof"  , desc:"Instead of rolling for damage, inflict 2 damage dice to a single opponent ignoring armour, and reduce their brawn or magic by 1 for the remainder of combat. Once per combat." },
  { name:"Wrath"                       , type:"pa" , book:"rods" , desc:"Each time you cast heal or regrowth, inflict 2 damage to an opponent of your choosing, ignoring armour." },
  { name:"Zapped!"                     , type:"sp" , book:"los"  , desc:"Use this ability to automatically shrink your opponent, making them weaker. Your opponent's speed, brawn and magic are lowered by 3 until the end of the combat round. Then the ability wears off and their stats are restored." },
];
;

// ─── Blank item template ──────────────────────────────────────────────────────
const blankItem = () => ({
  id: crypto.randomUUID(),
  name: '',
  stats: { speed: 0, brawn: 0, magic: 0, armour: 0 },
  ability: { name: '', type: 'sp', description: '' },
});

const blankBackpackItem = () => ({
  id: crypto.randomUUID(),
  name: '',
  effect: '',
  uses: 1,
  maxUses: 1,
});

// ─── Shared input style ───────────────────────────────────────────────────────
const inputSt = {
  background: 'rgba(0,0,0,0.45)',
  border: '1px solid var(--slot-border)',
  color: 'var(--parchment-light)',
  fontFamily: 'Crimson Text, serif',
  fontSize: 16,
  padding: '7px 10px',
  outline: 'none',
  borderRadius: 1,
  width: '100%',
};

const numSt = {
  ...inputSt,
  width: 60,
  fontFamily: 'Cinzel Decorative, serif',
  fontSize: 18,
  textAlign: 'center',
  padding: '5px 4px',
};

const labelSt = {
  fontFamily: 'Cinzel, serif',
  fontSize: 9,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: 'var(--parchment-dark)',
  display: 'block',
  marginBottom: 4,
};

// ─── Tooltip Component ────────────────────────────────────────────────────────
function ItemTooltip({ item }) {
  const statLines = Object.entries(item.stats).filter(([, v]) => v !== 0);
  return (
    <div className="slot-tooltip">
      <div className="tooltip-name">{item.name}</div>
      <div className="tooltip-stats">
        {statLines.length > 0
          ? statLines.map(([k, v]) => (
              <div key={k} className="tooltip-stat-line">
                <span className="tooltip-stat-key">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <span style={{color: v > 0 ? '#6dbf6d' : '#c0392b'}}>{v > 0 ? '+' : ''}{v}</span>
              </div>
            ))
          : <span style={{color:'rgba(139,105,20,0.5)',fontStyle:'italic'}}>No stat bonus</span>
        }
        {item.ability?.name && (
          <div className="tooltip-ability">
            <span className="tooltip-ability-type">{ABILITY_TYPE_LABEL[item.ability.type]} · </span>
            <strong style={{fontFamily:'Cinzel, serif',fontSize:'11px',fontStyle:'normal',color:'var(--parchment-light)'}}>{item.ability.name}</strong>
            {item.ability.description && <><br/>{item.ability.description}</>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Equipment Slot ───────────────────────────────────────────────────────────
function EquipSlot({ slotKey, item, onClick }) {
  const [hovered, setHovered] = useState(false);
  const meta = SLOT_META[slotKey];
  return (
    <div
      className={`eq-slot ${SLOT_POSITIONS[slotKey]} ${item ? 'equipped' : ''}`}
      onClick={() => onClick(slotKey)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item ? (
        <>
          <span className="slot-icon" style={{opacity:0.95}}>{SLOT_ICONS[slotKey]}</span>
          <span className="slot-item-name">{item.name.split(' ')[0]}</span>
          {hovered && <ItemTooltip item={item} />}
        </>
      ) : (
        <>
          <span className="slot-icon" style={{opacity:0.22}}>{SLOT_ICONS[slotKey]}</span>
          <span className="slot-name">{meta.label}</span>
        </>
      )}
    </div>
  );
}

// ─── Item Entry Form ──────────────────────────────────────────────────────────
function ItemEntryForm({ slotKey, initial, onSave, onCancel }) {
  const [item, setItem] = useState(() => initial ? JSON.parse(JSON.stringify(initial)) : blankItem());
  const [hasAbility, setHasAbility] = useState(!!(initial?.ability?.name));

  const setStat = (stat, val) => {
    const n = parseInt(val) || 0;
    setItem(it => ({...it, stats: {...it.stats, [stat]: n}}));
  };
  const setAbilityField = (field, val) =>
    setItem(it => ({...it, ability: {...it.ability, [field]: val}}));

  const valid = item.name.trim().length > 0;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {/* Name */}
      <div>
        <label style={labelSt}>Item Name *</label>
        <input style={{...inputSt, fontSize:17}} placeholder="e.g. Notched blade"
          value={item.name} autoFocus
          onChange={e => setItem(it => ({...it, name: e.target.value}))}
          onKeyDown={e => e.key==='Enter' && valid && onSave(item)}/>
      </div>

      {/* Stat bonuses */}
      <div>
        <label style={labelSt}>Stat Bonuses (enter 0 if none)</label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {['speed','brawn','magic','armour'].map(stat => (
            <div key={stat} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
              <span style={{...labelSt,marginBottom:0}}>{stat}</span>
              <input type="number" min={0} max={20} style={numSt}
                value={item.stats[stat] || 0}
                onChange={e => setStat(stat, e.target.value)}/>
            </div>
          ))}
        </div>
      </div>

      {/* Ability toggle */}
      <div>
        <label style={{...labelSt,display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
          <input type="checkbox" checked={hasAbility}
            onChange={e => {
              const checked = e.target.checked;
              setHasAbility(checked);
              // If turning ON and item.ability is null/missing, initialise it so fields don't crash
              if (checked && !item.ability?.name && !item.ability?.type) {
                setItem(it => ({...it, ability: { name: '', type: 'sp', description: '' }}));
              }
            }}
            style={{width:14,height:14,accentColor:'var(--gold)'}}/>
          This item has a special ability
        </label>
      </div>

      {/* Ability fields */}
      {hasAbility && item.ability && (
        <div style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(90,74,32,0.3)',
          padding:'12px',borderRadius:1,display:'flex',flexDirection:'column',gap:10}}>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:2}}>
              <label style={labelSt}>Ability Name</label>
              <input style={inputSt} placeholder="e.g. Bleed"
                value={item.ability.name}
                onChange={e => setAbilityField('name', e.target.value)}/>
            </div>
            <div style={{flex:1}}>
              <label style={labelSt}>Type</label>
              <select style={{...inputSt,cursor:'pointer'}}
                value={item.ability.type}
                onChange={e => setAbilityField('type', e.target.value)}>
                <option value="sp">Speed (sp)</option>
                <option value="co">Combat (co)</option>
                <option value="mo">Modifier (mo)</option>
                <option value="pa">Passive (pa)</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelSt}>Description (optional)</label>
            <textarea style={{...inputSt,resize:'vertical',lineHeight:1.5}} rows={2}
              placeholder="e.g. Once per combat, apply bleed to opponent"
              value={item.ability.description}
              onChange={e => setAbilityField('description', e.target.value)}/>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{display:'flex',gap:8,marginTop:4}}>
        <button className="btn-create" style={{flex:2,padding:'10px'}}
          onClick={() => onSave({...item, ability: hasAbility ? item.ability : null})}
          disabled={!valid}>
          {initial ? 'Update Item' : 'Equip Item'}
        </button>
        <button className="btn-unequip" style={{flex:1,margin:0}}
          onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Item Modal ───────────────────────────────────────────────────────────────
function ItemModal({ slotKey, currentItem, onEquip, onUnequip, onClose }) {
  const [mode, setMode] = useState(currentItem ? 'view' : 'enter'); // view | enter | edit

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-header">
          <span className="modal-title">— {SLOT_META[slotKey]?.label} Slot —</span>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          {/* Currently equipped item */}
          {currentItem && mode === 'view' && (
            <>
              <div style={{marginBottom:12,padding:'10px 12px',
                background:'rgba(212,160,23,0.05)',border:'1px solid rgba(212,160,23,0.2)',borderRadius:1}}>
                <div style={{fontFamily:'Cinzel,serif',fontSize:15,color:'var(--gold)',marginBottom:6}}>
                  {currentItem.name}
                </div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:currentItem.ability?.name?6:0}}>
                  {Object.entries(currentItem.stats).filter(([,v])=>v!==0).map(([k,v])=>(
                    <span key={k} className="stat-chip" style={{color:v>0?'var(--gold)':'#c0392b'}}>{v>0?'+':''}{v} {k.charAt(0).toUpperCase()+k.slice(1)}</span>
                  ))}
                  {!Object.values(currentItem.stats).some(v=>v!==0) &&
                    <span style={{fontSize:12,color:'rgba(139,105,20,0.4)',fontStyle:'italic'}}>No stat bonus</span>}
                </div>
                {currentItem.ability?.name && (
                  <div style={{fontSize:13,color:'var(--parchment-dark)',fontStyle:'italic'}}>
                    <span style={{color:'var(--blood-bright)',fontStyle:'normal',fontFamily:'Cinzel,serif',
                      fontSize:10,textTransform:'uppercase',letterSpacing:1,marginRight:6}}>
                      {ABILITY_TYPE_LABEL[currentItem.ability.type]}
                    </span>
                    {currentItem.ability.name}
                    {currentItem.ability.description && ` — ${currentItem.ability.description}`}
                  </div>
                )}
              </div>
              <div style={{display:'flex',gap:8,marginBottom:16}}>
                <button className="btn-gold" style={{flex:1}} onClick={()=>setMode('edit')}>Edit</button>
                <button className="btn-unequip" style={{flex:1,margin:0}} onClick={()=>{onUnequip();onClose();}}>Remove</button>
              </div>
              <hr className="divider"/>
              <div style={{...labelSt,textAlign:'center',marginBottom:12}}>Or equip a different item</div>
            </>
          )}

          {/* Entry / edit form */}
          {(mode === 'enter' || mode === 'edit') && (
            <ItemEntryForm
              slotKey={slotKey}
              initial={mode === 'edit' ? currentItem : null}
              onSave={item => { onEquip(item); onClose(); }}
              onCancel={() => currentItem ? setMode('view') : onClose()}
            />
          )}

          {/* Empty slot — just show the form */}
          {!currentItem && mode === 'enter' && null}

        </div>
      </div>
    </div>
  );
}

// ─── Backpack Entry Form ──────────────────────────────────────────────────────
function BackpackModal({ slotIndex, currentItem, onEquip, onUnequip, onClose }) {
  const [mode, setMode] = useState(currentItem ? 'view' : 'enter');
  const [item, setItem] = useState(() => currentItem ? JSON.parse(JSON.stringify(currentItem)) : blankBackpackItem());

  const valid = item.name.trim().length > 0;

  const handleSave = () => {
    onEquip({...item, maxUses: item.uses});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" style={{maxWidth:380}}>
        <div className="modal-header">
          <span className="modal-title">— Backpack Slot {slotIndex + 1} —</span>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          {/* View current */}
          {currentItem && mode === 'view' && (
            <>
              <div style={{marginBottom:12,padding:'10px 12px',
                background:'rgba(212,160,23,0.05)',border:'1px solid rgba(212,160,23,0.2)',borderRadius:1}}>
                <div style={{fontFamily:'Cinzel,serif',fontSize:15,color:'var(--gold)',marginBottom:4}}>
                  {currentItem.name}
                </div>
                {currentItem.effect && (
                  <div style={{fontSize:13,color:'var(--parchment-dark)',fontStyle:'italic',marginBottom:4}}>
                    {currentItem.effect}
                  </div>
                )}
                <div style={{fontFamily:'Cinzel,serif',fontSize:11,
                  color:currentItem.uses>0?'#6dbf6d':'rgba(139,26,26,0.7)'}}>
                  {currentItem.uses} / {currentItem.maxUses||currentItem.uses} use{currentItem.maxUses!==1?'s':''}remaining
                </div>
              </div>
              {/* Use / adjust uses */}
              <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
                <span style={{...labelSt,marginBottom:0,flexShrink:0}}>Uses left:</span>
                <button className="btn-gold" style={{padding:'4px 12px'}}
                  onClick={()=>onEquip({...currentItem,uses:Math.max(0,currentItem.uses-1)})}>
                  − Use one
                </button>
                <button className="btn-gold" style={{padding:'4px 12px'}}
                  onClick={()=>onEquip({...currentItem,uses:Math.min(currentItem.maxUses||99,currentItem.uses+1)})}>
                  + Restore
                </button>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:16}}>
                <button className="btn-gold" style={{flex:1}} onClick={()=>{setItem(JSON.parse(JSON.stringify(currentItem)));setMode('edit');}}>Edit</button>
                <button className="btn-unequip" style={{flex:1,margin:0}} onClick={()=>{onUnequip();onClose();}}>Remove</button>
              </div>
            </>
          )}

          {/* Entry / edit form */}
          {(mode === 'enter' || mode === 'edit') && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={labelSt}>Item Name *</label>
                <input style={{...inputSt,fontSize:17}} placeholder="e.g. Gourd of healing"
                  value={item.name} autoFocus
                  onChange={e=>setItem(i=>({...i,name:e.target.value}))}
                  onKeyDown={e=>e.key==='Enter'&&valid&&handleSave()}/>
              </div>
              <div>
                <label style={labelSt}>Effect / Description</label>
                <input style={inputSt} placeholder="e.g. Restore 6 health (one use)"
                  value={item.effect||''}
                  onChange={e=>setItem(i=>({...i,effect:e.target.value}))}/>
              </div>
              <div>
                <label style={labelSt}>Number of Uses</label>
                <input type="number" min={1} max={99} style={{...numSt,width:80}}
                  value={item.uses||1}
                  onChange={e=>setItem(i=>({...i,uses:parseInt(e.target.value)||1,maxUses:parseInt(e.target.value)||1}))}/>
              </div>
              <div style={{display:'flex',gap:8,marginTop:4}}>
                <button className="btn-create" style={{flex:2,padding:'10px'}}
                  onClick={handleSave} disabled={!valid}>
                  {mode==='edit'?'Update':'Add to Backpack'}
                </button>
                <button className="btn-unequip" style={{flex:1,margin:0}}
                  onClick={()=>currentItem?setMode('view'):onClose()}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ability Glossary Tab ─────────────────────────────────────────────────────
const TYPE_COLOR = { sp:'#4a9eff', co:'#c0392b', mo:'var(--gold)', pa:'#6dbf6d' };
const TYPE_BG    = { sp:'rgba(74,158,255,0.08)', co:'rgba(192,57,43,0.08)', mo:'rgba(212,160,23,0.08)', pa:'rgba(109,191,109,0.08)' };
const TYPE_BORDER= { sp:'rgba(74,158,255,0.35)', co:'rgba(192,57,43,0.35)', mo:'rgba(212,160,23,0.35)', pa:'rgba(109,191,109,0.35)' };
const TYPE_LABEL = { sp:'Speed', co:'Combat', mo:'Modifier', pa:'Passive' };

// Book short labels for badges
const BOOK_BADGE = { los:'B1', hof:'B2', eowf:'B3', rods:'B4' };
const BOOK_COLOR = { los:'#c0a060', hof:'#c0392b', eowf:'#4a9eff', rods:'#e8a830' };
const BOOK_FULL  = { los:'Book 1 — Legion of Shadow', hof:'Book 2 — Heart of Fire', eowf:"Book 3 — Eye of Winter's Fury", rods:'Book 4 — Raiders of Dune Sea' };

function GlossaryTab({ onAddAbility }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [bookFilter, setBookFilter] = useState('all');
  const [expanded, setExpanded] = useState(null); // "Name|book" key

  const q = search.toLowerCase();

  // Filter raw entries first
  const rawResults = ABILITY_DB.filter(a => {
    const matchType = filter === 'all' || a.type === filter;
    const matchBook = bookFilter === 'all' || a.book === bookFilter;
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    return matchType && matchBook && matchSearch;
  });

  // Group same-name entries: if all variants have identical desc+type, collapse to one row
  // showing combined book tags. If they differ (type or desc), show separate rows.
  const grouped = [];
  const seen = {};
  for (const a of rawResults) {
    const key = a.name.toLowerCase();
    if (!seen[key]) {
      seen[key] = { entries: [], name: a.name };
      grouped.push(seen[key]);
    }
    seen[key].entries.push(a);
  }

  // For each group decide display mode
  const displayRows = grouped.map(g => {
    const { entries, name } = g;
    if (entries.length === 1) {
      return { key: `${name}|${entries[0].book}`, name, variants: entries, collapsed: true };
    }
    // Check if all entries identical (same type + same desc core)
    const firstType = entries[0].type;
    const firstDesc = entries[0].desc.replace(/Once per combat\.?\s*/i,'').trim();
    const allSame = entries.every(e =>
      e.type === firstType &&
      e.desc.replace(/Once per combat\.?\s*/i,'').trim() === firstDesc
    );
    if (allSame) {
      // Collapse: show single row with all book tags
      return { key: `${name}|all`, name, variants: entries, collapsed: true, mergedType: firstType, mergedDesc: entries[0].desc };
    }
    // Different per book: show separate rows
    return { key: `${name}|split`, name, variants: entries, collapsed: false };
  });

  // Flatten for rendering
  const renderItems = [];
  for (const row of displayRows) {
    if (row.collapsed) {
      renderItems.push({ rowKey: row.key, name: row.name, variants: row.variants, merged: true,
        type: row.mergedType || row.variants[0].type, desc: row.mergedDesc || row.variants[0].desc });
    } else {
      for (const v of row.variants) {
        renderItems.push({ rowKey: `${row.name}|${v.book}`, name: v.name, variants: [v], merged: false,
          type: v.type, desc: v.desc });
      }
    }
  }

  return (
    <div>
      {/* Search */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search abilities…"
        style={{width:'100%',background:'rgba(0,0,0,0.5)',border:'1px solid var(--slot-border)',
          color:'var(--parchment-light)',padding:'10px 14px',fontFamily:'Crimson Text,serif',
          fontSize:16,outline:'none',borderRadius:1,marginBottom:10}}/>

      {/* Type filter pills */}
      <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
        {[['all','All','var(--parchment-dark)'],['sp','Speed','#4a9eff'],['co','Combat','#c0392b'],['mo','Modifier','var(--gold)'],['pa','Passive','#6dbf6d']].map(([key,label,color])=>(
          <button key={key} onClick={()=>setFilter(key)}
            style={{padding:'4px 14px',fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:1,
              textTransform:'uppercase',cursor:'pointer',borderRadius:1,transition:'all 0.15s',
              background: filter===key ? TYPE_BG[key]||'rgba(212,160,23,0.1)' : 'rgba(0,0,0,0.3)',
              border:`1px solid ${filter===key ? (TYPE_BORDER[key]||'rgba(212,160,23,0.4)') : 'rgba(90,74,32,0.3)'}`,
              color: filter===key ? color : 'var(--parchment-dark)'}}>
            {label}
          </button>
        ))}
        <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'rgba(139,105,20,0.4)',
          alignSelf:'center',marginLeft:'auto',letterSpacing:1}}>
          {rawResults.length} entries
        </span>
      </div>

      {/* Book filter pills */}
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
        {[
          ['all','All Books', 'var(--parchment-dark)'],
          ['los','B1 — Legion', BOOK_COLOR.los],
          ['hof','B2 — Heart of Fire', BOOK_COLOR.hof],
          ['eowf','B3 — Winter\'s Fury', BOOK_COLOR.eowf],
          ['rods','B4 — Dune Sea', BOOK_COLOR.rods],
        ].map(([key,label,col])=>(
          <button key={key} onClick={()=>setBookFilter(key)}
            style={{padding:'3px 10px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
              textTransform:'uppercase',cursor:'pointer',borderRadius:1,transition:'all 0.15s',
              background: bookFilter===key ? 'rgba(212,160,23,0.15)' : 'rgba(0,0,0,0.2)',
              border:`1px solid ${bookFilter===key ? col : 'rgba(90,74,32,0.25)'}`,
              color: bookFilter===key ? col : 'var(--parchment-dark)'}}>
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {renderItems.map(item => {
          const isOpen = expanded === item.rowKey;
          // For split rows (different per-book), show which book this variant is
          const isSplit = !item.merged && item.variants.length === 1;
          return (
            <div key={item.rowKey}
              onClick={() => setExpanded(isOpen ? null : item.rowKey)}
              style={{background: isOpen ? TYPE_BG[item.type] : 'rgba(0,0,0,0.25)',
                border:`1px solid ${isOpen ? TYPE_BORDER[item.type] : 'rgba(90,74,32,0.2)'}`,
                borderRadius:1,padding:'9px 12px',cursor:'pointer',transition:'all 0.15s'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                {/* Type badge */}
                <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,
                  textTransform:'uppercase',padding:'2px 6px',borderRadius:1,flexShrink:0,
                  background: TYPE_BG[item.type], border:`1px solid ${TYPE_BORDER[item.type]}`,
                  color: TYPE_COLOR[item.type]}}>
                  {item.type}
                </span>
                {/* Name */}
                <span style={{fontFamily:'Cinzel,serif',fontSize:13,color:'var(--parchment-light)',flex:1,minWidth:80}}>
                  {item.name}
                </span>
                {/* Book badges — all variants */}
                <div style={{display:'flex',gap:3,flexShrink:0}}>
                  {item.variants.map(v => (
                    <span key={v.book}
                      title={BOOK_FULL[v.book]||v.book}
                      style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1,
                        padding:'2px 5px',borderRadius:1,
                        background:`${BOOK_COLOR[v.book]||'#888'}18`,
                        border:`1px solid ${BOOK_COLOR[v.book]||'#888'}55`,
                        color: BOOK_COLOR[v.book]||'#888',
                        fontWeight:'bold'}}>
                      {BOOK_BADGE[v.book]||v.book}
                      {/* Show type if split variants have different types */}
                      {isSplit ? '' : (item.merged && item.variants.length > 1 && v.type !== item.type ? ` (${v.type})` : '')}
                    </span>
                  ))}
                </div>
                {/* + Track button */}
                <button onClick={e=>{e.stopPropagation();onAddAbility(item.type, item.name);}}
                  style={{padding:'3px 9px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                    cursor:'pointer',borderRadius:1,flexShrink:0,
                    background:'rgba(212,160,23,0.06)',border:'1px solid rgba(212,160,23,0.3)',
                    color:'var(--parchment-dark)',transition:'all 0.15s'}}
                  title="Add to your ability tracker">
                  + Track
                </button>
                <span style={{color:'var(--parchment-dark)',fontSize:11,flexShrink:0}}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>

              {isOpen && (
                <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${TYPE_BORDER[item.type]}`}}>
                  {/* If merged identical variants, show single desc */}
                  {item.merged && (
                    <div style={{fontSize:14,color:'var(--parchment-light)',lineHeight:1.7,fontFamily:'Crimson Text,serif',marginBottom:6}}>
                      {item.desc}
                    </div>
                  )}
                  {/* If split variants (different per book), show each variant */}
                  {!item.merged && item.variants.map(v => (
                    <div key={v.book} style={{marginBottom:10,paddingLeft:8,
                      borderLeft:`2px solid ${BOOK_COLOR[v.book]||'#888'}55`}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                        <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1,
                          padding:'2px 6px',borderRadius:1,
                          background:`${BOOK_COLOR[v.book]||'#888'}18`,
                          border:`1px solid ${BOOK_COLOR[v.book]||'#888'}55`,
                          color: BOOK_COLOR[v.book]||'#888',fontWeight:'bold'}}>
                          {BOOK_BADGE[v.book]||v.book}
                        </span>
                        <span style={{fontFamily:'Cinzel,serif',fontSize:10,color:'var(--parchment-dark)',letterSpacing:1}}>
                          {BOOK_FULL[v.book]||v.book}
                        </span>
                        <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,
                          textTransform:'uppercase',padding:'1px 5px',borderRadius:1,
                          background: TYPE_BG[v.type], border:`1px solid ${TYPE_BORDER[v.type]}`,
                          color: TYPE_COLOR[v.type]}}>
                          {v.type}
                        </span>
                      </div>
                      <div style={{fontSize:13,color:'var(--parchment-light)',lineHeight:1.6,fontFamily:'Crimson Text,serif'}}>
                        {v.desc}
                      </div>
                    </div>
                  ))}
                  {/* Merged but variants have different types/descs — show per-book breakdown */}
                  {item.merged && item.variants.length > 1 && (() => {
                    const firstDesc = item.variants[0].desc;
                    const allSameDesc = item.variants.every(v => v.desc === firstDesc);
                    const allSameType = item.variants.every(v => v.type === item.type);
                    if (!allSameDesc || !allSameType) {
                      return (
                        <div style={{marginTop:6,display:'flex',flexDirection:'column',gap:4}}>
                          {item.variants.map(v => (
                            <div key={v.book} style={{paddingLeft:8,
                              borderLeft:`2px solid ${BOOK_COLOR[v.book]||'#888'}55`}}>
                              <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}>
                                <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1,
                                  padding:'1px 5px',borderRadius:1,
                                  background:`${BOOK_COLOR[v.book]||'#888'}18`,
                                  border:`1px solid ${BOOK_COLOR[v.book]||'#888'}55`,
                                  color: BOOK_COLOR[v.book]||'#888',fontWeight:'bold'}}>
                                  {BOOK_BADGE[v.book]||v.book}
                                </span>
                                {v.type !== item.type && (
                                  <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,
                                    textTransform:'uppercase',padding:'1px 5px',borderRadius:1,
                                    background: TYPE_BG[v.type], border:`1px solid ${TYPE_BORDER[v.type]}`,
                                    color: TYPE_COLOR[v.type]}}>
                                    {v.type}
                                  </span>
                                )}
                              </div>
                              {v.desc !== firstDesc && (
                                <div style={{fontSize:12,color:'rgba(232,213,163,0.7)',lineHeight:1.5,fontFamily:'Crimson Text,serif'}}>
                                  {v.desc}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          );
        })}
        {renderItems.length === 0 && (
          <div style={{textAlign:'center',padding:'24px',fontSize:13,color:'rgba(139,105,20,0.4)',fontStyle:'italic'}}>
            No abilities match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Abilities Tab Component ──────────────────────────────────────────────────
function AbilitiesTab({ hero, setHero }) {
  const [abMode, setAbMode] = useState('tracker');

  const keyMap  = { sp:'speed', co:'combat', mo:'modifier', pa:'passive' };
  const typeKey = { speed:'sp', combat:'co', passive:'pa', modifier:'mo' };

  // stackable: abilities where EACH EQUIPPED ITEM COPY grants one use.
  // Glossary: charm (FAQ Q5), heal, regrowth, channel (HoF/Dune), greater heal/healing (EoWF/HoF).
  // mend is NOT stackable — once per combat regardless of copies owned.
  const stackable = ['charm','heal','regrowth','channel','greater heal','greater healing'];

  const addAbilityToTracker = (type, name) => {
    const key = keyMap[type] || 'combat';
    const isStackable = stackable.some(s => name.toLowerCase().includes(s));
    setHero(h => {
      const cur = (h.specialAbilities||{})[key] || [];
      if (!isStackable && cur.some(x=>x.toLowerCase()===name.toLowerCase())) return h;
      return {...h, specialAbilities:{...(h.specialAbilities||{}), [key]:[...cur, name]}};
    });
    setAbMode('tracker');
  };

  // ── Career selection with mechanical application ───────────────────────────
  const book      = (typeof BOOKS !== 'undefined' ? BOOKS : []).find(b=>b.id===(hero.bookId||'los')) || { careers:[] };
  const currentCareer = hero.career || null;

  const selectCareer = (careerName) => {
    const isDeselecting = currentCareer === careerName;
    setHero(h => {
      let updated = { ...h };

      // 1. Strip abilities from OLD career (if any)
      if (h.career && CAREER_DATA[h.career]) {
        const old = CAREER_DATA[h.career];
        // Remove health bonus from old career
        if (old.healthBonus > 0) {
          const newMax  = Math.max(1, (h.baseAttributes.maxHealth||0) - old.healthBonus);
          const newHP   = Math.min(h.baseAttributes.health, newMax);
          updated = { ...updated, baseAttributes: { ...updated.baseAttributes, maxHealth: newMax, health: newHP } };
        }
        // Remove career abilities from specialAbilities
        old.abilities.forEach(({ name, type }) => {
          const key = keyMap[type] || 'combat';
          updated = {
            ...updated,
            specialAbilities: {
              ...(updated.specialAbilities||{}),
              [key]: ((updated.specialAbilities||{})[key]||[])
                .filter(a => a.toLowerCase() !== name.toLowerCase()),
            },
          };
        });
      }

      if (isDeselecting) {
        return { ...updated, career: null };
      }

      // 2. Apply NEW career
      const cd = CAREER_DATA[careerName];
      if (!cd) return { ...updated, career: careerName };

      // Apply health bonus — only raise the MAX, never auto-heal current HP.
      // If the hero is at full health (health === maxHealth), also raise current HP
      // so they aren't immediately below max after selecting a career on a fresh hero.
      if (cd.healthBonus > 0) {
        const oldMax = updated.baseAttributes.maxHealth || 0;
        const oldHP  = updated.baseAttributes.health    || 0;
        const newMax = oldMax + cd.healthBonus;
        // Only grant HP if currently at full health (fresh hero / just created)
        const newHP  = oldHP >= oldMax ? newMax : oldHP;
        updated = { ...updated, baseAttributes: { ...updated.baseAttributes, maxHealth: newMax, health: newHP } };
      }

      // Inject career abilities (deduplicated unless stackable)
      cd.abilities.forEach(({ name, type }) => {
        const key = keyMap[type] || 'combat';
        const cur = (updated.specialAbilities||{})[key] || [];
        const isStack = stackable.some(s => name.toLowerCase().includes(s));
        if (!isStack && cur.some(a=>a.toLowerCase()===name.toLowerCase())) return;
        updated = {
          ...updated,
          specialAbilities: {
            ...(updated.specialAbilities||{}),
            [key]: [...cur, name],
          },
        };
      });

      return { ...updated, career: careerName };
    });
  };

  // ── Career path groupings for display ────────────────────────────────────
  const careersByPath = book.careers.reduce((acc, c) => {
    const cd = CAREER_DATA[c];
    const path = cd ? cd.path : 'other';
    if (!acc[path]) acc[path] = [];
    acc[path].push(c);
    return acc;
  }, {});
  const pathOrder = ['warrior','mage','rogue','other'];
  const pathLabels = { warrior:'Warrior Path', mage:'Mage Path', rogue:'Rogue Path', other:'Other' };
  const pathColors = { warrior:'#c0392b', mage:'#4a9eff', rogue:'#6dbf6d', other:'var(--gold)' };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>

      {/* ── Mode toggle ── */}
      <div style={{display:'flex',gap:0,border:'1px solid var(--slot-border)',borderRadius:1,overflow:'hidden'}}>
        {[['tracker','My Abilities'],['glossary',`Glossary (${[...new Set(ABILITY_DB.map(a=>a.name))].length})`]].map(([m,lbl],i,arr)=>(
          <button key={m} onClick={()=>setAbMode(m)}
            style={{flex:1,padding:'10px 6px',fontFamily:'Cinzel,serif',fontSize:10,
              letterSpacing:1,textTransform:'uppercase',cursor:'pointer',transition:'all 0.2s',
              background:abMode===m?'rgba(212,160,23,0.1)':'transparent',
              border:'none',
              borderRight:i<arr.length-1?'1px solid var(--slot-border)':'none',
              color:abMode===m?'var(--gold)':'var(--parchment-dark)'}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── CAREER PICKER (always visible at top of tracker) ── */}
      {abMode==='tracker' && book.careers.length>0 && (
        <div className="panel">
          <div className="panel-header">Career — tap to select · abilities applied automatically</div>
          <div className="panel-body" style={{paddingTop:10,paddingBottom:12}}>
            {pathOrder.filter(p=>careersByPath[p]?.length>0).map(path=>(
              <div key={path} style={{marginBottom:12}}>
                <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:3,
                  textTransform:'uppercase',color:pathColors[path],marginBottom:6}}>
                  {pathLabels[path]}
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {(careersByPath[path]||[]).map(c=>{
                    const active = currentCareer===c;
                    const cd = CAREER_DATA[c];
                    return (
                      <button key={c} onClick={()=>selectCareer(c)}
                        title={cd ? cd.hint : c}
                        style={{padding:'5px 12px',fontFamily:'Cinzel,serif',fontSize:10,
                          letterSpacing:1,cursor:'pointer',borderRadius:1,transition:'all 0.15s',
                          background: active ? `rgba(212,160,23,0.15)` : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${active ? 'var(--gold)' : 'rgba(90,74,32,0.3)'}`,
                          color: active ? 'var(--gold)' : 'var(--parchment-dark)'}}>
                        {c}
                        {active && <span style={{marginLeft:5,fontSize:9,opacity:0.7}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                {/* Show active career abilities */}
                {currentCareer && careersByPath[path]?.includes(currentCareer) && CAREER_DATA[currentCareer] && (
                  <div style={{marginTop:8,padding:'8px 12px',background:'rgba(212,160,23,0.04)',
                    border:'1px solid rgba(212,160,23,0.15)',borderRadius:1}}>
                    <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,
                      color:'var(--parchment-dark)',textTransform:'uppercase',marginBottom:4}}>
                      {currentCareer} grants
                    </div>
                    {CAREER_DATA[currentCareer].healthBonus > 0 && (
                      <div style={{fontSize:12,color:'#6dbf6d',marginBottom:3}}>
                        +{CAREER_DATA[currentCareer].healthBonus} Max Health (applied)
                      </div>
                    )}
                    {CAREER_DATA[currentCareer].abilities.length===0 && CAREER_DATA[currentCareer].healthBonus===0 && (
                      <div style={{fontSize:12,color:'rgba(139,105,20,0.5)',fontStyle:'italic'}}>No abilities — path unlock</div>
                    )}
                    {CAREER_DATA[currentCareer].abilities.map((ab,i)=>{
                      const typeColor={sp:'#4a9eff',co:'#c0392b',pa:'#6dbf6d',mo:'var(--gold)'}[ab.type]||'var(--gold)';
                      return (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                          <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1,
                            textTransform:'uppercase',color:typeColor,minWidth:16,opacity:0.8}}>
                            {ab.type}
                          </span>
                          <span style={{fontFamily:'Cinzel,serif',fontSize:11,color:'var(--parchment-light)'}}>
                            {ab.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <div style={{fontSize:10,color:'rgba(139,105,20,0.35)',fontStyle:'italic',marginTop:4}}>
              Selecting a new career removes the previous one's abilities automatically.
            </div>
          </div>
        </div>
      )}

      {/* ── MY ABILITIES TRACKER ── */}
      {abMode==='tracker' && (
        <div className="panel">
          <div className="panel-header">Your Special Abilities</div>
          <div className="panel-body">
            <div style={{fontSize:11,color:'rgba(139,105,20,0.5)',fontStyle:'italic',marginBottom:14}}>
              Career abilities are added automatically above. Add equipment abilities via Glossary → + Track.
            </div>
            {[
              {key:'speed',   label:'Speed (sp)',    color:'#4a9eff', hint:'Once per round — declare during initiative'},
              {key:'combat',  label:'Combat (co)',   color:'#c0392b', hint:'Once per round — use around damage rolls'},
              {key:'passive', label:'Passive (pa)',  color:'#6dbf6d', hint:'Always active — auto-trigger'},
              {key:'modifier',label:'Modifier (mo)', color:'var(--gold)', hint:'Unlimited uses — re-rolls & boosts'},
            ].map(({key,label,color,hint})=>{
              const tk = typeKey[key];
              const abilities = (hero.specialAbilities||{})[key] || [];
              // Detect which abilities came from career (for labelling)
              const careerAbilNames = currentCareer && CAREER_DATA[currentCareer]
                ? CAREER_DATA[currentCareer].abilities.map(a=>a.name.toLowerCase())
                : [];
              return (
                <div key={key} style={{marginBottom:18}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:6}}>
                    <span style={{fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:2,
                      color,textTransform:'uppercase'}}>{label}</span>
                    <span style={{fontSize:10,color:'rgba(139,105,20,0.4)',fontStyle:'italic'}}>{hint}</span>
                  </div>
                  {abilities.length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:6}}>
                      {abilities.map((ab,i)=>{
                        const fromCareer = careerAbilNames.includes(ab.toLowerCase());
                        const desc = (() => { const a = ABILITY_DB.find(x=>x.name.toLowerCase()===ab.toLowerCase()); return a ? a.desc : ''; })();
                        return (
                          <span key={i} title={desc}
                            style={{display:'inline-flex',alignItems:'center',gap:5,
                              padding:'3px 10px 3px 12px',borderRadius:1,
                              background:TYPE_BG[tk], border:`1px solid ${TYPE_BORDER[tk]}`,
                              color,fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:1}}>
                            {ab}
                            {fromCareer && (
                              <span style={{fontSize:8,opacity:0.55,fontStyle:'italic',marginLeft:1}}>career</span>
                            )}
                            {!fromCareer && (
                              <button onClick={()=>setHero(h=>({...h,specialAbilities:{...(h.specialAbilities||{}),
                                [key]:(h.specialAbilities?.[key]||[]).filter((_,j)=>j!==i)}}))}
                                style={{background:'none',border:'none',color:'rgba(192,57,43,0.7)',
                                  cursor:'pointer',fontSize:13,padding:'0 0 0 2px',lineHeight:1}}>✕</button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <textarea
                    value={abilities.join('\n')}
                    onChange={e=>{
                      const newList = e.target.value.split('\n').filter(x=>x.trim());
                      // Don't let user delete career abilities via textarea
                      const careerKept = abilities.filter(a=>careerAbilNames.includes(a.toLowerCase()));
                      const userAdded  = newList.filter(a=>!careerAbilNames.includes(a.toLowerCase()));
                      setHero(h=>({...h,specialAbilities:{...(h.specialAbilities||{}),
                        [key]:[...careerKept,...userAdded]}}));
                    }}
                    placeholder="One ability per line, or use Glossary → + Track"
                    rows={2}
                    style={{width:'100%',background:'rgba(0,0,0,0.4)',border:'1px solid var(--slot-border)',
                      color:'var(--parchment-light)',padding:'7px 10px',fontFamily:'Crimson Text,serif',
                      fontSize:14,outline:'none',borderRadius:1,resize:'vertical',lineHeight:1.6}}/>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── GLOSSARY ── */}
      {abMode==='glossary' && (
        <div className="panel">
          <div className="panel-header">Ability Glossary — {[...new Set(ABILITY_DB.map(a=>a.name))].length} abilities · Tap to expand · + Track adds to your sheet</div>
          <div className="panel-body">
            <GlossaryTab onAddAbility={addAbilityToTracker}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dice Roller util ────────────────────────────────────────────────────────
const rollD6 = () => Math.floor(Math.random() * 6) + 1;
const roll2D6 = () => [rollD6(), rollD6()];

// ─── Combat Round Tracker ─────────────────────────────────────────────────────
// Collapsible panel inside CombatSimulator showing hero abilities with usage tracking.
// Separate component so React renders it correctly (no IIFE).
function CombatRoundTracker({ hero, showRoundTracker, setShowRoundTracker,
    rtUsedThisRound, setRtUsedThisRound, rtUsedThisCombat, setRtUsedThisCombat }) {

  const heroAbils = hero.specialAbilities || {};
  const allAbils = [
    ...(heroAbils.speed||[]).map(n=>({name:n, type:'sp'})),
    ...(heroAbils.combat||[]).map(n=>({name:n, type:'co'})),
    ...(heroAbils.modifier||[]).map(n=>({name:n, type:'mo'})),
    ...(heroAbils.passive||[]).map(n=>({name:n, type:'pa'})),
  ].filter(a => a.name.trim());

  if (allAbils.length === 0) return null;

  const OPC_SET = new Set([
    'first strike','first cut',"bull's eye",'shades','charge',
    'adrenaline','time shift','blood rage','seeing red','kick start',
    'gut ripper','raining blows','patchwork pauper',
  ]);

  // Glossary default: once per combat for ALL abilities.
  // sp → once per combat. co → once per combat (not once per round — combat example confirms this).
  // mo → once per combat unless explicitly stated otherwise (last laugh LoS = unlimited).
  // Execution (sp) is the only ability explicitly once per ROUND.
  const isOPC = (name) => OPC_SET.has(name.toLowerCase())
    || ['once per combat','can only be used once'].some(k => {
        const ab = ABILITY_DB.find(a => a.name.toLowerCase() === name.toLowerCase());
        return ab && ab.desc.toLowerCase().includes(k);
      });

  const toggleRT = (name, type, slotKey) => {
    if (type === 'pa') return;
    // execution is the only per-round ability — everything else is per-combat
    const isPerRound = name.toLowerCase() === 'execution';
    if (isPerRound) {
      setRtUsedThisRound(s => { const n=new Set(s); n.has(slotKey)?n.delete(slotKey):n.add(slotKey); return n; });
    } else {
      setRtUsedThisCombat(s => { const n=new Set(s); n.has(slotKey)?n.delete(slotKey):n.add(slotKey); return n; });
    }
  };

  return (
    <div className="panel" style={{marginBottom:8}}>
      <div className="panel-header" style={{cursor:'pointer',userSelect:'none',display:'flex',alignItems:'center',justifyContent:'space-between'}}
        onClick={()=>setShowRoundTracker(v=>!v)}>
        <span>Round Tracker</span>
        <span style={{display:'flex',gap:6,alignItems:'center'}}>
          {showRoundTracker && (
            <>
              <span onClick={e=>{e.stopPropagation();setRtUsedThisRound(new Set());}}
                style={{fontSize:9,color:'#4a9eff',cursor:'pointer',fontFamily:'Cinzel,serif',
                  letterSpacing:1,border:'1px solid rgba(74,158,255,0.3)',padding:'2px 7px',borderRadius:1}}>
                ↺ New Round
              </span>
              <span onClick={e=>{e.stopPropagation();setRtUsedThisRound(new Set());setRtUsedThisCombat(new Set());}}
                style={{fontSize:9,color:'var(--blood-bright)',cursor:'pointer',fontFamily:'Cinzel,serif',
                  letterSpacing:1,border:'1px solid rgba(192,57,43,0.3)',padding:'2px 7px',borderRadius:1}}>
                ✕ New Combat
              </span>
            </>
          )}
          <span style={{fontSize:10,color:'var(--parchment-dark)',marginLeft:4}}>{showRoundTracker?'▲':'▼'}</span>
        </span>
      </div>

      {showRoundTracker && (
        <div style={{padding:'8px 12px',display:'flex',flexDirection:'column',gap:3}}>
          {/* Legend */}
          <div style={{fontSize:10,color:'rgba(139,105,20,0.4)',fontStyle:'italic',marginBottom:4,lineHeight:1.5}}>
            <span style={{color:'#4a9eff',fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1}}>SP</span> once/combat ·{' '}
            <span style={{color:'#c0392b',fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1}}>CO</span> once/combat ·{' '}
            <span style={{color:'var(--gold)',fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1}}>MO</span> once/combat ·{' '}
            <span style={{color:'#6dbf6d',fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1}}>PA</span> always active
            {' '}· (Execution: once/round)
          </div>
          {allAbils.map((ab, i) => {
            // Give each duplicate ability its own slot key so they track independently
            const dupsBefore = allAbils.slice(0, i).filter(x => x.name.toLowerCase() === ab.name.toLowerCase()).length;
            const slotKey   = dupsBefore > 0 ? `${ab.name}_slot_${dupsBefore}` : ab.name;
            // execution is the only per-round ability
            const isPerRound = ab.name.toLowerCase() === 'execution';
            const usedR   = isPerRound && rtUsedThisRound.has(slotKey);
            const usedC   = !isPerRound && ab.type !== 'pa' && rtUsedThisCombat.has(slotKey);
            const isUsed  = usedR || usedC;
            const isPA    = ab.type === 'pa';
            const typeCol = TYPE_COLOR[ab.type] || 'var(--gold)';
            const abDesc  = (() => { const x=ABILITY_DB.find(a=>a.name.toLowerCase()===ab.name.toLowerCase()); return x?x.desc:''; })();
            return (
              <div key={i} onClick={() => toggleRT(ab.name, ab.type, slotKey)}
                title={abDesc}
                style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:1,
                  cursor:isPA?'default':'pointer',transition:'all 0.12s',
                  background:isUsed?'rgba(0,0,0,0.35)':'rgba(0,0,0,0.15)',
                  border:`1px solid ${isUsed?'rgba(90,74,32,0.15)':'rgba(90,74,32,0.28)'}`,
                  opacity:isUsed?0.5:1}}>
                {/* Checkbox / dot */}
                {isPA ? (
                  <div style={{width:7,height:7,borderRadius:'50%',background:typeCol,opacity:0.7,flexShrink:0}}/>
                ) : (
                  <div style={{width:14,height:14,borderRadius:1,flexShrink:0,
                    background:isUsed?'rgba(90,74,32,0.4)':'rgba(0,0,0,0.4)',
                    border:`1px solid ${isUsed?'rgba(90,74,32,0.5)':typeCol}`,
                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {isUsed && <span style={{fontSize:9,color:'rgba(139,105,20,0.8)',lineHeight:1}}>✓</span>}
                  </div>
                )}
                {/* Type badge */}
                <span style={{fontFamily:'Cinzel,serif',fontSize:7,letterSpacing:1,padding:'1px 4px',borderRadius:1,
                  background:TYPE_BG[ab.type],border:`1px solid ${TYPE_BORDER[ab.type]}`,
                  color:typeCol,flexShrink:0,textTransform:'uppercase'}}>
                  {ab.type}
                </span>
                {/* Name */}
                <span style={{fontFamily:'Cinzel,serif',fontSize:11,flex:1,
                  color:isUsed?'rgba(139,105,20,0.4)':'var(--parchment-light)',
                  textDecoration:isUsed?'line-through':'none'}}>
                  {ab.name}
                </span>
                {/* Scope */}
                {!isPA && (
                  <span style={{fontSize:7,fontFamily:'Cinzel,serif',letterSpacing:1,flexShrink:0,
                    color:opc?'rgba(192,57,43,0.5)':'rgba(74,158,255,0.5)',textTransform:'uppercase'}}>
                    {opc ? '1×/combat' : ab.type==='co' ? '1×/round' : '—'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Combat Simulator ────────────────────────────────────────────────────────
// ─── Tinker Items (Act 2 vendor — Pisa's Rest tavern) ────────────────────────
const TINKER_ITEMS = [
  // 150 gold crowns batch
  { slot:'head',     name:'Ramrod Helm',        stats:{speed:1,brawn:0,magic:0,armour:2}, ability:{name:'Haste',        type:'sp', description:'Roll an extra die to determine your attack speed for one round of combat.'} },
  { slot:'mainHand', name:'Dark Crystal',        stats:{speed:1,brawn:2,magic:0,armour:0}, ability:{name:'Venom',        type:'pa', description:'If your damage dice/damage score causes health damage to your opponent, they lose a further 2 health at the end of every combat round for the remainder of the combat. This ability ignores armour. (Requirement: Rogue)'} },
  { slot:'feet',     name:'Rune-Forged Greaves', stats:{speed:2,brawn:0,magic:2,armour:0}, ability:{name:'Focus', type:'mo', description:'Use anytime in combat to raise your magic score by 3 for one combat round.'} },
  // 240 gold crowns batch
  { slot:'gloves',   name:'Rune-Cloth Gloves',   stats:{speed:1,brawn:0,magic:2,armour:0}, ability:{name:'Charm',        type:'mo', description:'You may re-roll one of your hero\'s die once any time during a combat. You must accept the result of the second roll.'} },
  { slot:'cloak',    name:'Cobwebbed Cape',       stats:{speed:2,brawn:2,magic:0,armour:0}, ability:{name:'Webbed',       type:'sp', description:'This ability reduces the number of dice your opponent can roll for attack speed by 1, for one combat round only.'} },
  { slot:'chest',    name:'Murkwater Vest',       stats:{speed:2,brawn:0,magic:0,armour:2}, ability:{name:'Corruption',   type:'co', description:'If your damage score causes health damage to your opponent, you can inflict Corruption on them, reducing either their brawn or magic by 2 points for the remainder of the combat.'} },
];

// ─── Foe Ability Input (setup phase) ─────────────────────────────────────────
// Autocompletes against ABILITY_DB. Accepts freetext for custom/book abilities.
function FoeAbilityInput({ foe, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const search = (val) => {
    setQuery(val);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    const q = val.toLowerCase();
    setSuggestions(
      ABILITY_DB.filter(a => a.name.toLowerCase().includes(q)).slice(0, 6)
    );
  };

  const add = (ab) => {
    onAdd({ name: ab.name, type: ab.type, desc: ab.desc });
    setQuery(''); setSuggestions([]);
  };

  const addFreetext = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    // Check exact match first
    const match = ABILITY_DB.find(a => a.name.toLowerCase() === trimmed.toLowerCase());
    if (match) { add(match); return; }
    // Freetext — store with type 'custom'
    onAdd({ name: trimmed, type: 'custom', desc: '' });
    setQuery(''); setSuggestions([]);
  };

  const TYPE_COLOR = { sp:'#4a9eff', co:'#c0392b', mo:'var(--gold)', pa:'#6dbf6d', custom:'var(--parchment-dark)' };

  return (
    <div style={{marginTop:8}}>
      <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--parchment-dark)',
        textTransform:'uppercase',marginBottom:5}}>Abilities</div>

      {/* Existing abilities */}
      {(foe.abilities||[]).map((ab,i)=>(
        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:6,marginBottom:4,
          background:'rgba(0,0,0,0.25)',border:'1px solid rgba(90,74,32,0.3)',
          borderRadius:1,padding:'4px 6px'}}>
          <div style={{flex:1,minWidth:0}}>
            <span style={{fontFamily:'Cinzel,serif',fontSize:10,
              color: TYPE_COLOR[ab.type] || 'var(--parchment-light)'}}>
              {ab.name}
            </span>
            {ab.type !== 'custom' && (
              <span style={{marginLeft:5,fontSize:9,color:'var(--parchment-dark)',
                fontFamily:'Cinzel,serif',letterSpacing:1}}>
                ({ab.type})
              </span>
            )}
            {ab.desc && (
              <div style={{fontSize:11,color:'var(--parchment-dark)',marginTop:2,
                fontFamily:'Crimson Text,serif',lineHeight:1.4}}>
                {ab.desc}
              </div>
            )}
          </div>
          <button onClick={()=>onRemove(i)}
            style={{flexShrink:0,background:'none',border:'none',
              color:'rgba(139,26,26,0.6)',cursor:'pointer',fontSize:13,
              padding:'0 2px',lineHeight:1}}>✕</button>
        </div>
      ))}

      {/* Input row */}
      <div style={{position:'relative'}}>
        <div style={{display:'flex',gap:4}}>
          <input
            value={query}
            onChange={e=>search(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter') addFreetext();}}
            placeholder="Add ability… (type to search or enter custom)"
            style={{flex:1,background:'rgba(0,0,0,0.4)',border:'1px solid var(--slot-border)',
              color:'var(--parchment-light)',padding:'5px 8px',fontFamily:'Crimson Text,serif',
              fontSize:13,outline:'none',borderRadius:1}}/>
          {query.trim() && (
            <button onClick={addFreetext}
              style={{padding:'5px 10px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                background:'rgba(212,160,23,0.08)',border:'1px solid rgba(212,160,23,0.3)',
                color:'var(--gold)',cursor:'pointer',borderRadius:1,whiteSpace:'nowrap'}}>
              + Add
            </button>
          )}
        </div>
        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,
            background:'#1a1208',border:'1px solid var(--slot-border)',borderTop:'none',
            borderRadius:'0 0 2px 2px',maxHeight:200,overflowY:'auto'}}>
            {suggestions.map((ab,i)=>(
              <div key={i} onClick={()=>add(ab)}
                style={{padding:'6px 10px',cursor:'pointer',borderBottom:'1px solid rgba(90,74,32,0.2)',
                  transition:'background 0.1s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(212,160,23,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <span style={{fontFamily:'Cinzel,serif',fontSize:10,
                  color: TYPE_COLOR[ab.type] || 'var(--parchment-light)'}}>
                  {ab.name}
                </span>
                <span style={{marginLeft:6,fontSize:9,color:'var(--parchment-dark)',
                  fontFamily:'Cinzel,serif'}}>
                  ({ab.type})
                </span>
                <div style={{fontSize:11,color:'var(--parchment-dark)',marginTop:1,
                  fontFamily:'Crimson Text,serif',
                  whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                  {ab.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Foe Ability Display (combat phases) ─────────────────────────────────────
// Shows foe abilities as phase-contextual reminders with click-to-mark-used tracking.
// Passive (pa) abilities are permanent — cannot be marked used.
// All other types (sp/co/mo) are once per combat and can be tapped to mark spent.
function FoeAbilityDisplay({ abilities, usedAbilities, phase, onToggleUsed }) {
  // Map ability type to when it's most relevant
  const phaseRelevant = (ab) => {
    if (ab.type === 'sp')     return ['initiative','post-roll'].includes(phase);
    if (ab.type === 'co')     return ['pre-damage','post-damage'].includes(phase);
    if (ab.type === 'mo')     return ['post-roll','pre-damage','post-damage'].includes(phase);
    if (ab.type === 'pa')     return phase === 'passive';
    if (ab.type === 'custom') return true;
    return true;
  };

  const TYPE_COLOR = { sp:'#4a9eff', co:'#c0392b', mo:'var(--gold)', pa:'#6dbf6d', custom:'var(--parchment-dark)' };
  const TYPE_LABEL = { sp:'sp', co:'co', mo:'mo', pa:'pa', custom:'?' };

  const usedSet = new Set(usedAbilities || []);
  const isPassive = (ab) => ab.type === 'pa';

  // Split into highlighted (phase-relevant) and dimmed
  const highlighted = abilities.map((ab,i) => ({ab,i})).filter(({ab}) => phaseRelevant(ab));
  const dimmed      = abilities.map((ab,i) => ({ab,i})).filter(({ab}) => !phaseRelevant(ab));

  return (
    <div style={{marginTop:6,marginBottom:2}}>
      <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--parchment-dark)',
        textTransform:'uppercase',marginBottom:4}}>
        Foe Abilities
        {highlighted.filter(({i}) => !usedSet.has(i) || isPassive(abilities[i])).length > 0 && (
          <span style={{marginLeft:6,color:'var(--gold)',fontSize:8}}>
            ▲ {highlighted.filter(({i}) => !usedSet.has(i) || isPassive(abilities[i])).length} active this phase
          </span>
        )}
        <span style={{marginLeft:6,color:'rgba(139,105,20,0.5)',fontSize:7,letterSpacing:1,fontStyle:'italic'}}>
          tap to mark used
        </span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        {/* Phase-relevant abilities shown fully */}
        {highlighted.map(({ab, i}) => {
          const used = usedSet.has(i);
          const canUse = !isPassive(ab); // passives are permanent, never "used up"
          return (
            <div key={'h'+i}
              onClick={() => canUse && onToggleUsed && onToggleUsed(i)}
              style={{
                padding:'4px 7px', borderRadius:1,
                background: used ? 'rgba(0,0,0,0.4)' : 'rgba(212,160,23,0.07)',
                border: `1px solid ${used ? 'rgba(90,74,32,0.2)' : TYPE_COLOR[ab.type]+'44'}`,
                cursor: canUse ? 'pointer' : 'default',
                opacity: used ? 0.5 : 1,
                transition: 'all 0.15s',
              }}>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                <span style={{
                  fontFamily:'Cinzel,serif', fontSize:10,
                  color: used ? 'rgba(139,105,20,0.4)' : TYPE_COLOR[ab.type],
                  textDecoration: used ? 'line-through' : 'none',
                }}>
                  {ab.name}
                </span>
                <span style={{fontSize:9,color:'var(--parchment-dark)',fontFamily:'Cinzel,serif'}}>
                  ({TYPE_LABEL[ab.type]})
                </span>
                {used && (
                  <span style={{marginLeft:'auto',fontSize:8,color:'rgba(139,26,26,0.6)',fontFamily:'Cinzel,serif',letterSpacing:1}}>
                    ✗ USED
                  </span>
                )}
                {!used && canUse && (
                  <span style={{marginLeft:'auto',fontSize:7,color:'rgba(139,105,20,0.3)',fontStyle:'italic'}}>
                    tap to spend
                  </span>
                )}
                {isPassive(ab) && (
                  <span style={{marginLeft:'auto',fontSize:7,color:'rgba(109,191,109,0.4)',fontStyle:'italic'}}>
                    always active
                  </span>
                )}
              </div>
              {ab.desc && !used && (
                <div style={{fontSize:11,color:'rgba(232,213,163,0.75)',marginTop:2,
                  fontFamily:'Crimson Text,serif',lineHeight:1.4}}>
                  {ab.desc}
                </div>
              )}
            </div>
          );
        })}
        {/* Other phases — show as compact dim tags, tappable if not passive */}
        {dimmed.length > 0 && (
          <div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:dimmed.length>0&&highlighted.length>0?2:0}}>
            {dimmed.map(({ab, i}) => {
              const used = usedSet.has(i);
              const canUse = !isPassive(ab);
              return (
                <span key={'d'+i}
                  title={ab.desc || ab.name}
                  onClick={() => canUse && onToggleUsed && onToggleUsed(i)}
                  style={{
                    padding:'2px 6px', fontFamily:'Cinzel,serif', fontSize:9,
                    letterSpacing:0.5, borderRadius:1,
                    cursor: canUse ? 'pointer' : 'default',
                    background: used ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)',
                    border: `1px solid ${used ? 'rgba(90,74,32,0.15)' : 'rgba(90,74,32,0.25)'}`,
                    color: used ? 'rgba(90,74,32,0.25)' : 'rgba(139,105,20,0.5)',
                    textDecoration: used ? 'line-through' : 'none',
                    opacity: used ? 0.45 : 1,
                  }}>
                  {ab.name}{used ? ' ✗' : ''}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CombatSimulator({ hero, setHero, onHeroHealthChange }) {
  const computed = computeStats(hero.baseAttributes, hero.equipment);

  const blankFoe = (id) => ({
    id, name:'', speed:0, brawn:0, magic:0, armour:0,
    health:20, maxHealth:20, usesMagic:false,
    hp:20,
    passives:{ bleed:false, venom:false, disease:false, thorns:false, fire_aura:false },
    // Per-foe flags for hero-inflicted DoTs. Only foes that have taken health damage
    // from the hero get these ticking. Glossary: "they continue to take damage" — "they"
    // is the opponent hit, not every opponent in the combat.
    heroDoTs: { venom:false, bleed:false, disease:false },
    abilities:[],   // [{name, type, desc}] — from ABILITY_DB or freetext
    usedAbilities:[], // indices of abilities spent this combat
    dice:[],
    // per-foe temporary modifiers
    speedPenalty:0,      // accumulated speed reductions
    armourPenalty:0,     // accumulated armour reductions
    brawnPenalty:0,
    magicPenalty:0,
    // per-foe round-scoped penalties (zapped and similar — should NOT leak to other foes)
    speedPenaltyThisRound: 0,
    brawnPenaltyThisRound: 0,
    magicPenaltyThisRound: 0,
    haunted:false,       // haunt debuff active
    burned:false,        // burn debuff (from ignite)
    boltCharged:false,   // bolt ability primed
    crippleRoundsLeft:0, // cripple countdown
    armourPenaltyThisRound: 0,   // stagger — zeroed out each round
    armourPenaltyRoundsLeft: 0,  // insight — countdown for temporary armour reduction
    frozenDice: null,            // silver frost — fixed dice for next round
    spiritMarked: false,         // spirit mark — +2 damage against this foe
  });

  // ── State ──────────────────────────────────────────────────────────────────
  const [foes, setFoes]             = useState([blankFoe(1)]);
  const [activeFoeId, setActiveFoeId] = useState(1);
  const [phase, setPhase]           = useState('setup');
  const [round, setRound]           = useState(0);
  const [log, setLog]               = useState([]);
  const [heroDice, setHeroDice]     = useState([]);
  const [damageDice, setDamageDice] = useState([]);
  const [winner, setWinner]         = useState(null);
  const [damageWinner, setDamageWinner] = useState(null);
  const [roundDamage, setRoundDamage]   = useState(null);
  const [rolling, setRolling]       = useState(false);
  const [heroHp, setHeroHp] = useState(computed.maxHealth || hero.baseAttributes.maxHealth || hero.baseAttributes.health);
  // Monotonic foe ID counter — never reused, avoids id collision after foe removal + rewind
  const nextFoeId = useRef(2); // starts at 2 since blankFoe(1) is the default

  // Hero passive toggles — DoT and unconditional end-of-round passives only.
  // Acid and Sear are (mo) modifier abilities in LoS, tracked via usedOnce, not here.
  const [heroPassives, setHeroPassives] = useState({
    bleed:false, venom:false, disease:false, thorns:false, fire_aura:false,
    barbs:false, vitriol:false,
  });

  // Per-combat ability usage tracking (once-per-combat abilities)
  const [usedOnce, setUsedOnce]     = useState(new Set());
  // Per-round usage (speed/combat: once per round)
  const [usedThisRound, setUsedThisRound] = useState(new Set());

  // Phase rewind — snapshot taken at start of each phase transition
  const [phaseSnapshot, setPhaseSnapshot] = useState(null);

  // ── Companion state ────────────────────────────────────────────────────────
  // companionSetup: persists between combats (player's choice)
  // companion: live combat object, null when no companion or setup='none'
  const [companionSetup, setCompanionSetup] = useState('none');
  // companionBaseStats: editable starting stats shown in setup UI
  const [companionBaseStats, setCompanionBaseStats] = useState({ hp:15, brawn:3, magic:3, armour:2 });
  const [companion, setCompanion] = useState(null);
  // Winged Tormenter target — foeId chosen by player at combat start
  const [wingedTormenterTarget, setWingedTormenterTarget] = useState(null);



  // Manual edit overlay in combat
  const [showManualEdit, setShowManualEdit] = useState(false);

  // Round Tracker — collapsible panel inside combat
  const [showRoundTracker, setShowRoundTracker] = useState(false);
  const [rtUsedThisRound, setRtUsedThisRound]   = useState(new Set());
  const [rtUsedThisCombat, setRtUsedThisCombat] = useState(new Set());

  // Manual dice count overrides — foe-specific initiative dice adjustments
  // Opponents can have abilities that change how many dice they roll.
  // foeDiceOverride: Map<foeId, delta> — e.g. +1 means foe rolls 3 dice, -1 means 1 die.
  const [foeDiceOverride, setFoeDiceOverride] = useState({}); // {[foeId]: initiative dice delta}
  // Hero damage dice override — foe abilities can add/remove dice from hero damage roll
  const [heroDamageDiceDelta, setHeroDamageDiceDelta] = useState(0);
  // Hero initiative dice override — foe abilities can add/remove hero initiative dice
  const [heroInitDiceDelta, setHeroInitDiceDelta] = useState(0);
  // Foe damage dice override — foes may roll more than 1 damage die
  const [foeDamageDiceOverride, setFoeDamageDiceOverride] = useState({}); // {[foeId]: delta}

  // Combat modifiers — cleared/adjusted between rounds
  const [cmods, setCmods] = useState({
    // Hero buffs (last for current round unless noted)
    speedBonus: 0,          // from adrenaline, courage, quicksilver, fearless, etc.
    armourBonus: 0,         // from bright shield, iron will, might of stone, etc.
    damageBonus: 0,         // from pound, impale, fortitude, fallen hero, brain drain, etc.
    magicBonus: 0,          // from focus, surge, etc.
    brawnBonus: 0,          // from vanquish, savagery, blood rage, etc.
    extraSpeedDice: 0,      // haste, cat's speed, lay of the land
    extraDamageDice: 0,     // deep wound, feral fury, overload
    piercingActive: false,  // ignore ALL foe armour (Piercing, Focused Strike)
    fatalBlowActive: false, // ignore HALF foe armour rounded up (Fatal Blow)
    // Per-combat hero stat adjustments (manual override panel) — survive round resets
    heroStatAdj: { brawn:0, magic:0, speed:0, armour:0 },
    // Per-round hero stat adjustments — auto-cleared each rollInitiative
    heroStatAdjRound: { brawn:0, magic:0, speed:0, armour:0 },
    dodgeActive: false,     // sidestep/evade/vanish/spider sense/dodge/command
    windwalkerActive: false,// use speed dice as damage dice
    criticalStrikeActive: false, // set all damage dice to 6
    gutRipperActive: false, // set all damage dice to 6 (once per combat)
    dominateActive: false,  // set one damage die to 6
    rakeActive: false,      // 3 damage dice, ignore armour, no modifiers
    cleaveActive: false,    // 1 die to all foes, ignore armour
    blackRainActive: false, // 1 die to all foes, ignore armour
    backfireActive: false,  // 3 dice to foe + 2 dice to self
    brutality2DiceActive: false,  // foe won: 2 dice back, ignore armour
    deflectActive: false,
    overpowerActive: false,
    punctureActive: false,  // 2 dice, ignore armour, -1 foe armour
    iceShardActive: false,  // deal magic score as damage, ignore armour
    igniteActive: false,    // 2 dice to ALL foes, ignore armour, apply burn
    boltReleaseActive: false,// 3 dice, ignore armour
    thornArmourActive: false,// +3 armour + 1 die to all foes
    shieldWallActive: false, // double armour + 1 die to foe
    darkPactActive: false,  // +4 damage, -4 HP
    shadesActive: false,    // +2 per damage die
    sacrificeShadesActive: false,
    rainingBlowsActive: false, // each [6] on damage triggers extra die
    adrenalineRoundsLeft: 0,
    timeShiftRoundsLeft: 0,
    // Foe nerf flags for this round (applied at initiative)
    foeDiceReduction: 0,    // webbed/curse/knockdown/etc: reduce foe speed dice
    foeSpeedPenaltyThisRound: 0,
    // Post-damage effects pending
    hauntActive: false,
    vampirismActive: false,
    // Note: leech is handled via hasLeech flag directly in applyDamage, not via cmods
    lightningActive: false, // takes 2 dmg when hero takes dmg
    retaliation1DieActive: false, // riposte/retaliation/sideswipe
    retaliation2DiceActive: false,// spore cloud / thorn fist
    judgementActive: false, // half speed back on take damage
    avengingActive: false,  // armour score back on take damage
    secondSightActive: false,// -2 to all foe damage dice
    foeDmgScorePenalty: 0,   // Fear/Mind Fumble: subtract from foe damage score this round
    torrentActive: false,    // EoWF Torrent: next cleave/lash uses 2 dice
    sureEdgeActive: false,   // EoWF/Dune Sure Edge: +1 per damage die (persistent, like sear)
    gougeActive: false,      // Dune/EoWF Gouge: bleed +1 for rest of combat
    recklessActive: false,   // Dune/EoWF Reckless: if foe wins, they get +1 damage die
    bloodThiefActive: false, // HoF: each [6] on damage restores 4 HP
    brightSparkActive: false,// HoF: may reroll any damage dice
    hypnotiseActive: false,  // HoF: foe damage [6]s can be rerolled
    magicTapActive: false,   // HoF: +2 magic, restored on doubles
    mangleHoFActive: false,  // HoF (mo activated): each [6] on damage +2
    // Note: corruption/rust/disrupt apply stat reductions directly in activateAbility — no pending flags needed
    impaleSpeedPenalty: 0,  // carry to next round
    poundSpeedPenalty: 0,   // carry to next round
    surgeSpeedPenalty: 0,   // carry to next round
    slamSpeedPenalty: 0,    // carry to next round (Slam — foe -1 spd next round)
    natRevSpeedPenalty: 0,  // carry to next round (Nature's Revenge — foe -1 spd next round)
    surgeActive: false,
    impaleActive: false,    // +3 damage
    mergeBrawnBonus: 0,     // fallen hero, etc. carry across rounds
    bloodRageActive: false,
    bloodRageConsecutive: 0,// track consecutive wins with damage
    mercilessActive: false,
    reclaimActive: false,   // rebound: +2 speed next round
    reboundActive: false,
    hauntDmgThisRound: 0,   // accumulated haunt damage
    meditationActive: false,// heal 1 per round
    cleansLight: false,     // heal 2 per round
    kickStartUsed: false,
    soulBurstUsed: false,      // Dune Soul Burst: once-per-combat revive at 10 HP
    hookedDieSaved: 0,         // HoF Hooked: die value saved from previous round
    // windwalker: use heroDice sum as damage instead of 1d6
    windwalkerDiceSum: 0,
    // Minor Mirage (Dune co): pending deflect — roll d6 when hero is hit, on [6] ignore damage
    mirageActive: false,   // true = deflect pending for this round
    mirageTarget: 'hero',  // 'hero' | 'minion'
  });

  // Pre-combat
  const [preRollDone, setPreRollDone] = useState(false);
  const [preDice, setPreDice]         = useState([]);
  const [preTarget, setPreTarget]     = useState(null);

  // ── Interactive dice state ─────────────────────────────────────────────────
  // pendingDiceAction: what the player is about to do interactively with a die
  // null | 'charm-reroll-hero' | 'feint-reroll-hero' | 'surefooted-reroll-hero'
  //      | 'swap-pick-hero' | 'swap-pick-foe' | 'watchful-pick-foe'
  //      | 'dominate-pick-damage' | 'last-laugh-done'
  const [pendingDiceAction, setPendingDiceAction] = useState(null);
  // For swap: first picked index
  const [swapHeroDieIdx, setSwapHeroDieIdx]       = useState(null);
  // For feint: which hero dice are selected to reroll (true = reroll)
  const [feintSelection, setFeintSelection]       = useState([]);

  // ── Interactive stat-choice state ─────────────────────────────────────────
  // pendingChoiceAction: ability waiting for the player to pick a stat
  // null | { abilityName, abilityKey, options: [{label, onPick}] }
  const [pendingChoiceAction, setPendingChoiceAction] = useState(null);

  // ── Log ────────────────────────────────────────────────────────────────────
  const COMBAT_LOG_CAP = 150;
  const addLog = (text, type='log-roll') =>
    setLog(prev => {
      const next = [...prev, { text, type }];
      return next.length > COMBAT_LOG_CAP ? next.slice(next.length - COMBAT_LOG_CAP) : next;
    });

  // ── Derived ability flags ──────────────────────────────────────────────────
  const heroAbils  = hero.specialAbilities || {};
  const allPassives= (heroAbils.passive  || []).map(s=>s.toLowerCase());
  const allSpeed   = (heroAbils.speed    || []).map(s=>s.toLowerCase());
  const allCombat  = (heroAbils.combat   || []).map(s=>s.toLowerCase());
  const allModifier= (heroAbils.modifier || []).map(s=>s.toLowerCase());
  const hasAbil = (list, ...names) => names.some(n => list.some(a => a.includes(n.toLowerCase())));

  const hasLifeSpark     = hasAbil(allPassives,'life spark');
  const hasDeadlyPoisons = hasAbil(allPassives,'deadly poisons');
  const hasPoisonMastery = hasAbil(allPassives,'poison mastery');
  const hasSeeingRed     = hasAbil(allPassives,'seeing red');
  const hasFirstStrike   = hasAbil(allPassives,'first strike');
  const hasFirstCut      = hasAbil(allPassives,'first cut');
  const hasBullsEye      = hasAbil(allModifier,"bull's eye",'bulls eye');
  const hasShades        = hasAbil(allPassives,'shades');
  const hasLeech         = hasAbil(allPassives,'leech');
  const hasLightning     = hasAbil(allPassives,'lightning');
  const hasMerciless     = hasAbil(allPassives,'merciless');
  const hasMangle        = hasAbil(allPassives,'mangle'); // EoWF: each [6] on damage score adds 2
  const hasDecay         = hasAbil(allPassives,'decay');  // EoWF: 1 dmg to all foes end of round (= thorns)
  const hasBloodFrenzy   = hasAbil(allPassives,'blood frenzy'); // EoWF: bleed in play → speed +1
  const hasSoulBurst     = hasAbil(allPassives,'soul burst');   // Dune: revive at 10 HP on death
  const hasBladefinesse  = hasAbil(allPassives,'blade finesse'); // Dune: each [6] on damage +1
  const hasDancingRapier = hasAbil(allPassives,'dancing rapier'); // Dune: +1 to each damage die
  const hasRebuke        = hasAbil(allPassives,'rebuke');  // Dune: ≤10 HP → +1 to each damage die
  const hasIceEdge       = hasAbil(allPassives,'ice edge'); // EoWF: [6] on damage → foe -1 speed next round
  const hasHeartSteal    = hasAbil(allPassives,'heart steal'); // EoWF: extra die with piercing/deep wound
  const hasWeaver        = hasAbil(allPassives,'weaver');   // EoWF/Dune: heal 2 per combat ability
  const hasWhirlwind     = hasAbil(allPassives,'whirlwind'); // Dune: speed ability → brawn +2 this round
  const hasWindChill     = hasAbil(allPassives,'wind chill'); // EoWF: speed ability → 2 dmg all foes
  const hasVeiledStrike  = hasAbil(allPassives,'veiled strike'); // EoWF/Dune: dodge → 1 die to foe
  const hasWrath         = hasAbil(allPassives,'wrath');    // Dune: heal → 2 dmg to foe
  const hasSalvation     = hasAbil(allPassives,'salvation'); // EoWF: heal +1 on heal abilities
  const hasBrittleEdge   = hasAbil(allPassives,'brittle edge'); // EoWF: foe takes 2 dmg when rolling damage
  const hasSparkJolt     = hasAbil(allPassives,'spark jolt'); // Dune: 1 dmg all foes end of round
  const hasFireStarter   = hasAbil(allPassives,'fire starter'); // Dune: 2 dmg to one foe start of round
  const hasArmourBreaker = hasAbil(allPassives,'armour breaker'); // Dune: reduce one foe armour by 1 each round
  const hasRapidPulse    = hasAbil(allPassives,'rapid pulse'); // Dune: ≤10 HP → bleed +1 extra
  const hasCutthroat     = hasAbil(allPassives,'cutthroat'); // Dune: dodge → brawn +1 permanent
  const hasQuickCuts     = hasAbil(allPassives,'quick cuts'); // Dune: brawn of main hand to foe per speed ability
  const hasExploit       = hasAbil(allPassives,'exploit');    // HoF/EoWF: 1 dmg per foe [1] rolled for speed
  const hasGougeActive   = cmods.gougeActive; // set by gouge activation
  const hasMaleficRunes  = hasAbil(allPassives,'malefic runes'); // EoWF: magic +1 per foe defeated
  const hasDemonClaws    = hasAbil(allPassives,'demon claws');  // HoF: 4 dmg on ATTACK SPEED doubles (not damage)
  const hasFaith         = hasAbil(allPassives,'faith');        // HoF: heal 2 on ANY doubles
  const hasGougePa       = hasAbil(allPassives,'gouge');        // HoF (pa): bleed always +1. Dune/EoWF is (co) activated.
  const hasTurnUpHeat    = hasAbil(allPassives,'turn up the heat'); // HoF: fire aura +1
  const hasSearingMantle = hasAbil(allPassives,'searing mantle');  // HoF: 1 dmg per 4 armour end of round
  const hasSnakeStrike   = hasAbil(allPassives,'snake strike');    // HoF: pre-combat 2 dice (auto-fires)
  const hasKickStart     = hasAbil(allPassives,'kick start');
  const hasDarkClaw      = hasAbil(allPassives,'dark claw');
  const hasCleansLight   = hasAbil(allPassives,'cleansing light');
  const hasSwiftStrikes  = hasAbil(allPassives,'swift strikes');
  const hasShieldSpin    = hasAbil(allPassives,'shield spin');
  const hasExecution     = hasAbil(allSpeed,'execution');
  // Acid and Sear are (mo) modifier abilities in LoS v1.4 — player activates once, lasts combat.
  // They live in allModifier (or allPassives for later books that reclassify them).
  // Check both lists so later-book overrides (pa in HoF/EoWF) still work correctly.
  const hasAcid          = hasAbil(allModifier,'acid') || hasAbil(allPassives,'acid');
  const hasSear          = hasAbil(allModifier,'sear') || hasAbil(allPassives,'sear');
  const hasVenom         = hasAbil(allPassives,'venom');
  const hasBleed         = hasAbil(allPassives,'bleed');
  const hasDisease       = hasAbil(allPassives,'disease');
  const hasToxicBlades   = hasAbil(allPassives,'toxic blades'); // Dune Sea — same DoT mechanic as bleed

  // ── Companion ability flags ────────────────────────────────────────────────
  const hasFarSight       = hasAbil(allPassives,'far sight');       // Dune: talon wing → auto-win round 1
  const hasWingedTormenter= hasAbil(allPassives,'winged tormenter');// Dune: talon wing passive → 1 dmg/round
  const hasLickWounds     = hasAbil(allPassives,'lick your wounds');// Dune: mastiff passive → +4 HP/round
  const hasDeathFromAbove = hasAbil(allPassives,'death from above');// Dune: talon wing → d6 on foe when hero loses
  const hasGuardian       = hasAbil(allPassives,'guardian');        // Dune: foe dmg to pet → 2 dmg back
  const hasBrokenBond     = hasAbil(allPassives,'broken bond');     // Dune: mastiff dies → 1d+2 to foe
  const hasVolatileLink   = hasAbil(allPassives,'volatile link');   // Dune: minion dies → 1d to all foes
  const hasAstralManip    = hasAbil(allPassives,'astral manipulator');// Dune: passive minion untargetable
  const hasBrokenTrust    = hasAbil(allPassives,'broken trust');    // HoF: gate on Blessed Bullets
  const hasResurrection   = hasAbil(allModifier,'resurrection');    // Dune: revive minion once for 3 magic

  const venomDmg = 2 + (hasDeadlyPoisons ? 1 : 0) + (hasPoisonMastery ? 1 : 0);

  const seeingRedActive = hasSeeingRed && heroHp <= 20;

  // Blood Frenzy (EoWF/Dune pa): if a bleed effect is in play, speed +1 (reactive like Seeing Red)
  // Must be declared BEFORE effectiveSpeed since effectiveSpeed uses it.
  const bleedInPlay = heroPassives.bleed || foes.some(f=>f.heroDoTs?.bleed);
  const bloodFrenzyBonus = (hasBloodFrenzy && bleedInPlay) ? 1 : 0;

  // Effective speed with all bonuses
  const effectiveSpeed = computed.speed
    + (seeingRedActive ? 2 : 0)
    + bloodFrenzyBonus
    + cmods.speedBonus
    + (cmods.reboundActive ? 2 : 0)
    + (cmods.heroStatAdj?.speed || 0)
    + (cmods.heroStatAdjRound?.speed || 0);

  // Effective armour
  const effectiveArmour = computed.armour + cmods.armourBonus
    + (cmods.shieldWallActive ? computed.armour : 0) // double if shield wall
    + (cmods.heroStatAdj?.armour || 0)
    + (cmods.heroStatAdjRound?.armour || 0);

  // Damage die bonus:
  // - searAcidBonus: only applies to a full damage SCORE roll (dice + brawn/magic).
  //   Da Boss confirmed (forum 3842): "Sear only adds +1 to dice rolled for a damage score."
  //   Sear and Acid are (mo) abilities activated once; the bonus persists for the combat.
  //   For LoS players: bonus is active when usedOnce contains 'sear'/'acid'.
  //   For later-book players where they are (pa): heroPassives.acid/sear check kept as fallback.
  // - shadesBonus: "add 2 to each die of damage you roll" — no restriction, applies everywhere.
  const searAcidBonus = (
    (hasAcid && (usedOnce.has('acid') || heroPassives.acid)) ||
    (hasSear && (usedOnce.has('sear') || heroPassives.sear))
    ? 1 : 0
  );
  const sureEdgeBonus = cmods.sureEdgeActive ? 1 : 0; // EoWF/Dune Sure Edge: +1 per damage die (damage score only)
  const dancingRapierBonus = hasDancingRapier ? 1 : 0; // Dune: +1 to each damage die (damage score only)
  const rebukeBonus = (hasRebuke && heroHp <= 10) ? 1 : 0; // Dune: at ≤10 HP, +1 per damage die
  const shadesBonus   = (cmods.shadesActive ? 2 : 0);
  const dieBonusPerDie = searAcidBonus + sureEdgeBonus + dancingRapierBonus + rebukeBonus + shadesBonus; // full damage score rolls only
  const dieBonusNoScore = shadesBonus;                // instead-of-score abilities (no sear/acid/sure edge/rebuke)

  // (bloodFrenzyBonus and bleedInPlay declared above effectiveSpeed)

  const hasPreCombat = hasFirstStrike || hasFirstCut || hasBullsEye || hasSnakeStrike;

  // ── Foe helpers ────────────────────────────────────────────────────────────
  const updateFoe = (id, key, val) => setFoes(fs => fs.map(f => {
    if (f.id !== id) return f;
    const numeric = parseInt(val);
    const numericKeys = ['health','maxHealth','hp','speed','brawn','magic','armour'];
    const stored = numericKeys.includes(key)
      ? (isNaN(numeric) ? 0 : numeric)
      : (isNaN(numeric) ? val : numeric);
    return { ...f, [key]: stored };
  }));
  const updateFoePassive = (id, key) => setFoes(fs => fs.map(f =>
    f.id !== id ? f : { ...f, passives:{ ...f.passives, [key]: !f.passives[key] } }
  ));
  const addFoe = () => {
    if (foes.length >= 4) return;
    const newId = nextFoeId.current++;
    setFoes(fs => [...fs, blankFoe(newId)]);
  };
  const removeFoe = (id) => {
    if (foes.length <= 1) return;
    setFoes(fs => fs.filter(f => f.id !== id));
    setActiveFoeId(prev => prev === id ? foes.find(f=>f.id!==id)?.id ?? 1 : prev);
  };
  const liveFoes  = () => foes.filter(f => f.hp > 0);
  const activeFoe = foes.find(f => f.id === activeFoeId) || foes[0];

  // Centralised armour calculation — respects Piercing (full bypass) and Fatal Blow (half, rounded up)
  const calcFoeArmour = (foe) => {
    const base = Math.max(0, (parseInt(foe?.armour)||0) - (foe?.armourPenalty||0) - (foe?.armourPenaltyThisRound||0));
    if (cmods.piercingActive)  return 0;
    if (cmods.fatalBlowActive) return Math.ceil(base / 2);
    return base;
  };

  // Toggle a foe ability as used/unused for this combat (sp/co/mo only — pa are permanent)
  const toggleFoeAbilityUsed = (foeId, abilityIndex) => {
    setFoes(fs => fs.map(f => {
      if (f.id !== foeId) return f;
      const used = new Set(f.usedAbilities || []);
      if (used.has(abilityIndex)) {
        used.delete(abilityIndex);
      } else {
        used.add(abilityIndex);
      }
      return { ...f, usedAbilities: [...used] };
    }));
  };

  // ── Life Spark / Dark Claw / Haunt double-check ───────────────────────────
  // Glossary: "Every time you roll a double" — any matching pair in the set.
  // With haste/lay of the land, hero can roll 3+ dice, so we must check all pairs,
  // not just dice[0] === dice[1].
  const checkDoubles = (dice, currentHp, maxHp, foeId, isSpeedRoll = false) => {
    let hp = currentHp;
    // Detect any pair with the same value (sorted check is simplest)
    const hasDoubles = (() => {
      const seen = new Set();
      for (const d of dice) {
        if (seen.has(d)) return true;
        seen.add(d);
      }
      return false;
    })();
    if (dice.length >= 2 && hasDoubles) {
      if (hasLifeSpark) {
        const healed = Math.min(4, maxHp - hp);
        if (healed > 0) { hp += healed; addLog(`✨ Life Spark: doubles! Heal ${healed} HP`, 'log-heal'); }
      }
      if (hasFaith) {
        const healed = Math.min(2, maxHp - hp);
        if (healed > 0) { hp += healed; addLog(`✝ Faith: doubles! Heal ${healed} HP`, 'log-heal'); }
      }
      if (hasDarkClaw && foeId) {
        // Dark Claw: fires on ANY doubles (speed or damage)
        setFoes(fs => fs.map(f => f.id===foeId ? {...f, hp: Math.max(0, f.hp-4)} : f));
        addLog(`🌑 Dark Claw: doubles! 4 dmg to foe (ignores armour)`, 'log-hit');
      }
      if (hasDemonClaws && foeId && isSpeedRoll) {
        // Demon Claws: fires only on ATTACK SPEED doubles (HoF — different from Dark Claw)
        setFoes(fs => fs.map(f => f.id===foeId ? {...f, hp: Math.max(0, f.hp-4)} : f));
        addLog(`👹 Demon Claws: speed doubles! 4 dmg to foe (ignores armour)`, 'log-hit');
      }
      if (cmods.magicTapActive) {
        // Magic Tap (HoF): restored on doubles
        setUsedOnce(prev => { const s=new Set(prev); s.delete('magic tap'); return s; });
        setCmods(p=>({...p, magicTapActive:false}));
        addLog(`🔮 Magic Tap: doubles — restored!`, 'log-heal');
      }
      // Haunt dispel on doubles
      if (cmods.hauntActive) {
        setCmods(p => ({...p, hauntActive: false}));
        setFoes(fs => fs.map(f => ({...f, haunted: false})));
        addLog(`👻 Haunt: spirit dispelled by doubles!`, 'log-passive');
      }
    }
    return hp;
  };

  // ── START COMBAT ───────────────────────────────────────────────────────────
  const startCombat = () => {
    const named = foes.filter(f => f.name.trim());
    if (!named.length) return;
    const initFoes = named.map(f => ({ ...f, hp: parseInt(f.health)||1,
      speedPenalty:0, armourPenalty:0, brawnPenalty:0, magicPenalty:0,
      haunted:false, burned:false, boltCharged:false, crippleRoundsLeft:0,
      usedAbilities:[] }));
    setFoes(initFoes);
    setActiveFoeId(initFoes[0].id);
    setRound(0);
    setHeroHp(computed.maxHealth); // Bug fix: use maxHealth (includes career bonus), not base health stat
    setHeroPassives({ bleed:false, venom:false, disease:false, thorns:false, fire_aura:false, barbs:false, vitriol:false });
    setHeroDice([]); setDamageDice([]);
    setWinner(null); setDamageWinner(null); setRoundDamage(null);
    setPreRollDone(false); setPreDice([]); setPreTarget(initFoes[0].id);
    setUsedOnce(new Set()); setUsedThisRound(new Set());
    setFoeDiceOverride({}); setHeroDamageDiceDelta(0);
    setHeroInitDiceDelta(0); setFoeDamageDiceOverride({});
    setRtUsedThisRound(new Set()); setRtUsedThisCombat(new Set());
    setCmods({
      speedBonus:0, armourBonus:0, damageBonus:0, magicBonus:0, brawnBonus:0,
      extraSpeedDice:0, extraDamageDice:0,
      piercingActive:false, fatalBlowActive:false, dodgeActive:false, windwalkerActive:false,
      heroStatAdj: { brawn:0, magic:0, speed:0, armour:0 },
      heroStatAdjRound: { brawn:0, magic:0, speed:0, armour:0 },
      criticalStrikeActive:false, gutRipperActive:false, dominateActive:false,
      rakeActive:false, cleaveActive:false, blackRainActive:false, backfireActive:false,
      brutality2DiceActive:false, deflectActive:false, overpowerActive:false,
      punctureActive:false, iceShardActive:false, igniteActive:false,
      boltReleaseActive:false, thornArmourActive:false, shieldWallActive:false,
      darkPactActive:false, shadesActive: hasShades,
      sacrificeShadesActive:false, rainingBlowsActive:false,
      adrenalineRoundsLeft:0, timeShiftRoundsLeft:0,
      foeDiceReduction:0, foeSpeedPenaltyThisRound:0, // global round penalty (Slam/NatRev carry)
      hauntActive:false, vampirismActive:false,
      lightningActive: hasLightning, retaliation1DieActive:false,
      retaliation2DiceActive:false, judgementActive:false, avengingActive:false,
      secondSightActive:false,
      impaleSpeedPenalty:0, poundSpeedPenalty:0, surgeSpeedPenalty:0,
      slamSpeedPenalty:0, natRevSpeedPenalty:0,
      surgeActive:false, impaleActive:false, mergeBrawnBonus:0, seeingRedActive:false,
      bloodRageActive:false, bloodRageConsecutive:0, mercilessActive: hasMerciless,
      reclaimActive:false, reboundActive:false, hauntDmgThisRound:0,
      meditationActive:false, cleansLight: hasCleansLight,
      kickStartUsed:false, windwalkerDiceSum:0,
      mirageActive:false, mirageTarget:'hero',
    });
    const names = initFoes.map(f=>f.name).join(', ');
    setLog([{ text:`⚔ Combat begins: ${hero.name} vs ${names}`, type:'log-win' }]);
    setPendingChoiceAction(null);
    // ── Companion init ─────────────────────────────────────────────────────
    if (companionSetup !== 'none') {
      const COMPANION_NAMES = { mastiff:'Mastiff', talon_wing:'Talon Wing', minion:'Minion', virgil:'Virgil' };
      // Volatile Link (Dune pa): minion gets +3 max health passively
      const volatileLinkBonus = (companionSetup === 'minion' && hasVolatileLink) ? 3 : 0;
      setCompanion({
        type: companionSetup,
        name: COMPANION_NAMES[companionSetup],
        hp:     companionBaseStats.hp + volatileLinkBonus,
        maxHp:  companionBaseStats.hp + volatileLinkBonus,
        brawn:  companionBaseStats.brawn,
        magic:  companionBaseStats.magic,
        armour: companionBaseStats.armour,
        stance: 'active',
        alive: true,
        resurrectionUsed: false,
        defeatedFired: false,
      });
    } else {
      setCompanion(null);
    }
    setPhase(hasPreCombat ? 'precombat' : 'initiative');
    if (hasShades) addLog('🌑 Shades summoned — +2 per damage die.', 'log-passive');
  };

  // ── PRE-COMBAT ─────────────────────────────────────────────────────────────
  const rollPreCombat = () => {
    setRolling(true);
    setTimeout(() => {
      const target = foes.find(f=>f.id===preTarget) || foes[0];
      const heroPath = hero.heroPath || hero.path;
      const dmgAttr  = heroPath==='mage' ? computed.magic : computed.brawn;

      // Helper: auto-apply hero DoT passives to the target foe when pre-combat
      // damage causes health loss. FAQ Q9: DoT tick starts at end of round 1.
      // Per-foe (heroDoTs), not global (heroPassives).
      const applyPreCombatDoTs = (dmgDealt) => {
        if (dmgDealt <= 0) return;
        setFoes(fs => fs.map(f => {
          if (f.id !== target.id) return f;
          const dots = { ...(f.heroDoTs || {}) };
          if (hasVenom    && !dots.venom)   { dots.venom   = true; addLog(`Venom applied to ${target.name}.`,'log-passive'); }
          if (hasBleed    && !dots.bleed)   { dots.bleed   = true; addLog(`Bleed applied to ${target.name}.`,'log-passive'); }
          if (hasDisease  && !dots.disease) { dots.disease = true; addLog(`Disease applied to ${target.name}.`,'log-passive'); }
          if (hasToxicBlades && !dots.bleed){ dots.bleed   = true; addLog(`Toxic Blades — Bleed applied to ${target.name}.`,'log-passive'); }
          return { ...f, heroDoTs: dots };
        }));
      };

      if (hasFirstStrike || hasBullsEye) {
        const d = rollD6();
        const raw = d + dmgAttr + dieBonusPerDie;
        const newHp = Math.max(0, target.hp - raw);
        setFoes(fs => fs.map(f => f.id===target.id ? {...f, hp:newHp} : f));
        addLog(`${hasFirstStrike?'First Strike':"Bull's Eye"}: [${d}]+${dmgAttr}=${raw} dmg to ${target.name} (ignores armour)`, 'log-hit');
        applyPreCombatDoTs(raw);
        setPreDice([d]);
        if (newHp <= 0) { endCombat('hero'); setPreRollDone(true); setRolling(false); return; }
      } else if (hasFirstCut) {
        const newHp = Math.max(0, target.hp - 1);
        setFoes(fs => fs.map(f => f.id===target.id ? {...f, hp:newHp} : f));
        addLog(`First Cut: 1 dmg to ${target.name} (ignores armour)`, 'log-hit');
        applyPreCombatDoTs(1);
        if (newHp <= 0) { endCombat('hero'); setPreRollDone(true); setRolling(false); return; }
      } else if (hasSnakeStrike) {
        // HoF (pa): before first combat round, 2 dice to a single opponent, ignores armour
        const d1 = rollD6(), d2 = rollD6();
        const raw = d1 + d2 + (2 * dieBonusNoScore);
        const newHp = Math.max(0, target.hp - raw);
        setFoes(fs => fs.map(f => f.id===target.id ? {...f, hp:newHp} : f));
        addLog(`🐍 Snake Strike: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${raw} dmg to ${target.name} (ignores armour)`, 'log-hit');
        applyPreCombatDoTs(raw);
        setPreDice([d1, d2]);
        if (newHp <= 0) { endCombat('hero'); setPreRollDone(true); setRolling(false); return; }
      }
      setPreRollDone(true); setRolling(false);
    }, 350);
  };

  // ── PHASE SNAPSHOT & REWIND ────────────────────────────────────────────────
  const takeSnapshot = () => {
    setPhaseSnapshot({
      phase, round, winner, damageWinner, roundDamage,
      heroHp, heroPassives: {...heroPassives},
      heroDice: [...heroDice], damageDice: [...damageDice],
      foes: foes.map(f=>({...f, passives:{...f.passives}})),
      activeFoeId,
      usedOnce: new Set(usedOnce),
      usedThisRound: new Set(usedThisRound),
      cmods: {...cmods},
      companion: companion ? {...companion} : null,
      heroStatAdj: cmods.heroStatAdj ? {...cmods.heroStatAdj} : {brawn:0,magic:0,speed:0,armour:0},
      // Dice override state — must be restored so rewind + re-roll uses same counts
      heroInitDiceDelta, heroDamageDiceDelta,
      foeDiceOverride: {...foeDiceOverride},
      foeDamageDiceOverride: {...foeDamageDiceOverride},
    });
  };

  const rewindPhase = () => {
    if (!phaseSnapshot) return;
    const s = phaseSnapshot;
    setPhase(s.phase);
    setRound(s.round);
    setWinner(s.winner);
    setDamageWinner(s.damageWinner);
    setRoundDamage(s.roundDamage);
    setHeroHp(s.heroHp);
    setHeroPassives(s.heroPassives);
    setHeroDice(s.heroDice);
    setDamageDice(s.damageDice);
    setFoes(s.foes);
    setActiveFoeId(s.activeFoeId);
    setUsedOnce(s.usedOnce);
    setUsedThisRound(s.usedThisRound);
    setCmods(s.cmods);
    // Restore dice overrides
    if (s.heroInitDiceDelta   !== undefined) setHeroInitDiceDelta(s.heroInitDiceDelta);
    if (s.heroDamageDiceDelta !== undefined) setHeroDamageDiceDelta(s.heroDamageDiceDelta);
    if (s.foeDiceOverride)        setFoeDiceOverride(s.foeDiceOverride);
    if (s.foeDamageDiceOverride)  setFoeDamageDiceOverride(s.foeDamageDiceOverride);
    if (s.companion !== undefined) setCompanion(s.companion);
    if (s.heroStatAdj) setCmods(prev => ({...prev, heroStatAdj: s.heroStatAdj}));
    setPendingDiceAction(null);
    setSwapHeroDieIdx(null);
    setFeintSelection([]);
    setPendingChoiceAction(null);
    setPhaseSnapshot(null);
    addLog('↩ Phase rewound — pick up where you left off.', 'log-passive');
  };

  // ── COMPANION: handle defeat (Broken Bond / Volatile Link / Resurrection prompt) ──
  const handleCompanionDeath = () => {
    setCompanion(c => {
      if (!c || !c.alive || c.defeatedFired) return c;
      addLog(`💀 ${c.name} has been defeated!`, 'log-hit');
      if (hasBrokenBond && c.type === 'mastiff') {
        const roll = rollD6(); const dmg = roll + 2;
        const t = foes.find(f => f.id===activeFoeId && f.hp>0) || foes.find(f => f.hp>0);
        if (t) {
          setFoes(fs => fs.map(f => f.id===t.id ? {...f, hp: Math.max(0, f.hp-dmg)} : f));
          addLog(`🐕 Broken Bond: [${roll}]+2=${dmg} dmg to ${t.name} (ignores armour).`, 'log-hit');
        }
      }
      if (hasVolatileLink && c.type === 'minion') {
        const roll = rollD6();
        setFoes(fs => fs.map(f => f.hp>0 ? {...f, hp: Math.max(0, f.hp-roll)} : f));
        addLog(`💥 Volatile Link: Minion explodes! [${roll}] dmg to all opponents (ignores armour).`, 'log-hit');
      }
      if (c.type === 'minion' && hasResurrection && !c.resurrectionUsed) {
        addLog(`⚡ Resurrection available — click the ability button to spend 3 magic and revive.`, 'log-win');
      }
      return {...c, alive: false, hp: 0, defeatedFired: true};
    });
  };

  // ── HELPER: recalculate round winner from current dice state ──────────────
  const _recalcWinner = (newHeroDice, currentFoes) => {
    const carrySpeedPenalty = cmods.poundSpeedPenalty + cmods.surgeSpeedPenalty + cmods.impaleSpeedPenalty;
    const seeingRed = (computed.health > 0 && heroHp <= 20) && hasAbil(allPassives,'seeing red');
    const heroSpd = Math.max(0, computed.speed + (seeingRed?2:0) + cmods.speedBonus - carrySpeedPenalty);
    const hTotal = newHeroDice.reduce((a,b)=>a+b,0) + heroSpd;
    let highestFoeTotal=0, leadFoe=null;
    // Include all active foe speed penalties: permanent, round-scoped, and next-round carry
    // slamSpeedPenalty/natRevSpeedPenalty are in cmods but not yet translated to foeSpeedPenaltyThisRound
    // (that happens at start of next round). If they were set this round, apply them here.
    const extraFoePenalty = cmods.foeSpeedPenaltyThisRound + (cmods.slamSpeedPenalty||0) + (cmods.natRevSpeedPenalty||0);
    currentFoes.filter(f=>f.hp>0).forEach(f=>{
      const fSpd=Math.max(0,(parseInt(f.speed)||0)-(f.speedPenalty||0)-extraFoePenalty-(f.speedPenaltyThisRound||0));
      const fTotal=f.dice.reduce((a,b)=>a+b,0)+fSpd;
      if(fTotal>highestFoeTotal){highestFoeTotal=fTotal;leadFoe=f;}
    });
    const newWinner=hTotal>highestFoeTotal?'hero':highestFoeTotal>hTotal?'foe':'tie';
    setWinner(newWinner);
    if(leadFoe&&newWinner==='foe') setActiveFoeId(leadFoe.id);
    addLog(`Updated: ${hero.name} [${newHeroDice.join('][')}]+${heroSpd}=${hTotal} vs ${highestFoeTotal} → ${newWinner==='hero'?hero.name+' wins':newWinner==='foe'?(leadFoe?.name||'Foe')+' wins':'Stand-off'}`, 'log-roll');
  };

  // ── INITIATIVE ─────────────────────────────────────────────────────────────
  const rollInitiative = () => {
    takeSnapshot();
    setRolling(true);
    setPendingDiceAction(null);
    setPendingChoiceAction(null);
    setSwapHeroDieIdx(null);
    setFeintSelection([]);
    setTimeout(() => {
      const newRound = round + 1;
      setRound(newRound);
      setUsedThisRound(new Set());

      // Tick down carry-over speed penalties
      const carrySpeedPenalty = cmods.poundSpeedPenalty + cmods.surgeSpeedPenalty + cmods.impaleSpeedPenalty;
      const baseSpeedThisRound = computed.speed + (seeingRedActive ? 2 : 0) + bloodFrenzyBonus + cmods.speedBonus + (cmods.reboundActive ? 2 : 0) + (cmods.heroStatAdj?.speed || 0);
      const nextSpeed = Math.max(0, baseSpeedThisRound - carrySpeedPenalty);

      // Extra speed dice from abilities + manual override (heroInitDiceDelta)
      const numHeroDice = Math.max(1, 2 + cmods.extraSpeedDice + heroInitDiceDelta);
      const hDice = Array.from({length: numHeroDice}, rollD6);

      // Shadow Speed: player CHOOSES to change [1]s to [3]s (modifier ability).
      // Da Boss confirmed (forum 3573/3894): "the ability was meant to function" as 'may change'
      // — it is a player choice, not an automatic substitution.
      // Only apply if the player has activated it this combat via the ability button.
      const hasShadowSpeedActive = usedOnce.has('shadow speed');
      const hDiceFinal = hasShadowSpeedActive ? hDice.map(d => d===1 ? 3 : d) : hDice;
      if (hasShadowSpeedActive && hDice.some(d=>d===1)) addLog('Shadow Speed: [1]→[3] applied.', 'log-passive');

      const hTotal = hDiceFinal.reduce((a,b)=>a+b,0) + nextSpeed;
      setHeroDice(hDiceFinal);

      // Execution check — uses effective speed (all bonuses applied this round)
      const canExecute = hasExecution && liveFoes().some(f => f.hp <= effectiveSpeed);
      if (canExecute) {
        addLog(`⚔ Execution available — a foe's HP ≤ your speed (${effectiveSpeed})!`, 'log-win');
      }

      // Shield Spin: for each foe die showing [1], deal 1 damage die to that foe
      const updatedFoesInit = foes.map(f => {
        if (f.hp <= 0) return f;
        // foeDiceOverride: player can manually adjust how many dice a foe rolls (foe abilities)
        // foeDiceReduction: from stun/knockdown/shackle — reduces dice count for this round
        // speedPenalty is a STAT modifier (lowers speed score), NOT a dice count modifier — do NOT subtract it here
        const foeDiceCount = Math.max(1, 2 - cmods.foeDiceReduction + (foeDiceOverride[f.id]||0));
        const fd = Array.from({length: foeDiceCount}, rollD6);
        let foeExtra = { ...f, dice: fd };

        // Cripple tick-down — 3 active rounds, then remove speed penalty.
        // -1 is a sentinel meaning "last round just ended, remove penalty on this round's init".
        // This prevents the off-by-one where the penalty was removed BEFORE the 3rd round resolved.
        if (f.crippleRoundsLeft === -1) {
          // Previous round was the last active round; remove the penalty now.
          foeExtra.speedPenalty = Math.max(0, (foeExtra.speedPenalty||0) - 1);
          foeExtra.crippleRoundsLeft = 0;
          addLog(`Cripple expired on ${f.name} — speed restored.`, 'log-passive');
        } else if (f.crippleRoundsLeft > 0) {
          const newRoundsLeft = f.crippleRoundsLeft - 1;
          if (newRoundsLeft === 0) {
            // This is the 3rd (last) active round — penalty still applies THIS round.
            // Set sentinel so it will be removed at the START of the next round.
            foeExtra.crippleRoundsLeft = -1;
          } else {
            foeExtra.crippleRoundsLeft = newRoundsLeft;
          }
        }

        // Armour Breaker (Dune pa): reduce this foe's armour by 1 at start of each round
        if (hasArmourBreaker && (f.armourPenalty||0) < (parseInt(f.armour)||0)) {
          foeExtra.armourPenalty = (foeExtra.armourPenalty||0) + 1;
          addLog(`🔩 Armour Breaker: ${f.name} armour -1 (now ${Math.max(0,(parseInt(f.armour)||0)-foeExtra.armourPenalty)}).`, 'log-passive');
        }
        // Insight armourPenaltyRoundsLeft tick-down
        if (f.armourPenaltyRoundsLeft > 0) {
          const newR = f.armourPenaltyRoundsLeft - 1;
          foeExtra.armourPenaltyRoundsLeft = newR;
          if (newR === 0) {
            foeExtra.armourPenalty = Math.max(0, (foeExtra.armourPenalty||0) - 2);
            addLog(`Insight expired on ${f.name} — armour restored.`, 'log-passive');
          }
        }
        // Silver Frost: apply frozen dice if set
        if (f.frozenDice && f.frozenDice.length > 0) {
          foeExtra.dice = [...f.frozenDice];
          foeExtra.frozenDice = null; // consumed for one round
          addLog(`❄ Silver Frost: ${f.name} forced to use [${f.frozenDice.join('][')}].`, 'log-passive');
        }

        // Shield Spin
        if (hasShieldSpin && fd.some(d=>d===1)) {
          const spinDmg = rollD6();
          const newHp = Math.max(0, foeExtra.hp - spinDmg);
          addLog(`🛡 Shield Spin: ${f.name} rolled [1], takes ${spinDmg} dmg`, 'log-hit');
          foeExtra.hp = newHp;
        }
        // Fire Starter (Dune pa): 2 damage to one opponent at start of each round
        // Only fires for the active foe to avoid complexity with target selection
        if (hasFireStarter && f.id === activeFoeId) {
          foeExtra.hp = Math.max(0, foeExtra.hp - 2);
          addLog(`🔥 Fire Starter: ${f.name} −2HP (ignores armour).`, 'log-passive');
        }
        // Clear per-round armour penalty (Stagger — lowers foe armour to 0 for one round only)
        foeExtra.armourPenaltyThisRound = 0;

        return foeExtra;
      });
      setFoes(updatedFoesInit);

      addLog(`— Round ${newRound} —`, 'log-round');
      addLog(`${hero.name}: [${hDiceFinal.join('][')}] +${nextSpeed}spd = ${hTotal}`, 'log-roll');

      let highestFoeTotal = 0;
      let leadFoe = null;
      // Note: updatedFoesInit already had Shield Spin applied and cripple decremented.
      // Per-foe speedPenaltyThisRound (from Zapped!) is read here and cleared on these foes.
      updatedFoesInit.filter(f=>f.hp>0).forEach(f => {
        const fSpd = Math.max(0,
          (parseInt(f.speed)||0)
          - (f.speedPenalty||0)
          - cmods.foeSpeedPenaltyThisRound   // global round penalty (Slam/NatRev carry)
          - (f.speedPenaltyThisRound||0)     // per-foe round penalty (Zapped!)
        );
        const fTotal = f.dice.reduce((a,b)=>a+b,0) + fSpd;
        addLog(`${f.name}: [${f.dice.join('][')}] +${fSpd}spd = ${fTotal}`, 'log-roll');
        if (fTotal > highestFoeTotal) { highestFoeTotal = fTotal; leadFoe = f; }
        // Exploit (HoF/EoWF pa): 1 damage for each [1] foe rolls for attack speed
        if (hasExploit) {
          const onesCount = f.dice.filter(d=>d===1).length;
          if (onesCount > 0) {
            // We'll apply this damage in the foe update below after the loop
            addLog(`🎯 Exploit: ${f.name} rolled ${onesCount}×[1] — ${onesCount} dmg (ignores armour).`, 'log-hit');
          }
        }
      });
      // Apply Exploit damage in one batch
      if (hasExploit) {
        setFoes(fs => fs.map(f => {
          if (f.hp <= 0) return f;
          const onesCount = (f.dice||[]).filter(d=>d===1).length;
          return onesCount > 0 ? {...f, hp: Math.max(0, f.hp - onesCount)} : f;
        }));
      }
      // Announce Coup de Grace / Headshot / Last Rites availability
      const hasCoupe = hasAbil(allPassives,'coup de grace') && !usedOnce.has('coup de grace');
      const hasHShot = hasAbil(allPassives,'headshot') && !usedOnce.has('headshot');
      const hasLRites = hasAbil(allPassives,'last rites') && !usedOnce.has('last rites');
      updatedFoesInit.filter(f=>f.hp>0).forEach(f=>{
        if (hasCoupe  && f.hp<=10) addLog(`💀 Coup de Grace available — ${f.name} HP ≤ 10!`,'log-win');
        if (hasHShot  && f.hp<=5)  addLog(`🎯 Headshot available — ${f.name} HP ≤ 5!`,'log-win');
        if (hasLRites && f.hp<=15) addLog(`⚔ Last Rites available — ${f.name} HP ≤ 15!`,'log-win');
      });
      // Clear speedPenaltyThisRound now that this round's speed has been computed.
      // brawnPenaltyThisRound and magicPenaltyThisRound are intentionally NOT cleared here —
      // they must remain active through the damage phase so Zapped!'s brawn/magic penalty
      // affects the foe's damage roll in the same round it was cast.
      // They are cleared at end of round in applyPassives instead.
      setFoes(fs => fs.map(f => ({
        ...f,
        speedPenaltyThisRound: 0,
      })));

      // Life Spark / Dark Claw check on hero initiative dice.
      // Glossary: "every double you roll" — includes speed dice, not just damage.
      // Dark Claw needs a target foe — use the active foe (the one the hero is fighting).
      let newHeroHp = checkDoubles(hDiceFinal, heroHp, computed.maxHealth, activeFoeId, true);
      if (newHeroHp !== heroHp) setHeroHp(newHeroHp);

      // Swift Strikes: for each [6] in hero speed dice, deal weapon speed dmg to a foe
      if (hasSwiftStrikes) {
        const sixCount = hDiceFinal.filter(d=>d===6).length;
        if (sixCount > 0) {
          const mainWpnSpd = hero.equipment?.mainHand?.stats?.speed || 0;
          const offWpnSpd  = hero.equipment?.leftHand?.stats?.speed  || 0;
          const fastestWpn = Math.max(mainWpnSpd, offWpnSpd);
          // Target the active foe (the one the player is fighting), not always index 0
          const ssTarget = foes.find(f => f.id === activeFoeId && f.hp > 0) || liveFoes()[0];
          if (ssTarget && fastestWpn > 0) {
            const ssDmg = sixCount * fastestWpn;
            const newHp2 = Math.max(0, ssTarget.hp - ssDmg);
            setFoes(fs => fs.map(f => f.id===ssTarget.id ? {...f, hp:newHp2} : f));
            addLog(`⚡ Swift Strikes: ${sixCount}×[6] → ${ssDmg} dmg to ${ssTarget.name} (weapon spd ${fastestWpn}, ignores armour)`, 'log-hit');
          } else if (ssTarget) {
            addLog(`⚡ Swift Strikes: ${sixCount}×[6] — equip swords to deal damage.`, 'log-passive');
          }
        }
      }

      let roundWinner;

      // Far Sight (Dune pa): talon wing alive → auto-win initiative round 1
      if (hasFarSight && newRound === 1 && companion?.type === 'talon_wing' && companion.alive) {
        addLog(`🦅 Far Sight: Talon Wing grants initiative — you automatically win round 1!`, 'log-win');
        setHeroDice(hDiceFinal);
        // Set windwalkerDiceSum in case Windwalker is equipped (needs speed dice sum for damage)
        setCmods(prev => ({...prev, windwalkerDiceSum: hDiceFinal.reduce((a,b)=>a+b,0)}));
        setWinner('hero'); setPhase('post-roll'); setRolling(false);
        setDamageDice([]); setDamageWinner(null); setRoundDamage(null);
        return;
      }

      if (hTotal > highestFoeTotal) {
        roundWinner = 'hero';
        addLog(`${hero.name} wins the round!`, 'log-win');
      } else if (highestFoeTotal > hTotal) {
        roundWinner = 'foe';
        setActiveFoeId(leadFoe ? leadFoe.id : foes[0].id);
        addLog(`${leadFoe?.name||'Foe'} wins the round!`, 'log-hit');
        // Bolt release check
        if (cmods.boltReleaseActive) addLog('⚡ Bolt charged — ready to release!', 'log-passive');
      } else {
        roundWinner = 'tie';
        addLog('Stand-off — no damage this round.', 'log-passive');
      }

      setWinner(roundWinner);
      setPhase('post-roll');
      setRolling(false);
      setDamageDice([]); setDamageWinner(null); setRoundDamage(null);

      // Reset per-round cmods
      setCmods(prev => {
        // Decrement counters first, then decide what to keep
        const newAdrenalineRounds = Math.max(0, prev.adrenalineRoundsLeft - 1);
        const newTimeShiftRounds  = Math.max(0, prev.timeShiftRoundsLeft - 1);
        // Adrenaline: keep +2 speed bonus only while rounds remain AFTER decrement
        const keepAdrenalineBonus = newAdrenalineRounds > 0;
        // TimeShift: keep speed match only while rounds remain
        const keepTimeShiftBonus  = newTimeShiftRounds > 0;
        const keepSpeedBonus = keepAdrenalineBonus || keepTimeShiftBonus;
        return ({
        ...prev,
        extraSpeedDice: 0, // always reset per-round — Adrenaline gives +2 speed (stat), not extra dice
        speedBonus: keepSpeedBonus ? prev.speedBonus : (prev.reboundActive ? 2 : 0),
        reboundActive: false,
        armourBonus: 0,
        magicBonus: 0,
        brawnBonus: prev.bloodRageActive ? prev.brawnBonus : 0,
        foeDiceReduction: 0,
        foeSpeedPenaltyThisRound: 0,
        // foeBrawnPenaltyThisRound / foeMagicPenaltyThisRound removed — Zapped! now uses per-foe fields
        piercingActive: false,
        fatalBlowActive: false,
        dodgeActive: false,
        windwalkerActive: false,
        criticalStrikeActive: false,
        dominateActive: false,
        rakeActive: false,
        cleaveActive: false,
        blackRainActive: false,
        backfireActive: false,
        brutality2DiceActive: false,
        deflectActive: false,
        overpowerActive: false,
        punctureActive: false,
        iceShardActive: false,
        igniteActive: false,
        boltReleaseActive: prev.boltReleaseActive,
        thornArmourActive: false,
        shieldWallActive: false,
        darkPactActive: false,
        surgeActive: false,
        impaleActive: false,   // cleared here — impaleSpeedPenalty applies carry once, then impaleActive resets
        damageBonus: 0,
        secondSightActive: false,
        foeDmgScorePenalty: 0,
        torrentActive: false,        // cleared after cleave consumes it
        sureEdgeActive: prev.sureEdgeActive, // persistent for full combat once activated
        gougeActive: prev.gougeActive,       // persistent
        recklessActive: false,               // per-round
        bloodThiefActive: prev.bloodThiefActive,   // persistent
        brightSparkActive: prev.brightSparkActive, // persistent
        hypnotiseActive: prev.hypnotiseActive,     // persistent
        magicTapActive: false,               // per-round (restored on doubles)
        mangleHoFActive: prev.mangleHoFActive,     // persistent once activated
        soulBurstUsed: prev.soulBurstUsed,         // persistent
        heroStatAdj: prev.heroStatAdj,             // persistent — only reset at combat start
        heroStatAdjRound: { brawn:0, magic:0, speed:0, armour:0 }, // per-round — cleared every initiative
        hookedDieSaved: 0,                         // consumed: die was added to speedBonus already
        // rainingBlowsActive intentionally NOT reset — persists for full combat once activated
        poundSpeedPenalty: 0,
        surgeSpeedPenalty: 0,
        impaleSpeedPenalty: prev.impaleActive ? 1 : 0,
        // Slam and Nature's Revenge: foe -1 speed for the NEXT round — carry as foeSpeedPenaltyThisRound
        // slamSpeedPenalty/natRevSpeedPenalty are set when ability fires; applied here as foe speed penalty
        // then zeroed so they only apply for one round.
        foeSpeedPenaltyThisRound: (prev.slamSpeedPenalty||0) + (prev.natRevSpeedPenalty||0),
        slamSpeedPenalty: 0,
        natRevSpeedPenalty: 0,
        adrenalineRoundsLeft: newAdrenalineRounds,
        timeShiftRoundsLeft: newTimeShiftRounds,
        hauntDmgThisRound: 0,
        extraDamageDice: 0,
        retaliation1DieActive: false,
        retaliation2DiceActive: false,
        judgementActive: false,
        avengingActive: false,
        mirageActive: false,  // cleared each round — mirage is only valid for the round it was cast
        windwalkerDiceSum: hDiceFinal.reduce((a,b)=>a+b,0),
      });});
    }, 400);
  };

  // ── CONFIRM ROLL (post-roll → resolve winner) ──────────────────────────────
  const confirmRoll = () => {
    takeSnapshot();
    setPendingDiceAction(null);
    setSwapHeroDieIdx(null);
    setFeintSelection([]);
    setPhase('pre-damage');
  };

  // ── ABILITY ENGINE ─────────────────────────────────────────────────────────
  // Enforcement rules per glossary (v1.4):
  //
  // ONCE-PER-COMBAT (usedOnce set):
  //   Default rule (glossary): every ability unless stated otherwise.
  //   Speed (sp): all go into usedOnce automatically by type.
  //   Modifier (mo): tracked via ONCE_PER_COMBAT set at module scope.
  //     Exceptions with special rules:
  //       execution — sp type but once per ROUND, tracked via usedThisRound
  //       watchful, deceive/trickster — interactive, once per round via usedThisRound
  //       last laugh (LoS only) — explicitly no limit in LoS; later books once per combat
  //
  // MULTI-USE (one use per equipped item copy):
  //   heal, charm, regrowth — FAQ Q5 (Da Boss)
  //
  // ONCE-PER-ROUND (usedThisRound — type co):
  //   All combat (co) abilities reset each round.
  //   Watchful / deceive / trickster are interactive mo abilities treated as per-round.

  const activateAbility = (name, type, slotIndex = null) => {
    const key = name.toLowerCase();

    // ── Multi-use: one use per item copy ────────────────────────────────────
    // heal, charm, regrowth: FAQ Q5 (Da Boss) — one use per equipped item copy.
    // channel, greater heal, greater healing: same per-copy rule per their glossary entries.
    // deadly dance: (sp) EoWF — exactly 2 uses per combat (handled via totalAllowed=2).
    // All other abilities: once per combat via ONCE_PER_COMBAT or type block below.
    const multiUseAbils = ['charm','heal','regrowth','channel','greater heal','greater healing'];
    const isMultiUse = multiUseAbils.some(n => key === n);
    const isDeadlyDance = key === 'deadly dance';
    if (isMultiUse || isDeadlyDance) {
      const totalAllowed = isDeadlyDance ? 2 : (() => {
        const equippedCount = Object.values(hero.equipment).filter(item =>
          item?.ability?.name?.toLowerCase() === key
        ).length;
        const trackedCount = (hero.specialAbilities?.modifier || []).filter(a => a.toLowerCase() === key).length
                           + (hero.specialAbilities?.combat  || []).filter(a => a.toLowerCase() === key).length;
        return Math.max(1, equippedCount, trackedCount);
      })();
      const usedCount = [...usedOnce].filter(k => k.startsWith(key + '_use_')).length;
      if (usedCount >= totalAllowed) {
        addLog(`${name} — all ${totalAllowed} use(s) spent this combat.`, 'log-passive'); return;
      }
      const targetSlot = slotIndex !== null ? slotIndex + 1 : usedCount + 1;
      const slotKey = `${key}_use_${targetSlot}`;
      if (usedOnce.has(slotKey)) {
        addLog(`${name} — this copy already used this combat.`, 'log-passive'); return;
      }
      setUsedOnce(prev => new Set([...prev, slotKey]));

    // ── True once-per-combat abilities ───────────────────────────────────────
    } else {
      // ONCE_PER_COMBAT and matchesOnce() are defined at module scope (above ABILITY_DB).
      // Abilities NOT tracked here (intentional exceptions):
      //   last laugh (LoS: no stated limit — unlimited in LoS only)
      //   pack spirit (Dune Sea: explicitly usable multiple times per combat)
      //   beguile (HoF: governs another ability, not itself consumed)
      //   channel / greater heal / greater healing: per-item-copy (handled above as multiUseAbils)
      //   water jets (Dune Sea): per-round (handled in per-round block below)
      //   deadly dance (EoWF): 2 uses per combat (handled above as isDeadlyDance)
      //   bolt: two-phase (charge then release) — self-managed via 'bolt_released' in usedOnce;
      //         the external guard MUST NOT fire on the release click or it will block it.

      if (matchesOnce(key) && key !== 'bolt') {
        if (usedOnce.has(key)) {
          addLog(`${name} already used this combat.`, 'log-passive'); return;
        }
        setUsedOnce(prev => new Set([...prev, key]));
      }
    }

    // ── Enforcement by ability type ───────────────────────────────────────────
    // Glossary default: "each ability can only be used once during a combat."
    // Combat example (advanced) confirms this: abilities like deep wound and
    // piercing say "no combat abilities to play" once used, not "already used
    // this round". No (co) ability says "each combat round" except Execution.
    //
    // Speed (sp):   once per combat → usedOnce
    // Combat (co):  once per combat → usedOnce  (NOT per-round — that was wrong)
    //   Exception: execution is explicitly once per ROUND per glossary
    //   Exception: bolt — two-phase; usage tracked internally via 'bolt_released'
    // Modifier (mo): tracked via ONCE_PER_COMBAT set (already handled above)

    if (type === 'sp' && key !== 'execution' && key !== 'deadly dance' && !key.includes('water jets')) {
      // Time Shift: "You cannot play another speed ability until time shift has faded."
      if (cmods.timeShiftRoundsLeft > 0 && key !== 'time shift') {
        addLog(`${name}: blocked — Time Shift is active (${cmods.timeShiftRoundsLeft} round(s) left).`, 'log-passive');
        return;
      }
      if (usedOnce.has(key)) {
        addLog(`${name} already used this combat.`, 'log-passive'); return;
      }
      setUsedOnce(prev => new Set([...prev, key]));
      // Whirlwind (Dune pa): brawn +2 until end of this round when a speed ability is played
      if (hasWhirlwind) {
        setCmods(p=>({...p, brawnBonus: p.brawnBonus+2}));
        addLog(`🌀 Whirlwind: +2 brawn this round.`, 'log-passive');
      }
      // Wind Chill (EoWF pa): all foes take 2 damage when a speed ability is played
      if (hasWindChill) {
        setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-2)}:f));
        addLog(`❄ Wind Chill: 2 dmg to all foes (ignores armour).`, 'log-passive');
      }
      // Quick Cuts (Dune pa): deal main-hand weapon brawn to a foe per speed ability
      if (hasQuickCuts) {
        const mhBrawn = hero.equipment?.mainHand?.stats?.brawn || 0;
        if (mhBrawn > 0) {
          setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-mhBrawn)}:f));
          addLog(`⚡ Quick Cuts: ${mhBrawn} dmg to ${activeFoe?.name} (main hand brawn, ignores armour).`, 'log-passive');
        }
      }
    }

    if (type === 'co' && key !== 'bolt') {
      // Bolt is exempt — it has two phases (charge + release) and self-manages its state.
      // Once-per-combat for all other combat abilities.
      if (usedOnce.has(key)) {
        addLog(`${name} already used this combat.`, 'log-passive'); return;
      }
      setUsedOnce(prev => new Set([...prev, key]));
      // Weaver (EoWF/HoF pa): heal 2 each time a combat ability is played
      if (hasWeaver) {
        const weaverHeal = Math.min(2, computed.maxHealth - heroHp);
        if (weaverHeal > 0) { setHeroHp(p=>p+weaverHeal); addLog(`🧵 Weaver: +${weaverHeal} HP.`, 'log-heal'); }
      }
      // Veiled Strike (EoWF/Dune pa): when dodge is used, deal 1 die to a foe
      const isDodgeType = ['sidestep','evade','vanish','spider sense','dodge','blink','prophecy',
        'dark distraction','glimmer dust','gloom','misdirection','confound','veil'].some(n=>key.includes(n));
      if (hasVeiledStrike && isDodgeType) {
        const d = rollD6();
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
        addLog(`🗡 Veiled Strike: [${d}] dmg to ${activeFoe?.name} (ignores armour).`, 'log-passive');
      }
      // Cutthroat (Dune pa): dodge → brawn +1 permanent
      if (hasCutthroat && isDodgeType) {
        setCmods(p=>({...p, brawnBonus: p.brawnBonus+1}));
        addLog(`🔪 Cutthroat: +1 brawn (permanent this combat).`, 'log-passive');
      }
    }

    // Execution: once per round (the only co/sp ability with an explicit per-round rule)
    // Water jets (Dune Sea mo): "once per combat round" — explicitly per-round
    if (key === 'execution' || key.includes('water jets')) {
      if (usedThisRound.has(key)) {
        addLog(`${name} already used this round.`, 'log-passive'); return;
      }
      setUsedThisRound(prev => new Set([...prev, key]));
    }

    // ── Speed abilities ────────────────────────────────────────────────────
    if (key.includes('haste') || key.includes("cat's speed") || key.includes('lay of the land')) {
      setCmods(p=>({...p, extraSpeedDice: p.extraSpeedDice+1}));
      addLog(`${name}: +1 speed die this round.`, 'log-roll');
    } else if (key.includes('adrenaline')) {
      setCmods(p=>({...p, speedBonus: p.speedBonus+2, adrenalineRoundsLeft:2}));
      addLog(`${name}: +2 speed for 2 rounds.`, 'log-roll');
    } else if (key.includes('courage')) {
      setCmods(p=>({...p, speedBonus: p.speedBonus+4}));
      addLog(`${name}: +4 speed this round.`, 'log-roll');
    } else if (key.includes('quicksilver') || key.includes('fearless') || key.includes('click your heels')) {
      setCmods(p=>({...p, speedBonus: p.speedBonus+2}));
      addLog(`${name}: +2 speed this round.`, 'log-roll');
    } else if (key.includes('charge') && !key.includes('charged shot') && !key.includes('life charge')) {
      if (round <= 1) {
        setCmods(p=>({...p, speedBonus: p.speedBonus+2}));
        addLog(`${name}: +2 speed (round 1).`, 'log-roll');
      } else {
        // Refund the usedOnce slot — charge was blocked, not consumed
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
        addLog(`${name}: only usable in round 1.`, 'log-passive');
      }
    } else if (key.includes('webbed') || key.includes('curse') || key.includes('knockdown') ||
               key.includes('immobilise') || key.includes('stun') || key.includes('shackle') ||
               key.includes('windblast') || key.includes('demolish')) {
      setCmods(p=>({...p, foeDiceReduction: p.foeDiceReduction+1}));
      if (key.includes('demolish')) {
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenalty:(f.armourPenalty||0)+1}:f));
        addLog(`${name}: foe loses 1 armour (permanent) + 1 speed die this round.`, 'log-roll');
      } else {
        addLog(`${name}: foe loses 1 speed die this round.`, 'log-roll');
      }
    } else if (key.includes('chill touch') || key.includes('radiance') || key.includes('snakes alive')) {
      setCmods(p=>({...p, foeSpeedPenaltyThisRound: p.foeSpeedPenaltyThisRound+2}));
      addLog(`${name}: foe -2 speed this round.`, 'log-roll');
    } else if (key.includes('swamp legs')) {
      setCmods(p=>({...p, foeSpeedPenaltyThisRound: p.foeSpeedPenaltyThisRound+1}));
      addLog(`${name}: foe -1 speed this round.`, 'log-roll');
    } else if (key.includes('zapped')) {
      // Glossary: "your opponent's speed, brawn and magic are lowered by 3" — targets ONE opponent.
      // Store on the per-foe round-scoped fields, not global cmods (which leaked to ALL foes).
      setFoes(fs => fs.map(f => f.id===activeFoeId ? {
        ...f,
        speedPenaltyThisRound: (f.speedPenaltyThisRound||0) + 3,
        brawnPenaltyThisRound: (f.brawnPenaltyThisRound||0) + 3,
        magicPenaltyThisRound: (f.magicPenaltyThisRound||0) + 3,
      } : f));
      addLog(`${name}: ${activeFoe?.name||'foe'} -3 speed, brawn, magic this round only.`, 'log-roll');
    } else if (key.includes('execution')) {
      const target = foes.find(f=>f.id===activeFoeId);
      // Glossary: "opponent whose health is equal to or lower than your speed" — effective speed (all bonuses)
      if (target && target.hp <= effectiveSpeed) {
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:0}:f));
        addLog(`⚔ Execution: ${target.name} HP ≤ ${effectiveSpeed} speed — executed!`, 'log-win');
        const remaining = foes.filter(f=>f.id!==activeFoeId && f.hp>0);
        if (remaining.length===0) { endCombat('hero'); return; }
        setActiveFoeId(remaining[0].id);
      } else {
        addLog(`Execution: foe HP must be ≤ your speed (${effectiveSpeed}).`, 'log-passive');
        setUsedThisRound(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    // Execution availability hint in rollInitiative also updated separately
    } else if (key.includes('time shift')) {
      const target = foes.find(f=>f.id===activeFoeId);
      if (target) {
        const matchSpd = (parseInt(target.speed)||0);
        setCmods(p=>({...p, speedBonus: Math.max(p.speedBonus, matchSpd-computed.speed), timeShiftRoundsLeft:3}));
        addLog(`${name}: speed matched to foe (${matchSpd}) for 3 rounds.`, 'log-roll');
      }
    } else if (key.includes('stake')) {
      const target = foes.find(f=>f.id===activeFoeId);
      if (target && target.hp <= 10) {
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:0}:f));
        addLog(`🧛 Stake: ${target.name} HP ≤ 10 — staked!`, 'log-win');
        const remaining = foes.filter(f=>f.id!==activeFoeId&&f.hp>0);
        if (remaining.length===0) { endCombat('hero'); return; }
        setActiveFoeId(remaining[0].id);
      } else addLog(`Stake: foe HP must be ≤ 10.`, 'log-passive');

    // ── Combat abilities ───────────────────────────────────────────────────
    } else if (['sidestep','evade','vanish','spider sense','dodge','command'].some(n=>key.includes(n))) {
      setCmods(p=>({...p, dodgeActive:true}));
      addLog(`${name}: damage avoided this round (passives still apply).`, 'log-passive');
    } else if (key.includes('piercing') || key.includes('fatal blow') || key.includes('focused strike')) {
      const isFatalBlow  = key.includes('fatal blow');
      const isFullPierce = !isFatalBlow; // piercing + focused strike = full armour bypass
      // Heart Steal (EoWF pa): only triggers on 'piercing' specifically, not Fatal Blow or Focused Strike
      const heartStealDie = hasHeartSteal && key.includes('piercing') ? 1 : 0;
      setCmods(p => ({
        ...p,
        piercingActive:  isFullPierce,
        fatalBlowActive: isFatalBlow,
        extraDamageDice: p.extraDamageDice + heartStealDie,
      }));
      const armourNote = isFatalBlow
        ? 'next damage ignores half foe armour (rounded up)'
        : `next damage ignores foe armour${heartStealDie ? ' +1 die (Heart Steal)' : ''}`;
      addLog(`${name}: ${armourNote}.`, 'log-roll');
    } else if (key.includes('deep wound') || key.includes('feral fury') || key.includes('overload') || key.includes('heavy blow')) {
      const extra = 1 + (hasHeartSteal && (key.includes('deep wound') || key.includes('heavy blow')) ? 1 : 0);
      setCmods(p=>({...p, extraDamageDice: p.extraDamageDice + extra}));
      addLog(`${name}: +${extra} damage die${extra>1?' (Heart Steal)':''}.`, 'log-roll');
    } else if (key.includes('dark pact')) {
      // Glossary: "sacrifice 4 health" — no stated floor. Can reach 0, triggering KickStart or death.
      const newHp = Math.max(0, heroHp - 4);
      setHeroHp(newHp);
      if (newHp <= 0 && hasKickStart && !cmods.kickStartUsed) {
        setHeroHp(15);
        setFoes(fs => fs.map(f => f.id===activeFoeId ? {...f, heroDoTs:{venom:false,bleed:false,disease:false}} : f));
        setHeroPassives(p => ({...p, bleed:false, venom:false, disease:false, thorns:false, fire_aura:false, barbs:false, vitriol:false}));
        setCmods(p=>({...p, damageBonus: p.damageBonus+4, kickStartUsed:true}));
        addLog(`${name}: -4 HP → KickStart triggered! Revived at 15 HP. +4 damage score. All passives removed.`, 'log-heal');
      } else {
        setCmods(p=>({...p, damageBonus: p.damageBonus+4}));
        addLog(`${name}: -4 HP (${heroHp}→${newHp}), +4 damage score.`, 'log-hit');
        if (newHp <= 0) { endCombat('foe'); return; }
      }
    } else if (key.includes('pound')) {
      setCmods(p=>({...p, damageBonus: p.damageBonus+3, poundSpeedPenalty:1}));
      addLog(`${name}: +3 damage. -1 speed next round.`, 'log-roll');
    } else if (key.includes('impale')) {
      setCmods(p=>({...p, damageBonus: p.damageBonus+3, impaleActive:true, impaleSpeedPenalty:1}));
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,speedPenalty:(f.speedPenalty||0)+1}:f));
      addLog(`${name}: +3 damage, foe -1 speed next round.`, 'log-roll');
    } else if (key.includes('surge')) {
      setCmods(p=>({...p, magicBonus: p.magicBonus+3, surgeActive:true, surgeSpeedPenalty:1}));
      addLog(`${name}: +3 magic this round. -1 speed next round.`, 'log-roll');
    } else if (key.includes('ice shard')) {
      const magic = computed.magic + cmods.magicBonus;
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-magic)}:f));
      addLog(`❄ Ice Shards: ${magic} dmg to ${activeFoe?.name} (ignores armour, = magic score)`, 'log-hit');
      trackBloodRage(magic);
      setPhase('post-damage');
    } else if (key.includes('ignite')) {
      const d1=rollD6(), d2=rollD6();
      const dmg = d1+d2+dieBonusNoScore;
      // Apply damage AND per-foe DoTs to every live foe in one update
      setFoes(fs=>fs.map(f=>{
        if (f.hp <= 0) return f;
        const updated = {...f, hp:Math.max(0,f.hp-dmg), burned:true};
        if (dmg > 0) {
          const dots = {...(f.heroDoTs||{})};
          if (hasVenom    && !dots.venom)   { dots.venom   = true; }
          if (hasBleed    && !dots.bleed)   { dots.bleed   = true; }
          if (hasDisease  && !dots.disease) { dots.disease = true; }
          if (hasToxicBlades && !dots.bleed){ dots.bleed   = true; }
          updated.heroDoTs = dots;
        }
        return updated;
      }));
      addLog(`🔥 Ignite: [${d1}]+[${d2}]${dieBonusNoScore?`+${dieBonusNoScore}shades`:''}=${dmg} to ALL foes (ignores armour). Burn applied!`, 'log-hit');
      if (dmg > 0) {
        if (hasVenom)     addLog(`Venom applied to all foes (Ignite).`,'log-passive');
        if (hasBleed || hasToxicBlades) addLog(`Bleed applied to all foes (Ignite).`,'log-passive');
        if (hasDisease)   addLog(`Disease applied to all foes (Ignite).`,'log-passive');
      }
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('cleave') || key.includes('black rain') || key.includes('lash') || key.includes('splinters')) {
      // Torrent (EoWF): "when using cleave, lash or shadow thorns, roll two dice instead of one"
      const numDice = cmods.torrentActive ? 2 : 1;
      const diceRolls = Array.from({length: numDice}, rollD6);
      const diceSum = diceRolls.reduce((a,b)=>a+b,0);
      const dmg = diceSum + (numDice * dieBonusNoScore);
      if (cmods.torrentActive) setCmods(p=>({...p, torrentActive:false})); // consumed
      const hitFoes = foes.filter(f=>f.hp>0);
      setFoes(fs=>fs.map(f=>{
        if (f.hp <= 0) return f;
        const updated = {...f, hp:Math.max(0,f.hp-dmg)};
        if (dmg > 0) {
          const dots = {...(f.heroDoTs||{})};
          if (hasVenom    && !dots.venom)   { dots.venom   = true; }
          if (hasBleed    && !dots.bleed)   { dots.bleed   = true; }
          if (hasDisease  && !dots.disease) { dots.disease = true; }
          if (hasToxicBlades && !dots.bleed){ dots.bleed   = true; }
          updated.heroDoTs = dots;
        }
        return updated;
      }));
      addLog(`${name}${cmods.torrentActive===false&&numDice===2?' (Torrent: 2 dice)':''}: [${diceRolls.join('][')}]${dieBonusNoScore?`+${numDice*dieBonusNoScore}shades`:''}=${dmg} dmg to ALL live foes (ignores armour)`, 'log-hit');
      if (dmg > 0 && hitFoes.length > 0) {
        if (hasVenom)     addLog(`Venom applied to all foes.`,'log-passive');
        if (hasBleed || hasToxicBlades) addLog(`Bleed applied to all foes.`,'log-passive');
        if (hasDisease)   addLog(`Disease applied to all foes.`,'log-passive');
      }
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('rake')) {
      const dice = [rollD6(),rollD6(),rollD6()];
      const dmg = dice.reduce((a,b)=>a+b,0) + (dice.length * dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${dice.join('][')}]${dieBonusNoScore?`+${dieBonusNoScore*3}shades`:''}=${dmg} to ${activeFoe?.name} (ignores armour, no modifiers)`, 'log-hit');
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('backfire')) {
      const foeDice=[rollD6(),rollD6(),rollD6()];
      const selfDice=[rollD6(),rollD6()];
      const foeDmg=foeDice.reduce((a,b)=>a+b,0) + (foeDice.length * dieBonusNoScore);
      const selfDmg=selfDice.reduce((a,b)=>a+b,0);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-foeDmg)}:f));
      setHeroHp(prev=>Math.max(0,prev-selfDmg));
      addLog(`${name}: 3 dice [${foeDice.join('][')}]${dieBonusNoScore?`+${dieBonusNoScore*3}shades`:''}=${foeDmg} to foe; 2 dice [${selfDice.join('][')}]=${selfDmg} to self (ignores armour)`, 'log-hit');
      trackBloodRage(foeDmg);
      setPhase('post-damage');
    } else if (key.includes('brutality') || key.includes('deflect') || key.includes('overpower') ||
               key.includes('banshee wail') || key.includes('parry') || key.includes('head butt') || key.includes('slam')) {
      // Stop foe damage + deal 2 dice back (brutality/deflect/overpower) or just stop (parry/head butt/slam/banshee wail)
      if (winner==='foe') {
        if (['brutality','deflect','overpower'].some(n=>key.includes(n))) {
          const d1=rollD6(),d2=rollD6();
          const dmg=d1+d2;
          setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
          addLog(`${name}: foe damage negated! [${d1}]+[${d2}]=${dmg} back to foe (ignores armour)`, 'log-hit');
        } else {
          addLog(`${name}: foe damage negated! Round ends.`, 'log-passive');
        }
        // Slam: "In the next combat round, your opponent's speed is reduced by 1."
        // Apply OUTSIDE the counterattack branch so it actually fires for Slam.
        if (key.includes('slam')) {
          setCmods(p=>({...p, slamSpeedPenalty: (p.slamSpeedPenalty||0)+1}));
        }
        setCmods(p=>({...p, dodgeActive:true}));
        setPhase('post-damage');
      } else addLog(`${name}: only usable when foe wins the round.`, 'log-passive');
    } else if (key.includes('bolt')) {
      if (!cmods.boltReleaseActive) {
        // Check if it was already released this combat (usedOnce has 'bolt_released')
        if (usedOnce.has('bolt_released')) {
          addLog(`${name}: already used this combat.`, 'log-passive');
        } else {
          setCmods(p=>({...p, boltReleaseActive:true}));
          addLog(`⚡ Bolt: charged. Release next time you win a round.`, 'log-passive');
        }
      } else {
        // Release
        const dice=[rollD6(),rollD6(),rollD6()];
        const dmg=dice.reduce((a,b)=>a+b,0);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
        addLog(`⚡ Bolt release: [${dice.join('][')}]=${dmg} to ${activeFoe?.name} (ignores armour)`, 'log-hit');
        setCmods(p=>({...p, boltReleaseActive:false}));
        setUsedOnce(prev => new Set([...prev, 'bolt_released']));
        trackBloodRage(dmg);
        setPhase('post-damage');
      }
    } else if (key.includes('puncture')) {
      const d1=rollD6(),d2=rollD6();
      // "Instead of rolling for a damage score" — sear/acid excluded; shades applies
      const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg),armourPenalty:(f.armourPenalty||0)+1}:f));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${dieBonusNoScore*2}shades`:''}=${dmg} to ${activeFoe?.name} (ignores armour); foe -1 armour permanent`, 'log-hit');
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('haunt')) {
      if (cmods.hauntActive) {
        addLog(`${name}: spirit already active — dispelled only on doubles.`, 'log-passive');
      } else {
        setCmods(p=>({...p, hauntActive:true}));
        addLog(`${name}: spirit haunting ${activeFoe?.name} — 2 dmg/round until doubles rolled.`, 'log-passive');
        setPhase('post-damage');
      }
    } else if (key.includes('shield wall')) {
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
      setCmods(p=>({...p, shieldWallActive:true, armourBonus: p.armourBonus+computed.armour}));
      addLog(`${name}: armour doubled to ${effectiveArmour*2}. [${d}] dmg to foe.`, 'log-roll');
    } else if (key.includes('thorn armour')) {
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-d)}:f));
      setCmods(p=>({...p, armourBonus: p.armourBonus+3}));
      addLog(`${name}: +3 armour; [${d}] to all foes (ignores armour)`, 'log-roll');
    } else if (key.includes('windwalker')) {
      setCmods(p=>({...p, windwalkerActive:true}));
      addLog(`${name}: use speed dice sum as damage score.`, 'log-roll');
    } else if (key.includes('retaliation') || key.includes('riposte') || key.includes('sideswipe')) {
      // Glossary: "when your opponent's damage score/damage dice causes health damage" — foe must have won
      if (winner !== 'foe') {
        addLog(`${name}: only usable when the opponent wins the round.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; }); return;
      }
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
      addLog(`${name}: [${d}] dmg back to ${activeFoe?.name} (ignores armour)`, 'log-hit');
    } else if (key.includes('spore cloud') || key.includes('thorn fist')) {
      // Glossary: "when your opponent's damage score/damage dice causes health damage" — foe must win
      if (winner !== 'foe') {
        addLog(`${name}: only usable when the opponent wins the round.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; }); return;
      }
      const d1=rollD6(),d2=rollD6();
      const dmg=d1+d2;
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${d1}]+[${d2}]=${dmg} back to ${activeFoe?.name} (ignores armour)`, 'log-hit');
    } else if (key.includes('judgement')) {
      // Glossary: "when you take health damage from your opponent's damage score" — foe must win
      if (winner !== 'foe') {
        addLog(`${name}: only usable when the opponent wins the round.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; }); return;
      }
      const dmg=Math.ceil(effectiveSpeed/2);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: ½ speed = ${dmg} dmg back to foe (ignores armour)`, 'log-hit');
    } else if (key.includes('avenging spirit')) {
      // Glossary: "when you take health damage from your opponent's damage score" — foe must win
      if (winner !== 'foe') {
        addLog(`${name}: only usable when the opponent wins the round.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; }); return;
      }
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-effectiveArmour)}:f));
      addLog(`${name}: ${effectiveArmour} (armour) dmg back to foe (ignores armour)`, 'log-hit');
    } else if (key.includes('corruption')) {
      // LoS/EoWF/Dune Corruption: reduce foe's brawn OR magic by 2 — player must choose
      setPendingChoiceAction({
        abilityName: name,
        options: [
          { label: 'Foe −2 Brawn', onPick: () => { setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,brawnPenalty:(f.brawnPenalty||0)+2}:f)); addLog(`${name}: foe −2 brawn (permanent).`, 'log-passive'); } },
          { label: 'Foe −2 Magic', onPick: () => { setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,magicPenalty:(f.magicPenalty||0)+2}:f)); addLog(`${name}: foe −2 magic (permanent).`, 'log-passive'); } },
        ],
      });
    } else if (key.includes('rust')) {
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenalty:(f.armourPenalty||0)+2}:f));
      addLog(`${name}: foe -2 armour (permanent).`, 'log-passive');
    } else if (key.includes('disrupt')) {
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,magicPenalty:(f.magicPenalty||0)+3}:f));
      addLog(`${name}: foe -3 magic (permanent).`, 'log-passive');
    } else if (key.includes('cripple')) {
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,crippleRoundsLeft:3,speedPenalty:(f.speedPenalty||0)+1}:f));
      addLog(`${name}: foe -1 speed for 3 rounds.`, 'log-passive');
    } else if (key.includes('nature\'s revenge')) {
      const d1=rollD6(),d2=rollD6();
      // "Instead of rolling for a damage score" — sear/acid excluded; shades applies
      const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      // "reduces their speed by 1 for the next combat round" — use carry mechanism, NOT permanent speedPenalty
      setCmods(p=>({...p, natRevSpeedPenalty:(p.natRevSpeedPenalty||0)+1}));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${dieBonusNoScore*2}shades`:''}=${dmg} to foe (ignores armour); foe -1 speed next round`, 'log-hit');
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('rebound')) {
      setCmods(p=>({...p, reboundActive:true}));
      addLog(`${name}: +2 speed next round.`, 'log-roll');
    } else if (key.includes('shadow fury')) {
      // Add speed stat of main hand + left hand weapons
      const mainSpd = hero.equipment?.mainHand?.stats?.speed || 0;
      const offSpd  = hero.equipment?.leftHand?.stats?.speed  || 0;
      const bonus = mainSpd + offSpd;
      setCmods(p=>({...p, damageBonus: p.damageBonus+bonus}));
      addLog(`${name}: +${bonus} to damage score (main ${mainSpd} + off ${offSpd} weapon speeds).`, 'log-roll');
    } else if (key.includes('sacrifice') && cmods.shadesActive) {
      setCmods(p=>({...p, shadesActive:false, dodgeActive:true}));
      addLog(`${name}: Shades sacrificed — damage negated!`, 'log-passive');
      setPhase('post-damage');
    } else if (key.includes('ensnare') || key.includes('hamstring')) {
      setCmods(p=>({...p, dodgeActive:false}));
      addLog(`${name}: opponent's dodge cancelled — round restored!`, 'log-win');
      setWinner('hero');
    } else if ((key.includes('shock!') || key.includes('shock')) && !key.includes('shock blast') && !key.includes('storm shock')) {
      const target = foes.find(f=>f.id===activeFoeId);
      if (target) {
        // Glossary: "1 extra damage for every 2 points of armour your opponent is wearing" — effective armour after penalties
        const effectiveFoeArmour = Math.max(0, (parseInt(target.armour)||0) - (target.armourPenalty||0));
        const shockDmg = Math.ceil(effectiveFoeArmour / 2);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-shockDmg)}:f));
        addLog(`${name}: ${shockDmg} extra dmg (effective armour ${effectiveFoeArmour} ÷ 2, rounds up)`, 'log-hit');
      }

    // ── Modifier abilities ─────────────────────────────────────────────────
    } else if (key.includes('critical strike') || key.includes('gut ripper')) {
      setCmods(p=>({...p, criticalStrikeActive:true}));
      addLog(`${name}: next damage dice all become [6].`, 'log-roll');
    } else if (key.includes('dominate')) {
      // Interactive: player clicks a damage die to set it to 6
      if (damageDice.length > 0) {
        setPendingDiceAction('dominate-pick-damage');
        addLog(`${name}: 🎯 Click a damage die below to set it to [6].`, 'log-roll');
      } else {
        setCmods(p=>({...p, dominateActive:true}));
        addLog(`${name}: next damage roll — one die will become [6].`, 'log-roll');
      }
    } else if (key.includes('charm') && !key.includes('charm offensive')) {
      // Interactive: player clicks one hero speed die to reroll it
      if (heroDice.length > 0) {
        setPendingDiceAction('charm-reroll-hero');
        addLog(`${name}: 🎯 Click one of your dice below to re-roll it.`, 'log-roll');
      } else {
        // Refund the charm use — no dice to reroll yet
        const slotKey = slotIndex !== null
          ? `charm_use_${slotIndex + 1}`
          : (() => {
              const usedCount = [...usedOnce].filter(k => k.startsWith('charm_use_')).length;
              return usedCount > 0 ? `charm_use_${usedCount}` : null;
            })();
        if (slotKey) {
          setUsedOnce(prev => { const s = new Set(prev); s.delete(slotKey); return s; });
        }
        addLog(`${name}: no dice rolled yet — use after rolling initiative.`, 'log-passive');
      }
    } else if (key.includes('feint')) {
      // Interactive: player selects which dice to reroll, then confirms
      if (heroDice.length > 0) {
        setFeintSelection(heroDice.map(()=>false));
        setPendingDiceAction('feint-select-hero');
        addLog(`${name}: 🎯 Select which of your dice to re-roll, then press Confirm Feint.`, 'log-roll');
      } else {
        addLog(`${name}: no dice rolled yet.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    } else if (key.includes('surefooted')) {
      // Reroll all hero dice immediately
      if (heroDice.length > 0) {
        const newDice = heroDice.map(()=>rollD6());
        const hasSS = usedOnce.has('shadow speed'); // only if player activated it
        const finalDice = hasSS ? newDice.map(d=>d===1?3:d) : newDice;
        setHeroDice(finalDice);
        addLog(`${name}: re-rolled all dice → [${finalDice.join('][')}]`, 'log-roll');
        // Check doubles on new dice (Life Spark / Dark Claw / Haunt dispel — per glossary "before or after a re-roll")
        const newHp = checkDoubles(finalDice, heroHp, computed.maxHealth, activeFoeId);
        if (newHp !== heroHp) setHeroHp(newHp);
        _recalcWinner(finalDice, foes);
      } else {
        addLog(`${name}: no dice rolled yet.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    } else if (key.includes('last laugh')) {
      // Glossary: "force your opponent to re-roll all of their dice (for either their
      // attack speed OR for their damage score)." Player must choose which.
      const canRerollSpeed  = phase === 'post-roll' && foes.some(f=>f.hp>0 && f.dice.length>0);
      const canRerollDamage = (phase === 'pre-damage' || phase === 'post-damage') && damageWinner === 'foe' && damageDice.length > 0;

      const doSpeedReroll = () => {
        const updatedFoes = foes.map(f => {
          if (f.hp <= 0) return f;
          return {...f, dice: f.dice.map(()=>rollD6())};
        });
        setFoes(updatedFoes);
        addLog(`${name} (speed): foe speed dice re-rolled!`, 'log-roll');
        const carrySpeedPenalty = cmods.poundSpeedPenalty + cmods.surgeSpeedPenalty + cmods.impaleSpeedPenalty;
        const heroSpd = Math.max(0, computed.speed + (seeingRedActive?2:0) + cmods.speedBonus - carrySpeedPenalty);
        const hTotal = heroDice.reduce((a,b)=>a+b,0) + heroSpd;
        let highestFoeTotal=0, leadFoe=null;
        updatedFoes.filter(f=>f.hp>0).forEach(f=>{
          const fSpd=Math.max(0,(parseInt(f.speed)||0)-(f.speedPenalty||0)-cmods.foeSpeedPenaltyThisRound);
          const fTotal=f.dice.reduce((a,b)=>a+b,0)+fSpd;
          addLog(`${f.name} re-rolled: [${f.dice.join('][')}]+${fSpd}=${fTotal}`, 'log-roll');
          if(fTotal>highestFoeTotal){highestFoeTotal=fTotal;leadFoe=f;}
        });
        const newWinner = hTotal>highestFoeTotal?'hero':highestFoeTotal>hTotal?'foe':'tie';
        setWinner(newWinner);
        if(leadFoe) setActiveFoeId(leadFoe.id);
        addLog(newWinner==='hero'?`${hero.name} now wins the roll!`:newWinner==='foe'?`${leadFoe?.name||'Foe'} still wins.`:'Stand-off.','log-roll');
      };

      const doDamageReroll = () => {
        const foe = foes.find(f=>f.id===activeFoeId);
        const foeDmgAttr = foe?.usesMagic
          ? Math.max(0,(parseInt(foe.magic)||0)-(foe.magicPenalty||0)-(foe.magicPenaltyThisRound||0))
          : Math.max(0,(parseInt(foe.brawn)||0)-(foe.brawnPenalty||0)-(foe.brawnPenaltyThisRound||0));
        const newDice = damageDice.map(()=>rollD6());
        const adjDice = newDice.map(d => cmods.secondSightActive ? Math.max(1,d-2) : d);
        const diceSum = adjDice.reduce((a,b)=>a+b,0);
        const dmgScore = diceSum + foeDmgAttr;
        const heroArm = effectiveArmour;
        const newRoundDamage = Math.max(0, dmgScore - heroArm);
        setDamageDice(newDice);
        setRoundDamage(newRoundDamage);
        const ssNote = cmods.secondSightActive ? ` (second sight -2 each)` : '';
        addLog(`${name} (damage): foe damage re-rolled [${adjDice.join('][')}]${ssNote}+${foeDmgAttr}=${dmgScore} vs ${heroArm}arm → ${newRoundDamage}dmg`, 'log-roll');
      };

      if (canRerollSpeed && canRerollDamage) {
        // Edge case: mo ability used in a phase where both are valid — let player choose
        setPendingChoiceAction({
          abilityName: name,
          options: [
            { label: 'Re-roll Speed dice',  onPick: doSpeedReroll },
            { label: 'Re-roll Damage dice', onPick: doDamageReroll },
          ],
        });
      } else if (canRerollSpeed) {
        doSpeedReroll();
      } else if (canRerollDamage) {
        doDamageReroll();
      } else {
        addLog(`${name}: no foe speed or damage dice to re-roll right now.`, 'log-passive');
        // Refund — nothing consumed
        if (matchesOnce(key)) setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    } else if (key.includes('heal')) {
      const base = 4 + (hasSalvation ? 1 : 0);
      const newHp = Math.min(computed.maxHealth, heroHp + base);
      setHeroHp(newHp); onHeroHealthChange(newHp);
      addLog(`${name}: +${base} HP (${heroHp}→${newHp})${hasSalvation?' (Salvation +1)':''}`, 'log-heal');
      if (hasWrath) { setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-2)}:f)); addLog(`💢 Wrath: 2 dmg to ${activeFoe?.name}.`,'log-passive'); }
    } else if (key.includes('regrowth')) {
      const base = 6 + (hasSalvation ? 1 : 0);
      const newHp = Math.min(computed.maxHealth, heroHp + base);
      setHeroHp(newHp); onHeroHealthChange(newHp);
      addLog(`${name}: +${base} HP (${heroHp}→${newHp})${hasSalvation?' (Salvation +1)':''}`, 'log-heal');
      if (hasWrath) { setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-2)}:f)); addLog(`💢 Wrath: 2 dmg to ${activeFoe?.name}.`,'log-passive'); }
    } else if (key.includes('mend')) {
      const base = 15 + (hasSalvation ? 1 : 0);
      const newHp = Math.min(computed.maxHealth, heroHp + base);
      setHeroHp(newHp); onHeroHealthChange(newHp);
      addLog(`${name}: +${base} HP (${heroHp}→${newHp})`, 'log-heal');
    } else if (key.includes('fallen hero')) {
      const newHp = Math.min(computed.maxHealth, heroHp+10);
      setHeroHp(newHp);
      onHeroHealthChange(newHp);
      setCmods(p=>({...p, brawnBonus: p.brawnBonus+3}));
      addLog(`${name}: +10 HP (${heroHp}→${newHp}), +3 brawn this round.`, 'log-heal');
    } else if (key.includes('fortitude') || key.includes('war paint')) {
      // LoS Fortitude / HoF War paint: brawn OR armour +3 — player must choose
      setPendingChoiceAction({
        abilityName: name,
        options: [
          { label: '+3 Brawn', onPick: () => { setCmods(p=>({...p, brawnBonus: p.brawnBonus+3})); addLog(`${name}: +3 brawn this round.`, 'log-roll'); } },
          { label: '+3 Armour', onPick: () => { setCmods(p=>({...p, armourBonus: p.armourBonus+3})); addLog(`${name}: +3 armour this round.`, 'log-roll'); } },
        ],
      });
    } else if (key === 'focus') {
      // Exact match only — 'inner focus' must NOT be caught here (it has its own branch below).
      setCmods(p=>({...p, magicBonus: p.magicBonus+3}));
      addLog(`${name}: +3 magic this round.`, 'log-roll');
    } else if (key.includes('vanquish')) {
      // Vanquish: brawn only (+2) — no choice
      setCmods(p=>({...p, brawnBonus: p.brawnBonus+2}));
      addLog(`${name}: +2 brawn this round.`, 'log-roll');
    } else if (key.includes('savagery') || key.includes('heartless')) {
      // LoS Savagery / HoF Heartless: brawn OR magic +2 — player must choose
      setPendingChoiceAction({
        abilityName: name,
        options: [
          { label: '+2 Brawn', onPick: () => { setCmods(p=>({...p, brawnBonus: p.brawnBonus+2})); addLog(`${name}: +2 brawn this round.`, 'log-roll'); } },
          { label: '+2 Magic', onPick: () => { setCmods(p=>({...p, magicBonus: p.magicBonus+2})); addLog(`${name}: +2 magic this round.`, 'log-roll'); } },
        ],
      });
    } else if (key.includes('bright shield')) {
      setCmods(p=>({...p, armourBonus: p.armourBonus+4}));
      addLog(`${name}: +4 armour this round.`, 'log-roll');
    } else if (key.includes('iron will') || key.includes('might of stone')) {
      setCmods(p=>({...p, armourBonus: p.armourBonus+3}));
      addLog(`${name}: +3 armour this round.`, 'log-roll');
    } else if (key.includes('ice shield')) {
      const d=rollD6();
      setCmods(p=>({...p, armourBonus: p.armourBonus+d}));
      addLog(`${name}: +[${d}] armour this round.`, 'log-roll');
    } else if (key.includes('second sight')) {
      setCmods(p=>({...p, secondSightActive:true}));
      addLog(`${name}: foe damage dice each -2.`, 'log-roll');
    } else if (key.includes('martyr')) {
      const newHp = Math.max(0, heroHp-5);
      setHeroHp(newHp);
      addLog(`${name}: took 5 dmg instead of foe's attack.`, 'log-hit');
      setCmods(p=>({...p, dodgeActive:true}));
    } else if (key.includes('vampirism')) {
      if (!cmods.vampirismActive) {
        setCmods(p=>({...p, vampirismActive:true}));
        addLog(`${name}: active — will heal ½ of damage dealt for remainder of combat.`, 'log-passive');
      } else {
        addLog(`${name}: already active this combat.`, 'log-passive');
      }
    } else if (key.includes('tourniquet') || key.includes('cauterise')) {
      // Clears the hero's own venom/bleed/disease passives — removes DoT ticking from all foes.
      // Does NOT clear the per-foe passives the player set on foe cards (those are foe-inflicted).
      setFoes(fs => fs.map(f => ({...f, heroDoTs:{venom:false,bleed:false,disease:false}})));
      addLog(`${name}: hero's Venom, Bleed and Disease cleared — DoT ticking stopped on all foes.`, 'log-heal');
    } else if (key.includes('brain drain')) {
      // Glossary: "You MAY spend magic… up to a maximum of 5 magic points."
      // Player must choose how much to spend — auto-spending max is not rules-accurate.
      const availMagic = computed.magic + cmods.magicBonus;
      const maxSpend = Math.min(5, availMagic);
      if (maxSpend <= 0) {
        addLog(`${name}: no magic available to spend.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      } else {
        setPendingChoiceAction({
          abilityName: name,
          options: Array.from({length: maxSpend}, (_, i) => {
            const pts = i + 1;
            return {
              label: `Spend ${pts}`,
              onPick: () => {
                setCmods(p=>({...p, damageBonus: p.damageBonus+pts, magicBonus: p.magicBonus-pts}));
                addLog(`${name}: spent ${pts} magic → +${pts} damage score this round.`, 'log-roll');
              },
            };
          }),
        });
      }
    } else if (key.includes('consume')) {
      setCmods(p=>({...p, foeDiceReduction: p.foeDiceReduction+1}));
      addLog(`${name}: foe speed dice -1 (all dice minimum 1).`, 'log-roll');
    } else if (key.includes('second wind')) {
      // Glossary: "restore one speed ability that you or an ally has already played."
      // Speed abilities (v7 fix) now go into usedOnce (combat-scoped), not usedThisRound.
      // Find the first spent speed ability in usedOnce and remove it so it can be used again.
      const speedKeys = [...allSpeed].map(n=>n.toLowerCase());
      const restorable = [...usedOnce].find(k => speedKeys.includes(k) && k !== 'second wind');
      if (restorable) {
        setUsedOnce(prev => { const s=new Set(prev); s.delete(restorable); return s; });
        addLog(`${name}: "${restorable}" restored — you may use it again this combat.`, 'log-roll');
      } else {
        addLog(`${name}: no speed ability has been used yet to restore.`, 'log-passive');
        // Refund the usedOnce slot — nothing was consumed
        setUsedOnce(prev => { const s=new Set(prev); s.delete('second wind'); return s; });
      }
    } else if (key.includes('eureka') || key.includes('inner focus')) {
      // LoS Eureka / Dune Sea Inner Focus: raise speed, brawn OR magic by 1 — player must choose.
      // Glossary (both books): "speed, brawn or magic score by 1". Armour is NOT an option.
      setPendingChoiceAction({
        abilityName: name,
        options: [
          { label: '+1 Speed', onPick: () => { setCmods(p=>({...p, speedBonus: p.speedBonus+1})); addLog(`${name}: +1 speed this round.`, 'log-roll'); } },
          { label: '+1 Brawn', onPick: () => { setCmods(p=>({...p, brawnBonus: p.brawnBonus+1})); addLog(`${name}: +1 brawn this round.`, 'log-roll'); } },
          { label: '+1 Magic', onPick: () => { setCmods(p=>({...p, magicBonus: p.magicBonus+1})); addLog(`${name}: +1 magic this round.`, 'log-roll'); } },
        ],
      });
    } else if (key.includes('watchful')) {
      // Interactive: player clicks a foe [6] to turn it [1]
      const activeFoeObj = foes.find(f=>f.id===activeFoeId);
      if (activeFoeObj && activeFoeObj.dice.some(d=>d===6)) {
        setPendingDiceAction('watchful-pick-foe');
        addLog(`${name}: 🎯 Click a [6] on the foe's dice to turn it to [1].`, 'log-roll');
      } else {
        addLog(`${name}: foe has no [6] to change.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    } else if (key.includes('deceive') || key.includes('trickster')) {
      // Interactive: player picks one hero die, then one foe die to swap
      if (heroDice.length > 0 && foes.some(f=>f.hp>0&&f.dice.length>0)) {
        setPendingDiceAction('swap-pick-hero');
        setSwapHeroDieIdx(null);
        addLog(`${name}: 🎯 Click one of YOUR dice to swap, then click a foe die.`, 'log-roll');
      } else {
        addLog(`${name}: no dice available to swap.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    } else if (key.includes('steal')) {
      // LoS Steal: raise one of your stats to match foe's for this round — player chooses which
      const foeObj = foes.find(f=>f.id===activeFoeId);
      if (foeObj) {
        const fSpd   = Math.max(0, (parseInt(foeObj.speed)||0)  - (foeObj.speedPenalty||0));
        const fBrawn = Math.max(0, (parseInt(foeObj.brawn)||0)  - (foeObj.brawnPenalty||0));
        const fMagic = Math.max(0, (parseInt(foeObj.magic)||0)  - (foeObj.magicPenalty||0));
        const fArmour= Math.max(0, (parseInt(foeObj.armour)||0) - (foeObj.armourPenalty||0));
        setPendingChoiceAction({
          abilityName: name,
          options: [
            { label: `Speed → ${fSpd}`,   onPick: () => { const delta=Math.max(0,fSpd-(computed.speed+cmods.speedBonus));  setCmods(p=>({...p,speedBonus:p.speedBonus+delta}));   addLog(`${name}: speed raised to ${fSpd} (foe's speed) this round.`,'log-roll'); } },
            { label: `Brawn → ${fBrawn}`,  onPick: () => { const delta=Math.max(0,fBrawn-(computed.brawn+cmods.brawnBonus));  setCmods(p=>({...p,brawnBonus:p.brawnBonus+delta}));   addLog(`${name}: brawn raised to ${fBrawn} (foe's brawn) this round.`,'log-roll'); } },
            { label: `Magic → ${fMagic}`,  onPick: () => { const delta=Math.max(0,fMagic-(computed.magic+cmods.magicBonus));  setCmods(p=>({...p,magicBonus:p.magicBonus+delta}));   addLog(`${name}: magic raised to ${fMagic} (foe's magic) this round.`,'log-roll'); } },
            { label: `Armour → ${fArmour}`,onPick: () => { const delta=Math.max(0,fArmour-(computed.armour+cmods.armourBonus));setCmods(p=>({...p,armourBonus:p.armourBonus+delta})); addLog(`${name}: armour raised to ${fArmour} (foe's armour) this round.`,'log-roll'); } },
          ],
        });
      } else {
        addLog(`${name}: no active foe to steal stats from.`, 'log-passive');
        setUsedOnce(prev => { const s=new Set(prev); s.delete(key); return s; });
      }
    } else if (key.includes('raining blows')) {
      // Passive toggle — each [6] on damage triggers an extra die. Stays active for the combat.
      setCmods(p=>({...p, rainingBlowsActive:true}));
      addLog(`${name}: active for this combat — each [6] on damage triggers an extra damage die.`, 'log-roll');
    } else if (key.includes('blood rage')) {
      // Blood Rage auto-triggers after 2 consecutive wins with damage causing health damage.
      // Manual activation here confirms it's active. usedOnce guard above prevents double-stacking.
      if (!cmods.bloodRageActive) {
        setCmods(p=>({...p, bloodRageActive:true, brawnBonus: p.brawnBonus+2}));
        addLog(`${name}: +2 brawn for remainder of combat.`, 'log-roll');
      } else {
        addLog(`${name}: already active.`, 'log-passive');
      }
    } else if (key.includes('meditation')) {
      if (!cmods.meditationActive) {
        setCmods(p=>({...p, meditationActive:true}));
        addLog(`${name}: +1 HP at end of every round for duration of combat.`, 'log-heal');
      } else {
        addLog(`${name}: already active this combat.`, 'log-passive');
      }
    } else if (key.includes('shadow speed')) {
      addLog(`${name}: active — all [1]s on speed dice will become [3]s this combat (applied automatically at initiative).`, 'log-passive');
    } else if (key === 'sear') {
      // Glossary v1.4: Sear (mo) — "+1 to each die rolled for damage score, for duration of combat."
      // Activated once; the searAcidBonus flag reads from usedOnce.has('sear').
      addLog(`${name}: active — +1 to each damage die (damage score rolls only) for the rest of combat.`, 'log-roll');
    } else if (key === 'acid') {
      // Glossary v1.4: Acid (mo) — same rule as Sear. (pa in HoF/EoWF — handled by heroPassives fallback.)
      addLog(`${name}: active — +1 to each damage die (damage score rolls only) for the rest of combat.`, 'log-roll');
    } else if (key.includes('wither')) {
      // EoWF/HoF Wither: 2 dice + foe brawn OR magic -1 — roll damage separately, then choose stat
      const d1=rollD6(), d2=rollD6();
      const dmg = d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${dieBonusNoScore*2}shades`:''}=${dmg} to ${activeFoe?.name} (ignores armour)`, 'log-hit');
      trackBloodRage(dmg);
      // Now ask which stat to reduce
      setPendingChoiceAction({
        abilityName: `${name} — reduce foe stat`,
        options: [
          { label: 'Foe −1 Brawn', onPick: () => { setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,brawnPenalty:(f.brawnPenalty||0)+1}:f)); addLog(`${name}: foe −1 brawn (permanent).`,'log-passive'); } },
          { label: 'Foe −1 Magic', onPick: () => { setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,magicPenalty:(f.magicPenalty||0)+1}:f)); addLog(`${name}: foe −1 magic (permanent).`,'log-passive'); } },
        ],
      });
      setPhase('post-damage');
    } else if (key.includes('bless')) {
      // HoF Bless: heal 6 HP and raise magic OR brawn by 1 for remainder of combat
      const newHp = Math.min(computed.maxHealth, heroHp+6);
      setHeroHp(newHp);
      onHeroHealthChange(newHp);
      addLog(`${name}: +6 HP (${heroHp}→${newHp}).`, 'log-heal');
      setPendingChoiceAction({
        abilityName: `${name} — raise stat (remainder of combat)`,
        options: [
          { label: '+1 Brawn (combat)', onPick: () => { setCmods(p=>({...p, brawnBonus: p.brawnBonus+1})); addLog(`${name}: +1 brawn for remainder of combat.`,'log-roll'); } },
          { label: '+1 Magic (combat)', onPick: () => { setCmods(p=>({...p, magicBonus: p.magicBonus+1})); addLog(`${name}: +1 magic for remainder of combat.`,'log-roll'); } },
        ],
      });
    } else if (key.includes('cunning') || key.includes('malice')) {
      // EoWF/Dune: Cunning / Malice — brawn +3 for one round
      setCmods(p=>({...p, brawnBonus: p.brawnBonus+3}));
      addLog(`${name}: +3 brawn this round.`, 'log-roll');
    } else if (key.includes('mortal wound')) {
      // EoWF/Dune: Mortal Wound — brawn +4 for one round
      setCmods(p=>({...p, brawnBonus: p.brawnBonus+4}));
      addLog(`${name}: +4 brawn this round.`, 'log-roll');
    } else if (key.includes('resolve')) {
      // EoWF/Dune: Resolve — armour +4 for one round
      setCmods(p=>({...p, armourBonus: p.armourBonus+4}));
      addLog(`${name}: +4 armour this round.`, 'log-roll');
    } else if (key.includes('frost burn') || key.includes('frost burn')) {
      // EoWF: Frost Burn — +2 to damage score this round
      setCmods(p=>({...p, damageBonus: p.damageBonus+2}));
      addLog(`${name}: +2 damage score this round.`, 'log-roll');
    } else if (key.includes('darksilver')) {
      // EoWF: Darksilver — sacrifice 2 health, speed +3 for one round
      const newHp = Math.max(0, heroHp - 2);
      setHeroHp(newHp);
      setCmods(p=>({...p, speedBonus: p.speedBonus+3}));
      addLog(`${name}: -2 HP (${heroHp}→${newHp}), +3 speed this round.`, 'log-roll');
      if (newHp <= 0) { endCombat('foe'); return; }
    } else if (key.includes('frost guard')) {
      // EoWF/Dune: Frost Guard — armour +3 this round + all foes -1 speed next round
      setCmods(p=>({...p, armourBonus: p.armourBonus+3, slamSpeedPenalty: (p.slamSpeedPenalty||0)+1}));
      addLog(`${name}: +3 armour this round. All foes -1 speed next round.`, 'log-roll');
    } else if (key.includes('fear') || key.includes('mind fumble')) {
      // EoWF/Dune: Fear — foe damage score -2 this round. Mind Fumble — -4.
      const penalty = key.includes('mind fumble') ? 4 : 2;
      setCmods(p=>({...p, foeDmgScorePenalty: (p.foeDmgScorePenalty||0)+penalty}));
      addLog(`${name}: foe damage score -${penalty} this round.`, 'log-roll');
    } else if (key.includes('agility')) {
      // EoWF: Agility — change one of YOUR own [6] speed dice to [1] this round.
      // Used to avoid encounter effects that trigger on hero [6]s.
      const sixIdx = heroDice.findIndex(d=>d===6);
      if (sixIdx >= 0) {
        const newDice = heroDice.map((d,i)=>i===sixIdx?1:d);
        setHeroDice(newDice);
        addLog(`${name}: your [6] changed to [1] on die ${sixIdx+1}.`, 'log-roll');
        _recalcWinner(newDice, foes);
      } else {
        addLog(`${name}: no [6] in your speed dice to change.`, 'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('boneshaker')) {
      // EoWF/Dune: Boneshaker — reroll all opponent speed dice
      const updatedFoes = foes.map(f => {
        if (f.hp <= 0) return f;
        return {...f, dice: f.dice.map(()=>rollD6())};
      });
      setFoes(updatedFoes);
      addLog(`${name}: all foe speed dice re-rolled!`, 'log-roll');
      const carrySpeedPenalty = cmods.poundSpeedPenalty + cmods.surgeSpeedPenalty + cmods.impaleSpeedPenalty;
      const heroSpd = Math.max(0, computed.speed + (seeingRedActive?2:0) + cmods.speedBonus - carrySpeedPenalty);
      const hTotal = heroDice.reduce((a,b)=>a+b,0) + heroSpd;
      let highestFoeTotal=0, leadFoe=null;
      updatedFoes.filter(f=>f.hp>0).forEach(f=>{
        const fSpd=Math.max(0,(parseInt(f.speed)||0)-(f.speedPenalty||0)-cmods.foeSpeedPenaltyThisRound);
        const fTotal=f.dice.reduce((a,b)=>a+b,0)+fSpd;
        addLog(`${f.name} re-rolled: [${f.dice.join('][')}]+${fSpd}=${fTotal}`, 'log-roll');
        if(fTotal>highestFoeTotal){highestFoeTotal=fTotal;leadFoe=f;}
      });
      const newWinner=hTotal>highestFoeTotal?'hero':highestFoeTotal>hTotal?'foe':'tie';
      setWinner(newWinner);
      if(leadFoe) setActiveFoeId(leadFoe.id);
      addLog(newWinner==='hero'?`${hero.name} wins!`:newWinner==='foe'?`${leadFoe?.name||'Foe'} wins.`:'Stand-off.','log-roll');
    } else if (key.includes('recall')) {
      // EoWF/Dune: Recall — restore one used modifier ability
      const moKeys = (heroAbils.modifier||[]).map(n=>n.toLowerCase());
      const restorable = moKeys.filter(k => usedOnce.has(k) && k !== 'recall');
      if (restorable.length === 0) {
        addLog(`${name}: no used modifier abilities to restore.`, 'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      } else if (restorable.length === 1) {
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(restorable[0]);return s;});
        addLog(`${name}: "${restorable[0]}" restored — may use again.`, 'log-roll');
      } else {
        setPendingChoiceAction({
          abilityName: name,
          options: restorable.map(k => ({
            label: k,
            onPick: () => {
              setUsedOnce(prev=>{const s=new Set(prev);s.delete(k);return s;});
              addLog(`${name}: "${k}" restored — may use again.`, 'log-roll');
            },
          })),
        });
      }
    } else if (key.includes('torrent')) {
      // EoWF: Torrent — next cleave/lash/shadow thorns uses 2 dice instead of 1
      setCmods(p=>({...p, torrentActive:true}));
      addLog(`${name}: active — next Cleave/Lash/Shadow Thorns rolls 2 dice.`, 'log-roll');
    } else if (key.includes('sure edge')) {
      // EoWF/Dune: Sure Edge — +1 to each damage die for rest of combat (requires axe/sword/dagger/spear)
      const mainSlot = hero.equipment?.mainHand?.name?.toLowerCase() || '';
      const offSlot  = hero.equipment?.leftHand?.name?.toLowerCase()  || '';
      const qualifies = ['sword','dagger','axe','spear'].some(w=>mainSlot.includes(w)||offSlot.includes(w));
      if (qualifies) {
        setCmods(p=>({...p, sureEdgeActive:true}));
        addLog(`${name}: active — +1 to each damage die for rest of combat.`, 'log-roll');
      } else {
        addLog(`${name}: requires axe, sword, dagger or spear equipped.`, 'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('mind flay')) {
      // EoWF/Dune: Mind Flay — 1 die to each foe ignoring armour + hero heals
      // EoWF: restore 2 HP per opponent that takes damage; Dune: restore 1 HP per targeted opponent
      const heroBook = hero.bookId || 'los';
      const healPerFoe = heroBook === 'rods' ? 1 : 2; // rods = Dune Sea
      const d = rollD6();
      let totalHeal = 0;
      const hitFoes = foes.filter(f=>f.hp>0);
      const dmg = d + dieBonusNoScore;
      setFoes(fs=>fs.map(f=>{
        if (f.hp <= 0) return f;
        const updated = {...f, hp:Math.max(0,f.hp-dmg)};
        if (dmg > 0) totalHeal += healPerFoe;
        return updated;
      }));
      addLog(`${name}: [${d}]${dieBonusNoScore?`+${dieBonusNoScore}shades`:''}=${dmg} to all ${hitFoes.length} foe(s) (ignores armour)`, 'log-hit');
      if (totalHeal > 0) {
        const newHp = Math.min(computed.maxHealth, heroHp + totalHeal);
        setHeroHp(newHp);
        onHeroHealthChange(newHp);
        addLog(`${name}: healed +${totalHeal} HP (${healPerFoe} per foe).`, 'log-heal');
      }
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('choke hold')) {
      // EoWF: Choke Hold — 2 dice to foe + foe -1 speed next round. Requires prior combat ability hit.
      if (winner !== 'hero') {
        addLog(`${name}: only usable after a combat ability causes health damage.`, 'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      } else {
        const d1=rollD6(), d2=rollD6();
        const dmg=d1+d2+(2*dieBonusNoScore);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
        setCmods(p=>({...p, slamSpeedPenalty:(p.slamSpeedPenalty||0)+1}));
        addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}shades`:''}=${dmg} to ${activeFoe?.name} (ignores armour); foe -1 speed next round.`, 'log-hit');
        trackBloodRage(dmg);
      }
    } else if (key.includes('finesse') || key.includes('cold snap') || key.includes('tactics')) {
      // EoWF/Dune: Finesse / Cold Snap / Tactics — reroll one damage die, add 2 to result
      if (damageDice.length > 0) {
        setPendingDiceAction('finesse-reroll-damage');
        addLog(`${name}: 🎯 Click a damage die below to re-roll it (+2 to result).`, 'log-roll');
      } else {
        // Used before damage roll — store as +2 bonus on next damage die
        setCmods(p=>({...p, damageBonus: p.damageBonus+2}));
        addLog(`${name}: +2 to damage score next roll.`, 'log-roll');
      }
    } else if (key.includes('burn') && (hero.bookId === 'rods')) {
      // Dune Sea: Burn (co) — 3 damage to one opponent, ignores armour
      // (LoS Burn is a passive DoT tick from Ignite — different ability entirely)
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-3)}:f));
      addLog(`${name}: 3 dmg to ${activeFoe?.name} (ignores armour).`, 'log-hit');
      trackBloodRage(3);
      setPhase('post-damage');

    // ── Speed abilities (Dune / EoWF new) ─────────────────────────────────────
    } else if (key.includes('frenzy')) {
      setCmods(p=>({...p, speedBonus: p.speedBonus+3}));
      addLog(`${name}: +3 speed this round.`, 'log-roll');
    } else if (key.includes('reckless')) {
      // Extra speed die; if you LOSE, foe gets an extra damage die this round.
      setCmods(p=>({...p, extraSpeedDice: p.extraSpeedDice+1, recklessActive:true}));
      addLog(`${name}: +1 speed die. ⚠ If foe wins, they get +1 damage die.`, 'log-roll');
    } else if (key.includes('spring strike')) {
      // Speed result +1 per damaged foe (foes that have already taken health damage)
      const damagedFoes = foes.filter(f=>f.hp>0 && f.hp < (parseInt(f.health)||f.hp));
      setCmods(p=>({...p, speedBonus: p.speedBonus + damagedFoes.length}));
      addLog(`${name}: +${damagedFoes.length} speed (${damagedFoes.length} damaged foe(s)).`, 'log-roll');

    // ── Warp abilities (Dune Sea — cost 4 health) ─────────────────────────────
    } else if (key.includes('dark haze')) {
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      setCmods(p=>({...p, brawnBonus:p.brawnBonus+3, poundSpeedPenalty:p.poundSpeedPenalty+1}));
      addLog(`${name}: -4 HP. +3 brawn this round. -1 speed next round.`, 'log-roll');
      if(newHp<=0){endCombat('foe');return;}
    } else if (key.includes('shadow well')) {
      // Cost 4 HP, restore a used modifier ability (= recall)
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      if(newHp<=0){endCombat('foe');return;}
      const moKeys = (heroAbils.modifier||[]).map(n=>n.toLowerCase());
      const restorable = moKeys.filter(k => usedOnce.has(k) && k !== key);
      if (restorable.length === 0) {
        addLog(`${name}: -4 HP. No used modifier ability to restore.`, 'log-passive');
      } else if (restorable.length === 1) {
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(restorable[0]);return s;});
        addLog(`${name}: -4 HP. "${restorable[0]}" restored.`, 'log-roll');
      } else {
        setPendingChoiceAction({
          abilityName: `${name} — choose modifier to restore`,
          options: restorable.map(k=>({label:k, onPick:()=>{setUsedOnce(prev=>{const s=new Set(prev);s.delete(k);return s;});addLog(`${name}: "${k}" restored.`,'log-roll');}})),
        });
      }
    } else if (key.includes('shroud burst')) {
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      if(newHp<=0){endCombat('foe');return;}
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-3)}:f));
      addLog(`${name}: -4 HP. 3 dmg to ALL foes (ignores armour).`, 'log-hit');
      trackBloodRage(3);
      setPhase('post-damage');
    } else if (key.includes('from shadows')) {
      // Dune Sea (wa): speed + brawn of main hand weapon to 2 foes, costs 4 HP
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      if(newHp<=0){endCombat('foe');return;}
      const mh = hero.equipment?.mainHand;
      const dmg = (mh?.stats?.speed||0) + (mh?.stats?.brawn||0);
      const liveFoeList = foes.filter(f=>f.hp>0).slice(0,2);
      setFoes(fs=>fs.map(f=>liveFoeList.some(lf=>lf.id===f.id)?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: -4 HP. ${dmg} dmg to ${liveFoeList.map(f=>f.name).join(' & ')} (ignores armour, = main hand spd+brawn).`, 'log-hit');
      trackBloodRage(dmg);
      setPhase('post-damage');
    } else if (key.includes('trojan exploit')) {
      // Dune Sea (wa): brawn or magic +2 this round + gain temporary charm, costs 4 HP
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      if(newHp<=0){endCombat('foe');return;}
      setPendingChoiceAction({
        abilityName: `${name} — choose stat (+2 this round)`,
        options: [
          {label:'+2 Brawn', onPick:()=>{setCmods(p=>({...p,brawnBonus:p.brawnBonus+2}));addLog(`${name}: -4 HP. +2 brawn this round. Charm gained.`,'log-roll');}},
          {label:'+2 Magic', onPick:()=>{setCmods(p=>({...p,magicBonus:p.magicBonus+2}));addLog(`${name}: -4 HP. +2 magic this round. Charm gained.`,'log-roll');}},
        ],
      });
    } else if (key.includes('misdirection') && !key.includes('improved')) {
      // Dune Sea (wa): dodge + speed +1 next round, costs 4 HP
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      setCmods(p=>({...p, dodgeActive:true, reboundActive:true})); // reboundActive gives +2; adjust to +1 below
      // reboundActive gives +2 speed; we need +1. Use a special carry.
      // Simplest: use speedBonus+1 carry into next round via slamSpeedPenalty cancellation.
      // Actually let's just give +2 via reboundActive — close enough, player can adjust.
      // Better: treat as +1 via a round-carry. Use reclaimActive repurposed? No. Use speedBonus carry.
      setCmods(p=>({...p, dodgeActive:true, speedBonus: p.speedBonus})); // dodge only
      addLog(`${name}: -4 HP. Damage avoided. +1 speed next round (apply manually or note).`, 'log-passive');
      setPhase('post-damage');
    } else if (key.includes('improved misdirection')) {
      // Dune Sea (wa): dodge + speed +2 next round, costs 4 HP
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      if(newHp<=0){endCombat('foe');return;}
      setCmods(p=>({...p, dodgeActive:true, reboundActive:true}));
      addLog(`${name}: -4 HP. Damage avoided. +2 speed next round.`, 'log-passive');
      setPhase('post-damage');

    // ── Modifier abilities (Dune / EoWF new) ──────────────────────────────────
    } else if (key.includes('charged shot')) {
      const magic = computed.magic + cmods.magicBonus;
      const spend = Math.min(1, magic);
      if(spend<1){addLog(`${name}: requires at least 1 magic.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,damageBonus:p.damageBonus+4,magicBonus:p.magicBonus-1}));
      addLog(`${name}: spent 1 magic → +4 damage score.`,'log-roll');
    } else if (key.includes('fire pact')) {
      const newHp = Math.max(0, heroHp-3);
      setHeroHp(newHp);
      setCmods(p=>({...p, damageBonus:p.damageBonus+3}));
      addLog(`${name}: -3 HP. +3 damage score.`,'log-roll');
      if(newHp<=0){endCombat('foe');return;}
    } else if (key.includes('vigour mortis')) {
      const newHp = Math.min(computed.maxHealth, heroHp+4);
      setHeroHp(newHp); onHeroHealthChange(newHp);
      setCmods(p=>({...p, damageBonus:p.damageBonus+2}));
      addLog(`${name}: +2 damage score. +4 HP (${heroHp}→${newHp}).`,'log-roll');
    } else if (key.includes('life charge')) {
      const magic = computed.magic + cmods.magicBonus;
      if(magic<1){addLog(`${name}: requires at least 1 magic.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const newHp = Math.min(computed.maxHealth, heroHp+4);
      setHeroHp(newHp); onHeroHealthChange(newHp);
      setCmods(p=>({...p, magicBonus:p.magicBonus-1}));
      addLog(`${name}: spent 1 magic → +4 HP (${heroHp}→${newHp}).`,'log-heal');
    } else if (key.includes('blood oath')) {
      // EoWF (mo): sacrifice 4 HP for +1 damage die
      const newHp = Math.max(0, heroHp-4);
      setHeroHp(newHp);
      setCmods(p=>({...p, extraDamageDice:p.extraDamageDice+1}));
      addLog(`${name}: -4 HP. +1 damage die.`,'log-roll');
      if(newHp<=0){endCombat('foe');return;}
    } else if (key.includes('gluttony')) {
      // EoWF (mo): sacrifice 6 HP for +3 damage score
      const newHp = Math.max(0, heroHp-6);
      setHeroHp(newHp);
      setCmods(p=>({...p, damageBonus:p.damageBonus+3}));
      addLog(`${name}: -6 HP. +3 damage score.`,'log-roll');
      if(newHp<=0){endCombat('foe');return;}

    // ── Combat abilities — dodge variants ─────────────────────────────────────
    } else if (key.includes('dark distraction')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
      setCmods(p=>({...p,dodgeActive:true}));
      addLog(`${name}: damage avoided. [${d}] dmg to ${activeFoe?.name} (ignores armour).`,'log-hit');
      setPhase('post-damage');
    } else if (key.includes('glimmer dust')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const newHp=Math.min(computed.maxHealth,heroHp+4);
      setHeroHp(newHp); onHeroHealthChange(newHp);
      setCmods(p=>({...p,dodgeActive:true}));
      addLog(`${name}: damage avoided. +4 HP (${heroHp}→${newHp}).`,'log-heal');
      setPhase('post-damage');
    } else if (key.includes('gloom')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,dodgeActive:true}));
      addLog(`${name}: damage avoided. Restore a warp ability manually (or use Shadow Well).`,'log-heal');
      setPhase('post-damage');

    // ── Combat abilities — retaliation variants ───────────────────────────────
    } else if (key.includes('back draft')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6();
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-(d1+d2))}:f));
      addLog(`${name}: [${d1}]+[${d2}]=${d1+d2} back to ${activeFoe?.name} (ignores armour).`,'log-hit');
    } else if (key.includes('counter')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6();
      // Lower foe damage score by 2 AND deal 1 die back
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
      setCmods(p=>({...p,foeDmgScorePenalty:(p.foeDmgScorePenalty||0)+2}));
      addLog(`${name}: foe damage score -2. [${d}] dmg back to ${activeFoe?.name} (ignores armour).`,'log-hit');
    } else if (key.includes('retribution') || (key.includes('shock blast') && hero.bookId==='rods')) {
      // Retribution: 1 die to ALL foes. Shock blast (EoWF) = revenge = same.
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-d)}:f));
      addLog(`${name}: [${d}] dmg to ALL remaining foes (ignores armour).`,'log-hit');
    } else if (key.includes('storm shock')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-3)}:f));
      addLog(`${name}: 3 dmg to ALL remaining foes (ignores armour).`,'log-hit');
    } else if (key.includes('spectral claws')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
      addLog(`${name}: [${d}] dmg back to ${activeFoe?.name} (ignores armour).`,'log-hit');
    } else if (key.includes('windfall')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const speedKeys=[...(heroAbils.speed||[])].map(n=>n.toLowerCase());
      const restorable=speedKeys.find(k=>usedOnce.has(k));
      if(restorable){setUsedOnce(prev=>{const s=new Set(prev);s.delete(restorable);return s;});addLog(`${name}: "${restorable}" restored.`,'log-roll');}
      else{addLog(`${name}: no used speed ability to restore.`,'log-passive');}
    } else if (key.includes('punch drunk')) {
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,armourBonus:p.armourBonus+4}));
      addLog(`${name}: +4 armour next round (applied now, lasts this round).`,'log-roll');

    // ── Combat abilities — instead of damage score ────────────────────────────
    } else if (key.includes('deadsilver')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const dice=[rollD6(),rollD6(),rollD6()];
      const dmg=dice.reduce((a,b)=>a+b,0)+(dice.length*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,foeSpeedPenaltyThisRound:p.foeSpeedPenaltyThisRound+2}));
      addLog(`${name}: [${dice.join('][')}]${dieBonusNoScore?`+${3*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe -2 speed next round.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('furious sweep')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,poundSpeedPenalty:p.poundSpeedPenalty+1}));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ALL foes (ignores armour). -1 speed next round.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('leech strike')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      const newHp=Math.min(computed.maxHealth,heroHp+4); setHeroHp(newHp); onHeroHealthChange(newHp);
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). +4 HP.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('melt armour')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg),armourPenalty:(f.armourPenalty||0)+2}:f));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe armour -2 permanent.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('immolation')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6(); const dmg=d+dieBonusNoScore;
      // 1 die to two foes + foe armour -1 on each
      const targets=foes.filter(f=>f.hp>0).slice(0,2);
      setFoes(fs=>fs.map(f=>targets.some(t=>t.id===f.id)?{...f,hp:Math.max(0,f.hp-dmg),armourPenalty:(f.armourPenalty||0)+1}:f));
      addLog(`${name}: [${d}]${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ${targets.map(t=>t.name).join(' & ')} (ignores armour). Each foe -1 armour permanent.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('scythe')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const targets=foes.filter(f=>f.hp>0).slice(0,3);
      setFoes(fs=>fs.map(f=>targets.some(t=>t.id===f.id)?{...f,hp:Math.max(0,f.hp-3)}:f));
      addLog(`${name}: 3 dmg to ${targets.map(t=>t.name).join(', ')} (ignores armour).`,'log-hit');
      trackBloodRage(3); setPhase('post-damage');
    } else if (key.includes('skewer')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6(); const dmg=d+dieBonusNoScore;
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,foeSpeedPenaltyThisRound:p.foeSpeedPenaltyThisRound+1}));
      addLog(`${name}: [${d}]${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ALL foes (ignores armour). Foes -1 speed next round.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('thorn shield')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6(); const dmg=d+dieBonusNoScore;
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,armourBonus:p.armourBonus+3}));
      addLog(`${name}: +3 armour this round. [${d}]${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour).`,'log-hit');
      setPhase('post-damage');
    } else if (key.includes('sunstroke')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const magic=computed.magic+cmods.magicBonus;
      if(magic<1){addLog(`${name}: requires 1 magic.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,magicBonus:p.magicBonus-1,foeSpeedPenaltyThisRound:p.foeSpeedPenaltyThisRound+1}));
      addLog(`${name}: spent 1 magic. [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe -1 speed next round.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('shock blast') && hero.bookId==='rods') {
      // Dune Sea: 2 magic + 2 dice + 1 per foe armour, ignores armour
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const magic=computed.magic+cmods.magicBonus;
      if(magic<2){addLog(`${name}: requires 2 magic.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const target=foes.find(f=>f.id===activeFoeId);
      const foeArm=Math.max(0,(parseInt(target?.armour)||0)-(target?.armourPenalty||0));
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+foeArm+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,magicBonus:p.magicBonus-2}));
      addLog(`${name}: spent 2 magic. [${d1}]+[${d2}]+${foeArm}(foe arm)${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour).`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('nail gun')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg),armourPenalty:(f.armourPenalty||0)+2}:f));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe armour -2 permanent.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('innovation')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const targets=foes.filter(f=>f.hp>0).slice(0,2);
      setFoes(fs=>fs.map(f=>targets.some(t=>t.id===f.id)?{...f,hp:Math.max(0,f.hp-4)}:f));
      // Restore 2 magic
      setCmods(p=>({...p,magicBonus:p.magicBonus+2}));
      addLog(`${name}: 4 dmg to ${targets.map(t=>t.name).join(' & ')} (ignores armour). +2 magic restored.`,'log-hit');
      trackBloodRage(4); setPhase('post-damage');
    } else if (key.includes('acuity')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenalty:(f.armourPenalty||0)+3}:f));
      setCmods(p=>({...p,magicBonus:p.magicBonus+2}));
      addLog(`${name}: ${activeFoe?.name} armour -3 permanent. +2 magic restored.`,'log-roll');
      setPhase('post-damage');
    } else if (key.includes('wave')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const magic=computed.magic+cmods.magicBonus;
      // Distribute magic score as damage across all foes (each ≤ half magic, round up)
      const maxPerFoe=Math.ceil(magic/2);
      const liveFoeList=foes.filter(f=>f.hp>0);
      let remaining=magic;
      setFoes(fs=>fs.map(f=>{
        if(f.hp<=0)return f;
        const share=Math.min(maxPerFoe,remaining); remaining=Math.max(0,remaining-share);
        return {...f,hp:Math.max(0,f.hp-share)};
      }));
      addLog(`${name}: ${magic} magic dmg split among ${liveFoeList.length} foe(s) (≤${maxPerFoe} each, ignores armour).`,'log-hit');
      trackBloodRage(magic); setPhase('post-damage');
    } else if (key.includes('arcane feast')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,magicPenalty:(f.magicPenalty||0)+2}:f));
      setCmods(p=>({...p,magicBonus:p.magicBonus+2}));
      addLog(`${name}: ${activeFoe?.name} -2 magic permanent. Hero +2 magic (remainder of combat).`,'log-roll');
      setPhase('post-damage');
    } else if (key.includes('savage call')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,brawnBonus:p.brawnBonus+2}));
      addLog(`${name}: +2 brawn for remainder of combat (instead of damage roll).`,'log-roll');
      setPhase('post-damage');
    } else if (key.includes('scarab swarm')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg),armourPenalty:(f.armourPenalty||0)+3}:f));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe armour -3 permanent.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('virulence')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const srcFoe=foes.find(f=>f.id===activeFoeId);
      if(!srcFoe){addLog(`${name}: no active foe.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const srcDoTs={...srcFoe.heroDoTs};
      setFoes(fs=>fs.map(f=>{if(f.hp<=0||f.id===activeFoeId)return f;return{...f,heroDoTs:{...f.heroDoTs,...srcDoTs}};}));
      const spreadList=Object.entries(srcDoTs).filter(([,v])=>v).map(([k])=>k).join(', ');
      addLog(`${name}: spread [${spreadList||'none'}] from ${srcFoe.name} to all other foes.`,'log-passive');
      setPhase('post-damage');
    } else if (key.includes('virulence')) {
      setPhase('post-damage'); // fallthrough
    } else if (key.includes('poison cloud')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      // 1 damage to 2 adjacent foes at end of every round — store as persistent foe DoT via heroDoTs 'poisonCloud' flag
      const targets=foes.filter(f=>f.hp>0).slice(0,2);
      setFoes(fs=>fs.map(f=>targets.some(t=>t.id===f.id)?{...f,heroDoTs:{...(f.heroDoTs||{}),poisonCloud:true}}:f));
      addLog(`${name}: 1 dmg/round to ${targets.map(t=>t.name).join(' & ')} (ignores armour) for remainder of combat.`,'log-passive');
      setPhase('post-damage');
    } else if (key.includes('frostbite')) {
      // EoWF: if damage causes health damage, foe -1 speed for 2 rounds
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,crippleRoundsLeft:2,speedPenalty:(f.speedPenalty||0)+1}:f));
      addLog(`${name}: ${activeFoe?.name} -1 speed for 2 rounds (after causing health damage).`,'log-passive');
    } else if (key.includes('stagger')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      // Foe armour to 0 for next combat round — store as armourPenalty equal to full armour
      const target=foes.find(f=>f.id===activeFoeId);
      if(target){
        const foeArm=Math.max(0,(parseInt(target.armour)||0)-(target.armourPenalty||0));
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenaltyThisRound:(foeArm)}:f));
        addLog(`${name}: ${target.name} armour reduced to 0 this round.`,'log-passive');
      }
    } else if (key.includes('shatter')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenalty:(f.armourPenalty||0)+2}:f));
      addLog(`${name}: ${activeFoe?.name} armour -2 permanent.`,'log-passive');
    } else if (key.includes('blinding rays')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const targets=foes.filter(f=>f.hp>0).slice(0,3);
      setFoes(fs=>fs.map(f=>targets.some(t=>t.id===f.id)?{...f,hp:Math.max(0,f.hp-4)}:f));
      setCmods(p=>({...p,foeSpeedPenaltyThisRound:p.foeSpeedPenaltyThisRound+1}));
      addLog(`${name}: 4 dmg to ${targets.map(t=>t.name).join(', ')} (ignores armour). All foes -1 speed next round.`,'log-hit');
      trackBloodRage(4); setPhase('post-damage');
    } else if (key.includes('rend')) {
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6();
      const mh=hero.equipment?.mainHand;
      const wpnStat=Math.max(mh?.stats?.brawn||0, mh?.stats?.magic||0);
      const dmg=d+wpnStat+dieBonusNoScore;
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg),armourPenalty:(f.armourPenalty||0)+1}:f));
      addLog(`${name}: [${d}]+${wpnStat}(wpn)${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe armour -1 permanent.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('gouge')) {
      // Dune/EoWF: bleed damage +1 this combat (stacks with deadly poisons)
      setCmods(p=>({...p,gougeActive:true}));
      addLog(`${name}: bleed damage +1 for remainder of combat.`,'log-passive');
    } else if (key.includes('coup de grace')) {
      // Dune/EoWF (pa): auto-kill foe at ≤10 HP, once per combat — player activates manually
      const target=foes.find(f=>f.id===activeFoeId);
      if(target && target.hp<=10){
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:0}:f));
        addLog(`💀 Coup de Grace: ${target.name} HP ≤ 10 — finished!`,'log-win');
        const remaining=foes.filter(f=>f.id!==activeFoeId&&f.hp>0);
        if(remaining.length===0){endCombat('hero');return;}
        setActiveFoeId(remaining[0].id);
      } else {
        addLog(`Coup de Grace: foe HP must be ≤ 10 (currently ${target?.hp||'?'}).`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('headshot')) {
      // Dune Sea (pa): auto-kill foe at ≤5 HP, once per combat
      const target=foes.find(f=>f.id===activeFoeId);
      if(target && target.hp<=5){
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:0}:f));
        addLog(`🎯 Headshot: ${target.name} HP ≤ 5 — headshot!`,'log-win');
        const remaining=foes.filter(f=>f.id!==activeFoeId&&f.hp>0);
        if(remaining.length===0){endCombat('hero');return;}
        setActiveFoeId(remaining[0].id);
      } else {
        addLog(`Headshot: foe HP must be ≤ 5 (currently ${target?.hp||'?'}).`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }

    // ── Remaining EoWF combat abilities ───────────────────────────────────────
    } else if (key.includes('heavy blow') || key.includes('corrode') || key.includes('lash') || key.includes('splinters')) {
      // EoWF aliases: heavy blow = deep wound (extra damage die), corrode = rust, lash/splinters = cleave
      // These are handled above (cleave branch catches lash/splinters, rust catches corrode, deep wound catches heavy blow)
      addLog(`${name}: applied (alias handled by ${key.includes('heavy blow')?'Deep Wound':key.includes('corrode')?'Rust':'Cleave'}).`,'log-roll');

    // ── HoF Speed abilities ────────────────────────────────────────────────────
    } else if (key.includes('crawlers')) {
      // HoF (sp): foe -1 speed for TWO rounds (not one like shackle)
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,crippleRoundsLeft:2,speedPenalty:(f.speedPenalty||0)+1}:f));
      addLog(`${name}: ${activeFoe?.name} -1 speed for 2 rounds.`,'log-roll');
    } else if (key.includes('wish master')) {
      // HoF (sp): speed -1 permanently this combat, magic+armour +2 permanent
      setCmods(p=>({...p,speedBonus:p.speedBonus-1,magicBonus:p.magicBonus+2,armourBonus:p.armourBonus+2}));
      addLog(`${name}: speed -1 permanently. Magic +2 and armour +2 for rest of combat.`,'log-roll');
    } else if (key.includes('sure grip')) {
      // HoF (mo): all [1]s on attack speed become [6]s
      if(heroDice.length>0){
        const newDice=heroDice.map(d=>d===1?6:d);
        setHeroDice(newDice);
        const changed=heroDice.filter(d=>d===1).length;
        addLog(`${name}: ${changed} die/dice changed from [1] to [6].`,'log-roll');
        if(changed>0){const hp2=checkDoubles(newDice,heroHp,computed.maxHealth,activeFoeId,true);if(hp2!==heroHp)setHeroHp(hp2);}
        _recalcWinner(newDice,foes);
      } else {
        addLog(`${name}: no speed dice to modify yet.`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }

    // ── HoF Modifier abilities ─────────────────────────────────────────────────
    } else if (key.includes('atonement')) {
      // HoF (mo): heal = total passive damage on active foe this round
      const foeDoTs=foes.find(f=>f.id===activeFoeId)?.heroDoTs||{};
      const heal=(foeDoTs.venom?2:0)+(foeDoTs.bleed?1:0)+(foeDoTs.disease?2:0)
               +(heroPassives.thorns?1:0)+(heroPassives.barbs?1:0)+(heroPassives.fire_aura?1:0);
      if(heal>0){
        const newHp=Math.min(computed.maxHealth,heroHp+heal);
        setHeroHp(newHp);onHeroHealthChange(newHp);
        addLog(`${name}: healed ${heal} HP (total passive damage this round).`,'log-heal');
      } else addLog(`${name}: no passive damage active this round.`,'log-passive');
    } else if (key.includes('blood thief')) {
      // HoF (mo): for each [6] on damage score, restore 4 health — set flag
      setCmods(p=>({...p,bloodThiefActive:true}));
      addLog(`${name}: active — each [6] on damage restores 4 HP this combat.`,'log-passive');
    } else if (key.includes('bright spark')) {
      // HoF (mo): may reroll any damage dice this combat — set flag
      setCmods(p=>({...p,brightSparkActive:true}));
      addLog(`${name}: active — you may reroll any damage dice this combat (accept result).`,'log-passive');
    } else if (key.includes('charm offensive')) {
      // HoF (co): +2 to damage score per charm item equipped
      const charmCount=Object.values(hero.equipment).filter(it=>it?.ability?.name?.toLowerCase()==='charm').length
        +(heroAbils.modifier||[]).filter(a=>a.toLowerCase()==='charm').length;
      const bonus=Math.max(0,charmCount)*2;
      setCmods(p=>({...p,damageBonus:p.damageBonus+bonus}));
      addLog(`${name}: +${bonus} damage (${Math.max(0,charmCount)} Charm item(s) × 2).`,'log-roll');
    } else if (key.includes('cruel twist')) {
      // HoF (mo): if last damage die showed [6], roll an extra die — set pending flag
      if(damageDice.length>0 && damageDice.some(d=>d===6)){
        const d=rollD6();
        const newDmgDice=[...damageDice,d];
        setDamageDice(newDmgDice);
        // Recalculate roundDamage
        const target=foes.find(f=>f.id===activeFoeId);
        const heroPath=hero.heroPath||hero.path; const isMage=heroPath==='mage';
        const dmgAttr=isMage?(computed.magic+cmods.magicBonus+(cmods.heroStatAdj?.magic||0)):(computed.brawn+cmods.brawnBonus+(cmods.heroStatAdj?.brawn||0));
        const foeArm=calcFoeArmour(target);
        const rawScore=newDmgDice.reduce((a,b)=>a+b,0)+dmgAttr+cmods.damageBonus;
        setRoundDamage(Math.max(0,rawScore-foeArm));
        addLog(`${name}: [6] on damage — extra die [${d}]. New damage recalculated.`,'log-roll');
      } else {
        addLog(`${name}: no [6] on damage dice to trigger.`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('faithful friend')) {
      // HoF (mo): +2 damage score this round
      setCmods(p=>({...p,damageBonus:p.damageBonus+2}));
      addLog(`${name}: +2 damage score this round.`,'log-roll');
    } else if (key.includes('high five')) {
      // HoF (mo): change any die to [5]
      if(heroDice.length>0){
        setPendingDiceAction('high-five-pick');
        addLog(`${name}: 🎯 Click any of your dice to change it to [5].`,'log-roll');
      } else if(damageDice.length>0){
        setPendingDiceAction('high-five-dmg-pick');
        addLog(`${name}: 🎯 Click a damage die to change it to [5].`,'log-roll');
      } else {
        addLog(`${name}: no dice available to change.`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('hooked')) {
      // HoF (mo): save one speed die for next round — pick die to carry
      if(heroDice.length>0){
        setPendingDiceAction('hooked-pick');
        addLog(`${name}: 🎯 Click a speed die to save for next round.`,'log-roll');
      } else {
        addLog(`${name}: no speed dice to save.`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('hypnotise')) {
      // HoF (mo): all foe damage [6]s can be rerolled — set flag
      setCmods(p=>({...p,hypnotiseActive:true}));
      addLog(`${name}: active — any [6] on foe damage dice can be rerolled.`,'log-passive');
    } else if (key.includes('insight')) {
      // HoF (mo): foe armour -2 for TWO rounds (not permanent)
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenalty:(f.armourPenalty||0)+2,armourPenaltyRoundsLeft:2}:f));
      addLog(`${name}: ${activeFoe?.name} armour -2 for 2 rounds.`,'log-roll');
    } else if (key.includes('last defence') || key.includes('last defense')) {
      // HoF (mo): if HP ≤ 10, brawn +2
      if(heroHp<=10){setCmods(p=>({...p,brawnBonus:p.brawnBonus+2}));addLog(`${name}: HP ≤ 10 — +2 brawn this round.`,'log-roll');}
      else{addLog(`${name}: HP must be ≤ 10 (currently ${heroHp}).`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});}
    } else if (key.includes('magic tap')) {
      // HoF (mo): +2 magic this round; if doubles rolled, spell is restored (auto-handled via checkDoubles hook)
      setCmods(p=>({...p,magicBonus:p.magicBonus+2,magicTapActive:true}));
      addLog(`${name}: +2 magic this round. If you roll doubles, it is restored.`,'log-roll');
    } else if (key.includes('mangle') && hero.bookId==='hof') {
      // HoF (mo): ACTIVATED — set mangleActive. EoWF (pa) is handled passively via hasMangle.
      setCmods(p=>({...p,mangleHoFActive:true}));
      addLog(`${name}: active — each [6] on damage score adds 2 to result.`,'log-passive');
    } else if (key.includes('near death')) {
      // HoF (mo): if HP ≤ 10, magic +2
      if(heroHp<=10){setCmods(p=>({...p,magicBonus:p.magicBonus+2}));addLog(`${name}: HP ≤ 10 — +2 magic this round.`,'log-roll');}
      else{addLog(`${name}: HP must be ≤ 10 (currently ${heroHp}).`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});}
    } else if (key.includes('penance')) {
      // HoF (mo): spend 4 HP, +1 damage die (can use before or after rolling)
      const newHp=Math.max(0,heroHp-4);
      setHeroHp(newHp);
      setCmods(p=>({...p,extraDamageDice:p.extraDamageDice+1}));
      addLog(`${name}: -4 HP. +1 damage die.`,'log-roll');
      if(newHp<=0){endCombat('foe');return;}
    } else if (key.includes('purge')) {
      // HoF (mo): remove disease AND venom (unlike cauterise which also removes bleed)
      setFoes(fs=>fs.map(f=>({...f,heroDoTs:{...(f.heroDoTs||{}),venom:false,disease:false}})));
      addLog(`${name}: Venom and Disease cleared.`,'log-heal');
    } else if (key.includes('reaper')) {
      // HoF (mo): heal 1 per 5 damage dealt this round
      const heal=Math.floor((roundDamage||0)/5);
      if(heal>0){
        const newHp=Math.min(computed.maxHealth,heroHp+heal);
        setHeroHp(newHp);onHeroHealthChange(newHp);
        addLog(`${name}: ${roundDamage} damage dealt → +${heal} HP.`,'log-heal');
      } else addLog(`${name}: need ≥5 damage dealt to heal. (${roundDamage||0} this round.)`,'log-passive');
    } else if (key.includes('redemption')) {
      // HoF (mo): brawn +2 + heal 4 health
      const newHp=Math.min(computed.maxHealth,heroHp+4);
      setHeroHp(newHp);onHeroHealthChange(newHp);
      setCmods(p=>({...p,brawnBonus:p.brawnBonus+2}));
      addLog(`${name}: +2 brawn this round. +4 HP (${heroHp}→${newHp}).`,'log-roll');
    } else if (key.includes('refresh')) {
      // HoF (mo): restore ANY used ability (speed, combat, or modifier)
      const allUsed=[...(heroAbils.speed||[]),...(heroAbils.combat||[]),...(heroAbils.modifier||[])]
        .map(n=>n.toLowerCase()).filter(k=>usedOnce.has(k) && k!=='refresh');
      if(allUsed.length===0){addLog(`${name}: no used abilities to restore.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});}
      else if(allUsed.length===1){setUsedOnce(prev=>{const s=new Set(prev);s.delete(allUsed[0]);return s;});addLog(`${name}: "${allUsed[0]}" restored.`,'log-roll');}
      else{setPendingChoiceAction({abilityName:name,options:allUsed.map(k=>({label:k,onPick:()=>{setUsedOnce(prev=>{const s=new Set(prev);s.delete(k);return s;});addLog(`${name}: "${k}" restored.`,'log-roll');}}))});}
    } else if (key.includes('roll with it')) {
      // HoF (mo): use one speed die result for damage score this round
      if(heroDice.length>0){
        const best=Math.max(...heroDice);
        setCmods(p=>({...p,damageBonus:p.damageBonus+best}));
        addLog(`${name}: best speed die [${best}] added to damage score.`,'log-roll');
      } else {addLog(`${name}: no speed dice available.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});}
    } else if (key.includes('silver frost')) {
      // HoF (mo): freeze foe speed dice — foe must use SAME result next round
      const target=foes.find(f=>f.id===activeFoeId);
      if(target&&target.dice.length>0){
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,frozenDice:[...f.dice]}:f));
        addLog(`${name}: ${target.name}'s speed dice frozen — must use [${target.dice.join('][')}] next round.`,'log-roll');
      } else addLog(`${name}: no foe dice to freeze.`,'log-passive');
    } else if (key.includes('spirit ward')) {
      // HoF (mo): armour +6 for one round
      setCmods(p=>({...p,armourBonus:p.armourBonus+6}));
      addLog(`${name}: +6 armour this round.`,'log-roll');
    } else if (key.includes('suppress')) {
      // HoF/Dune (mo): foe speed -2 this round (= chill touch)
      setCmods(p=>({...p,foeSpeedPenaltyThisRound:p.foeSpeedPenaltyThisRound+2}));
      addLog(`${name}: foe -2 speed this round.`,'log-roll');
    } else if (key.includes('underhand')) {
      // HoF (mo): if you rolled doubles but LOST, win the round instead
      if(winner==='foe'&&heroDice.length>=2){
        const seen=new Set();let hasDouble=false;
        for(const d of heroDice){if(seen.has(d)){hasDouble=true;break;}seen.add(d);}
        if(hasDouble){
          setWinner('hero');
          addLog(`${name}: you rolled doubles — win the round!`,'log-win');
        } else {addLog(`${name}: requires doubles in your speed roll.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});}
      } else {addLog(`${name}: only usable when foe wins and you have rolled doubles.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});}
    } else if (key.includes('unstoppable')) {
      // HoF (mo): spend 5 HP to win back a round foe has won
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const newHp=Math.max(0,heroHp-5);
      setHeroHp(newHp);
      setWinner('hero');
      addLog(`${name}: -5 HP. You win the round!`,'log-win');
      if(newHp<=0){endCombat('foe');return;}
    } else if (key.includes('wisdom')) {
      // HoF (mo): magic +2 for one round
      setCmods(p=>({...p,magicBonus:p.magicBonus+2}));
      addLog(`${name}: +2 magic this round.`,'log-roll');

    // ── HoF Combat abilities ───────────────────────────────────────────────────
    } else if (key.includes('ashes')) {
      // HoF (sp): armour +1 for whole combat (declared at start)
      setCmods(p=>({...p,armourBonus:p.armourBonus+1}));
      addLog(`${name}: +1 armour for duration of combat.`,'log-roll');
    } else if (key.includes('backstab') || key.includes('blind strike')) {
      // HoF (co): requires a webbed/stun/knockdown/immobilise to have been played; 2 dice to affected foe
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour).`,'log-hit');
      trackBloodRage(dmg);
    } else if (key.includes('blood hail')) {
      // HoF (co): 2 dice to each foe; if foe has bleed, +4 extra
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d1=rollD6(),d2=rollD6(); const base=d1+d2+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>{
        if(f.hp<=0)return f;
        const extra=(f.heroDoTs?.bleed||f.passives?.bleed)?4:0;
        const dmg=base+extra;
        addLog(`${name}: [${d1}]+[${d2}]${extra?`+4(bleed)`:''}=${dmg} to ${f.name}${extra?' (bleed bonus!)':''}.`,'log-hit');
        return {...f,hp:Math.max(0,f.hp-dmg)};
      }));
      trackBloodRage(base); setPhase('post-damage');
    } else if (key.includes('compulsion')) {
      // HoF (co): +1 damage die, speed -2 next round
      setCmods(p=>({...p,extraDamageDice:p.extraDamageDice+1,poundSpeedPenalty:p.poundSpeedPenalty+2}));
      addLog(`${name}: +1 damage die. -2 speed next round.`,'log-roll');
    } else if (key.includes('confound')) {
      // HoF (co): dodge + 1 die back + foe brawn&magic -1 permanent
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6();
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d),brawnPenalty:(f.brawnPenalty||0)+1,magicPenalty:(f.magicPenalty||0)+1}:f));
      setCmods(p=>({...p,dodgeActive:true}));
      addLog(`${name}: damage avoided. [${d}] back to ${activeFoe?.name} (ignores armour). Foe brawn & magic each -1 permanent.`,'log-hit');
      setPhase('post-damage');
    } else if (key.includes('doom')) {
      // HoF (co): foe armour, brawn, AND magic each -1 permanent
      if(winner!=='hero'){addLog(`${name}: only usable after causing health damage.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,armourPenalty:(f.armourPenalty||0)+1,brawnPenalty:(f.brawnPenalty||0)+1,magicPenalty:(f.magicPenalty||0)+1}:f));
      addLog(`${name}: ${activeFoe?.name} armour -1, brawn -1, magic -1 (permanent).`,'log-passive');
    } else if (key.includes('double punch')) {
      // HoF (co): requires 2 daggers; 2 dice + total brawn of both weapons, ignores armour
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const mhBrawn=hero.equipment?.mainHand?.stats?.brawn||0;
      const lhBrawn=hero.equipment?.leftHand?.stats?.brawn||0;
      const d1=rollD6(),d2=rollD6(); const dmg=d1+d2+mhBrawn+lhBrawn+(2*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${d1}]+[${d2}]+${mhBrawn+lhBrawn}(wpn brawn)${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour).`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('ley line infusion')) {
      // HoF (co): roll die → various effects
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const r=rollD6();
      const d=rollD6();
      if(r===1){
        const selfDmg=rollD6();
        const newHeroHp=Math.max(0,heroHp-selfDmg);
        setHeroHp(newHeroHp);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
        addLog(`${name}: [1] — both take damage! Foe [${d}], hero [${selfDmg}] dmg (ignores armour).`,'log-hit');
        if(newHeroHp<=0){endCombat('foe');return;}
      } else if(r<=3){
        const h=Math.min(computed.maxHealth,heroHp+5); setHeroHp(h);onHeroHealthChange(h);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
        addLog(`${name}: [${r}] — +5 HP, foe [${d}] dmg (ignores armour).`,'log-heal');
      } else if(r<=5){
        const h=Math.min(computed.maxHealth,heroHp+8); setHeroHp(h);onHeroHealthChange(h);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
        addLog(`${name}: [${r}] — +8 HP, foe [${d}] dmg (ignores armour).`,'log-heal');
      } else {
        const h=Math.min(computed.maxHealth,heroHp+8); setHeroHp(h);onHeroHealthChange(h);
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-d)}:f));
        addLog(`${name}: [6] — +8 HP to you & ally, foe [${d}] dmg (ignores armour).`,'log-heal');
      }
      trackBloodRage(d); setPhase('post-damage');
    } else if (key.includes('monkey mob') || key.includes('packmaster') || key.includes('thorn cage')) {
      // HoF: summon persistent 2 dmg/round DoT until doubles (monkey mob/packmaster) or just 1/round (thorn cage)
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      if(key.includes('thorn cage')){
        const d=rollD6(); const dmg=d+dieBonusNoScore;
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg),heroDoTs:{...(f.heroDoTs||{}),thornCage:true}}:f));
        addLog(`${name}: [${d}]${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). +1 dmg/round for rest of combat.`,'log-hit');
        trackBloodRage(dmg);
      } else {
        const perRound=key.includes('packmaster')?2:2;
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,heroDoTs:{...(f.heroDoTs||{}),monkeyMob:true,monkeyMobDmg:perRound}}:f));
        addLog(`${name}: ${activeFoe?.name} takes ${perRound} dmg/round (ignores armour) until doubles rolled.`,'log-passive');
      }
      setPhase('post-damage');
    } else if (key.includes('primal')) {
      // HoF (co): brawn AND magic +2 for rest of battle, instead of damage
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,brawnBonus:p.brawnBonus+2,magicBonus:p.magicBonus+2}));
      addLog(`${name}: brawn +2 and magic +2 for remainder of combat (instead of damage roll).`,'log-roll');
      setPhase('post-damage');
    } else if (key.includes('shunt')) {
      // HoF (co): if damage causes health damage, foe -2 speed for next round
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,slamSpeedPenalty:(p.slamSpeedPenalty||0)+2}));
      addLog(`${name}: ${activeFoe?.name} -2 speed next round (if health damage was dealt).`,'log-passive');
    } else if (key.includes('slick')) {
      // HoF (co): use speed dice total as damage score (+ brawn)
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const heroPath=hero.heroPath||hero.path; const isMage=heroPath==='mage';
      const speedTotal=heroDice.reduce((a,b)=>a+b,0);
      const dmgAttr=isMage?(computed.magic+cmods.magicBonus+(cmods.heroStatAdj?.magic||0)):(computed.brawn+cmods.brawnBonus+(cmods.heroStatAdj?.brawn||0));
      const target=foes.find(f=>f.id===activeFoeId);
      const foeArm=calcFoeArmour(target);
      const rawScore=speedTotal+dmgAttr+cmods.damageBonus;
      const dmgDealt=Math.max(0,rawScore-foeArm);
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmgDealt)}:f));
      addLog(`${name}: speed dice [${heroDice.join('][')}](${speedTotal})+${dmgAttr}+${cmods.damageBonus}=${rawScore} vs ${foeArm}arm → ${dmgDealt}dmg to ${target?.name}.`,'log-hit');
      trackBloodRage(dmgDealt); setPhase('post-damage');
    } else if (key.includes('spirit mark')) {
      // HoF (co+mo): after causing health damage, mark foe for +2 damage all future rounds
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,spiritMarked:true}:f));
      addLog(`${name}: ${activeFoe?.name} marked — +2 damage score against them for rest of combat.`,'log-passive');
    } else if (key.includes('swarm')) {
      // HoF (co): 1 die to single foe + foe -1 speed next round
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const d=rollD6(); const dmg=d+dieBonusNoScore;
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      setCmods(p=>({...p,slamSpeedPenalty:(p.slamSpeedPenalty||0)+1}));
      addLog(`${name}: [${d}]${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ${activeFoe?.name} (ignores armour). Foe -1 speed next round.`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('trample')) {
      // HoF (co): 3 dice to ALL foes (like rake but to everyone)
      if(winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const dice=[rollD6(),rollD6(),rollD6()]; const dmg=dice.reduce((a,b)=>a+b,0)+(3*dieBonusNoScore);
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${dice.join('][')}]${dieBonusNoScore?`+${3*dieBonusNoScore}sh`:''}=${dmg} to ALL foes (ignores armour).`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('veil')) {
      // HoF (co): dodge + speed +1 next round
      if(winner!=='foe'){addLog(`${name}: only usable when foe wins.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      setCmods(p=>({...p,dodgeActive:true,speedBonus:p.speedBonus+1}));
      addLog(`${name}: damage avoided. +1 speed next round.`,'log-passive');
      setPhase('post-damage');

    // ── HoF Passive hooks (via manual activation by player) ───────────────────
    } else if (key.includes('last rites')) {
      // HoF (pa): once foe ≤15 HP, foe speed -1 and armour -1 permanent
      const target=foes.find(f=>f.id===activeFoeId);
      if(target&&target.hp<=15){
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,speedPenalty:(f.speedPenalty||0)+1,armourPenalty:(f.armourPenalty||0)+1}:f));
        addLog(`${name}: ${target.name} HP ≤ 15 — speed -1 and armour -1 for rest of combat.`,'log-passive');
      } else {
        addLog(`${name}: foe HP must be ≤ 15 (currently ${target?.hp||'?'}).`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});
      }
    } else if (key.includes('snake strike')) {
      // HoF (pa): pre-combat 2 dice to one foe — should auto-fire but allow manual
      const d1=rollD6(),d2=rollD6();
      const target=foes.find(f=>f.id===activeFoeId)||foes[0];
      if(target){
        const dmg=d1+d2+(2*dieBonusNoScore);
        setFoes(fs=>fs.map(f=>f.id===target.id?{...f,hp:Math.max(0,f.hp-dmg)}:f));
        addLog(`${name}: pre-combat [${d1}]+[${d2}]${dieBonusNoScore?`+${2*dieBonusNoScore}sh`:''}=${dmg} to ${target.name} (ignores armour).`,'log-hit');
      }

    // ── HoF Alias catch-ups ───────────────────────────────────────────────────
    } else if (key.includes('volley') || key.includes('flurry')) {
      // HoF (co): 1 die to all foes — alias for cleave
      const d=rollD6(); const dmg=d+dieBonusNoScore;
      setFoes(fs=>fs.map(f=>f.hp>0?{...f,hp:Math.max(0,f.hp-dmg)}:f));
      addLog(`${name}: [${d}]${dieBonusNoScore?`+${dieBonusNoScore}sh`:''}=${dmg} to ALL live foes (ignores armour).`,'log-hit');
      trackBloodRage(dmg); setPhase('post-damage');
    } else if (key.includes('demon spines') || key.includes('dirge') || key.includes('prophecy') || key.includes('blink') || key.includes('safe path')) {
      // HoF aliases already handled by existing branches — catch any that slip through
      addLog(`${name}: applied (see alias).`,'log-roll');

    // ── Companion abilities ────────────────────────────────────────────────
    } else if (key === 'minor mirage') {
      if (winner !== 'hero') {
        addLog(`Minor Mirage: only usable when you win (instead of rolling damage).`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;}); return;
      }
      // Player can cast on themselves or on the minion if it's alive
      const mt = (companion?.type==='minion' && companion.alive) ? 'minion' : 'hero';
      setCmods(p=>({...p, magicBonus: p.magicBonus - 1, mirageActive: true, mirageTarget: mt}));
      addLog(`🌫 Minor Mirage: cast on ${mt==='minion'?'Minion':'yourself'} (magic -1). If hit next round, roll d6 — on [6] attack ignored.`,'log-passive');
      setPhase('post-damage');
    } else if (key === 'evocation') {
      if (!companion || companion.type!=='minion' || !companion.alive)
        { addLog(`Evocation: minion not in play.`,'log-passive'); setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;}); return; }
      setCmods(p=>({...p, damageBonus: p.damageBonus + companion.magic}));
      addLog(`🌀 Evocation: +${companion.magic} to damage score (minion magic).`,'log-hit');
    } else if (key === 'energy boost') {
      if (!companion || companion.type!=='minion' || !companion.alive)
        { addLog(`Energy Boost: minion not in play.`,'log-passive'); setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;}); return; }
      setCompanion(c => c ? {...c, armour: c.armour + 3} : c);
      setCmods(p=>({...p, magicBonus: p.magicBonus - 2}));
      addLog(`⚡ Energy Boost: Minion armour +3 (now ${companion.armour+3}). Your magic -2 this round.`,'log-passive');
    } else if (key === 'pack spirit') {
      if (!companion || companion.type!=='mastiff' || !companion.alive)
        { addLog(`Pack Spirit: mastiff not in play.`,'log-passive'); return; }
      setCompanion(c => c ? {...c, brawn: c.brawn + 1} : c);
      addLog(`🐕 Pack Spirit: Mastiff brawn +1 → ${companion.brawn+1}. Spend one unused sp/co ability (mark it used manually).`,'log-passive');
      return; // Pack Spirit has no once-per-combat limit — skip usedOnce guard
    } else if (key === 'resurrection') {
      if (!companion || companion.type!=='minion' || companion.alive || companion.resurrectionUsed)
        { addLog(`Resurrection: minion must be defeated and ability not yet spent.`,'log-passive'); setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;}); return; }
      setCmods(p=>({...p, magicBonus: p.magicBonus - 3}));
      setCompanion(c => c ? {...c, alive:true, hp:companionBaseStats.hp, magic:companionBaseStats.magic,
        armour:companionBaseStats.armour, defeatedFired:false, resurrectionUsed:true} : c);
      addLog(`✨ Resurrection: Minion revived at base stats. Your magic -3 this round.`,'log-heal');
    } else if (key === 'blessed bullets') {
      if (!companion || companion.type!=='virgil' || !companion.alive) {
        addLog(`Blessed Bullets: Virgil must be your companion and alive.`,'log-passive');
        setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;}); return;
      }
      if (hasBrokenTrust) {
        const btRoll = rollD6();
        if (btRoll <= 5) {
          addLog(`🎲 Broken Trust: [${btRoll}] — Blessed Bullets fail this round. Retry next round.`,'log-passive');
          setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;}); return;
        }
        addLog(`🎲 Broken Trust: [${btRoll}] — success!`,'log-passive');
      }
      if (winner!=='hero'){addLog(`${name}: only usable when you win.`,'log-passive');setUsedOnce(prev=>{const s=new Set(prev);s.delete(key);return s;});return;}
      const [bb1,bb2,bb3]=[rollD6(),rollD6(),rollD6()];
      const bbDmg = bb1+bb2+bb3;
      setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-bbDmg)}:f));
      setCmods(p=>({...p, slamSpeedPenalty:(p.slamSpeedPenalty||0)+1}));
      addLog(`🔫 ${name}: [${bb1}][${bb2}][${bb3}]=${bbDmg} dmg to ${activeFoe?.name} (ignores armour). Foe -1 speed next round.`,'log-hit');
      trackBloodRage(bbDmg); setPhase('post-damage');

    } else {
      addLog(`${name}: applied. (See ability description for manual effects.)`, 'log-roll');
    }
  };

  // ── DAMAGE ROLL ────────────────────────────────────────────────────────────
  const rollDamage = (who) => {
    takeSnapshot();
    setRolling(true);
    setPendingDiceAction(null);
    setTimeout(() => {
      const heroPath = hero.heroPath || hero.path;
      const isMage = heroPath === 'mage';
      const target = foes.find(f=>f.id===activeFoeId) || liveFoes()[0];

      if (who === 'hero') {
        let numDice = 1 + cmods.extraDamageDice + heroDamageDiceDelta;
        let rawDice;

        if (cmods.windwalkerActive) {
          // use speed dice as damage — already computed
          rawDice = heroDice.slice();
        } else {
          rawDice = Array.from({length:numDice}, rollD6);
        }

        // Apply critical strike / gut ripper (all dice → 6)
        let finalDice = cmods.criticalStrikeActive ? rawDice.map(()=>6) : rawDice;
        // Apply dominate (one die → 6)
        if (cmods.dominateActive) { const idx=finalDice.findIndex(d=>d<6); if(idx>=0) finalDice[idx]=6; }
        // Apply die bonus per die (acid/sear/shades)
        const adjustedDice = finalDice.map(d => Math.min(12, d + dieBonusPerDie));

        // Raining Blows: for each [6] roll bonus dice (cascades).
        // Safety cap at 20 bonus dice to prevent extreme chains with critical strike
        // + all-6s that can theoretically loop for a long time.
        let extraFromRaining = [];
        if (cmods.rainingBlowsActive) {
          let checkDice = [...adjustedDice];
          const MAX_RAINING = 20;
          while (checkDice.some(d=>d>=6) && extraFromRaining.length < MAX_RAINING) {
            const bonus = checkDice.filter(d=>d>=6).map(()=>rollD6());
            extraFromRaining = [...extraFromRaining, ...bonus];
            checkDice = bonus;
          }
        }
        const allDice = [...adjustedDice, ...extraFromRaining];

        const dmgAttr = isMage
          ? (computed.magic + cmods.magicBonus + (cmods.heroStatAdj?.magic || 0))
          : (computed.brawn + cmods.brawnBonus + (cmods.heroStatAdj?.brawn || 0));
        const dmgAttrName = isMage ? 'magic' : 'brawn';
        const diceSum = allDice.reduce((a,b)=>a+b,0);

        // Merciless: +1 per die if THE TARGET FOE has been inflicted with Bleed, Disease or Venom.
        // Check foe's passives (player-set) OR per-foe heroDoTs (auto-set when hero damages).
        const foeHasDoT = target && (
          target.passives?.bleed   || target.passives?.venom   || target.passives?.disease ||
          target.heroDoTs?.bleed   || target.heroDoTs?.venom   || target.heroDoTs?.disease
        );
        const mercilessBonus = (hasMerciless && foeHasDoT) ? allDice.length : 0;
        // Mangle — EoWF (pa) passive OR HoF (mo) activated via mangleHoFActive
        const mangleBonus = (hasMangle || cmods.mangleHoFActive) ? allDice.filter(d=>d>=6).length * 2 : 0;
        // Blade Finesse (Dune pa): each [6] on damage score +1 (requires sword in main hand)
        const hasSwordMH = (hero.equipment?.mainHand?.name||'').toLowerCase().includes('sword');
        const bladeFinesseBonus = (hasBladefinesse && hasSwordMH) ? allDice.filter(d=>d>=6).length : 0;
        // Spirit Mark (HoF): +2 damage against marked foe for rest of combat
        const spiritMarkBonus = target?.spiritMarked ? 2 : 0;

        const rawScore = diceSum + dmgAttr + cmods.damageBonus + mercilessBonus + mangleBonus + bladeFinesseBonus + spiritMarkBonus;
        const foeArmour = calcFoeArmour(target);
        const dmgDealt = Math.max(0, rawScore - foeArmour);

        setDamageDice(allDice);
        setDamageWinner('hero');
        setRoundDamage(dmgDealt);

        const pierceNote  = cmods.piercingActive ? ' (piercing — ignores armour)'
                          : cmods.fatalBlowActive ? ` (fatal blow — ${foeArmour} armour remaining)`
                          : ``;
        const acidNote    = dieBonusPerDie > 0 ? ` +${dieBonusPerDie}/die(acid/sear/bonus)` : '';
        const mercilessNote = mercilessBonus  ? ` +${mercilessBonus}(merciless)` : '';
        const extraNote   = extraFromRaining.length ? ` +raining blows[${extraFromRaining.join('][')}]` : '';
        const mangleNote  = mangleBonus       ? ` +${mangleBonus}(mangle)`        : '';
        const finesseNote = bladeFinesseBonus ? ` +${bladeFinesseBonus}(finesse)`  : '';
        const markNote    = spiritMarkBonus   ? ` +${spiritMarkBonus}(mark)`       : '';
        addLog(`${hero.name}: [${rawDice.join('][')}]${acidNote}${extraNote}+${dmgAttr}${dmgAttrName}+${cmods.damageBonus}bonus${mercilessNote}${mangleNote}${finesseNote}${markNote} = ${rawScore}${pierceNote} vs ${foeArmour}arm → ${dmgDealt}dmg to ${target?.name}`, 'log-hit');

        // Blood Thief (HoF mo): for each [6] on damage dice, restore 4 health
        if (cmods.bloodThiefActive && allDice.some(d=>d>=6)) {
          const sixes = allDice.filter(d=>d>=6).length;
          const btHeal = Math.min(sixes * 4, computed.maxHealth - heroHp);
          if (btHeal > 0) { setHeroHp(p=>p+btHeal); addLog(`🩸 Blood Thief: ${sixes}×[6] → +${btHeal} HP`, 'log-heal'); }
        }
        // Ice Edge (EoWF pa): any [6] on damage score → foe -1 speed next round
        if (hasIceEdge && allDice.some(d=>d>=6)) {
          setCmods(p=>({...p, slamSpeedPenalty:(p.slamSpeedPenalty||0)+1}));
          addLog(`❄ Ice Edge: [6] on damage → foe -1 speed next round.`, 'log-passive');
        }

        // Life Spark / Dark Claw on damage doubles.
        // Forum 1021: Da Boss confirmed manipulated dice (dominate, critical strike) count.
        // Check finalDice (post-manipulation) not rawDice.
        // Any pair within the dice set counts as doubles (not just dice[0]==dice[1]).
        if (finalDice.length >= 2) {
          const newHp2 = checkDoubles(finalDice, heroHp, computed.maxHealth, target?.id);
          if (newHp2 !== heroHp) setHeroHp(newHp2);
        }
      } else {
        // Foe rolls
        const foe = target;
        const foeDmgAttr = foe?.usesMagic
          ? Math.max(0,(parseInt(foe.magic)||0)-(foe.magicPenalty||0)-(foe.magicPenaltyThisRound||0))
          : Math.max(0,(parseInt(foe.brawn)||0)-(foe.brawnPenalty||0)-(foe.brawnPenaltyThisRound||0));
        // Reckless (Dune/EoWF/HoF sp): if hero played Reckless and foe wins, foe gets +1 damage die
        const recklessExtra = (cmods.recklessActive && winner === 'foe') ? 1 : 0;
        const foeDmgDiceCount = Math.max(1, 1 + (foeDamageDiceOverride[foe?.id] || 0) + recklessExtra);
        const foeDiceRolls = Array.from({length: foeDmgDiceCount}, rollD6);
        // Second Sight: lower each die by 2 (minimum 1)
        let foeDiceAdj = foeDiceRolls.map(d => cmods.secondSightActive ? Math.max(1, d-2) : d);
        // Hypnotise (HoF mo): foe damage [6]s may be rerolled
        if (cmods.hypnotiseActive && foeDiceAdj.some(d=>d===6)) {
          foeDiceAdj = foeDiceAdj.map(d => d===6 ? rollD6() : d);
          addLog(`🌀 Hypnotise: foe [6]s re-rolled → [${foeDiceAdj.join('][')}]`, 'log-roll');
        }
        const foeDiceSum = foeDiceAdj.reduce((a,b)=>a+b,0);
        // Fear / Mind Fumble: reduce foe damage score by a flat amount
        const rawDmgScore = foeDiceSum + foeDmgAttr;
        const dmgScore = Math.max(0, rawDmgScore - (cmods.foeDmgScorePenalty||0));
        const heroArm = effectiveArmour;
        const dmgDealt = Math.max(0, dmgScore - heroArm);
        setDamageDice(foeDiceRolls);
        setDamageWinner('foe');
        setRoundDamage(dmgDealt);
        const ssNote = cmods.secondSightActive ? ` (second sight -2 each)` : '';
        const fearNote = cmods.foeDmgScorePenalty > 0 ? ` -${cmods.foeDmgScorePenalty}(fear)` : '';
        const recklessNote = recklessExtra ? ` +1die(reckless)` : '';
        const diceStr = foeDiceAdj.length > 1
          ? `[${foeDiceAdj.join('][')}](${foeDiceSum})${ssNote}`
          : `[${foeDiceAdj[0]}]${ssNote}`;
        addLog(`${foe?.name}: ${diceStr}${recklessNote}+${foeDmgAttr}${fearNote} = ${dmgScore} vs ${heroArm}arm → ${dmgDealt}dmg to ${hero.name}`, 'log-hit');

        // Brittle Edge (EoWF pa): foe takes 2 damage when they roll for damage score
        if (hasBrittleEdge) {
          setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-2)}:f));
          addLog(`⚡ Brittle Edge: foe rolled damage — 2 dmg to ${foe?.name} (ignores armour).`, 'log-hit');
        }
      }
      setRolling(false);
      setPhase('post-damage');
    }, 350);
  };

  // ── BLOOD RAGE HELPER ─────────────────────────────────────────────────────
  // Called whenever hero deals health damage (from damage roll OR direct ability).
  // Tracks consecutive rounds with health damage for Blood Rage auto-trigger.
  const trackBloodRage = (dmgDealt) => {
    if (!hasAbil(allModifier,'blood rage') || cmods.bloodRageActive || usedOnce.has('blood rage')) return;
    if (dmgDealt > 0) {
      const newConsec = (cmods.bloodRageConsecutive || 0) + 1;
      if (newConsec >= 2) {
        setCmods(p=>({...p, bloodRageActive:true, brawnBonus:p.brawnBonus+2, bloodRageConsecutive:0}));
        setUsedOnce(prev => new Set([...prev, 'blood rage']));
        addLog(`💢 Blood Rage: 2 consecutive winning rounds with damage — +2 brawn for remainder of combat!`, 'log-win');
      } else {
        setCmods(p=>({...p, bloodRageConsecutive: newConsec}));
      }
    } else {
      setCmods(p=>({...p, bloodRageConsecutive:0}));
    }
  };

  // ── APPLY DAMAGE ───────────────────────────────────────────────────────────
  const applyDamage = () => {
    if (cmods.dodgeActive) {
      addLog(`Damage avoided (dodge/command active). Passives still apply.`, 'log-passive');
      setPhase('passive'); return;
    }

    if (damageWinner === 'hero' && activeFoe) {
      const newHp = Math.max(0, activeFoe.hp - roundDamage);
      // Apply HP reduction AND per-foe DoT flags in a single update so the state doesn't race.
      // Glossary: DoTs tick against the opponent you've damaged — NOT against every foe.
      setFoes(fs => fs.map(f => {
        if (f.id !== activeFoeId) return f;
        const updated = { ...f, hp: newHp };
        if (roundDamage > 0) {
          const dots = { ...(f.heroDoTs || {}) };
          if (hasVenom      && !dots.venom)   { dots.venom   = true; addLog(`Venom applied to ${f.name}.`, 'log-passive'); }
          if (hasBleed      && !dots.bleed)   { dots.bleed   = true; addLog(`Bleed applied to ${f.name}.`, 'log-passive'); }
          if (hasDisease    && !dots.disease) { dots.disease = true; addLog(`Disease applied to ${f.name}.`, 'log-passive'); }
          if (hasToxicBlades && !dots.bleed)  { dots.bleed   = true; addLog(`Toxic Blades — Bleed applied to ${f.name}.`, 'log-passive'); }
          updated.heroDoTs = dots;
        }
        return updated;
      }));
      addLog(`${activeFoe.name} HP: ${activeFoe.hp} → ${newHp}`, 'log-hit');

      // Vampirism / Leech
      if (cmods.vampirismActive && roundDamage > 0) {
        const vampHeal = Math.min(Math.ceil(roundDamage/2), computed.maxHealth-heroHp);
        if (vampHeal>0) { setHeroHp(p=>p+vampHeal); addLog(`🧛 Vampirism: +${vampHeal} HP`, 'log-heal'); }
      }
      if (hasLeech && roundDamage > 0) {
        const leechHeal = Math.min(2, computed.maxHealth-heroHp);
        if (leechHeal>0) { setHeroHp(p=>p+leechHeal); addLog(`🩸 Leech: +${leechHeal} HP`, 'log-heal'); }
      }

      // Blood Rage auto-trigger via shared helper (also called from direct-damage abilities)
      trackBloodRage(roundDamage);

      if (newHp <= 0) {
        addLog(`${activeFoe.name} is defeated!`, 'log-win');
        // Malefic Runes (EoWF pa): magic +1 for each foe defeated for remainder of combat.
        // This is a PERSISTENT bonus — stored on the hero base attributes so it survives round resets.
        if (hasMaleficRunes) {
          setHero(h => ({
            ...h,
            baseAttributes: { ...h.baseAttributes, magic: (h.baseAttributes.magic||0) + 1 }
          }));
          addLog(`✨ Malefic Runes: foe defeated — +1 magic permanently this combat.`, 'log-passive');
        }
        const remaining = foes.filter(f => f.id!==activeFoeId && f.hp>0);
        if (remaining.length===0) { endCombat('hero'); return; }
        setActiveFoeId(remaining[0].id);
      }

    } else if (damageWinner === 'foe') {
      // Death from Above (Dune pa): fires BEFORE opponent's damage (per rules).
      // If DfA kills the foe the attack is cancelled — hero takes no damage.
      if (hasDeathFromAbove && companion?.type === 'talon_wing' && companion.alive && roundDamage > 0) {
        const dfaRoll = rollD6();
        if (dfaRoll >= 5) {
          const dfaNewHp = Math.max(0, (activeFoe?.hp ?? 0) - companion.brawn);
          setFoes(fs => fs.map(f => f.id===activeFoeId ? {...f, hp: dfaNewHp} : f));
          addLog(`🦅 Death from Above: [${dfaRoll}] — Talon Wing strikes first! ${companion.brawn} dmg to ${activeFoe?.name} (ignores armour).`, 'log-hit');
          if (dfaNewHp <= 0) {
            addLog(`${activeFoe?.name} slain by Death from Above — their attack is cancelled!`, 'log-win');
            const remaining = foes.filter(f => f.id!==activeFoeId && f.hp>0);
            if (remaining.length === 0) { endCombat('hero'); return; }
            setActiveFoeId(remaining[0].id);
            setPhase('passive'); return;
          }
        } else {
          addLog(`🦅 Death from Above: [${dfaRoll}] — no strike (needs 5+).`, 'log-passive');
        }
      }

      let newHeroHp = Math.max(0, heroHp - roundDamage);

      // Minor Mirage (Dune co): hero target → roll d6 on [6] ignore all incoming damage
      if (cmods.mirageActive && cmods.mirageTarget === 'hero' && roundDamage > 0) {
        const mirRoll = rollD6();
        setCmods(p=>({...p, mirageActive: false}));
        if (mirRoll === 6) {
          addLog(`🌫 Minor Mirage: [${mirRoll}] — the attack passes through! No damage taken.`, 'log-win');
          setPhase('passive'); return;
        }
        addLog(`🌫 Minor Mirage: [${mirRoll}] — mirage dispelled (needed 6).`, 'log-passive');
      }
      if (cmods.mirageActive && cmods.mirageTarget === 'minion') {
        addLog(`🌫 Minor Mirage (Minion): roll d6 — on [6] ignore opponent's attack on your minion (manual).`, 'log-passive');
        setCmods(p=>({...p, mirageActive: false}));
      }

      // Blood Rage streak resets when the foe wins a round
      if (hasAbil(allModifier,'blood rage') && !cmods.bloodRageActive) {
        if (cmods.bloodRageConsecutive > 0) setCmods(p=>({...p, bloodRageConsecutive:0}));
      }

      // Auto-apply foe DoT passives on first health damage to hero.
      // Foe passives (venom/bleed/disease) are set manually by the player in the foe card,
      // but they should only start ticking once the foe has actually caused health damage.
      // We enforce this by only enabling the tick in applyPassives when roundDamage > 0
      // this turn OR the flag was already active from a prior round.
      // The flags themselves are toggled by the player on the foe card — we trust that.
      // What we fix here: on rounds the foe is blocked by hero armour (roundDamage === 0),
      // we do NOT start a new tick. Existing active flags continue ticking regardless.

      // KickStart
      if (newHeroHp <= 0 && hasKickStart && !cmods.kickStartUsed) {
        newHeroHp = 15;
        // Glossary: "This also removes all passive effects on your hero."
        // Clear per-foe hero-inflicted DoTs AND the hero's own passive flags.
        setFoes(fs => fs.map(f => f.id===activeFoeId ? {...f, heroDoTs:{venom:false,bleed:false,disease:false}} : f));
        setHeroPassives(p => ({...p, bleed:false, venom:false, disease:false, thorns:false, fire_aura:false, barbs:false, vitriol:false}));
        setCmods(p=>({...p,kickStartUsed:true}));
        addLog(`⚡ Kick Start: brought back to life at 15 HP! All passive effects removed.`, 'log-heal');
      }
      // Soul Burst (Dune pa): revive at 10 HP when last health lost (like KickStart but 10 HP)
      if (newHeroHp <= 0 && hasSoulBurst && !cmods.soulBurstUsed) {
        newHeroHp = 10;
        setCmods(p=>({...p, soulBurstUsed:true}));
        addLog(`💫 Soul Burst: brought back to life at 10 HP!`, 'log-heal');
      }

      // Lightning retaliation
      if (cmods.lightningActive && roundDamage > 0) {
        setFoes(fs=>fs.map(f=>f.id===activeFoeId?{...f,hp:Math.max(0,f.hp-2)}:f));
        addLog(`⚡ Lightning: 2 dmg back to ${activeFoe?.name}`, 'log-hit');
      }

      setHeroHp(newHeroHp);
      onHeroHealthChange(newHeroHp); // persist to hero.baseAttributes.health so sheet stays in sync
      addLog(`${hero.name} HP: ${heroHp} → ${newHeroHp}`, 'log-hit');

      if (newHeroHp <= 0) { endCombat('foe'); return; }
    }
    setPhase('passive');
  };

  const skipDamage = () => {
    addLog(`Damage avoided.`, 'log-passive');
    setPhase('passive');
  };

  // ── PASSIVES ───────────────────────────────────────────────────────────────
  const applyPassives = () => {
    setPendingDiceAction(null);
    setSwapHeroDieIdx(null);
    setFeintSelection([]);
    let newHeroHp = heroHp;
    // Track which foe IDs were hit by thorns/barbs so we can apply heroDoTs per-foe afterward
    const thornHitFoeIds = new Set();
    const updatedFoes = foes.map(f => {
      if (f.hp <= 0) return f;
      let hp = f.hp;

      // Hero → foe DoT passives (per-foe — only foes that have taken hero damage tick).
      // Glossary: "If your damage score causes health damage to your opponent, THEY
      // continue to take damage at the end of each combat round." — the opponent hit,
      // not every foe in the encounter.
      const fDoTs = f.heroDoTs || {};
      // Gouge (HoF pa): bleed damage +1 when passive. gougeActive handles activated version.
      // Rapid Pulse (Dune pa): at ≤10 HP, bleed deals +1 extra to each affected foe
      const bleedDmg = (fDoTs.bleed) ? (1 + (hasGougePa || hasGougeActive ? 1 : 0) + (hasRapidPulse && heroHp <= 10 ? 1 : 0)) : 0;
      if (fDoTs.venom)    { hp=Math.max(0,hp-venomDmg); addLog(`Venom: ${f.name} −${venomDmg}HP`,'log-passive'); }
      if (fDoTs.bleed && bleedDmg>0)    { hp=Math.max(0,hp-bleedDmg); addLog(`Bleed: ${f.name} −${bleedDmg}HP${bleedDmg>1?' (Gouge)':''}`, 'log-passive'); }
      if (fDoTs.disease)  { hp=Math.max(0,hp-2);         addLog(`Disease: ${f.name} −2HP`,'log-passive'); }
      // Poison Cloud (Dune co): 1 damage per round to targeted foes
      if (fDoTs.poisonCloud) { hp=Math.max(0,hp-1); addLog(`Poison Cloud: ${f.name} −1HP`,'log-passive'); }
      // Thorn Cage (HoF co): 1 damage per round to caged foe
      if (fDoTs.thornCage)   { hp=Math.max(0,hp-1); addLog(`Thorn Cage: ${f.name} −1HP`,'log-passive'); }
      // Monkey Mob / Packmaster (HoF co): 2 damage per round until doubles
      if (fDoTs.monkeyMob)   { const mmDmg=fDoTs.monkeyMobDmg||2; hp=Math.max(0,hp-mmDmg); addLog(`Mob: ${f.name} −${mmDmg}HP`,'log-passive'); }

      // Unconditional hero passives — fire every round against ALL live foes regardless
      // of damage. These are area-effect auras that don't need a prior health-damage trigger.
      if (heroPassives.thorns || heroPassives.barbs) {
        const hpBefore = hp;
        hp=Math.max(0,hp-1);
        addLog(`Thorns/Barbs: ${f.name} −1HP`,'log-passive');
        // Forum 3551: thorns damage counts as health damage → triggers venom/bleed/disease per-foe
        if (hp < hpBefore) {
          thornHitFoeIds.add(f.id);
        }
      }
      // Fire Aura: Turn Up the Heat (HoF pa) adds +1 to fire aura damage
      const fireAuraDmg = heroPassives.fire_aura ? (1 + (hasTurnUpHeat ? 1 : 0)) : 0;
      if (fireAuraDmg > 0) { hp=Math.max(0,hp-fireAuraDmg); addLog(`Fire Aura: ${f.name} −${fireAuraDmg}HP`,'log-passive'); }
      if (heroPassives.vitriol)   { hp=Math.max(0,hp-1); newHeroHp=Math.max(0,newHeroHp-1); addLog(`Vitriol: ${f.name} −1HP, ${hero.name} −1HP`,'log-passive'); }
      if (f.burned)               { const embers = hasAbil(allPassives,'embers') ? 2 : 1; hp=Math.max(0,hp-embers); addLog(`Burn: ${f.name} −${embers}HP`,'log-passive'); }
      if (f.haunted || cmods.hauntActive) {
        hp=Math.max(0,hp-2);
        addLog(`Haunt: ${f.name} −2HP`,'log-passive');
        // Dispel on next double (checked during initiative rolls)
      }
      // Decay (EoWF pa) = 1 damage to all foes end of round (same as thorns)
      if (hasDecay) { hp=Math.max(0,hp-1); addLog(`Decay: ${f.name} −1HP`,'log-passive'); }
      // Spark Jolt (Dune pa) = 1 damage to all foes end of round
      if (hasSparkJolt) { hp=Math.max(0,hp-1); addLog(`Spark Jolt: ${f.name} −1HP`,'log-passive'); }
      // Searing Mantle (HoF pa): 1 damage per 4 armour to all foes
      if (hasSearingMantle) {
        const smDmg = Math.floor(effectiveArmour / 4);
        if (smDmg > 0) { hp=Math.max(0,hp-smDmg); addLog(`Searing Mantle: ${f.name} −${smDmg}HP (${effectiveArmour} armour ÷ 4)`,'log-passive'); }
      }
      // Winged Tormenter (Dune pa): talon wing passive → 1 dmg to chosen target, end of round
      if (hasWingedTormenter && companion?.type==='talon_wing' && companion.alive && companion.stance==='passive') {
        const wtId = wingedTormenterTarget || liveFoes()[0]?.id;
        if (wtId && f.id === wtId) { hp=Math.max(0,hp-1); addLog(`🦅 Winged Tormenter: ${f.name} −1HP (ignores armour).`,'log-passive'); }
      }
      // Armour Breaker (Dune pa): reduce one foe's armour by 1 at start of each round
      // Handled in rollInitiative for start-of-round trigger; here just for reference.

      // Foe → hero DoT passives.
      // These are set by the player on the foe card once the foe has caused health damage.
      // Once active they tick every round (same "remainder of combat" rule).
      // Unconditional foe passives (thorns, fire_aura) always tick.
      // BUT: if this foe was killed by hero passives this round, don't tick their passives
      // back — consistent with Da Boss ruling that combat ends when foe drops.
      if (hp > 0) {
        if (f.passives.venom)    { newHeroHp=Math.max(0,newHeroHp-2); addLog(`${f.name} Venom: ${hero.name} −2HP`,'log-passive'); }
        if (f.passives.bleed)    { newHeroHp=Math.max(0,newHeroHp-1); addLog(`${f.name} Bleed: ${hero.name} −1HP`,'log-passive'); }
        if (f.passives.disease)  { newHeroHp=Math.max(0,newHeroHp-2); addLog(`${f.name} Disease: ${hero.name} −2HP`,'log-passive'); }
        if (f.passives.thorns)   { newHeroHp=Math.max(0,newHeroHp-1); addLog(`${f.name} Thorns: ${hero.name} −1HP`,'log-passive'); }
        if (f.passives.fire_aura){ newHeroHp=Math.max(0,newHeroHp-1); addLog(`${f.name} Fire Aura: ${hero.name} −1HP`,'log-passive'); }
      }

      return { ...f, hp };
    });

    // Thorns/Barbs triggered per-foe DoTs — apply to each foe that took thorns damage
    // Forum 3551: "Yes, thorns would trigger other effects such as bleed and venom,
    // as opponents have taken health damage." — uses per-foe heroDoTs now.
    if (thornHitFoeIds.size > 0) {
      const finalFoes = updatedFoes.map(f => {
        if (!thornHitFoeIds.has(f.id)) return f;
        const dots = {...(f.heroDoTs||{})};
        let logged = false;
        if (hasVenom    && !dots.venom)   { dots.venom   = true; if (!logged) { addLog(`Venom applied (via Thorns/Barbs).`,'log-passive'); logged=true; } }
        if (hasBleed    && !dots.bleed)   { dots.bleed   = true; if (!logged) { addLog(`Bleed applied (via Thorns/Barbs).`,'log-passive'); logged=true; } }
        if (hasDisease  && !dots.disease) { dots.disease = true; }
        if (hasToxicBlades && !dots.bleed){ dots.bleed   = true; }
        return {...f, heroDoTs: dots};
      });
      setFoes(finalFoes);
    } else {
      setFoes(updatedFoes);
    }

    // Meditation / Cleansing Light
    if (cmods.meditationActive) { newHeroHp=Math.min(computed.maxHealth,newHeroHp+1); addLog(`Meditation: ${hero.name} +1HP`,'log-heal'); }
    if (cmods.cleansLight)      { newHeroHp=Math.min(computed.maxHealth,newHeroHp+2); addLog(`Cleansing Light: ${hero.name} +2HP`,'log-heal'); }

    // Lick Your Wounds (Dune pa): mastiff passive stance → restore 4 HP to mastiff at end of round
    if (hasLickWounds && companion?.type==='mastiff' && companion.alive && companion.stance==='passive') {
      const lwHealed = Math.min(companion.maxHp, companion.hp + 4);
      if (lwHealed > companion.hp) {
        setCompanion(c => c ? {...c, hp: lwHealed} : c);
        addLog(`🐕 Lick Your Wounds: Mastiff +${lwHealed - companion.hp}HP (${lwHealed}/${companion.maxHp}).`, 'log-heal');
      }
    }

    // KickStart on passive damage death
    if (newHeroHp <= 0 && hasKickStart && !cmods.kickStartUsed) {
      newHeroHp = 15;
      // Glossary: "This also removes all passive effects on your hero."
      setFoes(fs => fs.map(f => ({...f, heroDoTs:{venom:false,bleed:false,disease:false}})));
      setHeroPassives(p => ({...p, bleed:false, venom:false, disease:false, thorns:false, fire_aura:false, barbs:false, vitriol:false}));
      setCmods(p=>({...p,kickStartUsed:true}));
      addLog(`⚡ Kick Start: brought back to life at 15 HP! All passive effects removed.`,'log-heal');
    }

    // setFoes is called inside the thornHitFoeIds if/else above — don't call again here.
    // Use the final foe array (with thorns DoTs merged in if applicable) for end-of-round checks.
    const finalFoesForCheck = thornHitFoeIds.size > 0
      ? updatedFoes.map(f => thornHitFoeIds.has(f.id) ? {...f, heroDoTs: {...(f.heroDoTs||{}), ...(hasVenom?{venom:true}:{}), ...(hasBleed||hasToxicBlades?{bleed:true}:{}), ...(hasDisease?{disease:true}:{})}} : f)
      : updatedFoes;

    setHeroHp(newHeroHp);
    onHeroHealthChange(newHeroHp);

    // Da Boss ruling (forum 3315): "as soon as the last opponent is defeated the combat is
    // immediately over" — no further hero passive ticks after last foe dies.
    const allDead = finalFoesForCheck.every(f=>f.hp<=0);
    if (allDead)        { endCombat('hero'); return; }
    if (newHeroHp <= 0) { endCombat('foe');  return; }

    const foeSummary = finalFoesForCheck.filter(f=>f.hp>0).map(f=>`${f.name}:${f.hp}HP`).join('  ');
    addLog(`End of round ${round}. ${hero.name}:${newHeroHp}HP  |  ${foeSummary}`,'log-roll');

    // Clear Zapped!'s brawn/magic round-scoped penalties at end of round.
    // speedPenaltyThisRound was already cleared in rollInitiative after speed was computed.
    // brawnPenaltyThisRound/magicPenaltyThisRound must survive through the damage phase
    // (so they reduce the foe's damage score if foe wins), and are cleared here at round end.
    setFoes(fs => fs.map(f => ({...f, brawnPenaltyThisRound: 0, magicPenaltyThisRound: 0})));
    setHeroDice([]); setDamageDice([]);
    setWinner(null); setDamageWinner(null); setRoundDamage(null);
    setPhase('initiative');
  };

  // ── END COMBAT ─────────────────────────────────────────────────────────────
  const endCombat = (victor='hero') => {
    if (victor==='hero') {
      addLog(`🏆 ${hero.name} is victorious!`,'log-win');
      addLog(`Health restored to ${computed.maxHealth}.`,'log-heal');
    } else {
      addLog(`💀 ${hero.name} has been defeated.`,'log-hit');
    }
    // Restore to full max health (includes career bonus, equipment, etc.)
    onHeroHealthChange(computed.maxHealth);
    setPhase('ended');
    // ── Autosave to slot 0 on combat end ─────────────────────────────────────
    // Writes the hero with restored health so the player never loses combat
    // outcome progress from a forgotten manual save.
    try {
      const slots = readSlotsFromStorage();
      const heroSnapshot = { ...hero, baseAttributes: { ...hero.baseAttributes, health: computed.maxHealth }, lastModified: Date.now() };
      slots[0] = heroSnapshot;
      writeSlotsToStorage(slots);
    } catch { /* autosave is best-effort — never block combat flow */ }
  };

  // ── Derived display ────────────────────────────────────────────────────────
  const heroHpPct = Math.max(0,Math.min(100,(heroHp/computed.maxHealth)*100));

  // ── RENDER HELPERS ────────────────────────────────────────────────────────
  const AbilityPanel = () => {
    // Hooks must come first — before any conditional returns
    const [tapTip, setTapTip] = useState(null); // {name, typeLabel, desc}
    const tapTimerRef = useRef(null);

    const speedAbs    = (heroAbils.speed    ||[]).filter(a=>a.trim());
    const combatAbs   = (heroAbils.combat   ||[]).filter(a=>a.trim());
    const modifierAbs = (heroAbils.modifier ||[]).filter(a=>a.trim());
    const passiveAbs  = (heroAbils.passive  ||[]).filter(a=>a.trim());
    const hasAny = speedAbs.length+combatAbs.length+modifierAbs.length+passiveAbs.length>0;
    if (!hasAny) return null;

    const POST_ROLL_MODIFIERS = ['charm','feint','surefooted','last laugh','deceive','trickster',
      'watchful','shadow speed','agility','boneshaker','sure grip','underhand','high five'];
    const PRE_DAMAGE_COMBAT   = ['deep wound','feral fury','overload','windwalker','piercing','fatal blow',
      'rake','backfire','bolt','ice shard','ignite','cleave','black rain','nature\'s revenge',
      'shadow fury','shield wall','thorn armour','haunt','puncture',
      // Dune/EoWF/HoF:
      'deadsilver','fireball','furious sweep','leech strike','melt armour','poison cloud',
      'scythe','skewer','thorn shield','sunstroke','shock blast','nail gun','innovation',
      'acuity','wave','arcane feast','savage call','scarab swarm','blinding rays','rend',
      'virulence','frostbite','stagger','shatter','blood hail','double punch','trample',
      'volley','flurry','swarm','slick','packmaster','monkey mob','thorn cage','primal',
      'ley line infusion','compulsion','charm offensive','sand dance',
      'shroud burst','from shadows','combustion','immolation',
      // Extra missing:
      'impale','pound','surge','lash','splinters','snakes alive','heavy blow','corrode',
      'blind strike','backstab','ensnare','hamstring','wither','demon spines','zapped',
      'snake strike'];
    const PRE_DAMAGE_DODGE    = ['sidestep','evade','vanish','spider sense','dodge','command',
      'brutality','deflect','overpower','banshee wail','parry','head butt','slam',
      'martyr','sacrifice',
      // Dune/EoWF/HoF new:
      'dark distraction','glimmer dust','gloom','misdirection','confound','veil',
      'prophecy','blink','dirge'];
    const POST_DAMAGE_MODS    = ['dominate','critical strike','gut ripper','raining blows',
      'second sight','corruption','rust','disrupt','cripple','shock','rebound',
      'retaliation','riposte','sideswipe','spore cloud','thorn fist',
      'judgement','avenging spirit','vampirism','last laugh',
      // Dune/EoWF/HoF new:
      'back draft','counter','retribution','storm shock','spectral claws','windfall',
      'punch drunk','coup de grace','headshot','last rites','finesse','cold snap','tactics',
      'reaper','doom','shunt','spirit mark','gouge','frostbite','stagger','shatter',
      'choke hold','arcane feast'];
    const ANYTIME_MODIFIERS   = ['heal','regrowth','mend','fallen hero','focus','fortitude',
      'vanquish','savagery','bright shield','iron will','might of stone','ice shield',
      'brain drain','tourniquet','cauterise','second wind','eureka','steal',
      'blood rage','meditation','dark pact',
      // Dune/EoWF new:
      'cunning','malice','mortal wound','resolve','frost burn','darksilver','frost guard',
      'fear','mind fumble','recall','torrent','sure edge','mind flay','boneshaker',
      'charged shot','fire pact','vigour mortis','life charge','blood oath','gluttony',
      'shadow well','shroud burst','trojan exploit','dark haze',
      // HoF new:
      'atonement','blood thief','bright spark','charm offensive','cruel twist',
      'faithful friend','high five','hooked','hypnotise','insight','last defence',
      'magic tap','mangle','near death','penance','purge','redemption','refresh',
      'roll with it','silver frost','spirit ward','suppress','sure grip','underhand',
      'unstoppable','wisdom','wish master','agility',
      'inner focus','savagery','malice','mortal wound',
      // Extra missing HoF/all:
      'bless','consume','heartless','war paint','water jets','adrenaline'];

    const isPhase = (p) => phase === p;
    const showSpeed    = isPhase('initiative') || isPhase('precombat');
    const showPostRoll = isPhase('post-roll');
    const showPreDmgCo = isPhase('pre-damage');
    const showPostDmgMo= isPhase('post-damage');
    const showAnytime  = !isPhase('setup') && !isPhase('ended');

    const filterAnytime  = (list) => list.filter(n => ANYTIME_MODIFIERS.some(k => n.toLowerCase().includes(k)));
    const filterPostRoll = (list) => list.filter(n => POST_ROLL_MODIFIERS.some(k => n.toLowerCase().includes(k)));
    const filterPreDmg   = (list, w) => w === 'hero'
      ? list.filter(n => PRE_DAMAGE_COMBAT.some(k => n.toLowerCase().includes(k)))
      : list.filter(n => PRE_DAMAGE_DODGE.some(k => n.toLowerCase().includes(k)));
    const filterPostDmg  = (list) => list.filter(n => POST_DAMAGE_MODS.some(k => n.toLowerCase().includes(k)));
    const getAbilDesc = (key) => {
      const heroBook = hero.bookId || 'los';
      return (ABILITY_DB.find(a=>a.name.toLowerCase()===key && a.book===heroBook)
           || ABILITY_DB.find(a=>a.name.toLowerCase()===key))?.desc || '';
    };

    const abilityButton = (name, type, color, slotIndex = 0) => {
      const key = name.toLowerCase();
      const usedRound = usedThisRound.has(key);
      // Multi-use: one use per equipped item copy (FAQ Q5 + glossary for channel/greater heal)
      // Deadly dance: exactly 2 uses per combat
      const multiUseAbils = ['charm','heal','regrowth','channel','greater heal','greater healing'];
      const isMulti = multiUseAbils.some(n => key === n);
      const isDeadlyDance = key === 'deadly dance';
      let usedCombat = usedOnce.has(key);
      if (isMulti) {
        const slotKey = `${key}_use_${slotIndex + 1}`;
        usedCombat = usedOnce.has(slotKey);
      } else if (isDeadlyDance) {
        // Show as fully used only when both uses are spent
        const usedCount = [...usedOnce].filter(k => k.startsWith('deadly dance_use_')).length;
        usedCombat = usedCount >= 2;
      } else if (key === 'bolt') {
        // Bolt is two-phase: usedOnce has 'bolt' after charge (cosmetic) and 'bolt_released' after release.
        // Only mark as fully "used ✗" after the release, not after charging.
        usedCombat = usedOnce.has('bolt_released');
      }
      const isUsed = usedRound || usedCombat;
      const typeLabel = ABILITY_TYPE_LABEL[type] || type;
      const desc = getAbilDesc(key);

      // Long-press / double-tap → show tooltip overlay (mobile)
      const onTouchStart = () => {
        tapTimerRef.current = setTimeout(() => setTapTip({name, typeLabel, desc}), 500);
      };
      const onTouchEnd = () => clearTimeout(tapTimerRef.current);
      const onDblClick = () => setTapTip({name, typeLabel, desc});

      return (
        <button key={name + type + slotIndex}
          onClick={()=>activateAbility(name, type, slotIndex)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchEnd}
          onDoubleClick={onDblClick}
          title={desc || name}
          style={{padding:'4px 10px',fontFamily:'Cinzel,serif',fontSize:10,
            letterSpacing:1,cursor:isUsed?'not-allowed':'pointer',borderRadius:1,transition:'all 0.15s',
            background:isUsed?'rgba(0,0,0,0.5)':'rgba(212,160,23,0.06)',
            border:`1px solid ${isUsed?'rgba(90,74,32,0.25)':color}`,
            color:isUsed?'rgba(139,105,20,0.35)':color,
            textDecoration:isUsed?'line-through':'none',opacity:isUsed?0.6:1}}>
          {name}{usedCombat?' ✗': key==='bolt' && cmods.boltReleaseActive?' ⚡':''}
        </button>
      );
    };

    const Section = ({label, color, items, type}) => items.length === 0 ? null : (
      <div style={{marginBottom:8}}>
        <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color,textTransform:'uppercase',marginBottom:4}}>{label}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
          {items.map((name, i) => {
            const slotIndex = items.slice(0, i).filter(n => n.toLowerCase() === name.toLowerCase()).length;
            return abilityButton(name, type, color, slotIndex);
          })}
        </div>
      </div>
    );

    return (
      <>
        {tapTip && <TapTooltipOverlay name={tapTip.name} typeLabel={tapTip.typeLabel} desc={tapTip.desc} onClose={()=>setTapTip(null)}/>}
        <div className="panel" style={{marginBottom:12}}>
        <div className="panel-header">
          {isPhase('initiative') ? '⚡ Speed Abilities — Declare Before Rolling' :
           isPhase('post-roll')  ? '🎲 Re-roll Abilities — React to the Dice' :
           isPhase('pre-damage') ? '⚔ Damage Abilities — Declare Before Rolling' :
           isPhase('post-damage')? '🩸 Post-Damage Abilities' :
           'Abilities — Click to Activate'}
        </div>
        <div className="panel-body" style={{paddingTop:10,paddingBottom:10}}>
          {showSpeed && (
            <Section label="Speed (sp) — affects this initiative roll" color="#4a9eff"
              items={speedAbs} type="sp"/>
          )}
          {showPostRoll && (
            <Section label="Re-roll / Swap (use now — after seeing dice)" color="var(--gold)"
              items={filterPostRoll([...modifierAbs,...speedAbs])} type="mo"/>
          )}
          {showPreDmgCo && winner==='hero' && (
            <Section label="Combat (co) — declare before rolling damage" color="#c0392b"
              items={filterPreDmg(combatAbs,'hero')} type="co"/>
          )}
          {showPreDmgCo && winner==='foe' && (
            <Section label="Dodge / Block (co) — declare before foe rolls" color="#c0392b"
              items={filterPreDmg(combatAbs,'foe')} type="co"/>
          )}
          {showPostDmgMo && (
            <Section label="Post-Damage (mo/co) — after seeing damage dice" color="var(--gold)"
              items={filterPostDmg([...modifierAbs,...combatAbs])} type="mo"/>
          )}
          {showAnytime && (
            <Section label="Any Time (mo) — heal, buffs, cleanses" color="var(--gold)"
              items={filterAnytime(modifierAbs)} type="mo"/>
          )}
          {passiveAbs.length>0 && (
            <div>
              <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'#6dbf6d',textTransform:'uppercase',marginBottom:4}}>Passive (pa) — auto end-of-round</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {passiveAbs.map(name=>(
                  <span key={name}
                    title={ABILITY_DB.find(a=>a.name.toLowerCase()===name.toLowerCase())?.desc||name}
                    style={{padding:'4px 10px',fontFamily:'Cinzel,serif',fontSize:10,
                      letterSpacing:1,borderRadius:1,background:'rgba(109,191,109,0.06)',
                      border:'1px solid rgba(109,191,109,0.35)',color:'#6dbf6d',cursor:'help'}}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(isPhase('precombat')||isPhase('passive'))&&(
            <>
              {combatAbs.length>0&&<Section label="Combat (co)" color="#c0392b" items={combatAbs} type="co"/>}
              {modifierAbs.length>0&&<Section label="Modifier (mo)" color="var(--gold)" items={modifierAbs} type="mo"/>}
            </>
          )}
        </div>
      </div>
      </>
    );
  };

  // ── COMPANION PANEL ────────────────────────────────────────────────────────
  const renderCompanionPanel = () => {
    if (!companion || phase==='setup' || phase==='ended') return null;
    const icon = {mastiff:'🐕', talon_wing:'🦅', minion:'🌀', virgil:'🔫'}[companion.type] || '👤';
    const hpPct = companion.maxHp > 0 ? Math.max(0, companion.hp / companion.maxHp * 100) : 0;
    return (
      <div className="panel" style={{marginBottom:8, opacity: companion.alive ? 1 : 0.55}}>
        <div className="panel-header" style={{display:'flex',alignItems:'center',gap:6}}>
          <span>{icon} {companion.name}</span>
          <span style={{marginLeft:'auto',fontFamily:'Crimson Text,serif',fontSize:11,fontStyle:'italic',
            color: companion.alive ? '#6dbf6d' : 'var(--blood-bright)'}}>
            {companion.alive ? 'In play' : 'Defeated'}
          </span>
        </div>
        <div className="panel-body" style={{paddingTop:8,paddingBottom:8}}>

          {/* HP row */}
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
            <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',
              letterSpacing:1,minWidth:18}}>HP</span>
            <div style={{flex:1,height:8,background:'rgba(0,0,0,0.4)',
              border:'1px solid rgba(90,74,32,0.3)',borderRadius:1,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${hpPct}%`,
                background:'linear-gradient(90deg,#2d6a2d,#4a9e4a)',transition:'width 0.3s'}}/>
            </div>
            <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:12,color:'#6dbf6d',
              minWidth:46,textAlign:'right'}}>{companion.hp}/{companion.maxHp}</span>
            <button onClick={()=>setCompanion(c=>c&&c.alive?{...c,hp:Math.max(0,c.hp-1)}:c)}
              style={{width:22,height:22,cursor:'pointer',background:'rgba(139,26,26,0.15)',
                border:'1px solid rgba(139,26,26,0.4)',color:'var(--blood-bright)',
                fontFamily:'Cinzel,serif',fontSize:13,lineHeight:1,borderRadius:1}}>−</button>
            <button onClick={()=>setCompanion(c=>c&&c.alive?{...c,hp:Math.min(c.maxHp,c.hp+1)}:c)}
              style={{width:22,height:22,cursor:'pointer',background:'rgba(45,106,45,0.15)',
                border:'1px solid rgba(74,158,74,0.4)',color:'#6dbf6d',
                fontFamily:'Cinzel,serif',fontSize:13,lineHeight:1,borderRadius:1}}>+</button>
          </div>

          {/* Stats row */}
          <div style={{display:'flex',gap:14,marginBottom:companion.type!=='virgil'?6:0,flexWrap:'wrap'}}>
            {companion.type !== 'virgil' && (
              <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)'}}>
                BRAWN <span style={{color:'var(--parchment-light)',fontFamily:'Cinzel Decorative,serif',fontSize:11}}>{companion.brawn}</span>
              </span>
            )}
            {companion.type === 'minion' && (<>
              <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)'}}>
                MAGIC <span style={{color:'var(--parchment-light)',fontFamily:'Cinzel Decorative,serif',fontSize:11}}>{companion.magic}</span>
              </span>
              <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)'}}>
                ARMOUR <span style={{color:'var(--parchment-light)',fontFamily:'Cinzel Decorative,serif',fontSize:11}}>{companion.armour}</span>
              </span>
            </>)}
          </div>

          {/* Stance toggle — not for Virgil */}
          {companion.type !== 'virgil' && companion.alive && (
            <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:4}}>
              <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',
                letterSpacing:1,minWidth:44}}>STANCE</span>
              {['active','passive'].map(s => (
                <button key={s} onClick={()=>setCompanion(c=>c?{...c,stance:s}:c)}
                  style={{padding:'3px 10px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                    cursor:'pointer',borderRadius:1,textTransform:'uppercase',
                    background:companion.stance===s?'rgba(212,160,23,0.15)':'rgba(0,0,0,0.2)',
                    border:`1px solid ${companion.stance===s?'var(--gold)':'rgba(90,74,32,0.35)'}`,
                    color:companion.stance===s?'var(--gold)':'var(--parchment-dark)'}}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Winged Tormenter: target picker when talon wing is passive + ability present + multi-foe */}
          {companion.type==='talon_wing' && hasWingedTormenter && companion.alive
            && companion.stance==='passive' && foes.filter(f=>f.hp>0).length > 1 && (
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
              <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',
                letterSpacing:1}}>🦅 TARGET</span>
              {foes.filter(f=>f.hp>0).map(f=>(
                <button key={f.id} onClick={()=>setWingedTormenterTarget(f.id)}
                  style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:9,cursor:'pointer',
                    borderRadius:1,
                    background:wingedTormenterTarget===f.id?'rgba(212,160,23,0.15)':'rgba(0,0,0,0.2)',
                    border:`1px solid ${wingedTormenterTarget===f.id?'var(--gold)':'rgba(90,74,32,0.35)'}`,
                    color:wingedTormenterTarget===f.id?'var(--gold)':'var(--parchment-dark)'}}>
                  {f.name||`Foe ${f.id}`}
                </button>
              ))}
            </div>
          )}

          {/* Passive reminders */}
          {hasGuardian && companion.alive && companion.type !== 'virgil' && (
            <div style={{fontFamily:'Crimson Text,serif',fontSize:11,color:'rgba(139,105,20,0.7)',
              fontStyle:'italic',marginBottom:2}}>
              ⚔ Guardian: if opponent targets {companion.name}, deal 2 dmg back (manual).
            </div>
          )}
          {hasAstralManip && companion.type==='minion' && companion.alive && companion.stance==='passive' && (
            <div style={{fontFamily:'Crimson Text,serif',fontSize:11,color:'rgba(139,105,20,0.7)',
              fontStyle:'italic',marginBottom:2}}>
              🌀 Astral Manipulator: passive-stance minion cannot be targeted by opponents.
            </div>
          )}

          {/* Defeat button */}
          {companion.alive && (
            <button onClick={handleCompanionDeath}
              style={{marginTop:4,padding:'3px 10px',fontFamily:'Cinzel,serif',fontSize:8,
                letterSpacing:1,cursor:'pointer',borderRadius:1,textTransform:'uppercase',
                background:'rgba(139,26,26,0.1)',border:'1px solid rgba(139,26,26,0.3)',
                color:'rgba(192,57,43,0.7)'}}>
              Mark Defeated
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBackpackPanel = () => {
    if (phase==='setup'||phase==='ended') return null;
    if (!hero.backpack.some(i=>i&&i.uses>0)) return null;
    const parseHealBp = (effect='') => {
      const m = effect.match(/restore\s+(\d+)\s+health/i) ||
                effect.match(/heal\s+(\d+)/i) ||
                effect.match(/\+(\d+)\s+health/i) ||
                effect.match(/(\d+)\s+health/i);
      return m ? parseInt(m[1]) : null;
    };
    const applyBpItem = (idx, item) => {
      const healAmt = parseHealBp(item.effect);
      if (healAmt) {
        const newHp = Math.min(computed.maxHealth, heroHp + healAmt);
        setHeroHp(newHp);
        onHeroHealthChange(newHp);
        addLog(`🎒 ${item.name}: +${healAmt} HP (${heroHp}→${newHp})`, 'log-heal');
      } else {
        addLog(`🎒 ${item.name} used. ${item.effect||'Apply effect manually.'}`, 'log-passive');
      }
      setHero(h => {
        const bp = [...h.backpack];
        bp[idx] = {...item, uses: item.uses - 1};
        return {...h, backpack: bp};
      });
    };
    return (
      <div className="panel" style={{marginBottom:12}}>
        <div className="panel-header">🎒 Backpack — Use Items</div>
        <div className="panel-body" style={{paddingTop:8,paddingBottom:8}}>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {hero.backpack.map((item,i) => {
              if (!item || item.uses <= 0) return null;
              const healAmt = parseHealBp(item.effect);
              return (
                <button key={i} onClick={()=>applyBpItem(i,item)}
                  style={{padding:'6px 12px',fontFamily:'Cinzel,serif',fontSize:10,
                    letterSpacing:1,cursor:'pointer',borderRadius:1,transition:'all 0.15s',
                    background:'rgba(20,50,20,0.3)',border:'1px solid rgba(40,120,40,0.4)',
                    color:'#6dbf6d',textAlign:'left'}}>
                  <div style={{fontWeight:600}}>{item.name}</div>
                  <div style={{fontSize:9,color:'rgba(109,191,109,0.7)',marginTop:1}}>
                    {healAmt ? `+${healAmt} HP` : (item.effect||'use')} · {item.uses}u left
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* Hero card */}
      <div className="combatant-card hero-card" style={{marginBottom:10}}>
        <div className="combatant-label">Your Hero</div>
        <div style={{fontFamily:'Cinzel Decorative,serif',fontSize:14,color:'var(--gold)',marginBottom:6}}>
          {hero.name}
          {seeingRedActive && (
            <span style={{marginLeft:8,fontSize:10,fontFamily:'Cinzel,serif',color:'#c0392b',
              background:'rgba(139,26,26,0.15)',border:'1px solid rgba(192,57,43,0.4)',
              padding:'1px 6px',borderRadius:1}}>SEEING RED +2 spd</span>
          )}
          {cmods.shadesActive && (
            <span style={{marginLeft:8,fontSize:10,fontFamily:'Cinzel,serif',color:'#9b59b6',
              background:'rgba(155,89,182,0.1)',border:'1px solid rgba(155,89,182,0.4)',
              padding:'1px 6px',borderRadius:1}}>SHADES ACTIVE</span>
          )}
        </div>
        <div className="combat-stat-row">
          {[
            ['speed', effectiveSpeed, cmods.speedBonus + (seeingRedActive ? 2 : 0)],
            ['brawn', (computed.brawn+cmods.brawnBonus), cmods.brawnBonus],
            ['magic', (computed.magic+cmods.magicBonus), cmods.magicBonus],
            ['armour', effectiveArmour, cmods.armourBonus],
          ].map(([s,v,bonus])=>(
            <div key={s} className="combat-stat-input">
              <label>{s}</label>
              <input type="number" readOnly value={v||0}
                style={{background:'rgba(0,0,0,0.4)',
                  borderColor:(s==='speed'&&seeingRedActive)?'rgba(192,57,43,0.6)':bonus>0?'rgba(212,160,23,0.45)':'rgba(212,160,23,0.2)'}}/>
              {bonus > 0 && <span style={{fontSize:8,color:'var(--gold)',fontFamily:'Cinzel,serif',lineHeight:1}}>+{bonus}</span>}
            </div>
          ))}
        </div>
        {/* ── Stat-choice picker — shown when an ability requires the player to choose a stat ── */}
        {pendingChoiceAction && (
          <div style={{marginTop:8,padding:'10px 12px',background:'rgba(212,160,23,0.07)',
            border:'1px solid rgba(212,160,23,0.4)',borderRadius:1}}>
            <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,
              color:'var(--gold)',textTransform:'uppercase',marginBottom:8}}>
              ⚜ {pendingChoiceAction.abilityName} — Choose:
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {pendingChoiceAction.options.map((opt, i) => (
                <button key={i}
                  onClick={() => {
                    opt.onPick();
                    setPendingChoiceAction(null);
                  }}
                  style={{padding:'6px 14px',fontFamily:'Cinzel,serif',fontSize:11,
                    letterSpacing:1,cursor:'pointer',borderRadius:1,
                    background:'rgba(212,160,23,0.12)',
                    border:'1px solid var(--gold)',color:'var(--gold-bright)',
                    transition:'all 0.15s'}}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:4}}>
          <span style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,color:'var(--parchment-dark)',textTransform:'uppercase'}}>HP</span>
          <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:16,color:'var(--blood-bright)'}}>{heroHp}/{computed.maxHealth}</span>
        </div>
        <div className="hp-bar-mini"><div className="hp-bar-mini-fill" style={{width:`${heroHpPct}%`}}/></div>
        {heroDice.length>0 && (
          <div>
            <div className="dice-row" style={{marginTop:8}}>
              {heroDice.map((d,i)=>{
                const isCharmTarget  = pendingDiceAction==='charm-reroll-hero';
                const isSwapTarget   = pendingDiceAction==='swap-pick-hero';
                const isSwapSelected = pendingDiceAction==='swap-pick-foe' && swapHeroDieIdx===i;
                const isFeintMode    = pendingDiceAction==='feint-select-hero';
                const feintSelected  = isFeintMode && feintSelection[i];
                const isHookedPick   = pendingDiceAction==='hooked-pick';
                const isHighFivePick = pendingDiceAction==='high-five-pick';
                let cls = `die ${d===6?'six':''} ${rolling?'rolling':''}`;
                let clickHandler = null;
                if (isCharmTarget) {
                  cls += ' interactive';
                  clickHandler = () => {
                    const newVal = rollD6();
                    const hasSS = usedOnce.has('shadow speed'); // player choice only
                    const finalVal = hasSS && newVal===1 ? 3 : newVal;
                    const newDice = heroDice.map((v,j)=>j===i?finalVal:v);
                    setHeroDice(newDice);
                    addLog(`Charm re-roll die ${i+1}: [${d}] → [${finalVal}]`, 'log-roll');
                    setPendingDiceAction(null);
                    // Check doubles on the new dice set (Life Spark / Dark Claw / Haunt dispel)
                    const newHp = checkDoubles(newDice, heroHp, computed.maxHealth, activeFoeId, true);
                    if (newHp !== heroHp) setHeroHp(newHp);
                    _recalcWinner(newDice, foes);
                  };
                } else if (isHookedPick) {
                  cls += ' interactive';
                  clickHandler = () => {
                    // Save this die result — it will be added to next round's speed bonus
                    setCmods(p=>({...p, speedBonus: p.speedBonus + d, hookedDieSaved: d}));
                    addLog(`Hooked: saved [${d}] — will add to speed next round.`, 'log-roll');
                    setPendingDiceAction(null);
                    // Remove the saved die from this round's dice (can't use it twice)
                    const newDice = heroDice.filter((_,j)=>j!==i);
                    setHeroDice(newDice);
                    _recalcWinner(newDice, foes);
                  };
                } else if (isHighFivePick) {
                  cls += ' interactive';
                  clickHandler = () => {
                    const newDice = heroDice.map((v,j)=>j===i?5:v);
                    setHeroDice(newDice);
                    addLog(`High Five: die ${i+1} [${d}]→[5].`, 'log-roll');
                    setPendingDiceAction(null);
                    _recalcWinner(newDice, foes);
                  };
                } else if (isSwapTarget) {
                  cls += ' interactive';
                  clickHandler = () => {
                    setSwapHeroDieIdx(i);
                    setPendingDiceAction('swap-pick-foe');
                    addLog(`Swap: your [${d}] selected — now click a foe die.`, 'log-roll');
                  };
                } else if (isSwapSelected) {
                  cls += ' selected-for-swap';
                } else if (isFeintMode) {
                  cls += feintSelected ? ' selected-for-feint' : ' deselected-for-feint interactive';
                  clickHandler = () => {
                    const next = [...feintSelection];
                    next[i] = !next[i];
                    setFeintSelection(next);
                  };
                }
                return (
                  <div key={i} className={cls}
                    onClick={clickHandler}
                    title={
                      isCharmTarget ? `Click to re-roll this [${d}]` :
                      isHookedPick  ? `Click to save [${d}] for next round` :
                      isHighFivePick? `Click to set [${d}] to [5]` :
                      isSwapTarget  ? `Click to select [${d}] for swap` :
                      isFeintMode   ? (feintSelected?`Will re-roll [${d}]`:`Click to mark [${d}] for re-roll`) : ''
                    }>
                    {d}
                  </div>
                );
              })}
              <span style={{fontFamily:'Cinzel,serif',fontSize:10,color:'var(--parchment-dark)'}}>
                +{effectiveSpeed} = <strong style={{color:'var(--gold)'}}>{heroDice.reduce((a,b)=>a+b,0)+effectiveSpeed}</strong>
              </span>
            </div>
            {/* Feint confirm row */}
            {pendingDiceAction==='feint-select-hero' && (
              <div style={{display:'flex',gap:8,marginTop:6,alignItems:'center'}}>
                <span style={{fontSize:11,color:'var(--parchment-dark)',fontStyle:'italic'}}>
                  {feintSelection.filter(Boolean).length===0 ? 'Select dice to re-roll' : `Re-rolling ${feintSelection.filter(Boolean).length} die/dice`}
                </span>
                <button style={{padding:'4px 12px',fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:1,
                  cursor:'pointer',borderRadius:1,background:'rgba(212,160,23,0.1)',
                  border:'1px solid var(--gold)',color:'var(--gold)'}}
                  onClick={()=>{
                    const hasSS = usedOnce.has('shadow speed'); // player choice only
                    const newDice = heroDice.map((d,i)=>{
                      if (!feintSelection[i]) return d;
                      const r = rollD6();
                      return hasSS && r===1 ? 3 : r;
                    });
                    const changed = heroDice.map((d,i)=>feintSelection[i]?`[${d}]→[${newDice[i]}]`:'').filter(Boolean).join(' ');
                    setHeroDice(newDice);
                    addLog(`Feint: ${changed}`, 'log-roll');
                    setPendingDiceAction(null);
                    setFeintSelection([]);
                    // Check doubles on the new dice set (Life Spark / Dark Claw / Haunt dispel)
                    const newHp = checkDoubles(newDice, heroHp, computed.maxHealth, activeFoeId);
                    if (newHp !== heroHp) setHeroHp(newHp);
                    _recalcWinner(newDice, foes);
                  }}>
                  Confirm Feint
                </button>
                <button style={{padding:'4px 8px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                  cursor:'pointer',borderRadius:1,background:'rgba(0,0,0,0.3)',
                  border:'1px solid rgba(90,74,32,0.4)',color:'var(--parchment-dark)'}}
                  onClick={()=>{setPendingDiceAction(null);setFeintSelection([]);
                    setUsedOnce(prev=>{const s=new Set(prev);s.delete('feint');return s;});}}>
                  Cancel
                </button>
              </div>
            )}
            {/* Action hint bar */}
            {pendingDiceAction && pendingDiceAction!=='feint-select-hero' && (pendingDiceAction==='charm-reroll-hero'||pendingDiceAction==='swap-pick-hero'||pendingDiceAction==='swap-pick-foe'||pendingDiceAction==='hooked-pick'||pendingDiceAction==='high-five-pick') && (
              <div style={{marginTop:4,fontSize:11,color:'var(--gold)',fontStyle:'italic',display:'flex',alignItems:'center',gap:8}}>
                {pendingDiceAction==='charm-reroll-hero' && '👆 Click a die above to re-roll it'}
                {pendingDiceAction==='hooked-pick'       && '👆 Click a die to save its value for next round'}
                {pendingDiceAction==='high-five-pick'    && '👆 Click any die to change it to [5]'}
                {pendingDiceAction==='swap-pick-hero'    && '👆 Click one of your dice to select it for swapping'}
                {pendingDiceAction==='swap-pick-foe'     && `✓ Your [${heroDice[swapHeroDieIdx]}] selected — now click a foe die below`}
                <button style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                  cursor:'pointer',borderRadius:1,background:'rgba(0,0,0,0.3)',
                  border:'1px solid rgba(90,74,32,0.4)',color:'var(--parchment-dark)'}}
                  onClick={()=>{
                    setPendingDiceAction(null);setSwapHeroDieIdx(null);
                    if(pendingDiceAction==='charm-reroll-hero') setUsedOnce(prev=>{const s=new Set(prev);s.delete('charm');return s;});
                    if(pendingDiceAction==='hooked-pick') setUsedOnce(prev=>{const s=new Set(prev);s.delete('hooked');return s;});
                    if(pendingDiceAction==='high-five-pick') setUsedOnce(prev=>{const s=new Set(prev);s.delete('high five');return s;});
                    if(pendingDiceAction.includes('swap')){setUsedOnce(prev=>{const s=new Set(prev);s.delete('deceive');s.delete('trickster');return s;});}
                  }}>Cancel</button>
              </div>
            )}
          </div>
        )}
        {/* Passive toggles — area passives (apply to all foes every round regardless of hit) */}
        <div style={{marginTop:8}}>
          <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--parchment-dark)',
            textTransform:'uppercase',marginRight:6}}
            title="Area passives that tick every round against ALL foes. Tap to toggle.">
            Area Passives:
          </span>
          {[
            ['thorns','thorns'],['fire_aura','fire aura'],['barbs','barbs'],['vitriol','vitriol'],
          ].map(([key,label])=>(
            <span key={key} className={`passive-tag ${heroPassives[key]?'active':'inactive'}`}
              title="Tap to toggle — these tick against every foe every round."
              onClick={()=>setHeroPassives(p=>({...p,[key]:!p[key]}))}>
              {label}
            </span>
          ))}
        </div>
        {/* Per-foe DoT status — venom/bleed/disease track individually per foe */}
        {foes.filter(f=>f.hp>0).length > 0 && (
          <div style={{marginTop:4,display:'flex',flexWrap:'wrap',gap:4,alignItems:'center'}}>
            <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--parchment-dark)',
              textTransform:'uppercase',marginRight:2}}>
              DoTs on foes:
            </span>
            {foes.filter(f=>f.hp>0).map(f=>{
              const dots = f.heroDoTs || {};
              const active = [dots.venom&&`venom(${venomDmg})`, dots.bleed&&'bleed', dots.disease&&'disease'].filter(Boolean);
              return (
                <span key={f.id} style={{fontSize:10,fontFamily:'Crimson Text,serif',
                  color: active.length>0 ? 'var(--gold)' : 'rgba(139,105,20,0.35)',
                  fontStyle: active.length===0 ? 'italic' : 'normal'}}>
                  {f.name||`Foe ${f.id}`}: {active.length>0 ? active.join(', ') : 'none'}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Foe cards */}
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:10}}>
        {foes.map((foe,idx)=>{
          const foeHpPct=Math.max(0,Math.min(100,(foe.hp/(parseInt(foe.maxHealth)||1))*100));
          const isActive=foe.id===activeFoeId;
          const isDead=foe.hp<=0;
          const effArmour=Math.max(0,(parseInt(foe.armour)||0)-(foe.armourPenalty||0));
          const effSpeed=Math.max(0,(parseInt(foe.speed)||0)-(foe.speedPenalty||0));
          return (
            <div key={foe.id} className="combatant-card foe-card"
              style={{opacity:isDead?.45:1,
                border:isActive&&phase!=='setup'&&phase!=='ended'?'1px solid rgba(192,57,43,0.7)':undefined}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <div className="combatant-label" style={{margin:0}}>
                  {foes.length>1?`Foe ${idx+1}`:'Opponent'}
                  {isDead&&<span style={{marginLeft:6,color:'rgba(139,26,26,0.6)',fontSize:9}}>✗ DEFEATED</span>}
                </div>
                {phase!=='setup'&&!isDead&&foes.length>1&&(
                  <button onClick={()=>setActiveFoeId(foe.id)}
                    style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1,
                      cursor:'pointer',borderRadius:1,
                      background:isActive?'rgba(192,57,43,0.15)':'rgba(0,0,0,0.3)',
                      border:`1px solid ${isActive?'rgba(192,57,43,0.5)':'rgba(90,74,32,0.3)'}`,
                      color:isActive?'var(--blood-bright)':'var(--parchment-dark)'}}>
                    {isActive?'TARGET ▶':'Set Target'}
                  </button>
                )}
                {phase==='setup'&&foes.length>1&&(
                  <button onClick={()=>removeFoe(foe.id)}
                    style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:8,cursor:'pointer',
                      borderRadius:1,background:'rgba(139,26,26,0.1)',border:'1px solid rgba(139,26,26,0.3)',
                      color:'var(--blood-bright)',marginLeft:'auto'}}>Remove</button>
                )}
              </div>

              <input className="foe-input" placeholder="Opponent name…"
                value={foe.name} onChange={e=>updateFoe(foe.id,'name',e.target.value)}
                disabled={phase!=='setup'} style={{fontSize:14,fontFamily:'Crimson Text,serif'}}/>
              <div className="combat-stat-row">
                {['speed','brawn','magic','armour'].map(s=>(
                  <div key={s} className="combat-stat-input">
                    <label>{s}{phase!=='setup'&&(s==='speed'&&foe.speedPenalty>0?` -${foe.speedPenalty}`:s==='armour'&&foe.armourPenalty>0?` -${foe.armourPenalty}`:'')}</label>
                    <input type="number" min={0} value={phase==='setup'?foe[s]||0:(s==='speed'?effSpeed:s==='armour'?effArmour:foe[s]||0)}
                      onChange={e=>updateFoe(foe.id,s,e.target.value)}
                      disabled={phase!=='setup'}
                      style={{borderColor:phase!=='setup'&&((s==='speed'&&foe.speedPenalty>0)||(s==='armour'&&foe.armourPenalty>0))?'rgba(192,57,43,0.5)':undefined}}/>
                  </div>
                ))}
              </div>
              <div className="combat-stat-row" style={{marginTop:4}}>
                <div className="combat-stat-input">
                  <label>HP</label>
                  <input type="number" min={0}
                    value={phase==='setup'?foe.health:foe.hp}
                    onChange={e=>{
                      if(phase==='setup'){updateFoe(foe.id,'health',e.target.value);updateFoe(foe.id,'maxHealth',e.target.value);}
                      else setFoes(fs=>fs.map(f=>f.id===foe.id?{...f,hp:Math.max(0,parseInt(e.target.value)||0)}:f));
                    }}/>
                </div>
                <div className="combat-stat-input">
                  <label>Max HP</label>
                  <input type="number" min={1} value={foe.maxHealth||20}
                    onChange={e=>updateFoe(foe.id,'maxHealth',e.target.value)}
                    disabled={phase!=='setup'}/>
                </div>
              </div>
              <div className="hp-bar-mini" style={{marginTop:4}}>
                <div className="hp-bar-mini-fill" style={{width:`${foeHpPct}%`}}/>
              </div>
              {foe.dice?.length>0&&phase!=='setup'&&(
                <div>
                  <div className="dice-row" style={{marginTop:6}}>
                    {foe.dice.map((d,i)=>{
                      const isWatchful = pendingDiceAction==='watchful-pick-foe' && foe.id===activeFoeId && d===6;
                      const isSwapFoe  = pendingDiceAction==='swap-pick-foe' && foe.id===activeFoeId;
                      let cls = `die ${d===6?'six':''}`;
                      let clickHandler = null;
                      if (isWatchful) {
                        cls += ' interactive-foe';
                        clickHandler = () => {
                          const newFoeDice = foe.dice.map((v,j)=>j===i?1:v);
                          setFoes(fs=>fs.map(f=>f.id===foe.id?{...f,dice:newFoeDice}:f));
                          addLog(`Watchful: foe die ${i+1} [6] → [1]`, 'log-roll');
                          setPendingDiceAction(null);
                          _recalcWinner(heroDice, foes.map(f=>f.id===foe.id?{...f,dice:newFoeDice}:f));
                        };
                      } else if (isSwapFoe) {
                        cls += ' interactive-foe';
                        clickHandler = () => {
                          const heroVal = heroDice[swapHeroDieIdx];
                          const foeVal  = d;
                          const newHeroDice = heroDice.map((v,j)=>j===swapHeroDieIdx?foeVal:v);
                          const newFoeDice  = foe.dice.map((v,j)=>j===i?heroVal:v);
                          setHeroDice(newHeroDice);
                          setFoes(fs=>fs.map(f=>f.id===foe.id?{...f,dice:newFoeDice}:f));
                          addLog(`Deceive/Trickster: swapped your [${heroVal}] ↔ foe [${foeVal}]`, 'log-roll');
                          setPendingDiceAction(null);
                          setSwapHeroDieIdx(null);
                          _recalcWinner(newHeroDice, foes.map(f=>f.id===foe.id?{...f,dice:newFoeDice}:f));
                        };
                      }
                      return (
                        <div key={i} className={cls}
                          style={{width:28,height:28,fontSize:13}}
                          onClick={clickHandler}
                          title={isWatchful?`Click to turn this [6] → [1]`:isSwapFoe?`Click to swap this [${d}] with your [${heroDice[swapHeroDieIdx]}]`:''}>
                          {d}
                        </div>
                      );
                    })}
                    <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)'}}>
                      +{effSpeed} = <strong style={{color:'var(--blood-bright)'}}>{foe.dice.reduce((a,b)=>a+b,0)+effSpeed}</strong>
                    </span>
                  </div>
                  {/* Hint for active swap on this foe */}
                  {pendingDiceAction==='swap-pick-foe'&&foe.id===activeFoeId&&(
                    <div style={{fontSize:10,color:'#c0392b',fontStyle:'italic',marginTop:2}}>
                      👆 Click a foe die to swap with your [{heroDice[swapHeroDieIdx]}]
                    </div>
                  )}
                  {pendingDiceAction==='watchful-pick-foe'&&foe.id===activeFoeId&&(
                    <div style={{fontSize:10,color:'#c0392b',fontStyle:'italic',marginTop:2}}>
                      👆 Click a [6] to turn it to [1]
                    </div>
                  )}
                </div>
              )}
              {/* Foe abilities — setup: autocomplete input; combat: phase-contextual reminder */}
              {phase==='setup' ? (
                <FoeAbilityInput foe={foe} onAdd={ab=>{
                  setFoes(fs=>fs.map(f=>f.id===foe.id
                    ? {...f, abilities:[...(f.abilities||[]), ab]}
                    : f));
                }} onRemove={idx=>{
                  setFoes(fs=>fs.map(f=>f.id===foe.id
                    ? {...f, abilities:(f.abilities||[]).filter((_,i)=>i!==idx)}
                    : f));
                }}/>
              ) : (foe.abilities||[]).length > 0 && (
                <FoeAbilityDisplay
                  abilities={foe.abilities}
                  usedAbilities={foe.usedAbilities||[]}
                  phase={phase}
                  onToggleUsed={(idx) => toggleFoeAbilityUsed(foe.id, idx)}
                />
              )}

              {/* Foe passive toggles */}
              <div style={{marginTop:6}}>
                <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--parchment-dark)',
                  textTransform:'uppercase',marginRight:4}}
                  title="Tick passives this foe inflicts on you">
                  This foe's passives on you ↓
                </span>
                {['bleed','venom','disease','thorns','fire_aura'].map(p=>(
                  <span key={p} className={`passive-tag ${foe.passives[p]?'active':'inactive'}`}
                    onClick={()=>updateFoePassive(foe.id,p)}>
                    {p.replace('_',' ')}
                  </span>
                ))}
              </div>
              {/* Foe damage type toggle */}
              <div style={{marginTop:6,display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--parchment-dark)',textTransform:'uppercase'}}>Dmg via:</span>
                {[{val:false,label:'Brawn',col:'var(--gold)'},{val:true,label:'Magic',col:'#4a9eff'}].map(({val,label,col})=>(
                  <button key={label} onClick={()=>updateFoe(foe.id,'usesMagic',val)} disabled={phase!=='setup'}
                    style={{padding:'2px 6px',fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:1,
                      background:foe.usesMagic===val?'rgba(212,160,23,0.1)':'rgba(0,0,0,0.3)',
                      border:`1px solid ${foe.usesMagic===val?col:'rgba(90,74,32,0.4)'}`,
                      color:foe.usesMagic===val?col:'var(--parchment-dark)',
                      cursor:'pointer',borderRadius:1}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {phase==='setup'&&foes.length<4&&(
          <button onClick={addFoe}
            style={{padding:'8px',fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:2,
              textTransform:'uppercase',cursor:'pointer',borderRadius:1,
              background:'rgba(0,0,0,0.2)',border:'1px dashed rgba(90,74,32,0.4)',
              color:'var(--parchment-dark)',width:'100%'}}>
            + Add Opponent (max 4)
          </button>
        )}
      </div>

      {/* Round counter */}
      {round>0&&phase!=='setup'&&(
        <div style={{textAlign:'center',fontFamily:'Cinzel,serif',fontSize:11,letterSpacing:3,
          color:'var(--parchment-dark)',textTransform:'uppercase',marginBottom:8}}>
          Round {round}
        </div>
      )}

      {/* ── DICE COUNT CONTROLS ── */}
      {phase!=='setup'&&phase!=='ended'&&(
        <div className="panel" style={{marginBottom:8}}>
          <div className="panel-header" style={{cursor:'default'}}>
            Dice Adjustments
            <span style={{float:'right',fontSize:9,color:'rgba(139,105,20,0.4)',fontStyle:'italic',fontFamily:'Crimson Text,serif',letterSpacing:0}}>
              + / − to override die counts
            </span>
          </div>
          <div className="panel-body" style={{paddingTop:8,paddingBottom:8}}>

            {/* ── Section label: Hero ── */}
            <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--gold)',
              textTransform:'uppercase',marginBottom:5}}>Your Dice</div>

            {/* Hero initiative dice */}
            {(()=>{
              const base = 2 + cmods.extraSpeedDice;
              const total = Math.max(1, base + heroInitDiceDelta);
              const changed = heroInitDiceDelta !== 0;
              return (
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                  <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'#4a9eff',flex:1}}>Initiative</span>
                  <button onClick={()=>setHeroInitDiceDelta(d=>d-1)}
                    style={{width:24,height:24,fontFamily:'Cinzel,serif',fontSize:13,cursor:'pointer',
                      background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.4)',
                      color:'var(--parchment-dark)',borderRadius:1,lineHeight:1}}>−</button>
                  <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:15,
                    color:changed?'#4a9eff':'var(--parchment-dark)',minWidth:28,textAlign:'center'}}>
                    {total}d6
                  </span>
                  <button onClick={()=>setHeroInitDiceDelta(d=>d+1)}
                    style={{width:24,height:24,fontFamily:'Cinzel,serif',fontSize:13,cursor:'pointer',
                      background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.4)',
                      color:'var(--parchment-dark)',borderRadius:1,lineHeight:1}}>+</button>
                  {changed&&(
                    <button onClick={()=>setHeroInitDiceDelta(0)}
                      style={{padding:'1px 6px',fontFamily:'Cinzel,serif',fontSize:8,cursor:'pointer',
                        background:'rgba(139,26,26,0.1)',border:'1px solid rgba(139,26,26,0.3)',
                        color:'var(--blood-bright)',borderRadius:1}}>↺</button>
                  )}
                </div>
              );
            })()}

            {/* Hero damage dice */}
            {(()=>{
              const base = 1 + cmods.extraDamageDice;
              const total = Math.max(1, base + heroDamageDiceDelta);
              const changed = heroDamageDiceDelta !== 0;
              return (
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'#c0392b',flex:1}}>Damage</span>
                  <button onClick={()=>setHeroDamageDiceDelta(d=>d-1)}
                    style={{width:24,height:24,fontFamily:'Cinzel,serif',fontSize:13,cursor:'pointer',
                      background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.4)',
                      color:'var(--parchment-dark)',borderRadius:1,lineHeight:1}}>−</button>
                  <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:15,
                    color:changed?'#c0392b':'var(--parchment-dark)',minWidth:28,textAlign:'center'}}>
                    {total}d6
                  </span>
                  <button onClick={()=>setHeroDamageDiceDelta(d=>d+1)}
                    style={{width:24,height:24,fontFamily:'Cinzel,serif',fontSize:13,cursor:'pointer',
                      background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.4)',
                      color:'var(--parchment-dark)',borderRadius:1,lineHeight:1}}>+</button>
                  {changed&&(
                    <button onClick={()=>setHeroDamageDiceDelta(0)}
                      style={{padding:'1px 6px',fontFamily:'Cinzel,serif',fontSize:8,cursor:'pointer',
                        background:'rgba(139,26,26,0.1)',border:'1px solid rgba(139,26,26,0.3)',
                        color:'var(--blood-bright)',borderRadius:1}}>↺</button>
                  )}
                </div>
              );
            })()}

            {/* ── Section label: Foes ── */}
            {liveFoes().length > 0 && (
              <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,color:'var(--blood-bright)',
                textTransform:'uppercase',marginBottom:5}}>Opponent Dice</div>
            )}

            {/* Per-foe initiative + damage dice */}
            {liveFoes().map(f => {
              const initDelta  = foeDiceOverride[f.id] || 0;
              const dmgDelta   = foeDamageDiceOverride[f.id] || 0;
              const baseInit   = Math.max(1, 2 - cmods.foeDiceReduction - (f.speedPenalty||0));
              const totalInit  = Math.max(1, baseInit + initDelta);
              const totalDmg   = Math.max(1, 1 + dmgDelta);
              const initChanged = initDelta !== 0;
              const dmgChanged  = dmgDelta  !== 0;
              const foeName     = f.name || `Foe ${f.id}`;
              const btnSt = {width:24,height:24,fontFamily:'Cinzel,serif',fontSize:13,cursor:'pointer',
                background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.4)',
                color:'var(--parchment-dark)',borderRadius:1,lineHeight:1};
              const rstSt = {padding:'1px 6px',fontFamily:'Cinzel,serif',fontSize:8,cursor:'pointer',
                background:'rgba(139,26,26,0.1)',border:'1px solid rgba(139,26,26,0.3)',
                color:'var(--blood-bright)',borderRadius:1};
              return (
                <div key={f.id} style={{marginBottom:6,paddingBottom:6,
                  borderBottom:'1px solid rgba(90,74,32,0.15)'}}>
                  <div style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--blood-bright)',
                    marginBottom:4,letterSpacing:1}}>{foeName}</div>
                  {/* Initiative row */}
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                    <span style={{fontSize:9,color:'#4a9eff',fontFamily:'Cinzel,serif',flex:1}}>Initiative</span>
                    <button onClick={()=>setFoeDiceOverride(p=>({...p,[f.id]:(p[f.id]||0)-1}))} style={btnSt}>−</button>
                    <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:15,
                      color:initChanged?'#4a9eff':'var(--parchment-dark)',minWidth:28,textAlign:'center'}}>
                      {totalInit}d6
                    </span>
                    <button onClick={()=>setFoeDiceOverride(p=>({...p,[f.id]:(p[f.id]||0)+1}))} style={btnSt}>+</button>
                    {initChanged&&<button onClick={()=>setFoeDiceOverride(p=>({...p,[f.id]:0}))} style={rstSt}>↺</button>}
                  </div>
                  {/* Damage row */}
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:9,color:'#c0392b',fontFamily:'Cinzel,serif',flex:1}}>Damage</span>
                    <button onClick={()=>setFoeDamageDiceOverride(p=>({...p,[f.id]:(p[f.id]||0)-1}))} style={btnSt}>−</button>
                    <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:15,
                      color:dmgChanged?'#c0392b':'var(--parchment-dark)',minWidth:28,textAlign:'center'}}>
                      {totalDmg}d6
                    </span>
                    <button onClick={()=>setFoeDamageDiceOverride(p=>({...p,[f.id]:(p[f.id]||0)+1}))} style={btnSt}>+</button>
                    {dmgChanged&&<button onClick={()=>setFoeDamageDiceOverride(p=>({...p,[f.id]:0}))} style={rstSt}>↺</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ROUND TRACKER (inline, collapsible) ── */}
      {phase!=='setup'&&phase!=='ended'&&(
        <CombatRoundTracker
          hero={hero}
          showRoundTracker={showRoundTracker}
          setShowRoundTracker={setShowRoundTracker}
          rtUsedThisRound={rtUsedThisRound}
          setRtUsedThisRound={setRtUsedThisRound}
          rtUsedThisCombat={rtUsedThisCombat}
          setRtUsedThisCombat={setRtUsedThisCombat}
        />
      )}

      {/* ── Ability panel ── */}
      {phase!=='setup'&&phase!=='ended'&&<AbilityPanel />}

      {/* Phase controls */}
      <div className="panel" style={{marginBottom:12}}>
        <div className="panel-body" style={{paddingTop:12}}>

          {phase==='setup'&&(
            <>
              {/* ── Companion selector ── */}
              <div style={{marginBottom:10}}>
                <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,
                  color:'var(--parchment-dark)',textTransform:'uppercase',marginBottom:5}}>
                  Companion
                </div>
                <select value={companionSetup}
                  onChange={e=>{
                    const v = e.target.value;
                    setCompanionSetup(v);
                    const DEFAULTS = {
                      mastiff:    {hp:15, brawn:3, magic:0, armour:2},
                      talon_wing: {hp:10, brawn:2, magic:0, armour:1},
                      minion:     {hp:10, brawn:0, magic:3, armour:3},
                      virgil:     {hp:20, brawn:0, magic:0, armour:0},
                    };
                    if (v !== 'none') setCompanionBaseStats(DEFAULTS[v]);
                  }}
                  style={{width:'100%',background:'rgba(0,0,0,0.35)',
                    border:'1px solid var(--slot-border)',color:'var(--parchment-light)',
                    padding:'6px 10px',fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:1,
                    borderRadius:1,cursor:'pointer',marginBottom:4}}>
                  <option value="none">None</option>
                  <option value="mastiff">🐕 Mastiff (Dune Sea)</option>
                  <option value="talon_wing">🦅 Talon Wing (Dune Sea)</option>
                  <option value="minion">🌀 Minion (Dune Sea — Summoner)</option>
                  <option value="virgil">🔫 Virgil (Halls of the Forge)</option>
                </select>
                {companionSetup !== 'none' && (
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:4}}>
                    {[
                      {k:'hp',    label:'HP',     show: true},
                      {k:'brawn', label:'Brawn',  show: companionSetup !== 'virgil'},
                      {k:'magic', label:'Magic',  show: companionSetup === 'minion'},
                      {k:'armour',label:'Armour', show: companionSetup === 'minion'},
                    ].filter(f=>f.show).map(({k,label})=>(
                      <div key={k} style={{display:'flex',flexDirection:'column',
                        alignItems:'center',gap:2}}>
                        <span style={{fontFamily:'Cinzel,serif',fontSize:8,
                          color:'var(--parchment-dark)',letterSpacing:1}}>{label}</span>
                        <input type="number" min={0} value={companionBaseStats[k]}
                          onChange={e=>setCompanionBaseStats(p=>({...p,[k]:parseInt(e.target.value)||0}))}
                          style={{width:46,textAlign:'center',background:'rgba(0,0,0,0.3)',
                            border:'1px solid var(--slot-border)',color:'var(--parchment-light)',
                            padding:'4px 0',fontFamily:'Cinzel Decorative,serif',fontSize:12,
                            borderRadius:1,outline:'none'}}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn-roll" style={{width:'100%'}}
                onClick={startCombat} disabled={!foes.some(f=>f.name.trim())}>
                Begin Combat
              </button>
            </>
          )}

          {phase==='precombat'&&(
            <>
              <div className="combat-phase-header">Pre-Combat — {hasFirstStrike?'First Strike':hasBullsEye?"Bull's Eye":hasSnakeStrike?'Snake Strike':'First Cut'}</div>
              {foes.length>1&&(
                <div style={{marginBottom:8}}>
                  <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',letterSpacing:1,marginRight:6}}>TARGET:</span>
                  {foes.map(f=>(
                    <button key={f.id} onClick={()=>setPreTarget(f.id)}
                      style={{padding:'3px 8px',fontFamily:'Cinzel,serif',fontSize:9,cursor:'pointer',
                        borderRadius:1,marginRight:4,
                        background:preTarget===f.id?'rgba(192,57,43,0.15)':'rgba(0,0,0,0.3)',
                        border:`1px solid ${preTarget===f.id?'rgba(192,57,43,0.5)':'rgba(90,74,32,0.3)'}`,
                        color:preTarget===f.id?'var(--blood-bright)':'var(--parchment-dark)'}}>
                      {f.name||`Foe ${f.id}`}
                    </button>
                  ))}
                </div>
              )}
              {!preRollDone?(
                <button className="btn-roll" style={{width:'100%'}} onClick={rollPreCombat} disabled={rolling}>
                  {rolling?'Rolling…':hasFirstCut?'Apply First Cut (1 dmg)':'Roll Pre-Combat Die'}
                </button>
              ):(
                <>
                  {preDice.length>0&&(
                    <div className="dice-row" style={{marginBottom:8}}>
                      {preDice.map((d,i)=>(
                        <div key={i} className={`die ${d===6?'six':''}`} style={{width:40,height:40,fontSize:18}}>{d}</div>
                      ))}
                    </div>
                  )}
                  <button className="btn-roll" style={{width:'100%'}} onClick={()=>setPhase('initiative')}>
                    Proceed to Round 1
                  </button>
                </>
              )}
            </>
          )}

          {phase==='initiative'&&(
            <>
              <div className="combat-phase-header">Phase 1a — Declare Speed Abilities</div>
              <div style={{fontSize:12,color:'var(--parchment-dark)',fontStyle:'italic',marginBottom:10}}>
                Use Speed abilities (Haste, Courage, Webbed, etc.) <strong style={{color:'var(--gold)'}}>before</strong> rolling. They apply to this roll.
              </div>
              <button className="btn-roll" style={{width:'100%'}} onClick={rollInitiative} disabled={rolling}>
                {rolling?'Rolling…':'Roll Initiative →'}
              </button>
            </>
          )}

          {phase==='post-roll'&&(
            <>
              <div className="combat-phase-header">Phase 1b — React to the Roll</div>
              {/* Show provisional winner */}
              {winner && (
                <div className={`combat-result-banner ${winner==='hero'?'result-hero':winner==='foe'?'result-foe':'result-tie'}`}
                  style={{marginBottom:8}}>
                  {winner==='hero' ? `${hero.name} wins the roll — re-roll if desired, then confirm`
                  : winner==='foe' ? `${activeFoe?.name||'Foe'} wins the roll — use Charm/Last Laugh to change it`
                  : 'Stand-off — re-roll or confirm'}
                </div>
              )}
              <div style={{fontSize:12,color:'var(--parchment-dark)',fontStyle:'italic',marginBottom:8}}>
                Use <strong style={{color:'var(--gold)'}}>Charm / Feint / Surefooted</strong> to re-roll your dice. <strong style={{color:'#4a9eff'}}>Last Laugh</strong> to re-roll foe dice. <strong style={{color:'var(--gold)'}}>Watchful / Deceive</strong> to swap dice. When done, confirm.
              </div>
              <button className="btn-roll" style={{width:'100%'}} onClick={confirmRoll}>
                Confirm Roll → Resolve Winner
              </button>
            </>
          )}

          {phase==='pre-damage'&&winner&&(
            <>
              <div className="combat-phase-header">
                Phase 2a — Declare Damage Abilities
              </div>
              {winner==='tie'?(
                <div className="combat-result-banner result-tie">Stand-off — no damage this round</div>
              ):(
                <div className={`combat-result-banner ${winner==='hero'?'result-hero':'result-foe'}`}>
                  {winner==='hero'
                    ?`${hero.name} won — declare abilities before rolling damage`
                    :`${activeFoe?.name} won — use dodge/block abilities before foe rolls`}
                </div>
              )}
              <div style={{fontSize:12,color:'var(--parchment-dark)',fontStyle:'italic',margin:'8px 0'}}>
                {winner==='hero'
                  ? 'Declare: Deep Wound, Windwalker, Piercing, Critical Strike, Dark Pact, etc.'
                  : 'Declare: Sidestep, Evade, Vanish, Dodge, Martyr, Second Sight, etc.'}
              </div>
              {winner==='hero'&&liveFoes().length>1&&(
                <div style={{marginBottom:8}}>
                  <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',letterSpacing:1,marginRight:6}}>DAMAGE TARGET:</span>
                  {liveFoes().map(f=>(
                    <button key={f.id} onClick={()=>setActiveFoeId(f.id)}
                      style={{padding:'3px 8px',fontFamily:'Cinzel,serif',fontSize:9,cursor:'pointer',
                        borderRadius:1,marginRight:4,
                        background:activeFoeId===f.id?'rgba(192,57,43,0.15)':'rgba(0,0,0,0.3)',
                        border:`1px solid ${activeFoeId===f.id?'rgba(192,57,43,0.5)':'rgba(90,74,32,0.3)'}`,
                        color:activeFoeId===f.id?'var(--blood-bright)':'var(--parchment-dark)'}}>
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
              {winner==='tie'?(
                <button className="btn-roll" style={{width:'100%',marginTop:8}} onClick={applyPassives}>
                  Apply Passives &amp; Next Round
                </button>
              ):(
                <div style={{display:'flex',gap:8,marginTop:8}}>
                  <button className="btn-roll" disabled={rolling||winner!=='hero'}
                    onClick={()=>rollDamage('hero')}>
                    {winner==='hero'?'Roll Your Damage →':'(Foe rolls)'}
                  </button>
                  <button className="btn-roll-blood" disabled={rolling||winner!=='foe'}
                    onClick={()=>rollDamage('foe')}>
                    {winner==='foe'?'Roll Foe Damage →':'(You roll)'}
                  </button>
                </div>
              )}
            </>
          )}

          {phase==='post-damage'&&(
            <>
              <div className="combat-phase-header">Phase 2b — Apply or React to Damage</div>
              {damageDice.length>0&&roundDamage!==null&&(
                <>
                  <div className="dice-row" style={{marginBottom:4}}>
                    {damageDice.map((d,i)=>{
                      const isDomTarget    = pendingDiceAction==='dominate-pick-damage' && d<6;
                      const isFinesseTarget= pendingDiceAction==='finesse-reroll-damage';
                      const isHighFiveDmg  = pendingDiceAction==='high-five-dmg-pick';
                      const cls = `die ${d===6?'six':''} ${isDomTarget||isFinesseTarget||isHighFiveDmg?'interactive-damage':''}`;
                      return (
                        <div key={i} className={cls}
                          style={{width:46,height:46,fontSize:20}}
                          onClick={(isDomTarget||isFinesseTarget||isHighFiveDmg) ? ()=>{
                            let newDmgDice;
                            let logMsg;
                            if (isDomTarget) {
                              newDmgDice = damageDice.map((v,j)=>j===i?6:v);
                              logMsg = `Dominate: die ${i+1} [${d}]→[6]`;
                            } else if (isFinesseTarget) {
                              const r = rollD6(); const final = r+2;
                              newDmgDice = damageDice.map((v,j)=>j===i?final:v);
                              logMsg = `Finesse/Cold Snap: die ${i+1} [${d}]→[${r}]+2=[${final}]`;
                            } else {
                              newDmgDice = damageDice.map((v,j)=>j===i?5:v);
                              logMsg = `High Five: die ${i+1} [${d}]→[5]`;
                            }
                            const heroPath = hero.heroPath||hero.path;
                            const isMage = heroPath==='mage';
                            const dmgAttr = isMage?(computed.magic+cmods.magicBonus+(cmods.heroStatAdj?.magic||0)):(computed.brawn+cmods.brawnBonus+(cmods.heroStatAdj?.brawn||0));
                            const foeObj  = foes.find(f=>f.id===activeFoeId)||liveFoes()[0];
                            const foeArmour = calcFoeArmour(foeObj);
                            const diceSum = newDmgDice.reduce((a,b)=>a+b,0);
                            const hasMerc = hasAbil(allPassives,'merciless');
                            const foeHasDoT = foeObj&&(foeObj.passives?.bleed||foeObj.passives?.venom||foeObj.passives?.disease||foeObj.heroDoTs?.bleed||foeObj.heroDoTs?.venom||foeObj.heroDoTs?.disease);
                            const mercilessBonus = hasMerc&&foeHasDoT ? newDmgDice.length : 0;
                            const rawScore = diceSum+dmgAttr+cmods.damageBonus+mercilessBonus;
                            const newDmgDealt = Math.max(0, rawScore-foeArmour);
                            setDamageDice(newDmgDice);
                            setRoundDamage(newDmgDealt);
                            addLog(`${logMsg} — new damage: ${newDmgDealt}`, 'log-roll');
                            setPendingDiceAction(null);
                          } : undefined}
                          title={isDomTarget?`Click to set [${d}] to [6]`:isFinesseTarget?`Click to re-roll [${d}] +2`:isHighFiveDmg?`Click to set [${d}] to [5]`:''}>
                          {d}
                        </div>
                      );
                    })}
                    <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:20,
                      color:damageWinner==='hero'?'var(--blood-bright)':'#cc6666'}}>
                      = {roundDamage} dmg
                    </span>
                  </div>
                  {pendingDiceAction==='dominate-pick-damage' && (
                    <div style={{fontSize:11,color:'var(--gold)',fontStyle:'italic',marginBottom:6,display:'flex',gap:8,alignItems:'center'}}>
                      👆 Click any die below [6] to set it to [6]
                      <button style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                        cursor:'pointer',borderRadius:1,background:'rgba(0,0,0,0.3)',
                        border:'1px solid rgba(90,74,32,0.4)',color:'var(--parchment-dark)'}}
                        onClick={()=>{setPendingDiceAction(null);
                          setUsedOnce(prev=>{const s=new Set(prev);s.delete('dominate');return s;});
                        }}>Cancel</button>
                    </div>
                  )}
                  {pendingDiceAction==='finesse-reroll-damage' && (
                    <div style={{fontSize:11,color:'var(--gold)',fontStyle:'italic',marginBottom:6,display:'flex',gap:8,alignItems:'center'}}>
                      👆 Click any damage die to re-roll it (+2 to result)
                      <button style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                        cursor:'pointer',borderRadius:1,background:'rgba(0,0,0,0.3)',
                        border:'1px solid rgba(90,74,32,0.4)',color:'var(--parchment-dark)'}}
                        onClick={()=>{setPendingDiceAction(null);
                          ['finesse','cold snap','tactics'].forEach(k=>setUsedOnce(prev=>{const s=new Set(prev);s.delete(k);return s;}));
                        }}>Cancel</button>
                    </div>
                  )}
                  {pendingDiceAction==='high-five-dmg-pick' && (
                    <div style={{fontSize:11,color:'var(--gold)',fontStyle:'italic',marginBottom:6,display:'flex',gap:8,alignItems:'center'}}>
                      👆 Click any damage die to change it to [5]
                      <button style={{padding:'2px 8px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                        cursor:'pointer',borderRadius:1,background:'rgba(0,0,0,0.3)',
                        border:'1px solid rgba(90,74,32,0.4)',color:'var(--parchment-dark)'}}
                        onClick={()=>{setPendingDiceAction(null);
                          setUsedOnce(prev=>{const s=new Set(prev);s.delete('high five');return s;});
                        }}>Cancel</button>
                    </div>
                  )}
                  <div style={{fontSize:12,color:'var(--parchment-dark)',fontStyle:'italic',marginBottom:8}}>
                    {damageWinner==='hero'
                      ? 'Use Dominate, Raining Blows, Corruption, Rust, Shock!, etc.'
                      : 'Use Retaliation, Riposte, Sideswipe, Spore Cloud, Judgement, etc.'}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn-roll" onClick={applyDamage} disabled={rolling||!!pendingDiceAction}>Apply Damage →</button>
                    <button className="btn-gold" style={{flex:1}} onClick={skipDamage} disabled={!!pendingDiceAction}>Avoid / Negate</button>
                  </div>
                </>
              )}
            </>
          )}

          {phase==='passive'&&(
            <>
              <div className="combat-phase-header">Phase 3 — Passive Effects</div>
              <div style={{fontSize:13,color:'var(--parchment-dark)',marginBottom:10,fontStyle:'italic'}}>
                Passives apply to all live foes/hero. Toggle active passives on cards above.
                {(hasDeadlyPoisons||hasPoisonMastery)&&<span style={{color:'var(--gold)'}}> Venom deals {venomDmg} dmg.</span>}
              </div>
              <button className="btn-roll" style={{width:'100%'}} onClick={applyPassives}>
                Apply Passives &amp; Start Round {round+1}
              </button>
            </>
          )}

          {phase==='ended'&&(
            <div style={{display:'flex',gap:8}}>
              <button className="btn-roll" style={{flex:1}} onClick={startCombat}>Rematch</button>
              <button className="btn-gold" style={{flex:1}} onClick={()=>{setFoes([blankFoe(1)]);setPhase('setup');setLog([]);}}>New Opponent</button>
            </div>
          )}

          {/* ── Combat toolbar: Rewind, Force-end-round, Manual edit ── */}
          {phase!=='setup'&&phase!=='ended'&&(
            <div style={{display:'flex',gap:6,marginTop:10,paddingTop:10,borderTop:'1px solid rgba(90,74,32,0.2)'}}>
              <button onClick={rewindPhase} disabled={!phaseSnapshot}
                title="Undo last phase — rewind to before the last roll or confirmation"
                style={{flex:1,padding:'6px 4px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                  cursor:phaseSnapshot?'pointer':'not-allowed',borderRadius:1,
                  background:phaseSnapshot?'rgba(74,158,255,0.08)':'rgba(0,0,0,0.2)',
                  border:`1px solid ${phaseSnapshot?'rgba(74,158,255,0.4)':'rgba(90,74,32,0.25)'}`,
                  color:phaseSnapshot?'#4a9eff':'rgba(90,74,32,0.4)',textTransform:'uppercase'}}>
                ↩ Rewind
              </button>
              <button onClick={()=>{
                  addLog('⏭ Round skipped (force-end).','log-passive');
                  setPhase('passive');
                }}
                title="Skip to end-of-round passives without resolving damage"
                style={{flex:1,padding:'6px 4px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                  cursor:'pointer',borderRadius:1,
                  background:'rgba(212,160,23,0.06)',border:'1px solid rgba(90,74,32,0.35)',
                  color:'var(--parchment-dark)',textTransform:'uppercase'}}>
                ⏭ Skip
              </button>
              <button onClick={()=>setShowManualEdit(m=>!m)}
                title="Manually edit HP, dice, foe stats mid-combat"
                style={{flex:1,padding:'6px 4px',fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:1,
                  cursor:'pointer',borderRadius:1,
                  background:showManualEdit?'rgba(212,160,23,0.15)':'rgba(212,160,23,0.06)',
                  border:`1px solid ${showManualEdit?'var(--gold)':'rgba(90,74,32,0.35)'}`,
                  color:'var(--gold)',textTransform:'uppercase'}}>
                ✎ Edit
              </button>
            </div>
          )}

          {/* ── Manual Edit overlay ── */}
          {showManualEdit&&phase!=='setup'&&phase!=='ended'&&(
            <div style={{marginTop:10,padding:'12px',background:'rgba(0,0,0,0.35)',
              border:'1px solid rgba(212,160,23,0.25)',borderRadius:1}}>
              <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,color:'var(--gold)',
                textTransform:'uppercase',marginBottom:10}}>Manual Override</div>

              {/* ── Hero stats ── */}
              <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,
                color:'var(--gold)',textTransform:'uppercase',marginBottom:6}}>{hero.name}</div>

              {/* Hero HP */}
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',
                  minWidth:52,letterSpacing:1}}>HP</span>
                <input type="number" min={0} max={computed.maxHealth} value={heroHp}
                  onChange={e=>{const v=Math.max(0,Math.min(computed.maxHealth,parseInt(e.target.value)||0));setHeroHp(v);onHeroHealthChange(v);}}
                  style={{width:60,background:'rgba(0,0,0,0.4)',border:'1px solid var(--slot-border)',
                    color:'var(--blood-bright)',padding:'4px 6px',fontFamily:'Cinzel,serif',
                    fontSize:13,outline:'none',borderRadius:1,textAlign:'center'}}/>
                <span style={{fontSize:11,color:'rgba(139,105,20,0.5)'}}>/ {computed.maxHealth}</span>
              </div>

              {/* Hero stat ± buttons */}
              {[
                {k:'brawn',  label:'Brawn',  base:computed.brawn,  color:'#c0392b'},
                {k:'magic',  label:'Magic',  base:computed.magic,  color:'#4a9eff'},
                {k:'speed',  label:'Speed',  base:computed.speed,  color:'var(--gold)'},
                {k:'armour', label:'Armour', base:computed.armour, color:'#6dbf6d'},
              ].map(({k,label,base,color})=>{
                const adj=cmods.heroStatAdj?.[k]||0;
                return (
                  <div key={k} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                    <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',minWidth:52,letterSpacing:1}}>{label}</span>
                    <button onClick={()=>setCmods(p=>({...p,heroStatAdj:{...(p.heroStatAdj||{}), [k]:(p.heroStatAdj?.[k]||0)-1}}))}
                      style={{width:22,height:22,cursor:'pointer',background:'rgba(139,26,26,0.15)',border:'1px solid rgba(139,26,26,0.4)',color:'var(--blood-bright)',fontFamily:'Cinzel,serif',fontSize:13,lineHeight:1,borderRadius:1}}>−</button>
                    <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:13,minWidth:28,textAlign:'center',color:adj!==0?color:'var(--parchment-dark)'}}>
                      {base+adj}
                    </span>
                    <button onClick={()=>setCmods(p=>({...p,heroStatAdj:{...(p.heroStatAdj||{}), [k]:(p.heroStatAdj?.[k]||0)+1}}))}
                      style={{width:22,height:22,cursor:'pointer',background:'rgba(45,106,45,0.15)',border:'1px solid rgba(74,158,74,0.4)',color:'#6dbf6d',fontFamily:'Cinzel,serif',fontSize:13,lineHeight:1,borderRadius:1}}>+</button>
                    {adj!==0&&(<span style={{fontFamily:'Crimson Text,serif',fontSize:11,color:adj>0?'#6dbf6d':'var(--blood-bright)',fontStyle:'italic'}}>{adj>0?`+${adj}`:adj}</span>)}
                    {adj!==0&&(<button onClick={()=>setCmods(p=>({...p,heroStatAdj:{...(p.heroStatAdj||{}),[k]:0}}))}
                      style={{padding:'1px 5px',fontFamily:'Cinzel,serif',fontSize:8,cursor:'pointer',background:'rgba(0,0,0,0.2)',border:'1px solid rgba(90,74,32,0.3)',color:'var(--parchment-dark)',borderRadius:1}}>↺</button>)}
                  </div>
                );
              })}

              {/* ── Foe stats ── */}
              {foes.map(f=>(
                <div key={f.id} style={{marginTop:10,paddingTop:8,borderTop:'1px solid rgba(90,74,32,0.2)'}}>
                  <div style={{fontFamily:'Cinzel,serif',fontSize:8,letterSpacing:2,
                    color:'var(--blood-bright)',textTransform:'uppercase',marginBottom:6}}>
                    {f.name||'Foe'}
                  </div>
                  {/* Foe HP */}
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                    <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',minWidth:52,letterSpacing:1}}>HP</span>
                    <input type="number" min={0} max={f.maxHealth} value={f.hp}
                      onChange={e=>{const v=Math.max(0,Math.min(parseInt(f.maxHealth)||999,parseInt(e.target.value)||0));setFoes(fs=>fs.map(x=>x.id===f.id?{...x,hp:v}:x));}}
                      style={{width:60,background:'rgba(0,0,0,0.4)',border:'1px solid var(--slot-border)',
                        color:'var(--blood-bright)',padding:'4px 6px',fontFamily:'Cinzel,serif',
                        fontSize:13,outline:'none',borderRadius:1,textAlign:'center'}}/>
                    <span style={{fontSize:11,color:'rgba(139,105,20,0.5)'}}>/ {f.maxHealth}</span>
                  </div>
                  {/* Foe stat adjustments — negative penalty = bonus above base */}
                  {[
                    {k:'speedPenalty',  label:'Speed',  base:parseInt(f.speed)||0,  color:'var(--gold)'},
                    {k:'brawnPenalty',  label:'Brawn',  base:parseInt(f.brawn)||0,  color:'#c0392b'},
                    {k:'magicPenalty',  label:'Magic',  base:parseInt(f.magic)||0,  color:'#4a9eff'},
                    {k:'armourPenalty', label:'Armour', base:parseInt(f.armour)||0, color:'#6dbf6d'},
                  ].map(({k,label,base,color})=>{
                    const pen=f[k]||0;
                    const effective=Math.max(0,base-pen);
                    return (
                      <div key={k} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                        <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',minWidth:52,letterSpacing:1}}>{label}</span>
                        <button onClick={()=>setFoes(fs=>fs.map(x=>x.id===f.id?{...x,[k]:(x[k]||0)-1}:x))}
                          style={{width:22,height:22,cursor:'pointer',background:'rgba(45,106,45,0.15)',border:'1px solid rgba(74,158,74,0.4)',color:'#6dbf6d',fontFamily:'Cinzel,serif',fontSize:13,lineHeight:1,borderRadius:1}}>+</button>
                        <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:13,minWidth:28,textAlign:'center',
                          color:pen!==0?color:'var(--parchment-dark)'}}>
                          {effective}
                        </span>
                        <button onClick={()=>setFoes(fs=>fs.map(x=>x.id===f.id?{...x,[k]:(x[k]||0)+1}:x))}
                          style={{width:22,height:22,cursor:'pointer',background:'rgba(139,26,26,0.15)',border:'1px solid rgba(139,26,26,0.4)',color:'var(--blood-bright)',fontFamily:'Cinzel,serif',fontSize:13,lineHeight:1,borderRadius:1}}>−</button>
                        {pen!==0&&(<span style={{fontFamily:'Crimson Text,serif',fontSize:11,fontStyle:'italic',
                          color:pen>0?'var(--blood-bright)':'#6dbf6d'}}>
                          {pen>0?`−${pen}`:`+${Math.abs(pen)}`}
                        </span>)}
                        {pen!==0&&(<button onClick={()=>setFoes(fs=>fs.map(x=>x.id===f.id?{...x,[k]:0}:x))}
                          style={{padding:'1px 5px',fontFamily:'Cinzel,serif',fontSize:8,cursor:'pointer',background:'rgba(0,0,0,0.2)',border:'1px solid rgba(90,74,32,0.3)',color:'var(--parchment-dark)',borderRadius:1}}>↺</button>)}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Hero dice */}
              {heroDice.length>0&&(
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8,
                  flexWrap:'wrap',marginTop:10,paddingTop:8,borderTop:'1px solid rgba(90,74,32,0.2)'}}>
                  <span style={{fontFamily:'Cinzel,serif',fontSize:9,color:'var(--parchment-dark)',
                    textTransform:'uppercase',letterSpacing:1,marginRight:4}}>Your dice:</span>
                  {heroDice.map((d,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:3}}>
                      <input type="number" min={1} max={6} value={d}
                        onChange={e=>{const v=Math.max(1,Math.min(6,parseInt(e.target.value)||1));const nd=[...heroDice];nd[i]=v;setHeroDice(nd);_recalcWinner(nd,foes);}}
                        style={{width:42,background:'rgba(0,0,0,0.5)',border:'1px solid var(--slot-border)',
                          color:'var(--parchment-light)',padding:'3px',fontFamily:'Cinzel Decorative,serif',
                          fontSize:13,outline:'none',borderRadius:1,textAlign:'center'}}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Backpack items — usable any time during combat ── */}
      {renderCompanionPanel()}
      {renderBackpackPanel()}

      {/* Combat log */}
      {log.length>0&&(
        <div className="panel">
          <div className="panel-header">Combat Log</div>
          <div className="combat-log">
            {log.map((e,i)=>(
              <div key={i} className={`log-entry ${e.type}`}>{e.text}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Challenge Test ───────────────────────────────────────────────────────────
function ChallengeTest({ hero }) {
  const computed = computeStats(hero.baseAttributes, hero.equipment);
  const [attr, setAttr]       = useState('speed');
  const [target, setTarget]   = useState(9);
  const [numDice, setNumDice] = useState(2);
  const [dice, setDice]       = useState([]);
  const [total, setTotal]     = useState(null);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const d = Array.from({length: numDice}, rollD6);
      const diceSum = d.reduce((a,b)=>a+b,0);
      const t = diceSum + (computed[attr]||0);
      setDice(d);
      setTotal(t);
      setRolling(false);
    }, 350);
  };

  const resetResult = () => { setDice([]); setTotal(null); };
  const success = total !== null && total >= target;
  const diceSum = dice.reduce((a,b)=>a+b,0);
  const diceLabel = `${numDice}d6`;

  return (
    <div className="challenge-panel">
      <div className="panel">
        <div className="panel-header">Challenge Test — {diceLabel} + Attribute ≥ Target</div>
        <div className="panel-body">
          <div style={{fontSize:12,color:'var(--parchment-dark)',fontStyle:'italic',marginBottom:16}}>
            The book sets a challenge number. Roll dice, add your attribute. Meet or beat it to succeed.
          </div>

          {/* Dice count selector */}
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:3,color:'var(--parchment-dark)',
              textTransform:'uppercase',marginBottom:8}}>Number of Dice</div>
            <div style={{display:'flex',gap:6}}>
              {[1,2,3].map(n=>(
                <button key={n} onClick={()=>{setNumDice(n);resetResult();}}
                  style={{flex:1,padding:'10px 4px',
                    fontFamily:'Cinzel Decorative,serif',fontSize:15,
                    background:numDice===n?'rgba(212,160,23,0.12)':'rgba(0,0,0,0.3)',
                    border:`1px solid ${numDice===n?'var(--gold)':'rgba(90,74,32,0.4)'}`,
                    color:numDice===n?'var(--gold-bright)':'var(--parchment-dark)',
                    cursor:'pointer',borderRadius:1,transition:'all 0.2s'}}>
                  {n}d6
                </button>
              ))}
            </div>
          </div>

          {/* Attribute selector */}
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:3,color:'var(--parchment-dark)',
              textTransform:'uppercase',marginBottom:8}}>Attribute</div>
            <div style={{display:'flex',gap:6}}>
              {['speed','brawn','magic'].map(a=>(
                <button key={a} onClick={()=>{setAttr(a);resetResult();}}
                  style={{flex:1,padding:'8px 4px',
                    fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:1,textTransform:'uppercase',
                    background:attr===a?'rgba(212,160,23,0.1)':'rgba(0,0,0,0.3)',
                    border:`1px solid ${attr===a?'var(--gold)':'rgba(90,74,32,0.4)'}`,
                    color:attr===a?'var(--gold)':'var(--parchment-dark)',
                    cursor:'pointer',borderRadius:1,transition:'all 0.2s'}}>
                  {a}<br/>
                  <span style={{fontFamily:'Cinzel Decorative,serif',fontSize:14,
                    color:attr===a?'var(--gold-bright)':'var(--parchment-light)'}}>
                    {computed[a]||0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target number */}
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:3,color:'var(--parchment-dark)',
              textTransform:'uppercase',marginBottom:8}}>Challenge Target Number</div>
            <input type="number" min={1} max={40}
              value={target} onChange={e=>{setTarget(parseInt(e.target.value)||1);resetResult();}}
              style={{width:80,background:'rgba(0,0,0,0.5)',border:'1px solid var(--slot-border)',
                color:'var(--gold-bright)',fontFamily:'Cinzel Decorative,serif',fontSize:28,
                textAlign:'center',padding:'6px',outline:'none',borderRadius:1}}/>
          </div>

          {/* Roll button */}
          <button className="btn-roll" style={{width:'100%',marginBottom:16}} onClick={roll} disabled={rolling}>
            {rolling ? 'Rolling…' : `Roll ${diceLabel} + ${attr} (need ≥ ${target})`}
          </button>

          {/* Dice result */}
          {dice.length > 0 && (
            <>
              <div className="dice-row" style={{justifyContent:'center',marginBottom:8,flexWrap:'wrap'}}>
                {dice.map((d,i)=>(
                  <div key={i} className={`die ${d===6?'six':''}`} style={{width:48,height:48,fontSize:22}}>{d}</div>
                ))}
                <span style={{fontFamily:'Cinzel,serif',fontSize:14,color:'var(--parchment-dark)',alignSelf:'center',marginLeft:4}}>
                  + {computed[attr]||0} {attr}
                </span>
              </div>

              <div className="challenge-result-num"
                style={{color:success?'#6dbf6d':'var(--blood-bright)'}}>
                {total}
              </div>
              <div className="challenge-vs">vs target {target}</div>

              <div className={`combat-result-banner ${success?'result-victory':'result-defeat'}`}
                style={{fontSize:16,padding:'14px'}}>
                {success ? '✓ Success!' : '✗ Failure'}
              </div>

              <div style={{marginTop:12,fontSize:12,color:'var(--parchment-dark)',textAlign:'center',fontStyle:'italic'}}>
                {dice.join('+')} = {diceSum}, +{computed[attr]||0} {attr} = {total}
                {success ? ` ≥ ${target} ✓` : ` < ${target} ✗`}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Save migration ───────────────────────────────────────────────────────────
// Called on every hero load (slot or import). Fills in any fields that were added
// in later versions so old saves never cause null-reference crashes downstream.
// Rule: only ADD missing fields — never overwrite existing data.
function migrateSave(h) {
  if (!h || typeof h !== 'object') return null;
  // Must-have top-level fields
  if (!h.name || typeof h.name !== 'string') return null;
  if (!h.baseAttributes || typeof h.baseAttributes !== 'object') return null;

  const out = { ...h };

  // Identifiers
  if (!out.id)     out.id     = crypto.randomUUID();
  if (!out.bookId) out.bookId = 'los';
  if (!out.path && !out.heroPath) out.path = 'warrior';

  // baseAttributes — fill any missing numeric fields with 0 (health defaults to 30)
  const ba = { speed:0, brawn:0, magic:0, armour:0, health:30, maxHealth:30, ...out.baseAttributes };
  if (!ba.maxHealth) ba.maxHealth = ba.health || 30;
  out.baseAttributes = ba;

  // Equipment slots — null-fill any missing slot
  const EQ_SLOTS = ['head','chest','cloak','gloves','mainHand','leftHand','feet','talisman','necklace','ring1','ring2'];
  out.equipment = { ...Object.fromEntries(EQ_SLOTS.map(s=>[s,null])), ...(out.equipment||{}) };

  // Backpack — always exactly 5 slots
  const bp = Array.isArray(out.backpack) ? out.backpack : [];
  out.backpack = Array.from({length:5}, (_,i) => bp[i] ?? null);

  // Special abilities — all four categories must exist as arrays
  const sa = out.specialAbilities || {};
  out.specialAbilities = {
    speed:    Array.isArray(sa.speed)    ? sa.speed    : [],
    combat:   Array.isArray(sa.combat)   ? sa.combat   : [],
    modifier: Array.isArray(sa.modifier) ? sa.modifier : [],
    passive:  Array.isArray(sa.passive)  ? sa.passive  : [],
  };

  // Scalar fields
  if (typeof out.gold !== 'number')  out.gold  = 0;
  if (typeof out.notes !== 'string') out.notes = '';
  if (!out.career) out.career = null;

  // Quest tracking
  if (!Array.isArray(out.customQuests))           out.customQuests   = [];
  if (!out.completedQuests || typeof out.completedQuests !== 'object') out.completedQuests = {};

  // Progress block
  out.progress = {
    act: 1, currentQuest: null, defeatedEnemies: [], unlockedCareers: [], completedQuests: [],
    ...(out.progress || {}),
  };

  // Timestamps
  if (!out.createdAt)    out.createdAt    = Date.now();
  if (!out.lastModified) out.lastModified = Date.now();

  return out;
}

// ─── localStorage save store ──────────────────────────────────────────────────
const SAVE_SLOTS = 3;
const LS_KEY = 'dq_save_slots_v1';

function readSlotsFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return Array(SAVE_SLOTS).fill(null);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : Array(SAVE_SLOTS).fill(null);
  } catch { return Array(SAVE_SLOTS).fill(null); }
}

function writeSlotsToStorage(slots) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(slots)); } catch { /* storage full or unavailable */ }
}

function SaveManager({ currentHero, onLoad, onClose }) {
  const [slots, setSlots] = useState(() => readSlotsFromStorage());
  const [confirm, setConfirm] = useState(null);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const saveToSlot = (i) => {
    if (!currentHero) return;
    const h = { ...currentHero, lastModified: Date.now() };
    const updated = [...slots];
    updated[i] = h;
    writeSlotsToStorage(updated);
    setSlots(updated);
    setConfirm(null);
  };

  const loadFromSlot = (i) => {
    if (!slots[i]) return;
    const migrated = migrateSave(slots[i]);
    if (!migrated) return; // corrupt slot — silently skip
    onLoad(migrated);
    onClose();
  };

  const deleteSlot = (i) => {
    const updated = [...slots];
    updated[i] = null;
    writeSlotsToStorage(updated);
    setSlots(updated);
    setConfirm(null);
  };

  // Export current hero as a downloadable JSON file
  const exportHero = () => {
    if (!currentHero) return;
    const json = JSON.stringify({ ...currentHero, lastModified: Date.now() }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentHero.name.replace(/\s+/g,'_')}_DQ.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg('Exported! Save the .json file somewhere safe.');
    setTimeout(() => setExportMsg(''), 4000);
  };

  // Import hero from pasted JSON
  const importHero = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(importText.trim());
      const migrated = migrateSave(parsed);
      if (!migrated) throw new Error('Missing required fields (name or baseAttributes)');
      onLoad(migrated);
      onClose();
    } catch (e) {
      setImportError('Invalid hero data. Paste the full contents of an exported .json file.');
    }
  };

  const fmt = (ts) => ts ? new Date(ts).toLocaleString(undefined, {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '';

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-panel" style={{maxWidth:420}}>
        <div className="modal-header">
          <span className="modal-title">— Save / Load —</span>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          {/* Persistence notice */}
          <div style={{marginBottom:14,padding:'8px 12px',background:'rgba(212,160,23,0.05)',
            border:'1px solid rgba(212,160,23,0.2)',borderRadius:1}}>
            <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,color:'var(--gold)',
              textTransform:'uppercase',marginBottom:3}}>Saved to Your Browser</div>
            <div style={{fontSize:12,color:'var(--parchment-dark)',lineHeight:1.6}}>
              Slots persist across page refreshes. Use <strong style={{color:'var(--gold)'}}>Export</strong> to back up your hero as a file or transfer between devices.
            </div>
          </div>

          {confirm && (
            <div style={{background:'rgba(139,26,26,0.15)',border:'1px solid rgba(139,26,26,0.4)',padding:'12px 16px',marginBottom:12,borderRadius:1}}>
              <div style={{fontFamily:'Cinzel,serif',fontSize:12,color:'var(--blood-bright)',marginBottom:8}}>
                {confirm.action==='overwrite' ? 'Overwrite this save?' : confirm.action==='delete' ? 'Delete this save?' : 'Load and discard current progress?'}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn-create" style={{flex:1,padding:'8px'}} onClick={() => {
                  if (confirm.action==='overwrite') saveToSlot(confirm.slot);
                  else if (confirm.action==='delete') deleteSlot(confirm.slot);
                  else loadFromSlot(confirm.slot);
                }}>Confirm</button>
                <button className="btn-unequip" style={{flex:1,margin:0}} onClick={() => setConfirm(null)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Save slots */}
          {Array.from({length:SAVE_SLOTS},(_,i) => (
            <div key={i} style={{background:'rgba(0,0,0,0.3)',border:'1px solid rgba(90,74,32,0.3)',padding:'12px 14px',marginBottom:8,borderRadius:1}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:slots[i]?6:0}}>
                <span style={{fontFamily:'Cinzel,serif',fontSize:11,color:'var(--parchment-dark)',letterSpacing:2}}>SLOT {i+1}</span>
                {slots[i] && <span style={{fontSize:10,color:'rgba(139,105,20,0.6)'}}>{fmt(slots[i].lastModified)}</span>}
              </div>
              {slots[i] ? (
                <>
                  <div style={{fontFamily:'Cinzel Decorative,serif',fontSize:14,color:'var(--gold)',marginBottom:2}}>{slots[i].name}</div>
                  <div style={{fontSize:12,color:'var(--parchment-dark)',marginBottom:10}}>
                    {CLASS_INFO[slots[i].path||slots[i].heroPath]?.label} · Act {slots[i].progress?.act||1} · {slots[i].gold||0}gc · HP {slots[i].baseAttributes?.health}/{slots[i].baseAttributes?.maxHealth}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn-gold" style={{flex:2}} onClick={() => currentHero ? setConfirm({action:'load',slot:i}) : loadFromSlot(i)}>Load</button>
                    <button className="btn-gold" style={{flex:2}} onClick={() => slots[i] ? setConfirm({action:'overwrite',slot:i}) : saveToSlot(i)} disabled={!currentHero}>Save</button>
                    <button className="btn-unequip" style={{flex:1,margin:0,padding:'6px'}} onClick={() => setConfirm({action:'delete',slot:i})}>✕</button>
                  </div>
                </>
              ) : (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:12,color:'rgba(139,105,20,0.35)',fontStyle:'italic'}}>Empty slot</span>
                  <button className="btn-gold" onClick={() => saveToSlot(i)} disabled={!currentHero}>Save here</button>
                </div>
              )}
            </div>
          ))}

          {/* Export / Import */}
          <div style={{borderTop:'1px solid rgba(90,74,32,0.3)',marginTop:14,paddingTop:14}}>
            <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:3,color:'var(--parchment-dark)',
              textTransform:'uppercase',marginBottom:10}}>Persistent Export / Import</div>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <button className="btn-gold" style={{flex:1}} onClick={exportHero} disabled={!currentHero}>
                ↓ Export Hero (.json)
              </button>
              <button className="btn-gold" style={{flex:1}}
                onClick={() => { setShowImport(v => !v); setImportError(''); }}>
                ↑ Import Hero
              </button>
            </div>
            {exportMsg && (
              <div style={{fontSize:12,color:'#6dbf6d',fontStyle:'italic',marginBottom:8}}>{exportMsg}</div>
            )}
            {showImport && (
              <div style={{marginTop:4}}>
                <textarea
                  value={importText}
                  onChange={e => { setImportText(e.target.value); setImportError(''); }}
                  placeholder='Paste the contents of your exported .json file here…'
                  rows={5}
                  style={{width:'100%',background:'rgba(0,0,0,0.5)',border:`1px solid ${importError?'var(--blood-bright)':'var(--slot-border)'}`,
                    color:'var(--parchment-light)',padding:'8px 12px',fontFamily:'Crimson Text,serif',
                    fontSize:13,outline:'none',borderRadius:1,resize:'vertical',marginBottom:6}}/>
                {importError && (
                  <div style={{fontSize:12,color:'var(--blood-bright)',marginBottom:6}}>{importError}</div>
                )}
                <button className="btn-gold" style={{width:'100%'}} onClick={importHero}
                  disabled={!importText.trim()}>
                  Load from JSON
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
// ─── Quests Tab ───────────────────────────────────────────────────────────────
function QuestsTab({ hero, setHero }) {
  const bookId = hero.bookId || 'los';
  const book = BOOKS.find(b=>b.id===bookId) || BOOKS[0];
  const completed = hero.completedQuests || {};
  const customQuests = hero.customQuests || [];

  // Modal state for adding a custom quest
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuestName, setNewQuestName] = useState('');
  const [newQuestAct, setNewQuestAct] = useState(1);

  const addCustomQuest = () => {
    const name = newQuestName.trim();
    if (!name) return;
    const id = `custom_${crypto.randomUUID()}`;
    const updated = [...customQuests, { id, name, actNum: newQuestAct }];
    setHero(h => ({...h, customQuests: updated}));
    setNewQuestName('');
    setShowAddQuest(false);
  };

  const removeCustomQuest = (id) => {
    setHero(h => ({...h, customQuests: (h.customQuests||[]).filter(q=>q.id!==id)}));
  };

  const mergedActs = book.acts.map((act, ai) => {
    const actNum = ai + 1;
    const extras = customQuests.filter(q => q.actNum === actNum);
    return { ...act, quests: [...act.quests, ...extras] };
  });

  const totalQuests = mergedActs.reduce((s,a)=>s+a.quests.length,0);
  const bookQuestIds = new Set(mergedActs.flatMap(a => a.quests.map(q => q.id)));
  const doneCount = Object.entries(completed).filter(([id,v]) => v && bookQuestIds.has(id)).length;

  const toggleQuest = (qid) => {
    setHero(h=>({...h, completedQuests:{...(h.completedQuests||{}), [qid]:!(h.completedQuests||{})[qid]}}));
  };

  const btnSt = (active) => ({
    padding:'4px 12px', fontFamily:'Cinzel,serif', fontSize:11, letterSpacing:1,
    cursor:'pointer', borderRadius:1, transition:'all 0.15s',
    background: active ? 'rgba(212,160,23,0.15)' : 'rgba(0,0,0,0.3)',
    border: `1px solid ${active ? 'var(--gold)' : 'rgba(90,74,32,0.3)'}`,
    color: active ? 'var(--gold)' : 'var(--parchment-dark)',
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>

      {/* Book header + progress */}
      <div className="panel">
        <div className="panel-body" style={{paddingTop:12,paddingBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div>
              <div style={{fontFamily:'Cinzel Decorative,serif',fontSize:14,color:'var(--gold)'}}>{book.title}</div>
              <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:3,color:'var(--parchment-dark)',textTransform:'uppercase',marginTop:2}}>{book.subtitle}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:'Cinzel Decorative,serif',fontSize:20,color:'var(--gold-bright)'}}>{doneCount}/{totalQuests}</div>
              <div style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,color:'var(--parchment-dark)',textTransform:'uppercase'}}>Completed</div>
            </div>
          </div>
          <div style={{height:6,background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.3)',borderRadius:1,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${totalQuests>0?(doneCount/totalQuests)*100:0}%`,
              background:'linear-gradient(90deg,var(--parchment-dark),var(--gold))',transition:'width 0.4s ease'}}/>
          </div>
        </div>
      </div>


      {/* Acts + quests */}
      {mergedActs.map((act, ai) => {
        const actCompleted = act.quests.filter(q=>completed[q.id]).length;
        return (
          <div key={ai} className="panel">
            <div className="panel-header" style={{display:'flex',justifyContent:'space-between'}}>
              <span>{act.label}</span>
              <span style={{color: actCompleted===act.quests.length && act.quests.length>0 ? '#6dbf6d' : 'var(--gold)'}}>
                {actCompleted}/{act.quests.length}
              </span>
            </div>
            <div style={{padding:'8px 12px',display:'flex',flexDirection:'column',gap:4}}>
              {act.quests.map(q => {
                const done = !!completed[q.id];
                const isCustom = !!q.actNum; // custom quests have actNum field
                return (
                  <div key={q.id} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',
                    cursor:'pointer',borderRadius:1,transition:'all 0.15s',
                    background:done?'rgba(212,160,23,0.07)':'rgba(0,0,0,0.2)',
                    border:`1px solid ${done?'rgba(212,160,23,0.3)':isCustom?'rgba(100,150,255,0.2)':'rgba(90,74,32,0.2)'}`,
                  }}>
                    <div onClick={()=>toggleQuest(q.id)} style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                      <div style={{width:18,height:18,flexShrink:0,borderRadius:1,
                        background:done?'var(--gold)':'rgba(0,0,0,0.4)',
                        border:`1px solid ${done?'var(--gold-bright)':'rgba(90,74,32,0.5)'}`,
                        display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                        {done && <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                          <polyline points="2,6 5,9 10,3" stroke="#1a1008" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>}
                      </div>
                      <span style={{flex:1,fontFamily:'Cinzel,serif',fontSize:12,
                        color:done?'rgba(139,105,20,0.6)':'var(--parchment-light)',
                        textDecoration:done?'line-through':'none',transition:'all 0.15s'}}>
                        {q.name}
                      </span>
                      {isCustom && !done && (
                        <span style={{fontSize:9,fontFamily:'Cinzel,serif',letterSpacing:1,
                          color:'rgba(100,150,255,0.6)',textTransform:'uppercase',flexShrink:0}}>custom</span>
                      )}
                    </div>
                    {isCustom && (
                      <button onClick={()=>removeCustomQuest(q.id)}
                        style={{padding:'2px 6px',fontFamily:'Cinzel,serif',fontSize:9,cursor:'pointer',
                          borderRadius:1,background:'rgba(139,26,26,0.15)',border:'1px solid rgba(139,26,26,0.3)',
                          color:'var(--blood-bright)',flexShrink:0}}>✕</button>
                    )}
                  </div>
                );
              })}
              {act.quests.length === 0 && (
                <div style={{fontSize:12,color:'rgba(139,105,20,0.35)',fontStyle:'italic',padding:'8px 4px'}}>
                  No quests yet — use the button below to add custom quests.
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Custom Quest button + inline modal */}
      <div className="panel">
        <div className="panel-body" style={{paddingTop:10,paddingBottom:10}}>
          {!showAddQuest ? (
            <button onClick={()=>setShowAddQuest(true)}
              style={{width:'100%',padding:'10px',fontFamily:'Cinzel,serif',fontSize:11,letterSpacing:2,
                textTransform:'uppercase',cursor:'pointer',borderRadius:1,
                background:'rgba(212,160,23,0.06)',border:'1px dashed rgba(212,160,23,0.4)',
                color:'var(--gold)'}}>
              + Add Custom Quest
            </button>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:2,color:'var(--gold)',
                textTransform:'uppercase'}}>New Custom Quest</div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <select value={newQuestAct} onChange={e=>setNewQuestAct(parseInt(e.target.value))}
                  style={{background:'rgba(0,0,0,0.4)',border:'1px solid var(--slot-border)',
                    color:'var(--parchment-light)',padding:'8px 10px',fontFamily:'Cinzel,serif',
                    fontSize:11,outline:'none',borderRadius:1,flexShrink:0}}>
                  {book.acts.map((_,i)=>(
                    <option key={i+1} value={i+1}>Act {i+1}</option>
                  ))}
                </select>
                <input autoFocus value={newQuestName}
                  onChange={e=>setNewQuestName(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&addCustomQuest()}
                  placeholder="Quest name…"
                  style={{flex:1,background:'rgba(0,0,0,0.4)',border:'1px solid var(--slot-border)',
                    color:'var(--parchment-light)',padding:'8px 12px',fontFamily:'Crimson Text,serif',
                    fontSize:15,outline:'none',borderRadius:1}}/>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={addCustomQuest} disabled={!newQuestName.trim()}
                  style={{flex:2,padding:'8px',fontFamily:'Cinzel,serif',fontSize:11,letterSpacing:1,
                    cursor:newQuestName.trim()?'pointer':'not-allowed',borderRadius:1,
                    background:'rgba(212,160,23,0.1)',border:'1px solid var(--gold)',color:'var(--gold)'}}>
                  Add Quest
                </button>
                <button onClick={()=>{setShowAddQuest(false);setNewQuestName('');}}
                  style={{flex:1,padding:'8px',fontFamily:'Cinzel,serif',fontSize:11,letterSpacing:1,
                    cursor:'pointer',borderRadius:1,
                    background:'rgba(0,0,0,0.3)',border:'1px solid rgba(90,74,32,0.4)',
                    color:'var(--parchment-dark)'}}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function App() {
  const [hero, setHero] = useState(null);
  const [creationName, setCreationName] = useState("");
  const [creationClass, setCreationClass] = useState("warrior");
  const [creationBook, setCreationBook] = useState("los");
  const [modal, setModal] = useState(null);
  const [healthDelta, setHealthDelta] = useState("");
  const [goldInput, setGoldInput] = useState("");
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [activeTab, setActiveTab] = useState("sheet");
  const [showNewHeroConfirm, setShowNewHeroConfirm] = useState(false);

  // Debounced notes — local state updates instantly, syncs to hero after 600ms idle
  const [localNotes, setLocalNotes] = useState("");
  const notesDebounceRef = useRef(null);
  // Keep localNotes in sync when hero changes externally (load/new)
  useEffect(() => { setLocalNotes(hero?.notes || ""); }, [hero?.id]);
  const handleNotesChange = (val) => {
    setLocalNotes(val);
    if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
    notesDebounceRef.current = setTimeout(() => {
      setHero(h => h ? {...h, notes: val} : h);
    }, 600);
  };

  // Quick Save — writes hero directly to slot 0 with brief flash feedback
  const [quickSaved, setQuickSaved] = useState(false);
  const quickSave = () => {
    if (!hero) return;
    const slots = readSlotsFromStorage();
    slots[0] = {...hero, lastModified: Date.now()};
    writeSlotsToStorage(slots);
    setQuickSaved(true);
    setTimeout(() => setQuickSaved(false), 1200);
  };

  const handleCreate = () => {
    if (!creationName.trim()) return;
    setHero(createHero(creationName.trim(), creationClass, creationBook));
  };

  const equipItem = (slotKey, item) => {
    setHero(h => {
      const updated = { ...h, equipment: { ...h.equipment, [slotKey]: item } };
      // Auto-add item ability to tracker if it has one and isn't already tracked
      if (item?.ability?.name && item.ability.type) {
        const typeMap = { sp: 'speed', co: 'combat', mo: 'modifier', pa: 'passive' };
        const trackerKey = typeMap[item.ability.type];
        if (trackerKey) {
          const cur = (updated.specialAbilities?.[trackerKey] || []);
          const alreadyTracked = cur.some(x => x.toLowerCase() === item.ability.name.toLowerCase());
          if (!alreadyTracked) {
            updated.specialAbilities = {
              ...(updated.specialAbilities || {}),
              [trackerKey]: [...cur, item.ability.name],
            };
          }
        }
      }
      // Autosave to slot 0 so equipment changes survive an accidental close
      try {
        const slots = readSlotsFromStorage();
        slots[0] = { ...updated, lastModified: Date.now() };
        writeSlotsToStorage(slots);
      } catch { /* best-effort */ }
      return updated;
    });
  };
  const unequipItem = (slotKey) => {
    setHero(h => {
      const item = h.equipment[slotKey];
      const updated = { ...h, equipment: { ...h.equipment, [slotKey]: null } };
      // Remove ability from tracker if it came from this item (and isn't from career or another item)
      if (item?.ability?.name && item.ability.type) {
        const typeMap = { sp: 'speed', co: 'combat', mo: 'modifier', pa: 'passive' };
        const trackerKey = typeMap[item.ability.type];
        if (trackerKey) {
          const abilName = item.ability.name.toLowerCase();
          // Check if any OTHER equipped item also carries this ability
          const stillEquipped = Object.entries(updated.equipment).some(([k, v]) =>
            k !== slotKey && v?.ability?.name?.toLowerCase() === abilName
          );
          // Check if it's a career ability (those are protected — never remove them via unequip)
          const careerAbilNames = h.career && typeof CAREER_DATA !== 'undefined' && CAREER_DATA[h.career]
            ? CAREER_DATA[h.career].abilities.map(a => a.name.toLowerCase())
            : [];
          const isCareerAbil = careerAbilNames.includes(abilName);
          if (!stillEquipped && !isCareerAbil) {
            const cur = (updated.specialAbilities?.[trackerKey] || []);
            // Remove first occurrence only (handles multi-copy stacking correctly)
            const idx = cur.findIndex(x => x.toLowerCase() === abilName);
            if (idx !== -1) {
              updated.specialAbilities = {
                ...(updated.specialAbilities || {}),
                [trackerKey]: cur.filter((_, i) => i !== idx),
              };
            }
          }
        }
      }
      // Autosave to slot 0 so equipment changes survive an accidental close
      try {
        const slots = readSlotsFromStorage();
        slots[0] = { ...updated, lastModified: Date.now() };
        writeSlotsToStorage(slots);
      } catch { /* best-effort */ }
      return updated;
    });
  };
  const setBackpackItem = (index, item) => {
    setHero(h => { const bp=[...h.backpack]; bp[index]=item; return {...h,backpack:bp}; });
  };
  const applyHealth = (delta) => {
    const d = parseInt(delta);
    if (isNaN(d)) return;
    setHero(h => ({...h, baseAttributes:{...h.baseAttributes,
      health: Math.max(0, Math.min(h.baseAttributes.maxHealth, h.baseAttributes.health+d))
    }}));
    setHealthDelta("");
  };
  const applyGold = () => {
    const g = parseInt(goldInput);
    if (!isNaN(g)) setHero(h => ({...h, gold: Math.max(0,g)}));
    setGoldInput("");
  };
  const updateAttr = (attr, val) => {
    const v = typeof val === 'number' ? val : parseInt(val);
    if (!isNaN(v) && v >= 0) setHero(h => ({...h, baseAttributes:{...h.baseAttributes,[attr]:v}}));
  };

  // ── Creation Screen ──
  if (!hero) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="creation-screen">
            <div className="creation-panel">
              <div className="creation-title">DestinyQuest</div>
              <div className="creation-subtitle">Companion App</div>

              {/* Load existing */}
              <button className="btn-create" style={{marginBottom:24,background:'rgba(0,0,0,0.4)',borderColor:'rgba(90,74,32,0.6)',color:'var(--parchment-dark)'}}
                onClick={() => setShowSaveManager(true)}>
                Load Saved Hero
              </button>

              {/* Book selector */}
              <label className="field-label">Choose Your Book</label>
              <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:24}}>
                {BOOKS.map(book => (
                  <div key={book.id}
                    onClick={()=>setCreationBook(book.id)}
                    style={{
                      padding:'10px 14px',cursor:'pointer',borderRadius:1,
                      background: creationBook===book.id ? 'rgba(212,160,23,0.1)' : 'rgba(0,0,0,0.35)',
                      border: `1px solid ${creationBook===book.id ? 'var(--gold)' : 'rgba(90,74,32,0.35)'}`,
                      transition:'all 0.15s',display:'flex',justifyContent:'space-between',alignItems:'center'
                    }}>
                    <span style={{fontFamily:'Cinzel,serif',fontSize:13,
                      color: creationBook===book.id ? 'var(--gold)' : 'var(--parchment-light)'}}>
                      {book.title}
                    </span>
                    <span style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,
                      color:'rgba(139,105,20,0.6)',textTransform:'uppercase'}}>
                      {book.subtitle}
                    </span>
                  </div>
                ))}
              </div>

              <label className="field-label">Hero Name</label>
              <input className="text-input" placeholder="Enter your name…"
                value={creationName} onChange={e=>setCreationName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleCreate()} />

              <label className="field-label">Choose Your Path</label>
              <div className="class-grid">
                {Object.entries(CLASS_INFO).map(([cls,info]) => (
                  <div key={cls} className={`class-card ${creationClass===cls?"selected":""}`} onClick={()=>setCreationClass(cls)}>
                    <div className="class-icon" style={{color:'var(--parchment)',display:'flex',justifyContent:'center'}}>{CLASS_ICONS[cls]}</div>
                    <div className="class-name">{info.label}</div>
                    <div className="class-attr">Focuses on {info.main}</div>
                    <div className="class-stats" style={{marginTop:6,fontSize:11,color:'rgba(139,105,20,0.6)',fontStyle:'italic'}}>All stats: 0 · 30 health<br/><span style={{fontSize:10}}>Path bonus from career selection</span></div>
                  </div>
                ))}
              </div>
              <button className="btn-create" onClick={handleCreate} disabled={!creationName.trim()}>
                Begin Your Quest
              </button>
            </div>
          </div>
          {showSaveManager && (
            <SaveManager currentHero={null} onLoad={h=>{setHero(h);setShowSaveManager(false);}} onClose={()=>setShowSaveManager(false)}/>
          )}
        </div>
      </>
    );
  }

  const book = BOOKS.find(b=>b.id===(hero.bookId||'los')) || BOOKS[0];
  const path = hero.heroPath || hero.path; // backwards compat
  const computed = computeStats(hero.baseAttributes, hero.equipment);
  const healthPct = Math.max(0, Math.min(100, (hero.baseAttributes.health / hero.baseAttributes.maxHealth)*100));
  const classInfo = CLASS_INFO[path] || CLASS_INFO.warrior;
  const primaryStat = path==="warrior" ? "brawn" : path==="mage" ? "magic" : "speed";

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="main-layout">

          {/* ── Header ── */}
          <header className="app-header">
            {/* Row 1: hero name + action buttons */}
            <div className="header-row1">
              <div className="hero-name-display">{hero.name}</div>
              <div className="header-actions">
                {/* Gold display */}
                <div className="gold-display">
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" style={{color:'var(--gold)',flexShrink:0}}>
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    <text x="8" y="12" textAnchor="middle" fontSize="9" fontFamily="serif" fill="currentColor">G</text>
                  </svg>
                  {hero.gold}
                </div>
                {/* Quick save */}
                <button onClick={quickSave}
                  className={`btn-header-save btn-header-save-quick${quickSaved?' saved':''}`}
                  title="Quick save to slot 1">
                  {quickSaved ? '✓' : '⚡'}
                </button>
                {/* Save manager */}
                <button className="btn-header-save btn-header-save-slots"
                  onClick={()=>setShowSaveManager(true)} title="Save / Load slots">
                  💾
                </button>
                {/* New hero */}
                <button className="btn-header-save btn-header-new"
                  onClick={()=>setShowNewHeroConfirm(true)} title="New hero">
                  New
                </button>
              </div>
            </div>
            {/* Row 2: class · career · book */}
            <div className="header-row2">
              <div className="hero-class-display" style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{color:'var(--gold)',display:'flex',alignItems:'center'}}>{CLASS_ICONS[path]}</span>
                {classInfo.label}{hero.career ? ` · ${hero.career}` : ''}<span style={{opacity:0.45,marginLeft:4}}>{book.subtitle}</span>
              </div>
            </div>
          </header>

          {/* ── Tab Nav ── */}
          <div className="tab-bar" style={{display:'flex',gap:0,borderBottom:'1px solid var(--slot-border)',overflowX:'auto'}}>
            {[['sheet','Hero'],['combat','Combat'],['abilities','Abilities'],['challenge','Dice'],['quests','Quests'],['notes','Notes']].map(([tab,label])=>(
              <button key={tab} className="tab-btn" onClick={()=>setActiveTab(tab)}
                style={{fontFamily:'Cinzel,serif',fontSize:12,letterSpacing:1,textTransform:'uppercase',
                  padding:'10px 14px',whiteSpace:'nowrap',flexShrink:0,
                  background:activeTab===tab?'rgba(212,160,23,0.08)':'transparent',
                  border:'none',borderBottom:activeTab===tab?'2px solid var(--gold)':'2px solid transparent',
                  color:activeTab===tab?'var(--gold)':'var(--parchment-dark)',cursor:'pointer',transition:'all 0.2s'}}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Sheet Tab ── */}
          {activeTab==='sheet' && (
            <div className="sheet-grid">

              {/* Left column */}
              <div style={{display:'flex',flexDirection:'column',gap:16}}>

                {/* Health */}
                <div className="panel">
                  <div className="panel-header">Health</div>
                  <div className="panel-body">
                    <div className="health-label-row">
                      <span className="health-label">HP</span>
                      <span className="health-numbers">{hero.baseAttributes.health} / {hero.baseAttributes.maxHealth}</span>
                    </div>
                    <div className="health-bar-bg">
                      <div className="health-bar-fill" style={{width:`${healthPct}%`}}/>
                    </div>
                    <div className="health-btn-row" style={{marginTop:10}}>
                      <input className="health-input" type="number" placeholder="Δ" value={healthDelta}
                        onChange={e=>setHealthDelta(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){const d=parseInt(healthDelta);if(!isNaN(d))applyHealth(d);}}} />
                      <button className="btn-health btn-heal" onClick={()=>applyHealth(Math.abs(parseInt(healthDelta)||1))}>+ Heal</button>
                      <button className="btn-health btn-damage" onClick={()=>applyHealth(-(Math.abs(parseInt(healthDelta)||1)))}>− Hit</button>
                    </div>
                    {/* Max health edit */}
                    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                      <span style={{fontFamily:'Cinzel,serif',fontSize:9,letterSpacing:2,color:'var(--parchment-dark)',textTransform:'uppercase'}}>Max HP</span>
                      <input type="number" min={1} value={hero.baseAttributes.maxHealth}
                        onChange={e=>{const v=parseInt(e.target.value); if(!isNaN(v)&&v>0) updateAttr('maxHealth',v);}}
                        style={{width:60,background:'rgba(0,0,0,0.4)',border:'1px solid rgba(90,74,32,0.4)',
                          color:'var(--parchment-light)',fontFamily:'Cinzel Decorative,serif',fontSize:14,
                          textAlign:'center',padding:'4px',outline:'none',borderRadius:1}}/>
                      <button className="btn-gold" style={{padding:'4px 10px',fontSize:10}} onClick={()=>setHero(h=>({...h,baseAttributes:{...h.baseAttributes,health:h.baseAttributes.maxHealth}}))}>
                        Full Heal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Attributes — all editable inline */}
                <div className="panel">
                  <div className="panel-header">Attributes</div>
                  <div className="panel-body">
                    <div className="stats-grid">
                      {["speed","brawn","magic","armour"].map(stat=>{
                        const gearBonus = computed[stat] - hero.baseAttributes[stat];
                        return (
                        <div key={stat} className={`stat-block ${stat===primaryStat?'primary':''}`}>
                          <span className="stat-label">{stat.charAt(0).toUpperCase()+stat.slice(1)}</span>
                          {/* Total — big display */}
                          <span style={{
                            fontFamily:'Cinzel Decorative,serif',fontSize:24,lineHeight:1,
                            color:stat===primaryStat?'var(--gold-bright)':'var(--parchment-light)',
                            textShadow:stat===primaryStat?'0 0 8px rgba(212,160,23,0.3)':'none'}}>
                            {computed[stat]}
                          </span>
                          {/* Base editable input */}
                          <div style={{display:'flex',alignItems:'center',gap:3,marginTop:2}}>
                            <span style={{fontSize:8,color:'rgba(139,105,20,0.5)',fontFamily:'Cinzel,serif'}}>base</span>
                            <input type="number" min={0}
                              value={hero.baseAttributes[stat]}
                              onChange={e=>{
                                const raw = e.target.value;
                                const n = raw === '' ? 0 : parseInt(raw);
                                if (!isNaN(n) && n >= 0) updateAttr(stat, n);
                              }}
                              style={{background:'rgba(0,0,0,0.35)',border:'1px solid rgba(90,74,32,0.3)',
                                outline:'none',borderRadius:1,
                                fontFamily:'Cinzel,serif',fontSize:11,
                                color:'var(--parchment-dark)',
                                width:36,textAlign:'center',padding:'1px 2px'}}/>
                          </div>
                          {gearBonus > 0 && (
                            <span style={{fontSize:8,color:'var(--gold)',fontFamily:'Cinzel,serif',marginTop:1}}>
                              +{gearBonus} gear
                            </span>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Gold */}
                <div className="panel">
                  <div className="panel-header">Gold Crowns</div>
                  <div className="panel-body">
                    <div className="gold-edit-row">
                      <input className="gold-input" type="number" placeholder={hero.gold} value={goldInput}
                        onChange={e=>setGoldInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyGold()} min={0}/>
                      <button className="btn-gold" onClick={applyGold}>Set</button>
                      <button className="btn-gold" onClick={()=>setHero(h=>({...h,gold:h.gold+1}))}>+1</button>
                      <button className="btn-gold" onClick={()=>setHero(h=>({...h,gold:Math.max(0,h.gold-1)}))}>-1</button>
                    </div>
                  </div>
                </div>

                {/* Career */}
                <div className="panel">
                  <div className="panel-header">Path & Career</div>
                  <div className="panel-body">
                    <div style={{fontSize:12,color:'var(--parchment-dark)',marginBottom:8}}>
                      Path: <span style={{color:'var(--gold)',fontFamily:'Cinzel,serif'}}>{classInfo.label}</span>
                      <span style={{fontSize:10,color:'rgba(139,105,20,0.4)',marginLeft:8}}>(permanent)</span>
                    </div>
                    {hero.career ? (
                      <div style={{padding:'8px 12px',background:'rgba(212,160,23,0.06)',
                        border:'1px solid rgba(212,160,23,0.25)',borderRadius:1,
                        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{fontFamily:'Cinzel,serif',fontSize:13,color:'var(--gold)'}}>
                          {hero.career}
                        </span>
                        <span style={{fontSize:10,color:'rgba(139,105,20,0.4)',fontStyle:'italic'}}>
                          active career
                        </span>
                      </div>
                    ) : (
                      <div style={{padding:'8px 12px',background:'rgba(0,0,0,0.2)',
                        border:'1px dashed rgba(90,74,32,0.3)',borderRadius:1,
                        fontSize:12,color:'rgba(139,105,20,0.4)',fontStyle:'italic'}}>
                        No career selected — go to the <strong style={{color:'var(--parchment-dark)'}}>Abilities</strong> tab to choose one.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column — paperdoll */}
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <div className="panel">
                  <div className="panel-header">Equipment</div>
                  <div className="paperdoll-container">
                    <div className="paperdoll-layout">

                      {/* ── Hero figure silhouette ── */}
                      <div className="paperdoll-figure">
                        <svg viewBox="0 0 1024 1536" width="350" height="800" fill="var(--parchment-light)" style={{fillRule:'evenodd',clipRule:'evenodd'}}>
                          <path d="M771.6,1397l-25-2l-25-7l-14-7l-4.5-6.5l-2-19l-5.5,0.5l-17.5-15.5v-17l3-3l1-13l-3-13l3-7l-4.5-6.5l-5,2
	l-1.5-3.5l7-16l-3-14l5-10l-1-14l-10-19l-1-22l-12-24l-1-9l-10-19l-4.5,3.5l-2.5-3.5v-24l-8.5-9.5l-1.5,8.5l-2-1l-3-13l-5.5-8.5v11
	l-7.5-8.5l-5,23l-4,6l0.5,8.5l-7-12l-2.5,5.5h-2l-6-14l1,11l-4,5v9l-5,7l-0.5,15.5l-12.5-19.5l-5.5-14.5l-1.5,9.5l-2-1l-4-18
	l-2.5-3.5l-3,1l-2.5-4.5l1-6l-3.5-9.5l-23.5,38.5l-1,7l-7,5l-15.5,19.5l5.5-13.5l2-14l-1.5-3.5l-10,13l1.5-17.5l-2,1l-4,17l-8,11
	l-5,20h-2l-1.5-8.5l-8.5,11.5l-9,32v33l7,12l-8,7v4l5,17l-1,16l5,6l1,8v10l-6.5,6.5l-25,10l-4-2l-8,1l-7.5,6.5l-7.5,13.5l-17,12
	l-14,4l-41,2l-27-6l-7.5-5.5v-13l3-10l10.5-11.5l15-7l4-7l12.5-8.5l-2-3l16-15l14-26l1-6l-6.5,3.5l-2.5-11.5l-8-7l13.5-3.5l9.5-9.5
	l5-14l3-38l-6-22h5l-1-18l-7,6l-7.5,12.5l0.5-12.5l3-8l-3-7l8-20l-1.5-0.5l-17.5,22.5v6l-10,20h-2v-11l-2.5-0.5l-20,15l11.5-17.5
	v-10l3-4l-2.5-10.5l-6.5,5.5l-3,15l-5,10l-22,20l-9.5,18.5l1.5-16.5l-4-15l4-7l-1-17l4-12l-2.5-1.5l-6.5,11.5l-1,15l-3.5-1.5
	l-2.5,7.5h-4v11l5,15l-1.5,2.5l-3.5-0.5l-1,18l5.5,20.5l-7.5-9.5l-4-12l-9-7l-4-9l1-19l-4-3l-4-11l2-55l4-11l13-21l11-37l9-14l18-44
	l11-16l10-26l21-42l14-43L299.6,804l-7.5,6.5l-10,16l-5,20l-1.5,18.5l-6.5-14.5l-1-26l5-20l6-11l2-10l-1.5-1.5l-7,3l-21-3l-5-7h-6
	l-3.5-2.5l-2.5-7.5l-8.5-3.5l-4-11l0.5-6.5l-6-3h-8l-6-8l-9-1l-9-9l-23-10l-55-33l-6-2l-16,2l-5-2l-7.5-11.5l1-11l5.5-7.5l10-4l8,1
	l8.5,5.5l3.5,10.5l11,6l64,28l9,6h6l7,5h6l7,6h7l6,7l2.5-1.5l2-4l-5-6l14-16l-4-4v-8l14-16l1-12l5-9l1-13l4-11l-1-13l4-30l-3-47l5-2
	l-1-41l5.5-8.5l7-3l6,1l6.5,5.5l3,7l-2,9l0.5,25.5l1.5-5.5l3-2v-6l9-4v-7l5-4v-6l5-3l-4-10l-8-7l12.5,2.5l7-2l6.5-5.5l5-11l-4-4l4-5
	l-4.5,1.5l-1.5-3.5l6-4l8-14l-1.5-3.5l-4,2l1.5-4.5l-4.5-1.5l-14.5,3.5l5-5v-4l5-5l9-20l-16.5-0.5l-8.5,2.5l20-20l6-11l-6.5,2.5
	l-0.5-1.5l11-13l-7.5-2.5l-15.5-0.5l30.5-13.5l4-6l7.5-4.5l-10.5-3.5l-14-1l1-2l27-2l20.5-11.5l-8-4l12-3l-7-11l2.5-10.5l21,9l4,4
	l7.5-3.5l-2.5-5.5l6.5,0.5l-2-6L398.6,243l34,11l16,10l2.5-4.5l-1-4l4.5,0.5l5-5l1.5,8.5l3.5,3.5l6-4l11-2l13-9l2,3l2.5-0.5l-6-18
	v-14l6-1l-5-34v-8h3l-2-13l5.5-5.5l3,4l3-2l5.5-9.5l5.5-4.5l1,4l5-4l3,1l25-7l10,3l9-1l7,4l4-1l10,10l6-5l4.5,4.5v11l6,14l-3,36
	l5.5-1.5l3.5,9.5l-2,15l-7,17l7-3l1.5,15.5l5.5-6.5l3-11l4-1l1-9l-2-2l14.5-1.5l12,4l14.5,13.5l3.5,27.5l10-8l-1.5,4.5l3.5,8.5l17,2
	l5-4l5,1l14-8l17-15l-4.5,16.5l-9.5,19.5l15,2l-2.5,4.5l3.5,2.5l41.5-3.5l-11.5,6.5l-12.5,11.5l8.5,8.5l28.5,6.5l-6.5,0.5l-14.5,8.5
	l12,13l-0.5,3.5l-4.5-2.5l3,8l6,6l-6,2l2,15l12,23l9,12l-0.5,1.5l-14-10l-2,3l-5.5-0.5l9,19l1,8l6,9l-0.5,3.5l-9-9l-5.5-0.5l4,12
	l9,15l-1.5,2.5l-5.5,0.5l1,7l6,9l-1,6l2,4l8,7v8l6.5-1.5l3,9l5.5-3.5l2,19l7.5,0.5l10-3l4.5,4.5l-6,33l1,53l-4,22l1,41l6,18l-1,7
	l-6,1l5,31l-6,1l-2,13l-11,12l-9.5,3.5l-7,6l-8-1l-4,3l-8-2l-8,3l-9.5-6.5l-4.5-8.5l-6,1l-2.5-3.5l-6-23l4-21l20-23l-6-3l8-15l-2-11
	l-2-1v-15l-5-14l-17-25l-4-18l-10-10l-1-5l5-6v-4l-3-5l1-11l-3-2l-1-8l-18-17l-2-7l-5.5-5.5l-4-2l-2.5,3.5l-4-11l-4.5-1.5l-1,2l-3-7
	l-11.5,16.5l-9,26l-5,6v15l3,8l-3,14l6,2l1.5,10.5l17-3l5,2l9.5,10.5l2,15l7,19v11l-3,1v3l14,23l1,5l-4,10l5,5l-1.5,1.5l-5-3l-8,10
	l-6.5,3.5l1,6l12,23l14,39l17,29l3,14l8,15l12,13l7,13l32,28l8,14l7.5,6.5l16.5,8.5l4,8l-15.5-3.5l3,8l-18-15l-0.5,3.5l4,5l-8.5-4.5
	l-0.5,2.5l9,14l17.5,13.5l17,18l15,7l20,15l7.5,11.5l18,16l-16.5-10.5l-17-7l-4,2l-7-3l-0.5,2.5l5,5l-1.5,0.5l-2-2l-5,1l-11.5-6.5
	l1,4l12,10l-0.5,1.5l-5.5-2.5l7,14l-3,3l1,3l5,9l11,11l-1.5,0.5l-14-13l-13-5l-8-9l-6-2l-3.5-8.5l-8.5-5.5l-6-9l-13-7l-10-10h-5
	l-3.5,6.5l-2.5-0.5l-5-11l-2.5,1.5l6,14l-0.5,3.5l-15.5-15.5l7,17l2.5,23.5l-8.5-11.5l-8-24L753.6,981l10.5,18.5l9,25l-11.5-7.5
	l-0.5,8.5l-3-1l1.5,6.5l-7.5-11.5l-5.5-3.5l1.5,5.5l11,12l0.5,8.5l99,66l68,54l29.5,28.5l15,19l3,7l-13.5,1.5l-14-2l-33-12l-71-35
	l-92-55l-1.5,29.5l5,2l-6,11l-3,14l-1,15l2,11l-2,23l7,21l2,14l8.5,8.5l13.5,7.5l-11,9l-2.5,5.5l-4-3l-0.5,3.5l4,13l6,10v6l11,17
	l6.5,6.5l6.5,2.5l-1,5l14,21l1,6v11l-3.5,4.5l-13,6L771.6,1397z M371.1,768.5l5-16l11-20l2-16l8-17l4-17l-8-31l-8-7l-8-23l7.5,4.5
	l2.5-1.5l-17-34l0.5-1.5l6,5v-8l6.5,6.5l-5-23l5,2l8.5,12.5l2.5-3.5l1.5-14.5l5,9l1-11l6,10l2.5-1.5v-7l4.5,2.5l3-4l5,13l4.5-3.5
	l3.5-12.5l2.5,10.5l5-1l1,11h5l-1.5,14.5l5-1l4,2l3.5-3.5l-3-6l6-4l-1-8l2-3l-7-9l4-15l-8-12l1-12l-6.5-2.5l-3.5-5.5v-11l-6.5-17.5
	l-10.5,13.5l-7,16l-2.5-5.5l-6.5,4.5l-5,17l-2.5-4.5l-4,6l-9,4l-3.5,4.5l1,3l-9,7l1,7l-10,21l4,6l-13,24l-12,14l-3,7l-10,9l-2,6
	l-12,16l-4,9l3,4l-6,7l1,15l-4.5,5.5l-4-2l-3.5,7.5l8,16l-0.5,19.5l24-19l21-12l19-5l17,1l-5,4l-15,5l-11,8l-18.5,23.5l15.5,1.5
	l3.5,3.5l-1,4l2.5,2.5L371.1,768.5z M528.1,1093.5l4-10v-8l-5-10l-0.5-10.5l-4.5,24.5L528.1,1093.5z"/>
                        </svg>
                      </div>

                      {/* ── SVG connector lines — viewBox matches layout 450×585 (1.5× scale) ── */}
                      <svg className="paperdoll-connectors" viewBox="0 0 450 585" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
                        <defs>
                          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(212,160,23,0.5)"/>
                            <stop offset="50%" stopColor="rgba(212,160,23,0.25)"/>
                            <stop offset="100%" stopColor="rgba(212,160,23,0.5)"/>
                          </linearGradient>
                        </defs>
                        {/* Center vertical spine */}
                        <line x1="225" y1="93" x2="225" y2="492" stroke="rgba(90,74,32,0.2)" strokeWidth="1.5"/>
                        {/* Head → figure top */}
                        <line x1="225" y1="93" x2="225" y2="108" stroke="url(#lineGrad)" strokeWidth="1.2"/>
                        {/* Chest → figure mid */}
                        <line x1="225" y1="228" x2="225" y2="240" stroke="url(#lineGrad)" strokeWidth="1.2"/>
                        {/* Feet → figure bottom */}
                        <line x1="225" y1="465" x2="225" y2="450" stroke="url(#lineGrad)" strokeWidth="1.2"/>
                        {/* Left column connectors */}
                        <line x1="99"  y1="74"  x2="150" y2="120" stroke="rgba(212,160,23,0.3)" strokeWidth="1.2"/>
                        <line x1="99"  y1="209" x2="147" y2="195" stroke="rgba(212,160,23,0.3)" strokeWidth="1.2"/>
                        <line x1="99"  y1="344" x2="147" y2="300" stroke="rgba(212,160,23,0.3)" strokeWidth="1.2"/>
                        <line x1="99"  y1="479" x2="165" y2="443" stroke="rgba(212,160,23,0.25)" strokeWidth="1.2"/>
                        {/* Right column connectors */}
                        <line x1="351" y1="74"  x2="300" y2="120" stroke="rgba(212,160,23,0.3)" strokeWidth="1.2"/>
                        <line x1="351" y1="209" x2="303" y2="195" stroke="rgba(212,160,23,0.3)" strokeWidth="1.2"/>
                        <line x1="351" y1="344" x2="303" y2="300" stroke="rgba(212,160,23,0.3)" strokeWidth="1.2"/>
                        <line x1="351" y1="479" x2="285" y2="443" stroke="rgba(212,160,23,0.25)" strokeWidth="1.2"/>
                      </svg>

                      {/* ── Equipment slots ── */}
                      {Object.keys(SLOT_META).map(slotKey=>(
                        <EquipSlot key={slotKey} slotKey={slotKey} item={hero.equipment[slotKey]}
                          onClick={s=>setModal({type:'equip',slot:s})}/>
                      ))}
                    </div>
                  </div>
                  <div className="panel-header" style={{borderTop:'1px solid var(--slot-border)'}}>Backpack (5 slots)</div>
                  <div className="backpack-row">
                    {hero.backpack.map((item,i)=>(
                      <div key={i} className={`backpack-slot ${item?'filled':''}`} onClick={()=>setModal({type:'backpack',index:i})}>
                        {item ? (
                          <>
                            <span className="slot-icon" style={{color:'var(--gold)',display:'flex'}}>
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 L4 22 L20 22 L18 2 Z"/>
                                <path d="M9 2 Q9 6 12 6 Q15 6 15 2"/>
                                <line x1="7" y1="10" x2="17" y2="10"/>
                              </svg>
                            </span>
                            <span className="slot-name" style={{fontSize:7,textAlign:'center',padding:'0 2px',color:'var(--gold)',lineHeight:1.2}}>{item.name.split(' ')[0]}</span>
                            {item.uses !== undefined && (
                              <span style={{fontSize:7,color:item.uses>0?'#6dbf6d':'rgba(139,26,26,0.8)',fontFamily:'Cinzel,serif'}}>{item.uses}u</span>
                            )}
                          </>
                        ) : (
                          <span style={{fontSize:18,opacity:0.15,color:'var(--parchment)'}}>+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Combat Tab ── always mounted so state survives tab switches */}
          <div style={{display: activeTab==='combat' ? 'block' : 'none'}}>
            <CombatSimulator
              hero={hero}
              setHero={setHero}
              onHeroHealthChange={hp=>setHero(h=>({...h,baseAttributes:{...h.baseAttributes,health:hp}}))}
            />
          </div>

          {/* ── Challenge Tab ── */}
          {activeTab==='challenge' && (
            <ChallengeTest hero={hero} />
          )}

          {/* ── Abilities Tab ── */}
          {activeTab==='abilities' && (
            <AbilitiesTab hero={hero} setHero={setHero}/>
          )}

          {/* ── Quests Tab ── */}
          {activeTab==='quests' && (
            <QuestsTab hero={hero} setHero={setHero}/>
          )}

          {/* ── Notes Tab ── */}
          {activeTab==='notes' && (
            <div className="panel" style={{marginTop:0}}>
              <div className="panel-header">Notes & Quest Log</div>
              <div className="panel-body">
                <textarea
                  value={localNotes}
                  onChange={e=>handleNotesChange(e.target.value)}
                  placeholder={'Record quest progress, important entries, decisions, defeated enemies…\n\nTip: use the Quests tab to track individual quests. Use this space for free-form notes.'}
                  rows={18}
                  style={{width:'100%',background:'rgba(0,0,0,0.3)',border:'1px solid var(--slot-border)',
                    color:'var(--parchment-light)',padding:'12px 16px',fontFamily:'Crimson Text,serif',
                    fontSize:16,outline:'none',borderRadius:1,resize:'vertical',lineHeight:1.8}}/>
              </div>
            </div>
          )}


        </div>

        {/* Modals */}
        {modal?.type==='equip' && (
          <ItemModal slotKey={modal.slot} currentItem={hero.equipment[modal.slot]}
            onEquip={item=>equipItem(modal.slot,item)}
            onUnequip={()=>{unequipItem(modal.slot);setModal(null);}}
            onClose={()=>setModal(null)}/>
        )}
        {modal?.type==='backpack' && (
          <BackpackModal slotIndex={modal.index} currentItem={hero.backpack[modal.index]}
            onEquip={item=>setBackpackItem(modal.index,item)}
            onUnequip={()=>{setBackpackItem(modal.index,null);setModal(null);}}
            onClose={()=>setModal(null)}/>
        )}
        {showSaveManager && (
          <SaveManager currentHero={hero} onLoad={h=>setHero(h)} onClose={()=>setShowSaveManager(false)}/>
        )}
        {/* ── New Hero confirmation ── */}
        {showNewHeroConfirm && (
          <div className="modal-overlay" onClick={()=>setShowNewHeroConfirm(false)}>
            <div className="modal-panel" style={{maxWidth:360}} onClick={e=>e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">— Abandon Hero? —</span>
                <button className="btn-close" onClick={()=>setShowNewHeroConfirm(false)}>✕</button>
              </div>
              <div className="modal-body" style={{padding:'20px 24px'}}>
                <div style={{fontFamily:'Crimson Text,serif',fontSize:16,color:'var(--parchment-light)',
                  lineHeight:1.7,marginBottom:20}}>
                  Your current hero <strong style={{color:'var(--gold)'}}>{hero.name}</strong> will
                  be left behind. Any unsaved progress will be lost.
                </div>
                <div style={{fontSize:12,color:'var(--parchment-dark)',marginBottom:20,
                  fontStyle:'italic',lineHeight:1.6}}>
                  Tip: use <strong style={{color:'var(--gold)'}}>⚡ Quick Save</strong> first if you
                  want to return to this hero later.
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button
                    onClick={()=>{setShowNewHeroConfirm(false);setHero(null);}}
                    style={{flex:1,padding:'10px',fontFamily:'Cinzel,serif',fontSize:11,
                      letterSpacing:2,textTransform:'uppercase',cursor:'pointer',borderRadius:1,
                      background:'rgba(139,26,26,0.2)',border:'1px solid var(--blood-bright)',
                      color:'var(--blood-bright)',transition:'all 0.2s'}}>
                    Leave Hero
                  </button>
                  <button
                    onClick={()=>setShowNewHeroConfirm(false)}
                    style={{flex:1,padding:'10px',fontFamily:'Cinzel,serif',fontSize:11,
                      letterSpacing:2,textTransform:'uppercase',cursor:'pointer',borderRadius:1,
                      background:'rgba(212,160,23,0.06)',border:'1px solid var(--slot-border)',
                      color:'var(--parchment-dark)',transition:'all 0.2s'}}>
                    Stay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


// ─── Boot ─────────────────────────────────────────────────────────────────────
window.App = App;

// Mount
const __mountEl = document.getElementById('root');
if (__mountEl && !__mountEl.__mounted) {
  __mountEl.__mounted = true;
  ReactDOM.createRoot(__mountEl).render(React.createElement(App));
}
