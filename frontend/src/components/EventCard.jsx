import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// Each event is shown as a ticket: details on the left, fee on the stub.
function EventCard({ event, onChange }) {
  const { token, user } = useAuth();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleRegister() {
    if (!token) {
      setIsError(true);
      setMessage("Log in to register for this event.");
      return;
    }
    try {
      const res = await api.post("/registrations", { eventId: event._id });
      setIsError(false);
      setMessage(res.data.message);
      onChange(); // reload so the seat count updates
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Server not reachable");
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${event.name}"?`)) return;
    try {
      await api.delete(`/events/${event._id}`);
      onChange();
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Could not delete");
    }
  }

  return (
    <article className="ticket" data-cat={event.category}>
      <div className="ticket-main">
        <span className="chip">{event.category}</span>
        <h3>{event.name}</h3>
        <p className="seats"><strong>{event.seats}</strong> seats left</p>
        <div className="ticket-actions">
          {event.seats === 0 ? (
            <button disabled>Sold out</button>
          ) : (
            <button onClick={handleRegister}>Register</button>
          )}
          {user?.role === "admin" && (
            <button className="danger-btn" onClick={handleDelete}>Delete</button>
          )}
        </div>
        {message && <p className={isError ? "error-msg" : "success-msg"}>{message}</p>}
      </div>
      <div className="ticket-stub">
        <span>Fee</span>
        <strong>{event.fee === 0 ? "Free" : `Rs. ${event.fee}`}</strong>
      </div>
    </article>
  );
}

export default EventCard;
