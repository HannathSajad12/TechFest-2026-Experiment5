import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function MyRegistrations() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/registrations/my")
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load registrations"))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="page">
        <h1>My Registrations</h1>
        <p>Please <Link to="/login">log in</Link> to see your registrations.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Registrations</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && items.length === 0 && <p>You have not registered for any event yet.</p>}
      <div className="event-grid">
        {items.map((r) => (
          <div className="event-card" key={r._id}>
            {r.event ? (
              <>
                <h3>{r.event.name}</h3>
                <p>Category: {r.event.category}</p>
                <p>Fee: {r.event.fee === 0 ? "Free" : `Rs. ${r.event.fee}`}</p>
                {r.event.date && <p>Date: {new Date(r.event.date).toLocaleDateString()}</p>}
              </>
            ) : (
              <p>This event was removed.</p>
            )}
            <p>Registered on: {new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRegistrations;
