import { Link } from "react-router-dom";
import {
  useFetchTrashedCourses,
  useForceDeleteCourse,
  useRestoreCourse,
} from "../../../../hooks/useCourse";
import { Trash2, ArrowLeft } from "lucide-react";

const CourseTrashedPage = () => {
  const { data: courses } = useFetchTrashedCourses();
  const forceDeleteCourseMutation = useForceDeleteCourse();
  const restoreCourseMutation = useRestoreCourse();

  const handleForceDelete = async (id: number) => {
    if (!confirm("Permanently delete this course?")) return;
    try {
      await forceDeleteCourseMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (id: number) => {
    if (!confirm("Restore this course?")) return;
    try {
      await restoreCourseMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Trashed Courses{" "}
            <span className="text-gray-500 text-base sm:text-lg">
              ({courses?.length || 0})
            </span>
          </h1>
          <Link
            to="/admin/courses"
            className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-sm transition"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {courses?.length ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col gap-2"
              >
                <p className="text-sm sm:text-base font-medium text-gray-800">
                  {course.name}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleRestore(course.id)}
                    className="flex-1 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleForceDelete(course.id)}
                    className="flex-1 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition flex justify-center items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 font-medium">
              No trashed courses found.
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Course Name</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {courses?.length ? (
                courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={`transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">{course.id}</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{course.name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleRestore(course.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handleForceDelete(course.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-1 justify-center"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-gray-500 font-medium">
                    No trashed courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default CourseTrashedPage;