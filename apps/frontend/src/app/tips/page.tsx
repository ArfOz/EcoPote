'use client';
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseTips, ResponseTipsDetails, Tips } from '@shared/dtos';

const TipsPage: React.FC = () => {
  const [tips, setTips] = React.useState<Tips[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [filteredUsers, setFilteredUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTip, setSelectedTip] = React.useState<
    ResponseTipsDetails['data'] | null
  >(null);
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
      const res: ResponseTipsDetails = await fetchWithAuth(
        `admin/tips/${id}`,
        {},
        false
      );
      const data = res.data;
      console.log('res tip', res);
      if (data) {
        setSelectedTip(data);
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">{selectedTip.title}</h2>
            <p className="mb-2">{selectedTip.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              Created at: {selectedTip.createdAt.toString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Updated at: {selectedTip.updatedAt.toString()}
            </p>
            <p className="text-lg font-medium mb-4">
              News Name: {selectedTip.title}
            </p>
            {/* <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: selectedTip.news[0].content }}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TipsPage;
