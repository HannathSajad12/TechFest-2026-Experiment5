import { useState, useEffect } from "react";
import EventList from "../components/EventList";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // admin "add event" form
  const [newEvent, setNewEvent] = useState({
    name: "", category: "Technical", fee: 0, seats: 50, date: ""
  });
  const [formMsg, setFormMsg] = useState("");

  async function loadEvents() {
    try {
      const res = await api.get("/events");
      setEvents(res.data.data);
      setError(null);
    } catch {
      setError("Could not load events. Is the backend running on port 5000?");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/events", {
        ...newEvent,
        fee: Number(newEvent.fee),
        seats: Number(newEvent.seats),
        date: newEvent.date || undefined
      });
      setFormMsg("Event added");
      setNewEvent({ name: "", category: "Technical", fee: 0, seats: 50, date: "" });
      loadEvents();
    } catch (err) {
      setFormMsg(err.response?.data?.message || "Could not add event");
    }
  }

  const filteredEvents = events.filter((event) => {
    const nameMatches = event.name.toLowerCase().includes(search.toLowerCase());
    const categoryMatches = category === "All" || event.category === category;
    return nameMatches && categoryMatches;
  });

  return (
    <div className="page">
      <h1>Events</h1>
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Technical">Technical</option>
        <option value="Workshop">Workshop</option>
        <option value="Cultural">Cultural</option>
        <option value="Sports">Sports</option>
      </select>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && <EventList events={filteredEvents} onChange={loadEvents} />}

      {user?.role === "admin" && (
        <form className="admin-form" onSubmit={handleAdd}>
          <h2>Admin: Add Event</h2>
          <label>Name</label>
          <input value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
          <label>Category</label>
          <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}>
            <option>Technical</option>
            <option>Workshop</option>
            <option>Cultural</option>
            <option>Sports</option>
          </select>
          <label>Fee</label>
          <input type="number" value={newEvent.fee} onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })} />
          <label>Seats</label>
          <input type="number" value={newEvent.seats} onChange={(e) => setNewEvent({ ...newEvent, seats: e.target.value })} />
          <label>Date</label>
          <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <button type="submit">Add Event</button>
          {formMsg && <p>{formMsg}</p>}
        </form>
      )}
    </div>
  );
}

export default Events;
