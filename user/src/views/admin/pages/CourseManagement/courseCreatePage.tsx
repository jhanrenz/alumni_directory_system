import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCourse } from "../../../../hooks/useCourse";
import type { Course } from "../../../../types/course";

const CourseCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCourse();

  const [form, setForm] = useState<Course>({
    id: 0,
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(form, {
      onSuccess: () => {
        navigate("/admin/courses");
      },
    });
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Course</h1>
          <p className="text-gray-500 text-sm">Create a new course.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter course name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {createMutation.isPending ? "Creating..." : "Create Course"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CourseCreatePage;