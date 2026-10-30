import EventCard from "./EventCard";

// Receives an ARRAY of events (from the backend) and shows one card per event
function EventList({ events, onChange }) {
  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onChange={onChange} />
      ))}
    </div>
  );
}

export default EventList;
