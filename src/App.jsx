import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useApp } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import PostJobPage from "./pages/PostJobPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";

function formatRelativeTime(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Avatar({ user, size = "medium" }) {
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: user.avatarColor }}
      aria-label={user.name}
    >
      {user.avatar}
    </div>
  );
}

function NotificationBell() {
  const { unreadNotifications, notifications, currentUser, markNotificationRead } = useApp();
  const [open, setOpen] = useState(false);
  const items = notifications
    .filter((item) => item.userId === currentUser.id)
    .slice(0, 4);

  return (
    <div className="notification-bell">
      <button className="icon-button" onClick={() => setOpen((value) => !value)}>
        <span>🔔</span>
        {unreadNotifications.length > 0 && <strong>{unreadNotifications.length}</strong>}
      </button>
      {open && (
        <div className="notification-dropdown card">
          <div className="section-heading">
            <h3>Notifications</h3>
          </div>
          {items.length === 0 && <p className="muted">No alerts yet.</p>}
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              className={`notification-item ${item.read ? "" : "unread"}`}
              onClick={() => {
                markNotificationRead(item.id);
                setOpen(false);
              }}
            >
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </NavLink>
          ))}
          <NavLink className="text-link" to="/notifications" onClick={() => setOpen(false)}>
            View all notifications
          </NavLink>
        </div>
      )}
    </div>
  );
}

function Shell() {
  const { users, currentUser, switchUser } = useApp();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">GC</div>
          <div>
            <h1>GigChat</h1>
            <p>Live work feed with deal flow built in.</p>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/home">Live Feed</NavLink>
          <NavLink to="/post-job">Post a Job</NavLink>
          <NavLink to={`/profile/${currentUser.id}`}>Your Profile</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
        </nav>

        <div className="account-switcher card">
          <div className="section-heading">
            <h3>Demo Accounts</h3>
          </div>
          {users.map((user) => (
            <button
              key={user.id}
              className={`account-option ${currentUser.id === user.id ? "active" : ""}`}
              onClick={() => switchUser(user.id)}
            >
              <Avatar user={user} size="small" />
              <span>
                {user.name}
                <small>{user.type}</small>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Real-time social marketplace</p>
            <h2>Find work. Hire talent. Close in chat.</h2>
          </div>
          <div className="topbar-actions">
            <NotificationBell />
            <NavLink to={`/profile/${currentUser.id}`} className="current-user card">
              <Avatar user={currentUser} size="small" />
              <div>
                <strong>{currentUser.name}</strong>
                <span>{currentUser.type}</span>
              </div>
            </NavLink>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage Avatar={Avatar} formatRelativeTime={formatRelativeTime} />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/profile/:id" element={<ProfilePage Avatar={Avatar} formatRelativeTime={formatRelativeTime} />} />
          <Route path="/chat/:id" element={<ChatPage Avatar={Avatar} formatRelativeTime={formatRelativeTime} />} />
          <Route path="/notifications" element={<NotificationsPage formatRelativeTime={formatRelativeTime} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <Shell />;
}
