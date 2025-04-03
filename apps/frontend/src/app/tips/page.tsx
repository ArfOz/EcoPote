'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseTips, ResponseTipsDetails, Tips } from '@shared/dtos';
import { SelectedTips } from './components';

const TipsPage: React.FC = () => {
  const [tips, setTips] = React.useState<Tips[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTip, setSelectedTip] = React.useState<
    ResponseTipsDetails['data'] | null
  >(null);
  const [selectedTipNews, setSelectedTipNews] = React.useState<
    ResponseTipsDetails['data']['news'] | null
  >(null);
  const [showNewsForm, setShowNewsForm] = React.useState<boolean>(false);
  const [newsTitle, setNewsTitle] = React.useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [page, setPage] = useState<number>(1);

  const limit = 5;

  useEffect(() => {
    const fetchAllTips = async () => {
      try {
        const res: ResponseTips = await fetchWithAuth(`admin/tips`, {}, false); // Fetch all users
        console.log('res filter', res);
        const data = res.data;
        if (data && Array.isArray(data.tips)) {
          setTips(data.tips);
          setTotal(data.total);
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

    fetchAllTips();
  }, []);

  const handleTipClick = async (id: number) => {
    try {
      const res: ResponseTipsDetails = await fetchWithAuth(
        `admin/tips/${id}?page=${page}&limit=${limit}`,
        {},
        false
      );
      const data = res.data;
      console.log('res tip', res);
      if (data) {
        setSelectedTip(data);
        setTotal(data.total);
        data?.news && setSelectedTipNews(data.news);
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

  const addNews = async () => {
    setShowNewsForm(true);

    setSelectedTip((prevTip) => {
      if (prevTip) {
        return {
          ...prevTip,
          news: prevTip.news ? [...prevTip.news] : [],
        };
      }
      return prevTip;
    });

    setNewsTitle('');
    setFile(null);
  };

  const addNewsBackend = async (id: number) => {
    if (!newsTitle || !file) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newsTitle);
      if (file) {
        formData.append('file', file);
      }

      if (selectedTip?.id !== undefined) {
        formData.append('tipsId', selectedTip.id.toString());
      }

      console.log('formData', formData);

      const res = await fetchWithAuth(
        'admin/news/add',
        {
          method: 'POST',
          body: formData,
        },
        false
      );
      const data = res.data;

      console.log('res add news', res);
      if (res.status === 200) {
        setSelectedTip((prevTip) => {
          if (prevTip) {
            return {
              ...prevTip,
              news: prevTip.news ? [...prevTip.news, data] : [data],
            };
          }
          return prevTip;
        });
        setShowNewsForm(false);
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
                <button
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => {
                    addNews();
                  }}
                >
                  Add News
                </button>
                {showNewsForm && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      placeholder="News Title"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                    />

                    <input
                      type="file"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      accept=".htm,.html"
                      onChange={(e) => {
                        const selectedFile = e.target.files
                          ? e.target.files[0]
                          : null;
                        setFile(selectedFile);
                      }}
                      required
                    />
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                      onClick={() => addNewsBackend(selectedTip.id)}
                    >
                      Submit News
                    </button>
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 mb-2">
                <p className="font-medium">News:</p>
                {selectedTipNews && selectedTipNews.length > 0 ? (
                  <SelectedTips
                    selectedTipNews={selectedTipNews?.map((news) => ({
                      ...news,
                      id: news.id.toString(),
                    }))}
                    handleDeleteNews={() =>
                      handleDeleteNews(selectedTipNews[0].id)
                    }
                  />
                ) : (
                  <p className="text-sm text-gray-500">No news available</p>
                )}
                {Array.from(
                  { length: Math.ceil(total / limit) },
                  (_, index) => (
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
                  )
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
