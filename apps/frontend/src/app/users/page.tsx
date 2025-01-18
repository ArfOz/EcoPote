"use client";
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { User } from '@prisma/client';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3300/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();


        if (Array.isArray(data)) {
          setUsers(data);
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

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800">All Users</h1>
          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="py-4 flex justify-between items-center">
                  <span className="text-gray-700">{user.email}</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${user.subscription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.subscription ? 'Subscribed' : 'Not Subscribed'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
