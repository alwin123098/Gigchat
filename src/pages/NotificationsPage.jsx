import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function NotificationsPage({ formatRelativeTime }) {
  const { notifications, currentUser, markNotificationRead } = useApp();
  const items = notifications.filter((item) => item.userId === currentUser.id);

  return (
    <div className="page-grid single-page">
      <section className="page-column">
        <div className="card">
          <div className="section-heading">
            <h3>All notifications</h3>
            <span>{items.length} total</span>
          </div>
          <div className="notification-list">
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`notification-row ${item.read ? "" : "unread"}`}
                onClick={() => markNotificationRead(item.id)}
              >
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <span>{formatRelativeTime(item.createdAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
