import CollectionCard from "./CollectionCard.jsx";

const STYLES = [
  { colorClass: "", icon: "◆" },
  { colorClass: "teal", icon: "⌘" },
  { colorClass: "violet", icon: "◈" },
];

export default function CollectionsView({ 
  collections, 
  counts, 
  onOpenCollection,
  onNewNote 
}) {
  return (
    <div className="av-collections-view">
      <div className="av-content-head">
        <h1 className="av-content-h1">Collections</h1>
        <a className="av-view-all" href="#">VIEW ALL →</a>
      </div>
      <p className="av-content-sub">Your most accessed documentation hubs.</p>

      <div className="av-card-grid">
        {collections.map((c, i) => {
          const style = STYLES[i % STYLES.length];
          return (
            <CollectionCard
              key={c}
              collection={c}
              count={counts[c] || 0}
              delay={i * 60}
              colorClass={style.colorClass}
              icon={style.icon}
              onClick={() => onOpenCollection(c)}
            />
          );
        })}
        
        <div className="av-new-card" style={{ animationDelay: `${collections.length * 60}ms` }} onClick={() => document.getElementById('newBtn')?.click()}>
          <div className="av-plus">+</div>
          <span>CREATE NEW COLLECTION</span>
        </div>
      </div>
    </div>
  );
}
