import { useState, useMemo } from "react";
import { useFetchUsers, useVerifyUser } from "../../../../hooks/userVerification";
import type { User } from "../../../../types/user";
import { Link } from "react-router-dom";
import { useFetchCourses } from "../../../../hooks/useCourse";

function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const apiUrl = import.meta.env.VITE_BASE_APP_URL?.replace("/api", "") ?? "";

const UserPageList = () => {
  const [filter, setFilter] = useState<"pending" | "approved">("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [course, setCourse] = useState("");
  const { data: courses = [] } = useFetchCourses();

  const { data, isLoading, isError } = useFetchUsers(filter, page, search, course);
  const verifyMutation = useVerifyUser();

  const users = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 300),
    []
  );

  const handleVerify = (id: number, status: "approved" | "rejected" | "pending") => {
    if (!confirm("Confirm?")) return;
    verifyMutation.mutate({ id, verify: status });
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Users Registered <span className="text-gray-500 text-lg">({users.length})</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Review and verify user registrations.</p>
          </div>

          <Link
            to="/admin/users/rejected"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm md:text-base"
          >
            Rejected Users
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value as "pending" | "approved"); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base"
          >
            {["pending", "approved"].map((status) => (
              <option key={status} value={status}>{status.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={course}
            onChange={(e) => { setCourse(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base"
          />
        </div>

        {/* Loading / Error */}
        {isLoading && <div className="text-center py-8 text-gray-400 text-sm">Loading users...</div>}
        {isError && <div className="text-center py-8 text-red-500 text-sm">Failed to load users.</div>}

        {/* Desktop Table */}
        {!isLoading && users.length > 0 && (
          <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full min-w-[700px] divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      {user.image ? (
                        <img
                          src={`${apiUrl}/storage/${user.image}`}
                          alt={user.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/100x100?text=No+Image")}
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-gray-400 border rounded-lg text-xs">No Image</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{user.course?.name ?? "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600">{user.year}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.verify === "pending" ? "bg-yellow-100 text-yellow-800" :
                        user.verify === "approved" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {user.verify}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {user.verify === "pending" && (
                        <>
                          <button
                            onClick={() => handleVerify(user.id, "approved")}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(user.id, "rejected")}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {user.verify === "approved" && (
                        <button
                          onClick={() => handleVerify(user.id, "pending")}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                        >
                          Unapprove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && users.length > 0 && (
          <div className="md:hidden space-y-4">
            {users.map((user: User) => (
              <div key={user.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                <div>
                  {user.image ? (
                    <img
                      src={`${apiUrl}/storage/${user.image}`}
                      alt={user.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => ((e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/100x100?text=No+Image")}
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center text-gray-400 border rounded-lg text-xs">No Image</div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-gray-600 text-sm truncate">{user.email}</div>
                  <div className="text-gray-600 text-sm">Course: {user.course?.name ?? "N/A"}</div>
                  <div className="text-gray-600 text-sm">Year: {user.year}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.verify === "pending" ? "bg-yellow-100 text-yellow-800" :
                      user.verify === "approved" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {user.verify}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.verify === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(user.id, "approved")}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(user.id, "rejected")}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {user.verify === "approved" && (
                      <button
                        onClick={() => handleVerify(user.id, "pending")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                      >
                        Unapprove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No users found.</div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">{page} / {meta.last_page}</span>
            <button
              onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserPageList;