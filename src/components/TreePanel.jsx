import { useEffect, useRef, useState } from "react";
import { LANGUAGES, RECALL_COLLECTION } from "../hooks/useNotes.js";
import {
  FolderClosed,
  Tag,
  LayoutDashboard,
  Settings,
  Archive,
  Star,
  Lightbulb,
} from "lucide-react";

export default function TreePanel({
  counts,
  collections,
  activeCollection,
  setActiveCollection,
  activeLang,
  setActiveLang,
  searchQuery,
  setSearchQuery,
  onAddCollection,
  onRenameCollection,
  onDeleteCollection,
}) {
  const [menuFor, setMenuFor] = useState(null);
  const [draftMode, setDraftMode] = useState(null);
  const [draftCollection, setDraftCollection] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftError, setDraftError] = useState("");
  const holdRef = useRef(null);
  const skipClickRef = useRef(false);

  useEffect(() => {
    const closeMenu = () => setMenuFor(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    return () => clearTimeout(holdRef.current);
  }, []);

  const clearDraft = () => {
    setDraftMode(null);
    setDraftCollection(null);
    setDraftName("");
    setDraftError("");
  };

  const selectCollection = (c) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }
    setActiveCollection(c);
  };

  const selectLang = (l) => {
    setActiveLang(activeLang === l ? null : l);
  };

  const openMenu = (e, c) => {
    e.preventDefault();
    e.stopPropagation();
    clearDraft();
    setMenuFor((current) => (current === c ? null : c));
  };

  const startHold = (c) => {
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => {
      skipClickRef.current = true;
      clearDraft();
      setMenuFor(c);
    }, 550);
  };

  const stopHold = () => {
    clearTimeout(holdRef.current);
    holdRef.current = null;
  };

  const startRename = (c) => {
    setMenuFor(null);
    setDraftMode("rename");
    setDraftCollection(c);
    setDraftName(c);
    setDraftError("");
  };

  const saveCollection = (e) => {
    e.preventDefault();
    const name = draftName.trim();

    if (!name) {
      setDraftError("Name required");
      return;
    }

    const saved =
      draftMode === "rename"
        ? onRenameCollection(draftCollection, name)
        : onAddCollection(name);

    if (!saved) {
      setDraftError("Name already exists");
      return;
    }

    clearDraft();
  };

  const removeCollection = (c) => {
    setMenuFor(null);
    if (
      window.confirm(`Delete "${c}"? Snippets will move to another collection.`)
    ) {
      onDeleteCollection(c);
      clearDraft();
    }
  };

  const collectionForm = () => (
    <form className="av-collection-editor" onSubmit={saveCollection}>
      <input
        autoFocus
        type="text"
        value={draftName}
        placeholder="Collection name"
        onChange={(e) => {
          setDraftName(e.target.value);
          setDraftError("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearDraft();
        }}
      />
      <div className="av-collection-editor-actions">
        <button type="submit">{draftMode === "rename" ? "Save" : "Add"}</button>
        <button type="button" onClick={clearDraft}>
          Cancel
        </button>
      </div>
      {draftError && <span className="av-collection-error">{draftError}</span>}
    </form>
  );

  const [showAllLangs, setShowAllLangs] = useState(false);

  return (
    <div className="av-tree-panel">
      <div className="av-tree-brand">
        <img src="/logo.png" alt="Logo" width="40" />
        SnipDesk
      </div>

      <div className="av-panel-label">Workspace</div>

      <div className="av-tree">
        {draftMode === "add" && collectionForm()}

        <button
          className={`av-tree-row${activeCollection === "All" ? " active" : ""}`}
          onClick={() => selectCollection("All")}>
          <span className="av-tree-icon">
            <LayoutDashboard width="20" height="20" />
          </span>
          Dashboard
          <span className="av-tree-count">{counts.All ?? 0}</span>
        </button>
        <button
          className={`av-tree-row${activeCollection === "Favorites" ? " active" : ""}`}
          onClick={() => selectCollection("Favorites")}>
          <span className="av-tree-icon">
            <Star width="20" height="20" />
          </span>
          Favorites
          <span className="av-tree-count">{counts.Favorites ?? 0}</span>
        </button>
        <button
          className={`av-tree-row${activeCollection === RECALL_COLLECTION ? " active" : ""}`}
          onClick={() => selectCollection(RECALL_COLLECTION)}>
          <span className="av-tree-icon">
            <Lightbulb width="20" height="20" />
          </span>
          147 Recall
          <span className="av-tree-count">
            {counts[RECALL_COLLECTION] ?? 0}
          </span>
        </button>
        <button
          className={`av-tree-row${activeCollection === "tags" ? " active" : ""}`}
          onClick={() => selectCollection("tags")}>
          <span className="av-tree-icon">
            <Tag width="20" height="20" />
          </span>
          Tags
          <span className="av-tree-count">{counts["tags"] ?? 0}</span>
        </button>

        <button
          className={`av-tree-row${activeCollection === "settings" ? " active" : ""}`}
          onClick={() => selectCollection("settings")}>
          <span className="av-tree-icon">
            <Settings width="20" height="20" />
          </span>
          Settings
        </button>

        {/* {collections.map((c) => (
          <div className="av-collection-row" key={c}>
            {draftMode === "rename" && draftCollection === c ? (
              collectionForm()
            ) : (
              <>
                <button
                  className={`av-tree-row${activeCollection === c ? " active" : ""}`}
                  onClick={() => selectCollection(c)}
                  onContextMenu={(e) => openMenu(e, c)}
                  onTouchStart={() => startHold(c)}
                  onTouchEnd={stopHold}
                  onTouchMove={stopHold}
                  onTouchCancel={stopHold}>
                  <span className="av-tree-icon">
                    <FolderClosed width="20" height="20" />
                  </span>
                  {c}
                  <span className="av-tree-count">{counts[c] ?? 0}</span>
                </button>
                {menuFor === c && (
                  <div
                    className="av-collection-menu"
                    onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={() => startRename(c)}>
                      Rename
                    </button>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => removeCollection(c)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))} */}
      </div>

      <div
        className="av-panel-label"
        style={{ marginTop: "auto", paddingTop: "20px" }}>
        Languages
      </div>
      <div className="av-tag-row">
        {(showAllLangs ? LANGUAGES : LANGUAGES.slice(0, 4)).map((l) => (
          <button
            key={l}
            className={`av-tag-chip ${activeLang === l ? "active" : ""}`}
            title={l}
            onClick={() => selectLang(l)}>
            {l.slice(0, 3).toUpperCase()}
          </button>
        ))}
        {LANGUAGES.length > 4 && (
          <button
            className="av-tag-chip"
            onClick={() => setShowAllLangs((s) => !s)}
            title={showAllLangs ? "Show less" : "See more"}>
            {showAllLangs ? "-" : "+"}
          </button>
        )}
      </div>
    </div>
  );
}

/*

<FolderClosed />
<Tag />
<Star />
<Archive />
<Settings />
<LayoutDashboard />
*/
