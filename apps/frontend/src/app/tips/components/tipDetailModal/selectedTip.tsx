import React, { use, useEffect, useState } from 'react';
import { AddNews } from '../addNews';
import { TipsDetail } from './tipsDetail';
import { fetchWithAuth } from '@utils';
import {
  ResponseAddNews,
  ResponseDeleteNews,
  ResponseTipNews,
  ResponseTipsDetails,
} from '@shared/dtos';

type SelectedTipType = {
  id?: number;
  title: string;
  description: string;
  news?: Array<{ id: number; [key: string]: any }>;
};

export const SelectedTip = ({
  setSelectedTip,
  selectedTip,
  closeModal,
  selectedTipNews,
  showNewsForm,
  setShowNewsForm,
  newsTitle,
  setNewsTitle,
  setError,
  setSelectedTipNews,
}: {
  setSelectedTip: any;
  selectedTip: ResponseTipsDetails['data'];
  closeModal: () => void;
  selectedTipNews: ResponseTipNews['data'] | null;
  showNewsForm: boolean;
  setShowNewsForm: (show: boolean) => void;
  newsTitle: string;
  setNewsTitle: (title: string) => void;
  setError: (error: string) => void;
  setSelectedTipNews: (news: any) => void;
}) => {
  const [totalNews, setTotalNews] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTipNews = async () => {
      if (selectedTip) {
        // Set the page number you want to fetch
        const limit = 5; // Set the limit for the number of news items to fetch

        try {
          const tipNews: ResponseTipNews = await fetchWithAuth(
            `admin/tips/news/${selectedTip.id}?page=${page}&limit=${limit}`,
            {},
            false
          );

          const news = tipNews.data;
          console.log('Fetched news:', news);

          setSelectedTipNews(news);
          setTotalNews(tipNews.data.total); // Set the total number of news items
        } catch (error) {
          console.error('Error fetching tip news:', error);
        }
      }
    };

    fetchTipNews();
  }, [page]);
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

      const res: ResponseAddNews = await fetchWithAuth(
        'admin/news/add',
        {
          method: 'POST',
          body: formData,
        },
        false
      );
      const data = res.data;

      if (res.success) {
        setTotalNews((prevTotal) => prevTotal + 1);

        setSelectedTipNews((prevNews: ResponseTipNews['data'] | null) => {
          if (prevNews && prevNews.news) {
            return {
              ...prevNews,
              news: [...prevNews.news, data],
            };
          }
          return prevNews;
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
  const limit = 5;
  const addNews = async () => {
    setShowNewsForm(true);

    setSelectedTip((prevTip: SelectedTipType | null) => {
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

  const handleDeleteNews = async (newsId: number) => {
    try {
      const res: ResponseDeleteNews = await fetchWithAuth(
        `admin/news/${newsId}`,
        {
          method: 'DELETE',
        },
        false
      );

      if (res.success) {
        setTotalNews((prevTotal) => {
          const updatedTotal = prevTotal - 1;
          // Adjust the page if the current page becomes empty
          if (updatedTotal <= (page - 1) * limit && page > 1) {
            setPage(page - 1);
          }
          return updatedTotal;
        });
        setSelectedTipNews((prevNews: ResponseTipNews['data'] | null) => {
          if (prevNews && prevNews.news) {
            return {
              ...prevNews,
              news: prevNews.news.filter((news) => news.id !== newsId),
            };
          }
          return prevNews;
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">{selectedTip?.title}</h2>
        <div className="flex flex-row">
          <div className="w-full md:w-1/2 mb-2">
            <p className="font-medium">Description:</p>
            <p>{selectedTip?.description}</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => {
                addNews();
              }}
            >
              Add News
            </button>
            {showNewsForm && (
              <AddNews
                newsTitle={newsTitle}
                setNewsTitle={setNewsTitle}
                setFile={setFile}
                addNewsBackend={addNewsBackend}
                selectedTip={selectedTip}
              />
            )}
          </div>
          <div className="w-full md:w-1/2 mb-2">
            <p className="font-medium">News:</p>
            {selectedTipNews && selectedTipNews.news.length > 0 ? (
              <TipsDetail
                selectedTipNews={selectedTipNews?.news.map((news) => ({
                  ...news,
                  id: news.id,
                }))}
                handleDeleteNews={() =>
                  handleDeleteNews(selectedTipNews.news[0].id)
                }
              />
            ) : (
              <p className="text-sm text-gray-500">No news available</p>
            )}
            {Array.from(
              { length: Math.ceil(totalNews / limit) },
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
  );
};
