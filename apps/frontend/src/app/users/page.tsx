"use client";
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { User } from '@prisma/client';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const limit = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3300/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        if (Array.isArray(data.users)) {
          setUsers(data.users);
          setFilteredUsers(data.users);
          setTotal(data.total);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => user.email.toLowerCase().includes(search.toLowerCase()));
    setFilteredUsers(filtered);
    setTotal(filtered.length);
    setPage(1); // Reset to first page on search
  }, [search, users]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800">All Users</h1>
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
                {filteredUsers.slice((page - 1) * limit, page * limit).map((user) => (
                  <li key={user.id} className="py-4 flex justify-between items-center">
                    <span className="text-gray-700">{user.email}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${user.subscription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.subscription ? 'Subscribed' : 'Not Subscribed'}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`px-3 py-1 rounded ${page === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
