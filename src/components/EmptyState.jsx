import { Plus, Sparkles, FolderOpen } from "lucide-react";
import { RECALL_COLLECTION } from "../hooks/useNotes.js";

export default function EmptyState({ activeCollection, onNewNote }) {
  const recallView = activeCollection === RECALL_COLLECTION;

  return (
    <div className="av-empty-state">
      {/* Floating code bracket decorations */}
      <div className="av-empty-floaters" aria-hidden="true">
        <span className="av-floater av-floater-1">{"{"}</span>
        <span className="av-floater av-floater-2">{"}"}</span>
        <span className="av-floater av-floater-3">{"</>"}</span>
        <span className="av-floater av-floater-4">{"//"}</span>
        <span className="av-floater av-floater-5">{"=>"}</span>
        <span className="av-floater av-floater-6">{"[ ]"}</span>
      </div>

      <div className="av-empty-visual" aria-hidden="true">
        <div className="av-empty-orb">
          <div className="av-empty-orb-inner">
            {recallView ? (
              <span className="av-orb-text">147</span>
            ) : (
              <Sparkles size={32} strokeWidth={1.5} />
            )}
          </div>
          <div className="av-empty-orb-ring" />
          <div className="av-empty-orb-ring av-ring-2" />
        </div>
      </div>

      <div className="av-empty-content">
        <span className="av-empty-kicker">
          {recallView
            ? "Recall queue is clear"
            : "Still building your workspace"}
        </span>
        <h3>
          {recallView
            ? "Nothing is due for review yet"
            : "This view is waiting for its first snippet"}
        </h3>
        <p>
          {recallView
            ? "Enable 1-4-7 recall on a snippet and it will show up here with its next review window."
            : "Create a new snippet, organize it into a collection, and add tags so this space becomes a useful reference hub."}
        </p>

        <div className="av-empty-actions">
          <button className="av-btn-primary av-btn-glow" onClick={onNewNote}>
            <Plus size={16} strokeWidth={2.5} />
            Create your first snippet
          </button>
          <button className="av-btn-ghost av-btn-icon" onClick={onNewNote}>
            <FolderOpen size={15} />
            Browse collections
          </button>
        </div>
        <span className="av-empty-tip">
          <Sparkles size={12} />
          Tip: use collections and tags to keep everything easy to find later.
        </span>
      </div>
    </div>
  );
}
