import { useState, useMemo } from "react";
import { Download } from "lucide-react"; // Lucide icon
import { useFetchAlumni, useExportAlumniPDF } from "../../../../hooks/useAlumni";
import type { User } from "../../../../types/user";
import { useFetchCourses } from "../../../../hooks/useCourse";

function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const apiUrl = import.meta.env.VITE_BASE_APP_URL?.replace("/api", "") ?? "";

const AlumniDirectoryPage = () => {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [exporting, setExporting] = useState(false); // loading state
  const { data: courses = [] } = useFetchCourses();

  const { data: alumni = [], isLoading, isError } = useFetchAlumni(
    search,
    course === "" ? undefined : course,
    year === "" ? undefined : year
  );

  const exportPDFQuery = useExportAlumniPDF(
    search,
    course === "" ? undefined : course,
    year === "" ? undefined : year
  );

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    []
  );

  const handleExportPDF = async () => {
    if (!confirm("Are you sure you want to export the alumni list as PDF?")) return;

    setExporting(true);
    try {
      const result = await exportPDFQuery.refetch();
      if (!result.data) {
        console.error("No PDF data returned");
        return;
      }
      const blob = result.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "alumni_directory.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto space-y-8">

    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Alumni Directory <span className="text-gray-500 text-lg">({alumni?.length || 0})</span>
        </h1>
        <p className="text-gray-500 mt-2">Browse and export alumni records.</p>
      </div>

      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${
          exporting ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <Download className="w-5 h-5" />
        {exporting ? "Exporting..." : "Export PDF"}
      </button>
    </div>

    {/* Filters */}
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <select
        value={course}
        onChange={(e) => setCourse(e.target.value === "" ? "" : Number(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <input
        type="text"
        placeholder="Search by name or email..."
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>

    {/* Table / Cards */}
    {isLoading && <div className="text-center py-20 text-gray-400">Loading alumni...</div>}
    {isError && <div className="text-center py-20 text-red-500">Failed to load alumni.</div>}

    {!isLoading && alumni.length > 0 && (
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full min-w-[700px] divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Course</th>
                <th className="text-left px-4 py-3">Year</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {alumni.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    {user.image ? (
                      <img
                        src={`${apiUrl}/storage/${user.image}`}
                        className="w-12 h-12 object-cover rounded-lg"
                        alt={user.name}
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/100x100?text=No+Image")
                        }
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-gray-400 border rounded-lg">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.course?.name ?? "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {alumni.map((user: User) => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-4 flex gap-4">
              <div>
                {user.image ? (
                  <img
                    src={`${apiUrl}/storage/${user.image}`}
                    className="w-16 h-16 object-cover rounded-lg"
                    alt={user.name}
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/100x100?text=No+Image")
                    }
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center text-gray-400 border rounded-lg">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-gray-600 text-sm">{user.email}</div>
                <div className="text-gray-600 text-sm">Course: {user.course?.name ?? "N/A"}</div>
                <div className="text-gray-600 text-sm">Year: {user.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {!isLoading && alumni.length === 0 && (
      <div className="text-center py-20 text-gray-400">No alumni found.</div>
    )}
  </div>
</div>
  )
};

export default AlumniDirectoryPage;