import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // runs once, right after the page loads
  useEffect(() => {
    api.get("/announcements")
      .then((res) => {
        setPosts(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load announcements. Check that the backend is running.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="hero">
        <p className="hero-where">MBCET Campus, Thiruvananthapuram</p>
        <h1>TechFest 2026</h1>
        <p className="hero-sub">Three days of hackathons, workshops and competitions.</p>
        <div className="hero-actions">
          <Link className="btn" to="/events">Browse events</Link>
          <Link className="btn-ghost" to="/register">Create an account</Link>
        </div>
      </section>

      <section className="page">
        <h2>Notice board</h2>
        {loading && <p>Loading notices...</p>}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && (
          <ul className="notices">
            {posts.map((post) => (
              <li key={post.id} className="notice" data-tag={post.tag}>
                <span className="notice-tag">{post.tag}</span>
                <span className="notice-text">{post.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;
