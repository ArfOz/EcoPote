import React, { useState } from 'react';
import { TipDetail } from '../addNews';
import { TipsDetail } from './tipsDetail';
import { fetchWithAuth } from '@utils';
import { ResponseTipNews } from '@shared/dtos';

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
  selectedTip: any;
  closeModal: () => void;
  selectedTipNews: ResponseTipNews['data'] | null;
  showNewsForm: boolean;
  setShowNewsForm: (show: boolean) => void;
  newsTitle: string;
  setNewsTitle: (title: string) => void;
  setError: (error: string) => void;
  setSelectedTipNews: (news: any) => void;
}) => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

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
        setSelectedTip((prevTip: SelectedTipType | null) => {
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
        setSelectedTip((prevTip: SelectedTipType | null) => {
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
              <TipDetail
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
            {selectedTipNews && selectedTipNews.length > 0 ? (
              <TipsDetail
                selectedTipNews={selectedTipNews?.map((news) => ({
                  ...news,
                  id: news.id.toString(),
                }))}
                handleDeleteNews={() => handleDeleteNews(selectedTipNews[0].id)}
              />
            ) : (
              <p className="text-sm text-gray-500">No news available</p>
            )}
            {Array.from({ length: Math.ceil(total / limit) }, (_, index) => (
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
        </div>
      </div>
    </div>
  );
};
