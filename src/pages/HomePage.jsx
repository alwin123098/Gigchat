import { Link } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export default function HomePage({ Avatar, formatRelativeTime }) {
  const {
    users,
    jobs,
    currentUser,
    activeSkill,
    skillOptions,
    setActiveSkill,
    addReply,
    selectFreelancer
  } = useApp();
  const [drafts, setDrafts] = useState({});
  const isClient = currentUser.type === "client";

  const filteredJobs =
    activeSkill === "All" ? jobs : jobs.filter((job) => job.skill === activeSkill);
  const clientJobs = filteredJobs.filter((job) => job.clientId === currentUser.id);
  const freelancerJobs = filteredJobs.filter((job) => job.clientId !== currentUser.id);

  return (
    <div className="page-grid">
      <section className="page-column">
        <div className="hero card">
          <div>
            <p className="eyebrow">{isClient ? "Client section" : "Freelancer section"}</p>
            <h3>
              {isClient
                ? "Post jobs and manage incoming freelancer replies"
                : "Reply to client job requests in the public feed"}
            </h3>
            <p>
              {isClient
                ? "Your posts stay public until you select one freelancer and move the deal into private chat."
                : "Pitch directly in-thread with a fast intro. Once selected, the conversation moves into private chat."}
            </p>
          </div>
          {isClient ? (
            <Link to="/post-job" className="primary-button">
              Client: Post a new job
            </Link>
          ) : (
            <a href="#freelancer-feed" className="primary-button">
              Freelancer: Jump to reply feed
            </a>
          )}
        </div>

        <div className="filter-bar card">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              className={`filter-pill ${activeSkill === skill ? "active" : ""}`}
              onClick={() => setActiveSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="feed-list">
          {isClient && (
            <section className="dashboard-section">
              <div className="section-heading">
                <h3>Your client posts</h3>
                <span>{clientJobs.length} jobs</span>
              </div>
              {clientJobs.length === 0 && (
                <div className="empty-state card">
                  <strong>No posts yet.</strong>
                  <p>Create your first client job post to start getting freelancer replies.</p>
                </div>
              )}
            </section>
          )}

          {(isClient ? clientJobs : freelancerJobs).map((job) => {
            const client = users.find((user) => user.id === job.clientId);
            const isOwner = currentUser.id === client.id;
            const canReply =
              currentUser.type === "freelancer" && !isOwner && !job.selectedFreelancerId;
            const selectedFreelancer = users.find((user) => user.id === job.selectedFreelancerId);

            return (
              <article
                key={job.id}
                id={!isClient ? "freelancer-feed" : undefined}
                className="job-card card"
              >
                <div className="job-header">
                  <div className="user-inline">
                    <Avatar user={client} />
                    <div>
                      <strong>{client.name}</strong>
                      <span>{client.company}</span>
                    </div>
                  </div>
                  <span className="job-time">{formatRelativeTime(job.createdAt)}</span>
                </div>

                <div className="job-meta">
                  <div>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                  </div>
                  <div className="budget-box">
                    <strong>{currency.format(job.budget)}</strong>
                    <span>Budget</span>
                  </div>
                </div>

                <div className="job-foot">
                  <div className="tag-row">
                    {job.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="job-deadline">Deadline: {job.deadline}</div>
                </div>

                <div className="thread-block">
                  <div className="section-heading">
                    <h4>Freelancer replies</h4>
                    <span>{job.replies.length} responses</span>
                  </div>

                  {job.replies.map((reply) => {
                    const freelancer = users.find((user) => user.id === reply.freelancerId);
                    return (
                      <div key={reply.id} className="reply-card">
                        <div className="user-inline">
                          <Avatar user={freelancer} size="small" />
                          <div>
                            <strong>{freelancer.name}</strong>
                            <span>{freelancer.skills?.join(" · ")}</span>
                          </div>
                        </div>
                        <p>{reply.message}</p>
                        <div className="reply-actions">
                          <Link to={`/profile/${freelancer.id}`} className="text-link">
                            View profile
                          </Link>
                          {isOwner && !job.selectedFreelancerId && (
                            <button
                              className="secondary-button"
                              onClick={() => selectFreelancer(job.id, freelancer.id)}
                            >
                              Client: Select freelancer
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {selectedFreelancer && (
                    <div className="selected-banner">
                      <strong>{selectedFreelancer.name}</strong> has been selected for this job.
                      <Link to={`/chat/${job.id}`} className="text-link">
                        Open private chat
                      </Link>
                    </div>
                  )}

                  {canReply && (
                    <form
                      className="reply-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const message = drafts[job.id]?.trim();
                        if (!message) return;
                        addReply(job.id, message);
                        setDrafts((prev) => ({ ...prev, [job.id]: "" }));
                      }}
                    >
                      <textarea
                        rows="3"
                        value={drafts[job.id] ?? ""}
                        onChange={(event) =>
                          setDrafts((prev) => ({ ...prev, [job.id]: event.target.value }))
                        }
                        placeholder='Write a direct pitch, for example "I can do this"'
                      />
                      <button className="primary-button" type="submit">
                        Freelancer: Reply to this job
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="side-column">
        <div className="card spotlight-card">
          <p className="eyebrow">{isClient ? "Client workflow" : "Freelancer workflow"}</p>
          <ol className="steps-list">
            {isClient ? (
              <>
                <li>Post a job from the client section.</li>
                <li>Watch freelancer replies arrive on your post.</li>
                <li>Select one freelancer and move to private chat.</li>
                <li>Fund escrow and release payment after completion.</li>
              </>
            ) : (
              <>
                <li>Browse open client requests in the freelancer section.</li>
                <li>Reply publicly with your offer and experience.</li>
                <li>Wait for the client to select your reply.</li>
                <li>Deliver work in private chat and collect payment.</li>
              </>
            )}
          </ol>
        </div>

        <div className="card spotlight-card">
          <p className="eyebrow">How GigChat works</p>
          <ol className="steps-list">
            <li>Clients post a brief with budget and deadline.</li>
            <li>Freelancers respond live in the public thread.</li>
            <li>Client selects one reply and opens private chat.</li>
            <li>Escrow UI, delivery, reviews, and payment release happen in one flow.</li>
          </ol>
        </div>

        <div className="card stat-card">
          <div className="section-heading">
            <h3>Marketplace Snapshot</h3>
          </div>
          <div className="stat-grid">
            <div>
              <strong>{jobs.length}</strong>
              <span>Open and active jobs</span>
            </div>
            <div>
              <strong>{users.filter((user) => user.type === "freelancer").length}</strong>
              <span>Freelancers in the demo pool</span>
            </div>
            <div>
              <strong>
                {jobs.filter((job) => job.selectedFreelancerId && !job.paymentReleased).length}
              </strong>
              <span>Projects in private chat</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
