import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function RatingForm({ onSubmit, label }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <form
      className="rating-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(rating, comment);
        setComment("");
      }}
    >
      <h4>{label}</h4>
      <label>
        Rating
        <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} star{value > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <label>
        Comment
        <textarea
          rows="3"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share how the project went."
          required
        />
      </label>
      <button className="secondary-button" type="submit">
        Submit review
      </button>
    </form>
  );
}

export default function ChatPage({ Avatar, formatRelativeTime }) {
  const { id } = useParams();
  const {
    users,
    jobs,
    chats,
    reviews,
    currentUser,
    sendMessage,
    payToEscrow,
    markAsComplete,
    releasePayment,
    submitReview
  } = useApp();
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const job = jobs.find((item) => item.id === id);
  const chat = chats.find((item) => item.jobId === id);

  const participants = useMemo(() => {
    if (!job?.selectedFreelancerId) return {};
    return {
      client: users.find((user) => user.id === job.clientId),
      freelancer: users.find((user) => user.id === job.selectedFreelancerId)
    };
  }, [job, users]);

  if (!job) {
    return (
      <div className="card">
        <h3>Chat not found</h3>
      </div>
    );
  }

  if (!job.selectedFreelancerId || !chat) {
    return (
      <div className="card">
        <h3>This job does not have a private chat yet.</h3>
        <p className="muted">Select a freelancer from the live feed first.</p>
        <Link to="/home" className="text-link">
          Return to feed
        </Link>
      </div>
    );
  }

  const isClient = currentUser.id === job.clientId;
  const escrowTotal = job.budget * 1.1;
  const existingReview = reviews.find(
    (review) => review.jobId === id && review.fromUserId === currentUser.id
  );

  return (
    <div className="page-grid">
      <section className="page-column">
        <div className="card chat-header-card">
          <div>
            <p className="eyebrow">Private chat</p>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
          </div>
          <div className="participant-strip">
            <div className="user-inline">
              <Avatar user={participants.client} size="small" />
              <span>{participants.client.name}</span>
            </div>
            <div className="connector">↔</div>
            <div className="user-inline">
              <Avatar user={participants.freelancer} size="small" />
              <span>{participants.freelancer.name}</span>
            </div>
          </div>
        </div>

        <div className="chat-layout">
          <div className="card chat-stream">
            {chat.messages.map((entry) => {
              const sender = users.find((user) => user.id === entry.senderId);
              const mine = sender.id === currentUser.id;
              return (
                <div key={entry.id} className={`chat-bubble ${mine ? "mine" : ""}`}>
                  <div className="user-inline">
                    <Avatar user={sender} size="small" />
                    <div>
                      <strong>{sender.name}</strong>
                      <span>{formatRelativeTime(entry.createdAt)}</span>
                    </div>
                  </div>
                  <p>{entry.text}</p>
                  {entry.type === "file" && entry.fileName && (
                    <div className="file-pill">File: {entry.fileName}</div>
                  )}
                </div>
              );
            })}

            <form
              className="message-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!message.trim()) return;
                sendMessage(id, { type: "text", text: message.trim() });
                setMessage("");
              }}
            >
              <textarea
                rows="3"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a private message"
              />
              <div className="message-actions">
                <button className="primary-button" type="submit">
                  Send message
                </button>
              </div>
            </form>

            <form
              className="file-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!fileName.trim()) return;
                sendMessage(id, {
                  type: "file",
                  text: "Shared a project file",
                  fileName: fileName.trim()
                });
                setFileName("");
              }}
            >
              <input
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder="Mock file name, for example final-cut-v2.mp4"
              />
              <button className="secondary-button" type="submit">
                Share file
              </button>
            </form>
          </div>

          <aside className="card deal-panel">
            <div className="section-heading">
              <h3>Escrow & completion</h3>
            </div>

            <div className="deal-metrics">
              <div>
                <span>Job amount</span>
                <strong>{currency.format(job.budget)}</strong>
              </div>
              <div>
                <span>Platform fee</span>
                <strong>{currency.format(job.budget * 0.1)}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{currency.format(escrowTotal)}</strong>
              </div>
            </div>

            {!job.escrowPaid && isClient && (
              <button className="primary-button" onClick={() => payToEscrow(id)}>
                Pay to escrow
              </button>
            )}

            {!job.completed && (
              <button className="secondary-button" onClick={() => markAsComplete(id)}>
                Mark as complete
              </button>
            )}

            {job.completed && !job.paymentReleased && isClient && (
              <button className="primary-button" onClick={() => releasePayment(id)}>
                Release payment
              </button>
            )}

            <div className="status-list">
              <div className={job.escrowPaid ? "status-active" : ""}>Escrow funded</div>
              <div className={job.completed ? "status-active" : ""}>Work marked complete</div>
              <div className={job.paymentReleased ? "status-active" : ""}>Payment released</div>
            </div>

            {job.paymentReleased && !existingReview && (
              <RatingForm
                label="Leave a review"
                onSubmit={(rating, comment) =>
                  submitReview(
                    id,
                    isClient ? participants.freelancer.id : participants.client.id,
                    rating,
                    comment
                  )
                }
              />
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
