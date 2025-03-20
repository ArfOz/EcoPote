'use client';
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseTips, Tips } from '@shared/dtos';

const TipsPage: React.FC = () => {
  const [tips, setTips] = React.useState<Tips[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [filteredUsers, setFilteredUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTip, setSelectedTip] = React.useState<Tips | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res: ResponseTips = await fetchWithAuth(`admin/tips`, {}, false); // Fetch all users
        console.log('res filter', res);
        const data = res.data;
        if (data && Array.isArray(data.tips)) {
          setTips(data.tips);
          setTotal(data.total);
          const filtered = data.tips.filter((tip) =>
            tip.title.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredUsers(filtered);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          if (
            error.message === 'Token is expired' ||
            error.message === 'Unauthorized access'
          ) {
            localStorage.removeItem('token');
            router.push('/login');
          }
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchAllUsers();
  }, [search]);

  const handleTipClick = async (id: number) => {
    try {
      const res: ResponseTips = await fetchWithAuth(
        `admin/tips/${id}`,
        {},
        false
      );
      const data = res.data;
      console.log('res tip', res);
      if (data && data.tips && data.tips.length > 0) {
        setSelectedTip(data.tips[0]);
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

  const closeModal = () => {
    setSelectedTip(null);
  };

  return (
    <div>
      <Navbar />
      <h1>Tips</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip, index) => (
              <tr
                key={index}
                onClick={() => handleTipClick(tip.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-2 px-4 border-b">{tip.id}</td>
                <td className="py-2 px-4 border-b">{tip.title}</td>
                <td className="py-2 px-4 border-b">{tip.description}</td>
                <td className="py-2 px-4 border-b">
                  {tip.createdAt.toString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {tip.updatedAt.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p>{error}</p>}
      {selectedTip && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedTip.title}</h2>
            <p>{selectedTip.description}</p>
            <p>Created at: {selectedTip.createdAt.toString()}</p>
            <p>Updated at: {selectedTip.updatedAt.toString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipsPage;
