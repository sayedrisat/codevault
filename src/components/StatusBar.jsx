import { Radio, Keyboard, Code2 } from "lucide-react";

export default function StatusBar({ totalSnippets }) {
  return (
    <div className="av-statusbar">
      <span className="av-sync-dot"></span>
      <span>Local storage</span>
      <span className="av-statusbar-divider" />
      <Code2 size={12} />
      <span>{totalSnippets ? `${totalSnippets.toLocaleString()} snippets` : "0 snippets"}</span>
      <div className="av-statusbar-spacer">
        <span className="av-statusbar-link">
          <Keyboard size={12} />
          Shortcuts
        </span>
        <span>v0.1.0-alpha</span>
      </div>
    </div>
  );
}
