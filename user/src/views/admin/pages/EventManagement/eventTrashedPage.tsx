import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import {
  useFetchTrashedEvents,
  useRestoreEvent,
  useForceDeleteEvent,
} from "../../../../hooks/useEvent";
import type { Event } from "../../../../types/event";

// Debounce utility
function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const EventTrashedPage = () => {
  const [search, setSearch] = useState("");
  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    []
  );

  const { data: events = [], isLoading, isError } = useFetchTrashedEvents(search);
  const restoreEventMutation = useRestoreEvent();
  const forceDeleteEventMutation = useForceDeleteEvent();

  const handleRestore = async (id: number) => {
    if (!confirm("Are you sure you want to restore this event?")) return;
    try {
      await restoreEventMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Failed to restore event");
    }
  };

  const handleForceDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this event?")) return;
    try {
      await forceDeleteEventMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header + Back button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Title / Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Trashed Events
              <span className="text-lg text-gray-500">{events.length}</span>
            </h1>
            <p className="text-gray-500 mt-1">Manage deleted events</p>
          </div>

          {/* Back button on far right */}
          <Link
            to="/admin/events"
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-black transition"

          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search trashed events..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />

        {/* Loading / Error */}
        {isLoading && (
          <div className="text-center py-10 text-gray-400 text-sm">Loading events...</div>
        )}
        {isError && (
          <div className="text-center py-10 text-red-500 text-sm">
            Failed to load trashed events
          </div>
        )}

        {/* Event List */}
        {!isLoading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event: Event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                {/* Title + Date */}
                <div className="flex justify-between items-start">
                  <h2 className="text-base font-semibold text-gray-800">{event.title}</h2>
                  <span className="text-xs text-gray-400">
                    {event.created_at
                      ? new Date(event.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {event.description}
                </p>

                {/* Meta info */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {event.location}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleRestore(event.id)}
                    className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleForceDelete(event.id)}
                    className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No trashed events found.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTrashedPage;