import { Search, LayoutGrid, List, Plus } from "lucide-react";
import { RECALL_COLLECTION } from "../hooks/useNotes.js";

export default function Topbar({
  activeCollection,
  view,
  setView,
  onMenuClick,
  searchQuery,
  setSearchQuery,
  onNewCollection
}) {
  const currentCollection =
    activeCollection === "All"
      ? "All snippets"
      : activeCollection === RECALL_COLLECTION
        ? "147 Recall"
        : activeCollection;

  return (
    <div className="av-topbar">
      <div className="av-topbar-title">Collections</div>
      
      <div className="av-topbar-search">
        <Search size={15} className="av-topbar-search-icon" />
        <input 
          placeholder="Search collections and snippets..." 
          type="text"
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="av-topbar-actions">
        <div className="av-kbd-hint">
          <kbd>⌘</kbd><span>K</span>
        </div>
        <button className="av-btn-new-collection" onClick={onNewCollection}>
          <Plus size={15} strokeWidth={2.5} />
          New Collection
        </button>
      </div>

      <div className="av-view-toggle">
        <button
          className={`av-view-btn${view === "grid" ? " active" : ""}`}
          onClick={() => setView("grid")}
          aria-label="Grid view">
          <LayoutGrid size={16} />
        </button>
        <button
          className={`av-view-btn${view === "list" ? " active" : ""}`}
          onClick={() => setView("list")}
          aria-label="List view">
          <List size={16} />
        </button>
      </div>
    </div>
  );
}
