import { api } from "../../config/connection";
import type { User } from "../../types/user";


export const fetchUsers = async (): Promise<User[]> => {
  const res = await api.get('/users');
  return res.data.users ?? [];
};

export const fetchTrashedUsers = async (): Promise<User[]> => {
  const res = await api.get('/users?filter=trashed');
  return res.data.users.data ?? [];
};

export const fetchUsersByStatus = async (
  status: 'pending' | 'approved' | 'rejected' | 'all',
  page: number = 1,
  search: string = "",
  course = "",
): Promise<{ data: User[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }> => {
  const res = await api.get('/users', { params: { filter: status, page, search, course } });

  const paginatedUsers = res.data.users;

  return {
    data: paginatedUsers.data, // the actual users array
    meta: {
      current_page: paginatedUsers.current_page,
      last_page: paginatedUsers.last_page,
      per_page: paginatedUsers.per_page,
      total: paginatedUsers.total,
    }
  };
};
export const verifyUser = async (userId: number, verify: 'pending' | 'approved' | 'rejected'): Promise<User> => {
  const res = await api.patch(`/users/${userId}`, { verify });
  return res.data.user;
};
export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};
export const restoreUser = async (userId: number): Promise<{ message: string }> => {
  const res = await api.patch(`/users/${userId}/restore`);
  return res.data;
};

export const forceDeleteUser = async (userId: number): Promise<{ message: string }> => {
  const res = await api.delete(`/users/${userId}/force`);
  return res.data;
};