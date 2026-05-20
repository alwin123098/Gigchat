import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const initialForm = {
  title: "",
  description: "",
  skill: "Design",
  budget: "",
  deadline: ""
};

export default function PostJobPage() {
  const { currentUser, postJob } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);

  if (currentUser.type !== "client") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="page-grid single-page">
      <section className="page-column">
        <div className="card form-card">
          <p className="eyebrow">Client workflow</p>
          <h3>Post a job into the live feed</h3>
          <p>
            Keep it concise. The best responses happen when budget, deliverables, and timing are
            explicit.
          </p>

          <form
            className="job-form"
            onSubmit={(event) => {
              event.preventDefault();
              postJob(form);
              navigate("/home");
            }}
          >
            <label>
              Job title
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Need a product teaser edit"
                required
              />
            </label>

            <label>
              Description
              <textarea
                rows="6"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Describe the exact scope, assets available, and what success looks like."
                required
              />
            </label>

            <div className="input-row">
              <label>
                Skill needed
                <select
                  value={form.skill}
                  onChange={(event) => setForm((prev) => ({ ...prev, skill: event.target.value }))}
                >
                  <option>Design</option>
                  <option>Video Editing</option>
                  <option>Coding</option>
                  <option>Writing</option>
                  <option>Music</option>
                  <option>Marketing</option>
                </select>
              </label>

              <label>
                Budget
                <input
                  type="number"
                  min="50"
                  value={form.budget}
                  onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                  placeholder="500"
                  required
                />
              </label>

              <label>
                Deadline
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, deadline: event.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <button type="submit" className="primary-button">
              Publish to live feed
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
