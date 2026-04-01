import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdminFetchCourses, useUpdateCourse } from "../../../../hooks/useCourse";
import type { Course } from "../../../../types/course";

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: courses = [], isLoading } = useAdminFetchCourses();
  const updateMutation = useUpdateCourse();

  const course = courses.find((c) => c.id === Number(id));

  const [data, setData] = useState<Course>({ id: 0, name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setData({ ...course });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!confirm("Are you sure to update?")) return;    

    if (!data.name.trim() || !id) return;

    try {
      setLoading(true);
      await updateMutation.mutateAsync({ id: Number(id), data });
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <span className="animate-spin border-4 border-gray-900 border-t-transparent rounded-full w-12 h-12"></span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Course not found</p>
          <Link
            to="/admin/courses"
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Course</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              name="name"
              type="text"
              value={data.name}
              onChange={handleChange}
              required
              autoFocus
              placeholder="e.g. Computer Science"
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
              focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900
              placeholder:text-gray-400 transition"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
              to="/admin/courses"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-900 text-white
              hover:bg-gray-800 transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditPage;