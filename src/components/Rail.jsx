export default function Rail() {
  return (
    <div className="av-rail">
      <div className="av-rail-brand">
        <img src="/logo.png" alt="Logo" width="34" height="34" />
      </div>
      <div className="av-rail-nav">
        <button className="av-rail-btn" title="Dashboard">
          ▦<span className="av-rail-tip">Dashboard</span>
        </button>
        <button className="av-rail-btn active" title="Collections">
          🗂<span className="av-rail-tip">Collections</span>
        </button>
        <button className="av-rail-btn" title="Tags">
          🏷<span className="av-rail-tip">Tags</span>
        </button>
        <button className="av-rail-btn" title="Starred">
          ★<span className="av-rail-tip">Starred</span>
        </button>
        <button className="av-rail-btn" title="Archive">
          ▤<span className="av-rail-tip">Archive</span>
        </button>
      </div>
      <div className="av-rail-foot">
        <button className="av-rail-btn" title="Theme">
          ◐<span className="av-rail-tip">Toggle theme</span>
        </button>
        <button className="av-rail-btn" title="Settings">
          ⚙<span className="av-rail-tip">Settings</span>
        </button>
      </div>
    </div>
  );
}
