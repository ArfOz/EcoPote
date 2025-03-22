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

  const handleDeleteNews = async (newsId: number) => {
    try {
      const res = await fetchWithAuth(
        `admin/news/${newsId}`,
        {
          method: 'DELETE',
        },
        false
      );
      const data = res.data;
      console.log('res delete news', res);

      if (data) {
        setSelectedTip((prevTip) => {
          if (prevTip) {
            return {
              ...prevTip,
              news: prevTip.news
                ? prevTip.news.filter((news) => news.id !== newsId)
                : [],
            };
          }
          return prevTip;
        });
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">{selectedTip.title}</h2>
            <div className="flex flex-row">
              <div className="w-full md:w-1/2 mb-2">
                <p className="font-medium">Description:</p>
                <p>{selectedTip.description}</p>
              </div>
              <div className="w-full md:w-1/2 mb-2">
                <p className="font-medium">News:</p>
                {selectedTip.news && selectedTip.news.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTip.news.map((newsItem, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        <p>News Name: {newsItem.title}</p>
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => {
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(newsItem.content);
                              newWindow.document.close();
                            }
                          }}
                        >
                          <span className="text-blue-500 hover:underline">
                            View Content
                          </span>
                        </button>
                        <button
                          className="text-red-500 hover:underline ml-2"
                          onClick={async () => {
                            handleDeleteNews(newsItem.id);
                          }}
                        >
                          Delete
                        </button>
                        <p className="text-xs text-gray-400">
                          Created At:{' '}
                          {new Date(newsItem.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Updated At:{' '}
                          {new Date(newsItem.updatedAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No news available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipsPage;
