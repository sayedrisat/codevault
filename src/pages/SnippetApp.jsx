import { lazy, Suspense, useEffect, useState } from "react";
import useNotes from "../hooks/useNotes.js";
import useToast from "../hooks/useToast.js";
import SidebarShell from "../components/SidebarShell.jsx";
import Topbar from "../components/Topbar.jsx";
import Toast from "../components/Toast.jsx";
import CollectionsView from "../components/CollectionsView.jsx";
import DetailView from "../components/DetailView.jsx";
import StatusBar from "../components/StatusBar.jsx";
import NewCollectionModal from "../components/NewCollectionModal.jsx";
import TagsView from "../components/TagsView.jsx";
import SettingsView from "../components/SettingsView.jsx";
import "../styles/app.css";

const EditorDrawer = lazy(() => import("../components/EditorDrawer.jsx"));

export default function SnippetApp() {
  const {
    notes,
    filteredNotes,
    collections,
    counts,
    activeCollection,
    setActiveCollection,
    activeLang,
    setActiveLang,
    searchQuery,
    setSearchQuery,
    saveNote,
    deleteNote,
    markRecall,
    resetRecall,
    addCollection,
    renameCollection,
    deleteCollection,
  } = useNotes();

  const { message, show } = useToast();

  const [view, setView] = useState("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasOpenedDrawer, setHasOpenedDrawer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("collections"); 
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 860) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [sidebarOpen]);

  const editingNote = editingId
    ? (notes.find((n) => n.id === editingId) ?? null)
    : null;

  const openNewNote = () => {
    setEditingId(null);
    setDrawerOpen(true);
    setHasOpenedDrawer(true);
  };

  const openEditNote = (id) => {
    setEditingId(id);
    setDrawerOpen(true);
    setHasOpenedDrawer(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleSave = (payload, id) => {
    saveNote(payload, id);
    show(id ? "Note updated" : "Note saved");
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    deleteNote(id);
    show("Note deleted");
    if (drawerOpen && editingId === id) setDrawerOpen(false);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => show("Copied to clipboard"));
  };

  const handleToggleFavorite = (note) => {
    saveNote({ ...note, favorite: !note.favorite }, note.id);
    show(note.favorite ? "Removed from favorites" : "Added to favorites");
  };
  
  const handleOpenCollection = (c) => {
    setActiveCollection(c);
    setActiveView("detail");
    setSearchQuery("");
  };
  
  const handleBackToCollections = () => {
    setActiveView("collections");
    setSearchQuery("");
  };

  const handleSelectTag = (tag) => {
    setSearchQuery(tag);
    setActiveView("detail");
  };

  const isSpecialView =
    activeCollection === "Favorites" ||
    activeCollection === "Recall" ||
    activeCollection === "tags" ||
    activeCollection === "settings";

  const handleCreateCollection = (name) => {
    if (addCollection(name)) {
      show("Collection created");
    } else {
      show("Collection name already exists or is invalid");
    }
  };

  return (
    <div className="app-shell">
      <SidebarShell
        counts={counts}
        collections={collections}
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddCollection={addCollection}
        onRenameCollection={renameCollection}
        onDeleteCollection={deleteCollection}
      />

      <main className="av-main">
        <Topbar
          activeCollection={activeCollection}
          view={view}
          setView={setView}
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewCollection={() => setModalOpen(true)}
        />
        
        <div className="av-content">
          <div className="av-content-glow" />
          <div className="av-content-inner">
            {activeCollection === "settings" ? (
              <SettingsView counts={counts} totalNotes={notes.length} />
            ) : activeCollection === "tags" ? (
              <TagsView notes={notes} onSelectTag={handleSelectTag} />
            ) : activeView === "collections" && !searchQuery && !activeLang && !isSpecialView ? (
              <CollectionsView 
                collections={collections} 
                counts={counts} 
                onOpenCollection={handleOpenCollection} 
                onNewNote={openNewNote}
              />
            ) : (
              <DetailView
                collection={
                  activeCollection === "All" && (searchQuery || activeLang)
                    ? "Search Results"
                    : activeCollection === "Favorites"
                      ? "Favorites"
                      : activeCollection === "Recall"
                        ? "147 Recall"
                        : activeCollection
                }
                description={
                  activeCollection === "Favorites"
                    ? "Your favorite snippets collected in one place."
                    : activeCollection === "Recall"
                      ? "Snippets currently enrolled in 1-4-7 recall." 
                      : undefined
                }
                notes={filteredNotes}
                view={view}
                onBack={handleBackToCollections}
                onOpenNote={openEditNote}
                onCopyNote={handleCopy}
                onDeleteNote={handleDelete}
                onRecallNote={(id) => {
                  markRecall(id);
                  show("Recall updated");
                }}
                onNewNote={openNewNote}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        </div>
        
        <StatusBar totalSnippets={counts.All} />
      </main>

      {hasOpenedDrawer && (
        <Suspense fallback={null}>
          <EditorDrawer
            open={drawerOpen}
            editingNote={editingNote}
            collections={collections}
            defaultLang={activeLang}
            defaultCollection={activeCollection}
            onClose={closeDrawer}
            onSave={handleSave}
            onDelete={handleDelete}
            onRecall={(id) => {
              markRecall(id);
              show("Recall updated");
            }}
            onResetRecall={(id) => {
              resetRecall(id);
              show("Recall restarted");
            }}
          />
        </Suspense>
      )}

      <NewCollectionModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreate={handleCreateCollection} 
      />

      <Toast message={message} />
      
      {/* Hidden button for triggering modal from CollectionsView new card */}
      <button id="newBtn" style={{display: 'none'}} onClick={() => setModalOpen(true)}></button>
    </div>
  );
}
