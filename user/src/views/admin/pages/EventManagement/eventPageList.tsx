import { useState, useMemo } from "react";
import { useAdminFetchEvents, useDeleteEvent } from "../../../../hooks/useEvent";
import type { Event } from "../../../../types/event";
import { Link } from "react-router-dom";
import { Plus, Trash2, Calendar, Clock, MapPin } from "lucide-react";

function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const EventPageList = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"upcoming" | "done" | "all">("all");

  // 🔥 Convert "all" → undefined (para walang filter sa backend)
  const statusParam = filter === "all" ? undefined : filter;

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    []
  );

  const deleteEventMutation = useDeleteEvent();

  const {
    data: events = [],
    isLoading,
    isError,
  } = useAdminFetchEvents(search, statusParam);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEventMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
       {/* Header */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
      Events
      <span className="text-sm text-gray-400">{events.length}</span>
    </h1>
    <p className="text-sm text-gray-500">Manage events</p>
  </div>

  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
    {/* Filter */}
    
    {/* Actions */}
    <div className="flex gap-2">
      <Link
        to="/admin/events/create"
        className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
      >
        <Plus size={16} />
        Add
      </Link>

      <Link
        to="/admin/events/trashed"
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-black transition"
      >
        <Trash2 size={16} />
        Trashed
      </Link>
    </div>
    <select
      value={filter}
      onChange={(e) =>
        setFilter(e.target.value as "upcoming" | "done" | "all")
      }
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
    >
      {["upcoming", "done", "all"].map((status) => (
        <option key={status} value={status}>
          {status.toUpperCase()}
        </option>
      ))}
    </select>
       <input
          type="text"
          placeholder="Search events"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />

  </div>
</div>
      
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Loading...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-10 text-red-500 text-sm">
            Failed to load events
          </div>
        )}

        {/* Event List */}
        {!isLoading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event: Event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
              >
                {/* Title + Date + Status */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-800">
                      {event.title}
                    </h2>

                    {/* ✅ Status Badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.status === "done"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

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

                {/* Meta */}
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
                  <Link
                    to={`/admin/events/edit/${event.id}`}
                    className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No events found
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPageList;