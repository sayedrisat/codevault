import SnippetGrid from "./SnippetGrid.jsx";

export default function DetailView({
  collection,
  description,
  notes,
  view,
  onBack,
  onOpenNote,
  onCopyNote,
  onDeleteNote,
  onRecallNote,
  onNewNote,
  onToggleFavorite,
}) {
  return (
    <div className="av-detail-view">
      <div className="av-content-head">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button className="av-back-btn" onClick={onBack}>←</button>
          <h1 className="av-content-h1">{collection}</h1>
        </div>
        <button className="av-detail-new-btn" onClick={onNewNote}>+ New note</button>
      </div>
      <p className="av-content-sub">{description || `Code snippets related to ${collection}.`}</p>
      
      <div className="av-detail-grid">
        <SnippetGrid
          notes={notes}
          view={view}
          activeCollection={collection}
          onOpen={onOpenNote}
          onCopy={onCopyNote}
          onDelete={onDeleteNote}
          onRecall={onRecallNote}
          onNewNote={onNewNote}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
}
