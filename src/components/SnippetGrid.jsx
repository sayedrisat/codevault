import SnippetCard from './SnippetCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function SnippetGrid({
  notes,
  view,
  activeCollection,
  onOpen,
  onCopy,
  onDelete,
  onRecall,
  onNewNote,
  onToggleFavorite,
}) {
  if (notes.length === 0) {
    return <EmptyState activeCollection={activeCollection} onNewNote={onNewNote} />;
  }

  return (
    <div className={`av-grid${view === 'list' ? ' list-view' : ''}`}>
      {notes.map((note, i) => (
        <SnippetCard
          key={note.id}
          note={note}
          index={i}
          onOpen={onOpen}
          onCopy={onCopy}
          onDelete={onDelete}
          onRecall={onRecall}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
