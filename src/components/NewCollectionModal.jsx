import { useEffect, useRef, useState } from "react";

export default function NewCollectionModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDesc("");
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (open && e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), desc.trim());
      onClose();
    }
  };

  return (
    <div 
      className={`av-modal-overlay ${open ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="av-modal">
        <h3>New collection</h3>
        <div className="av-modal-field">
          <label>Name</label>
          <input 
            ref={nameInputRef}
            type="text" 
            placeholder="e.g. GraphQL Snippets" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
        </div>
        <div className="av-modal-field">
          <label>Description</label>
          <textarea 
            rows="2" 
            placeholder="What lives in this collection?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="av-modal-foot">
          <button className="av-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="av-btn-primary" onClick={handleCreate} disabled={!name.trim()}>Create</button>
        </div>
      </div>
    </div>
  );
}
