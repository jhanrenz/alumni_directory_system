import { useState, useMemo } from "react";
import { useFetchEvents } from "../../../hooks/useEvent";
import type { Event } from "../../../types/event";
import { Calendar, Clock, MapPin } from "lucide-react";

function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const EventPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"upcoming" | "done" | "all">("upcoming");

  const statusParam = filter === "all" ? undefined : filter;

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    []
  );

  const { data: events = [], isLoading, isError } = useFetchEvents(
    search,
    statusParam
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Events Feed</h1>
            <p className="text-sm text-gray-500">
              {events.length} posts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
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
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-10 text-red-500 text-sm">
            Failed to load events
          </div>
        )}

        {/* Event Feed */}
        {!isLoading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event: Event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {/* Title + Status */}
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
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

                {/* Description */}
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>

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

                {/* Created At */}
                <div className="text-right text-xs text-gray-400 mt-2">
                  Posted on {event.created_at ? new Date(event.created_at).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No events found
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;