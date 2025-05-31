'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseNewsAllDto } from '@shared/dtos';
import { News } from '@prisma/client';

const NEWS_PER_PAGE = 20;

export const AllNews = () => {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsStatus, setNewsStatus] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Fetch news from backend
  const fetchNews = async () => {
    try {
      const res: ResponseNewsAllDto = await fetchWithAuth(
        'news/allnews',
        {
          method: 'GET',
        },
        true
      );
      if (!res.success) {
        throw new Error('Failed to fetch news');
      }
      setNews(res.data?.emails || []);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Token is expired' ||
          error.message === 'Unauthorized access' ||
          error.message === 'No token found')
      ) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Pagination logic
  const totalPages = Math.ceil(news.length / NEWS_PER_PAGE);
  const paginatedNews = news.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleUpdate = (id: number) => {
    const email = news.find((e) => e.id === id);
    if (email) {
      setEditingId(id);
      setNewsTitle(email.title);
      setNewsStatus(email.status);
      setFile(null);
    }
  };

  const handleSave = async (id: number) => {
    const formData = new FormData();
    formData.append('title', newsTitle);
    formData.append('status', String(newsStatus));
    if (file) {
      formData.append('file', file);
    }

    await fetchWithAuth(
      `news/news/update/${id}`,
      {
        method: 'POST',
        body: formData,
      },
      true
    );

    setEditingId(null);
    setFile(null);
    await fetchNews(); // Refresh data after update
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      await fetchWithAuth(
        `news/news/${id}`,
        {
          method: 'DELETE',
        },
        true
      );
      setNews((prev) => prev.filter((email) => email.id !== id));
    }
  };

  return (
    <div>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Title
            </th>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Created At
            </th>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Updated At
            </th>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Status
            </th>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Send Time
            </th>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Content
            </th>
            <th
              style={{
                borderBottom: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedNews.map((email) => (
            <tr key={email.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {editingId === email.id ? (
                  <input
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                  />
                ) : (
                  email.title
                )}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {new Date(email.createdAt).toLocaleString()}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {new Date(email.updatedAt).toLocaleString()}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {editingId === email.id ? (
                  <select
                    value={newsStatus ? 'active' : 'inactive'}
                    onChange={(e) => setNewsStatus(e.target.value === 'active')}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span
                    style={{
                      color: email.status ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {email.status ? 'Active' : 'Inactive'}
                  </span>
                )}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {email.sendTime
                  ? new Date(email.sendTime).toLocaleString()
                  : ''}
              </td>
              <td>
                {editingId === email.id ? (
                  <input
                    type="file"
                    accept=".htm,.html"
                    style={{ width: '100%' }}
                    onChange={(e) => {
                      const selectedFile = e.target.files
                        ? e.target.files[0]
                        : null;
                      setFile(selectedFile);
                    }}
                  />
                ) : (
                  <button
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(email.content);
                        newWindow.document.close();
                      }
                    }}
                  >
                    Click to view content
                  </button>
                )}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {editingId === email.id ? (
                  <>
                    <button
                      style={{ marginRight: '8px' }}
                      onClick={() => handleSave(email.id)}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      style={{ marginRight: '8px' }}
                      onClick={() => handleUpdate(email.id)}
                    >
                      Update
                    </button>
                    <button
                      style={{ color: 'red' }}
                      onClick={() => handleDelete(email.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};
