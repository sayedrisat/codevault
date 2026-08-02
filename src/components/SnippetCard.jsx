import { getRecallSummary, RECALL_INTERVALS } from "../hooks/useNotes.js";
import { Copy, Trash2, Heart, Code2 } from "lucide-react";

export default function SnippetCard({ note, index, onOpen, onCopy, onDelete, onRecall, onToggleFavorite }) {
  const recall = getRecallSummary(note);

  return (
    <div
      className="av-card"
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => onOpen(note.id)}
    >
      <div className="av-card-top">
        <div className="av-card-lang">
          <Code2 size={12} />
          {note.lang || "text"}
        </div>
        <div className="av-card-actions">
          <button
            className="av-icon-btn"
            title="Copy code"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(note.code);
            }}
          >
            <Copy size={14} />
          </button>
          <button
            className="av-icon-btn danger"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="av-card-title">
        {note.title || "Untitled Snippet"}
        <button 
          className={`av-card-favorite-btn ${note.favorite ? "active" : ""}`} 
          aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(note);
          }}
        >
          <Heart size={14} fill={note.favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="av-card-reason">{note.reason || "No description provided."}</div>

      {recall.enabled && (
        <div className={`av-recall-card${recall.due ? " due" : ""}`}>
          <div>
            <span className="av-recall-kicker">1-4-7 Recall</span>
            <strong>{recall.title}</strong>
            <span>{recall.detail}</span>
          </div>
          <div className="av-recall-progress" aria-label="Recall progress">
            {RECALL_INTERVALS.map((interval, step) => (
              <span
                key={interval}
                className={
                  step < recall.completedSteps || recall.mastered
                    ? "complete"
                    : ""
                }
              />
            ))}
          </div>
          {!recall.mastered && (
            <button
              className="av-recall-action"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRecall(note.id);
              }}
            >
              {recall.due ? "Recall" : "Recall early"}
            </button>
          )}
        </div>
      )}

      {note.tags && note.tags.length > 0 && (
        <div className="av-card-tags">
          {note.tags.map((t) => (
            <span key={t} className="av-card-tag">#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
