import { useRef } from "react";

export default function CollectionCard({ 
  collection, 
  count, 
  delay, 
  colorClass, 
  icon,
  description,
  onClick 
}) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%";
    const my = ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%";
    cardRef.current.style.setProperty("--mx", mx);
    cardRef.current.style.setProperty("--my", my);
  };

  return (
    <div 
      className={`av-coll-card ${colorClass || ''}`} 
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      ref={cardRef}
    >
      <div className="av-card-top-row">
        <div className={`av-card-icon ${colorClass || ''}`}>{icon || "◆"}</div>
        <button className="av-card-menu" onClick={(e) => { e.stopPropagation(); }}>⋯</button>
      </div>
      <div className="av-card-title">{collection}</div>
      <div className="av-card-desc">
        {description || `Code snippets related to ${collection}.`}
      </div>
      <div className="av-card-meta">
        <span className="av-meta-item">📄 {count} snippets</span>
        <span className="av-dot-sep"></span>
        <span className="av-meta-item">updated recently</span>
      </div>
    </div>
  );
}
