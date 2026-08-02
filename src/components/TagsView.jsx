import { useState } from "react";
import { Hash, Search, Sparkles, Tag } from "lucide-react";

export default function TagsView({ notes, onSelectTag }) {
  const [filter, setFilter] = useState("");

  const tagMap = notes.reduce((acc, note) => {
    (note.tags || []).forEach((tag) => {
      const cleanTag = tag.trim();
      if (!cleanTag) return;
      acc[cleanTag] = (acc[cleanTag] || 0) + 1;
    });
    return acc;
  }, {});

  const tags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .filter(([tag]) =>
      filter ? tag.toLowerCase().includes(filter.toLowerCase()) : true
    );

  return (
    <div className="av-detail-view">
      <div className="av-content-head">
        <h1 className="av-content-h1">Tags</h1>
      </div>
      <p className="av-content-sub">
        Browse your snippets by tag and jump into the matching notes.
      </p>

      {/* Tag filter input */}
      <div className="av-tag-filter">
        <Search size={15} className="av-tag-filter-icon" />
        <input
          type="text"
          placeholder="Filter tags..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {tags.length === 0 ? (
        <div className="av-empty-state av-tags-empty">
          <div className="av-empty-floaters" aria-hidden="true">
            <span className="av-floater av-floater-1">#</span>
            <span className="av-floater av-floater-2">#</span>
            <span className="av-floater av-floater-3">
              <Tag size={14} />
            </span>
            <span className="av-floater av-floater-4">#</span>
          </div>
          <div className="av-empty-visual" aria-hidden="true">
            <div className="av-empty-orb">
              <div className="av-empty-orb-inner">
                <Hash size={32} strokeWidth={1.5} />
              </div>
              <div className="av-empty-orb-ring" />
              <div className="av-empty-orb-ring av-ring-2" />
            </div>
          </div>
          <div className="av-empty-content">
            <span className="av-empty-kicker">No tags found</span>
            <h3>
              {filter ? `No tags matching "${filter}"` : "No tags yet"}
            </h3>
            <p>
              {filter
                ? "Try a different search term or clear the filter."
                : "Add tags to snippets and they will appear here for quick browsing."}
            </p>
          </div>
        </div>
      ) : (
        <div className="av-tags-grid">
          {tags.map(([tag, count], i) => (
            <button
              key={tag}
              className="av-tag-card"
              onClick={() => onSelectTag(tag)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="av-tag-card-icon">
                <Hash size={18} />
              </div>
              <div className="av-tag-card-body">
                <span className="av-tag-card-name">{tag}</span>
                <span className="av-tag-card-count">
                  {count} snippet{count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="av-tag-card-arrow">→</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
