import { useEffect, useRef, useState } from "react";
import {
  Heart,
  X,
  Trash2,
  Save,
  XCircle,
  Brain,
  RotateCcw,
} from "lucide-react";
import {
  getRecallSummary,
  LANGUAGES,
  RECALL_INTERVALS,
} from "../hooks/useNotes.js";
import TagsInput from "./TagsInput.jsx";
import CodeField from "./CodeField.jsx";

const EMPTY_FORM = {
  title: "",
  lang: "TypeScript",
  collection: "Utilities",
  reason: "",
  tags: [],
  favorite: false,
  recallEnabled: false,
  code: "",
};

export default function EditorDrawer({
  open,
  editingNote,
  collections = [],
  defaultLang,
  defaultCollection,
  onClose,
  onSave,
  onDelete,
  onRecall = () => {},
  onResetRecall = () => {},
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const titleRef = useRef(null);
  const recallSummary = editingNote ? getRecallSummary(editingNote) : null;
  const availableCollections =
    form.collection && !collections.includes(form.collection)
      ? [form.collection, ...collections]
      : collections;

  useEffect(() => {
    if (!open) return;
    if (editingNote) {
      setForm({
        title: editingNote.title,
        lang: editingNote.lang,
        collection: editingNote.collection,
        reason: editingNote.reason,
        tags: [...editingNote.tags],
        favorite: Boolean(editingNote.favorite),
        recallEnabled: Boolean(editingNote.recall?.enabled),
        code: editingNote.code,
      });
    } else {
      const firstCollection = collections[0] || "Uncategorized";
      setForm({
        ...EMPTY_FORM,
        lang: defaultLang || "TypeScript",
        collection:
          defaultCollection &&
          defaultCollection !== "All" &&
          defaultCollection !== "Favorites" &&
          defaultCollection !== "Recall" &&
          collections.includes(defaultCollection)
            ? defaultCollection
            : firstCollection,
      });
    }
    const t = setTimeout(
      () => titleRef.current && titleRef.current.focus(),
      350,
    );
    return () => clearTimeout(t);
  }, [open, editingNote, defaultLang, defaultCollection, collections]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setTags = (tags) => setForm((f) => ({ ...f, tags }));
  const setCode = (code) => setForm((f) => ({ ...f, code }));
  const toggleFavorite = () =>
    setForm((f) => ({ ...f, favorite: !f.favorite }));
  const toggleRecall = () =>
    setForm((f) => ({ ...f, recallEnabled: !f.recallEnabled }));

  const handleSave = () => {
    const payload = {
      title: form.title.trim() || "Untitled snippet",
      lang: form.lang,
      collection: form.collection,
      reason: form.reason.trim(),
      tags: form.tags,
      favorite: form.favorite,
      recallEnabled: form.recallEnabled,
      code: form.code,
    };
    onSave(payload, editingNote ? editingNote.id : null);
  };

  return (
    <>
      <div className={`av-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`av-drawer${open ? " open" : ""}`}>
        <div className="av-drawer-head">
          <h2>{editingNote ? "Edit snippet" : "New snippet"}</h2>
          <div className="av-drawer-actions">
            <button
              className={`av-heart-btn${form.favorite ? " active" : ""}`}
              onClick={toggleFavorite}
              type="button"
              aria-label={
                form.favorite ? "Remove from favorites" : "Add to favorites"
              }
              title={
                form.favorite ? "Remove from favorites" : "Add to favorites"
              }>
              <Heart size={15} fill={form.favorite ? "currentColor" : "none"} />
            </button>
            <button
              className="av-drawer-close"
              onClick={onClose}
              aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="av-drawer-body">
          <div className="av-field">
            <label>Title</label>
            <input
              ref={titleRef}
              type="text"
              placeholder="e.g. useDebounce"
              value={form.title}
              onChange={setField("title")}
            />
          </div>

          <div className="av-row-2">
            <div className="av-field">
              <label>Language</label>
              <select
                className="appearance-none bg-[#1b1b1b] "
                value={form.lang}
                onChange={setField("lang")}>
                {LANGUAGES.map((l) => (
                  <option className="bg-[#1b1b1b] focus:bg-black " key={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="av-field">
              <label>Collection</label>
              <select
                value={form.collection}
                className="appearance-none bg-[#1b1b1b] "
                onChange={setField("collection")}>
                {availableCollections.map((c) => (
                  <option className="bg-[#1b1b1b] focus:bg-black " key={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="av-field">
            <label>Reason</label>
            <textarea
              rows={2}
              placeholder="Why did you save this?"
              value={form.reason}
              onChange={setField("reason")}
            />
          </div>

          <div className="av-field">
            <label>Tags</label>
            <TagsInput tags={form.tags} setTags={setTags} />
          </div>

          <div
            className={`av-recall-panel${form.recallEnabled ? " active" : ""}`}>
            <div className="av-recall-panel-head">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Brain size={18} className="av-recall-icon" />
                <div>
                  <span>1-4-7 Memory Recall</span>
                  <strong>
                    {form.recallEnabled
                      ? "Learning mode on"
                      : "Optional learning mode"}
                  </strong>
                </div>
              </div>
              <label
                className="av-switch"
                style={{ width: "40px", height: "28px" }}>
                <input
                  type="checkbox"
                  checked={form.recallEnabled}
                  onChange={toggleRecall}
                />
                <span
                  className="av-switch-slider"
                  style={{ borderRadius: "20px" }}
                />
              </label>
            </div>
            <p>
              Enable this only for snippets you want to actively remember. It
              schedules recall checkpoints using the 1 day, 4 day, and 7 day
              rule.
            </p>

            {form.recallEnabled && (
              <div className="av-recall-panel-body">
                <div className="av-recall-steps">
                  {RECALL_INTERVALS.map((interval, step) => (
                    <span
                      key={interval}
                      className={
                        recallSummary &&
                        (step < recallSummary.completedSteps ||
                          recallSummary.mastered)
                          ? "complete"
                          : ""
                      }>
                      Day {interval}
                    </span>
                  ))}
                </div>
                {editingNote?.recall?.enabled ? (
                  <div className="av-recall-status-row">
                    <div>
                      <strong>{recallSummary.title}</strong>
                      <span>{recallSummary.detail}</span>
                    </div>
                    {!recallSummary.mastered && (
                      <button
                        type="button"
                        onClick={() => onRecall(editingNote.id)}
                        className="av-btn-primary av-btn-sm"
                        style={{ padding: "6px 12px", fontSize: "11px" }}>
                        Remembered
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onResetRecall(editingNote.id)}
                      className="av-btn-ghost av-btn-sm"
                      style={{
                        padding: "6px 10px",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                      <RotateCcw size={12} /> Restart
                    </button>
                  </div>
                ) : (
                  <span className="av-recall-save-note">
                    Recall schedule starts after you save this note.
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="av-field">
            <label>Code</label>
            <CodeField
              language={form.lang}
              value={form.code}
              onChange={setCode}
            />
          </div>
        </div>

        <div className="av-drawer-foot">
          {editingNote ? (
            <button
              className="av-btn-danger-text"
              onClick={() => onDelete(editingNote.id)}>
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <span />
          )}
          <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
            <button className="av-btn-ghost" onClick={onClose}>
              <XCircle size={14} /> Cancel
            </button>
            <button className="av-btn-primary" onClick={handleSave}>
              <Save size={14} /> Save note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
