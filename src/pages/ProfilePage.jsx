import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Stars({ value }) {
  return <span className="stars">{"★".repeat(value)}{"☆".repeat(5 - value)}</span>;
}

export default function ProfilePage({ Avatar, formatRelativeTime }) {
  const { id } = useParams();
  const { users, jobs, reviews } = useApp();
  const user = users.find((item) => item.id === id);

  const profileReviews = reviews.filter((review) => review.toUserId === id);
  const average = useMemo(() => {
    if (profileReviews.length === 0) return null;
    return (
      profileReviews.reduce((sum, review) => sum + review.rating, 0) / profileReviews.length
    ).toFixed(1);
  }, [profileReviews]);

  if (!user) {
    return (
      <div className="card">
        <h3>User not found</h3>
      </div>
    );
  }

  return (
    <div className="page-grid">
      <section className="page-column">
        <div className="card profile-hero">
          <Avatar user={user} size="large" />
          <div>
            <p className="eyebrow">{user.type}</p>
            <h3>{user.name}</h3>
            <p>{user.company || user.bio}</p>
            {user.skills && (
              <div className="tag-row">
                {user.skills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {user.type === "freelancer" ? (
          <>
            <div className="card">
              <div className="stat-grid">
                <div>
                  <strong>{average || user.rating}</strong>
                  <span>Average rating</span>
                </div>
                <div>
                  <strong>{user.completedJobs}</strong>
                  <span>Completed jobs</span>
                </div>
                <div>
                  <strong>{profileReviews.length}</strong>
                  <span>Written reviews</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-heading">
                <h3>Portfolio links</h3>
              </div>
              <div className="link-list">
                {user.portfolio?.map((link) => (
                  <a href={`https://${link}`} key={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-heading">
                <h3>Reviews</h3>
              </div>
              {profileReviews.length === 0 && <p className="muted">No reviews yet.</p>}
              {profileReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <Stars value={review.rating} />
                  <p>{review.comment}</p>
                  <span>{formatRelativeTime(review.createdAt)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card">
            <div className="section-heading">
              <h3>Past jobs posted</h3>
            </div>
            {jobs
              .filter((job) => job.clientId === user.id)
              .map((job) => (
                <div key={job.id} className="list-row">
                  <div>
                    <strong>{job.title}</strong>
                    <p>{job.description}</p>
                  </div>
                  <Link className="text-link" to={`/chat/${job.id}`}>
                    Open project
                  </Link>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
