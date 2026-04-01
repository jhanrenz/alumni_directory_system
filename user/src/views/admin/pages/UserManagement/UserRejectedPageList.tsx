import { useState, useMemo } from "react";
import { useFetchUsers, useDeleteUser } from "../../../../hooks/userVerification";
import type { User } from "../../../../types/user";
import { Link } from "react-router-dom";

// Debounce function
function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const UserRejectedPageList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useFetchUsers("rejected", page);
  const users = data?.data ?? [];
  const meta = data?.meta;

  const deleteMutation = useDeleteUser();

  const handleSearch = useMemo(() => debounce((value: string) => setSearch(value), 300), []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this user?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-10 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Rejected Users <span className="text-gray-500 text-lg">({users?.length || 0})</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Users whose registrations were rejected.</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition text-sm md:text-base"
            >
              &larr; Back
            </Link>
            <Link
              to="/admin/users/trashed"
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition text-sm md:text-base"
            >
              Trashed
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base"
          />
        </div>

        {/* Table for Desktop */}
        {isLoading && <div className="text-center py-20 text-gray-400">Loading users...</div>}
        {isError && <div className="text-center py-20 text-red-500">Failed to load users.</div>}

        {!isLoading && filteredUsers.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
              <table className="w-full min-w-[700px] divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Course</th>
                    <th className="text-left px-4 py-3">Year</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">{user.course?.name ?? "N/A"}</td>
                      <td className="px-4 py-3 text-gray-600">{user.year}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          {user.verify}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteMutation.isPending}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user: User) => (
                <div key={user.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-gray-600 text-sm truncate">{user.email}</div>
                  <div className="text-gray-600 text-sm">Course: {user.course?.name ?? "N/A"}</div>
                  <div className="text-gray-600 text-sm">Year: {user.year}</div>
                  <div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      {user.verify}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition w-full"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No rejected users found.
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 font-medium text-gray-700">
              {page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserRejectedPageList;