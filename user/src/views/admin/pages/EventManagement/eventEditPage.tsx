import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminFetchEvents, useUpdateEvent } from "../../../../hooks/useEvent";
import type { Event } from "../../../../types/event";

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: events = [], isLoading } = useAdminFetchEvents();
  const updateMutation = useUpdateEvent();

  const event = events.find((e) => e.id === Number(id));

  // ✅ Include 'id' in state so it matches Event type
  const [data, setData] = useState<Event>({
    id: 0, // placeholder, will be replaced in useEffect
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "upcoming",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Populate form
  useEffect(() => {
    if (event) {
      setData({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        status: (event.status as "upcoming" | "done") || "upcoming",
      });
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to update this event?")) return;
    if (!id) return;

    try {
      setLoading(true);
      // Pass the full Event object
      await updateMutation.mutateAsync({
        id: Number(id),
        data,
      });
      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <span className="animate-spin border-4 border-gray-900 border-t-transparent rounded-full w-12 h-12"></span>
      </div>
    );
  }

  // ❗ If event not found
  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">
        Event not found
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
  <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          name="title"
          type="text"
          value={data.title}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          required
          disabled={loading}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        />
      </div>

      {/* Date & Time */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            name="date"
            type="date"
            value={data.date}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            name="time"
            type="time"
            value={data.time}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          name="location"
          type="text"
          value={data.location}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={data.status}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        >
          <option value="upcoming">UPCOMING</option>
          <option value="done">DONE</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => navigate("/admin/events")}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm"
        >
          {updateMutation.isPending ? "Updating..." : "Update Event"}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default EventEditPage;