import { useState, useEffect } from "react";
import {
  Moon,
  FileCode,
  Eye,
  FolderClosed,
  Keyboard,
  HardDrive,
  Zap,
  ChevronRight,
  Info,
  Layers,
  Tag,
  Sparkles,
} from "lucide-react";

export default function SettingsView({ counts, totalNotes }) {
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        total += (localStorage.getItem(key) || "").length;
      }
      setStorageUsed(Math.round(total / 1024));
    } catch {
      setStorageUsed(0);
    }
  }, []);

  const collectionCount = Object.keys(counts || {}).filter(
    (key) => key !== "All" && key !== "Favorites" && key !== "Recall",
  ).length;

  const storagePercent = Math.min((storageUsed / 5120) * 100, 100); // 5MB max

  return (
    <div className="av-detail-view">
      <div className="av-content-head">
        <h1 className="av-content-h1">Settings</h1>
      </div>
      <p className="av-content-sub">
        A lightweight workspace overview and quick controls for now.
      </p>

      <div className="av-settings-grid">
        {/* Appearance Card */}
        <div className="av-settings-card" style={{ animationDelay: "0ms" }}>
          <div className="av-settings-card-header">
            <Moon size={16} />
            <span className="av-settings-label">Appearance</span>
          </div>
          <div className="av-settings-row">
            <span>Dark mode</span>
            <label className="av-switch">
              <input type="checkbox" defaultChecked />
              <span className="av-switch-slider" />
            </label>
          </div>
          <div className="av-settings-row">
            <span>Reduce animations</span>
            <label className="av-switch">
              <input type="checkbox" />
              <span className="av-switch-slider" />
            </label>
          </div>
        </div>

        {/* Workspace Stats Card */}
        <div className="av-settings-card" style={{ animationDelay: "60ms" }}>
          <div className="av-settings-card-header">
            <Layers size={16} />
            <span className="av-settings-label">Workspace Stats</span>
          </div>
          <div className="av-stats-tiles">
            <div className="av-stat-tile">
              <div className="av-stat-icon av-stat-blue">
                <FileCode size={18} />
              </div>
              <div className="av-stat-data">
                <strong>{totalNotes}</strong>
                <span>Total snippets</span>
              </div>
            </div>
            <div className="av-stat-tile">
              <div className="av-stat-icon av-stat-cyan">
                <Eye size={18} />
              </div>
              <div className="av-stat-data">
                <strong>{counts?.All ?? 0}</strong>
                <span>Visible</span>
              </div>
            </div>
            <div className="av-stat-tile">
              <div className="av-stat-icon av-stat-violet">
                <FolderClosed size={18} />
              </div>
              <div className="av-stat-data">
                <strong>{collectionCount}</strong>
                <span>Collections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Card */}
        <div className="av-settings-card" style={{ animationDelay: "120ms" }}>
          <div className="av-settings-card-header">
            <Keyboard size={16} />
            <span className="av-settings-label">Keyboard Shortcuts</span>
          </div>
          <div className="av-shortcuts-list">
            <div className="av-shortcut-row">
              <span>New snippet</span>
              <div className="av-kbd-group">
                <kbd>Ctrl</kbd>
                <span className="av-kbd-plus">+</span>
                <kbd>N</kbd>
              </div>
            </div>
            <div className="av-shortcut-row">
              <span>Quick search</span>
              <div className="av-kbd-group">
                <kbd>Ctrl</kbd>
                <span className="av-kbd-plus">+</span>
                <kbd>K</kbd>
              </div>
            </div>
            <div className="av-shortcut-row">
              <span>Close panel</span>
              <div className="av-kbd-group">
                <kbd>Esc</kbd>
              </div>
            </div>
            <div className="av-shortcut-row">
              <span>Save snippet</span>
              <div className="av-kbd-group">
                <kbd>Ctrl</kbd>
                <span className="av-kbd-plus">+</span>
                <kbd>S</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Storage Card */}
        <div className="av-settings-card" style={{ animationDelay: "180ms" }}>
          <div className="av-settings-card-header">
            <HardDrive size={16} />
            <span className="av-settings-label">Data & Storage</span>
          </div>
          <div className="av-storage-info">
            <div className="av-storage-header">
              <span>Local browser storage</span>
              <span className="av-storage-amount">{storageUsed} KB / 5 MB</span>
            </div>
            <div className="av-storage-bar">
              <div
                className="av-storage-fill"
                style={{ width: `${Math.max(storagePercent, 2)}%` }}
              />
            </div>
            <p className="av-storage-note">
              All data is stored locally in your browser. Nothing leaves your
              device.
            </p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="av-settings-card" style={{ animationDelay: "240ms" }}>
          <div className="av-settings-card-header">
            <Zap size={16} />
            <span className="av-settings-label">Quick Actions</span>
          </div>
          <div className="av-actions-list">
            <button className="av-action-row" type="button">
              <FolderClosed size={15} />
              <span>Manage collections from the sidebar</span>
              <ChevronRight size={14} className="av-action-chevron" />
            </button>
            <button className="av-action-row" type="button">
              <Tag size={15} />
              <span>Use tags to organize snippets</span>
              <ChevronRight size={14} className="av-action-chevron" />
            </button>
            <button className="av-action-row" type="button">
              <Sparkles size={15} />
              <span>Enable recall for spaced review</span>
              <ChevronRight size={14} className="av-action-chevron" />
            </button>
          </div>
        </div>

        {/* About Card */}
        <div className="av-settings-card" style={{ animationDelay: "300ms" }}>
          <div className="av-settings-card-header">
            <Info size={16} />
            <span className="av-settings-label">About</span>
          </div>
          <div className="av-about-content">
            <div className="av-about-brand">
              <div className="av-about-logo">
                <img src="/logo.png" alt="logo" />
              </div>
              <div>
                <strong>SnipDesk</strong>
                <span>v0.1.0-alpha</span>
              </div>
            </div>
            <p className="av-about-desc">
              A lightweight code snippet manager built for developers. Organize,
              tag, and recall your most important code patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
