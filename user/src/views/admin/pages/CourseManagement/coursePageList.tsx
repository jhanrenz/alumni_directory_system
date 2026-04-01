import { useState, useMemo } from "react";
import { useAdminFetchCourses, useDeleteCourse } from "../../../../hooks/useCourse";
import type { Course } from "../../../../types/course";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const CoursePageList = () => {
  const [search, setSearch] = useState("");

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    []
  );

  const deleteCourseMutation = useDeleteCourse();
  const { data: courses = [], isLoading, isError } = useAdminFetchCourses(search);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourseMutation.mutateAsync(id);
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              Courses <span className="text-gray-500 text-base">({courses.length})</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage all courses in your system
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              to="/admin/courses/create"
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <Plus size={16} />
              Add Course
            </Link>

            <Link
              to="/admin/courses/trashed"
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              <Trash2 size={16} />
              Trashed
            </Link>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
        />

        {/* Loading / Error */}
        {isLoading && <div className="text-center py-16 text-gray-400 text-sm">Loading courses...</div>}
        {isError && <div className="text-center py-16 text-red-500 text-sm">Error loading courses</div>}

        {/* Courses List */}
        {!isLoading && courses.length > 0 && (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
              {courses.map((course: Course) => (
                <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-2">
                  <p className="text-gray-800 font-medium text-sm md:text-base">{course.name}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="flex-1 text-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="w-full min-w-[600px] text-sm divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left">Course Name</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {courses.map((course: Course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{course.name}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/courses/edit/${course.id}`}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && courses.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No courses found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePageList;