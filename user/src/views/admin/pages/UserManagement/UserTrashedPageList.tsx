import { useState, useMemo } from "react";
import { useFetchTrashedUsers, useRestoreUser, useForceDeleteUser } from "../../../../hooks/userVerification";
import type { User } from "../../../../types/user";
import { Link } from "react-router-dom";

// Debounce utility
function debounce(fn: (value: string) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

const UserTrashedPageList = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useFetchTrashedUsers();
  const users = Array.isArray(data) ? data : [];

  const restoreMutation = useRestoreUser();
  const forceDeleteMutation = useForceDeleteUser();

  const handleSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    []
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = (id: number) => {
    if (confirm("Restore this user?")) restoreMutation.mutate(id);
  };

  const handleForceDelete = (id: number) => {
    if (confirm("Permanently delete this user? This cannot be undone.")) {
      forceDeleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-10 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Trashed Users <span className="text-gray-500 text-lg">({users?.length || 0})</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Users that have been deleted or trashed</p>
          </div>
          <Link
            to="/admin/users/rejected"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 text-sm md:text-base transition"
          >
            &larr; Back
          </Link>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base transition"
          />
        </div>

        {/* Content */}
        {isLoading && <div className="text-center py-10 text-gray-400">Loading users...</div>}
        {isError && <div className="text-center py-10 text-red-500">Failed to load users.</div>}

        {!isLoading && filteredUsers.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white shadow-md rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm min-w-[700px] divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Course</th>
                    <th className="px-4 py-3 text-left">Year</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">{user.course?.name ?? "N/A"}</td>
                      <td className="px-4 py-3 text-gray-600">{user.year}</td>
                      <td className="px-4 py-3 text-right space-x-2 flex justify-end">
                        <button
                          onClick={() => handleRestore(user.id)}
                          disabled={restoreMutation.isPending}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handleForceDelete(user.id)}
                          disabled={forceDeleteMutation.isPending}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
                        >
                          Delete
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleRestore(user.id)}
                      disabled={restoreMutation.isPending}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleForceDelete(user.id)}
                      disabled={forceDeleteMutation.isPending}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
                    >
                      Delete
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
            No trashed users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTrashedPageList;