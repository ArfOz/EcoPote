'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import { fetchWithAuth } from '@utils';
import { handleAuthError } from '../components';

const limit = 10;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch paginated users for current page
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchWithAuth(
          `admin/users?page=${page}&limit=${limit}`,
          {},
          true
        );
        const data = res.data as { users: User[]; total: number } | undefined;
        if (data && Array.isArray(data.users)) {
          setUsers(data.users);
          setTotal(data.total);
          // If not searching, show current page users
          if (!search) setFilteredUsers(data.users);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        handleAuthError(error, setError, router);
      }
    };
    fetchUsers();
  }, [page, search, handleAuthError]);

  // Fetch all users for search (only when search changes)
  useEffect(() => {
    if (!search) return;
    const fetchAllUsers = async () => {
      try {
        const res = await fetchWithAuth(`admin/users`, {}, true);
        const data = res.data as { users: User[]; total: number } | undefined;
        if (data && Array.isArray(data.users)) {
          setTotal(data.total);
          const filtered = data.users.filter((user) =>
            user.email.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredUsers(filtered);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        handleAuthError(error, setError, router);
      }
    };
    fetchAllUsers();
  }, [search, handleAuthError]);

  const toggleSubscription = async (userId: string) => {
    try {
      const res = await fetchWithAuth(
        `admin/users/${userId}/toggle-subscription`,
        { method: 'POST' },
        true
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id.toString() === userId
            ? { ...user, subscription: res.data.subscription }
            : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id.toString() === userId
            ? { ...user, subscription: res.data.subscription }
            : user
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          All Users
        </h1>
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              <li className="py-2 flex justify-between items-center font-bold">
                <span className="text-gray-700 flex-1">Email</span>
                <span className="text-gray-700 flex-1 text-center">Name</span>
                <span className="text-gray-700 flex-1 text-right">Status</span>
              </li>
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="py-4 flex justify-between items-center"
                >
                  <span className="text-gray-700 flex-1">{user.email}</span>
                  <span className="text-gray-700 flex-1 text-center">
                    {user.name}
                  </span>
                  <span className="text-gray-700 flex-1 text-right">
                    <button
                      onClick={() => toggleSubscription(user.id.toString())}
                      className={`ml-4 px-3 py-1 rounded text-white ${
                        user.subscription ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {user.subscription ? 'Subscribed' : 'Unsubscribed'}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            {!search && (
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`px-3 py-1 rounded ${
                      page === index + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
