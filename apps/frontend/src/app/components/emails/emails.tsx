'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseEmailsAllDto } from '@shared/dtos';
import { News } from '@prisma/client';

const EMAILS_PER_PAGE = 20;

export const Emails = () => {
  const router = useRouter();
  const [emails, setEmails] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [emailTitle, setEmailTitle] = useState('');
  const [emailStatus, setEmailStatus] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    const fetchEmails = async () => {
      try {
        const res: ResponseEmailsAllDto = await fetchWithAuth(
          'email/allemails',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.success) {
          throw new Error('Failed to fetch emails');
        }

        setEmails(res.data?.emails || []);
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message === 'Token is expired' ||
            error.message === 'Unauthorized access' ||
            error.message === 'No token found'
          ) {
            localStorage.removeItem('token');
            router.push('/login');
          }
        }
      }
    };
    fetchEmails();
  }, [router]);

  // Pagination logic
  const totalPages = Math.ceil(emails.length / EMAILS_PER_PAGE);
  const paginatedEmails = emails.slice(
    (currentPage - 1) * EMAILS_PER_PAGE,
    currentPage * EMAILS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleUpdate = (id: number) => {
    const email = emails.find((e) => e.id === id);
    if (email) {
      setEditingId(id);
      setEmailTitle(email.title);
      setEmailStatus(email.status);
    }
  };

  const handleSave = async (id: number) => {
    // Prepare FormData for file upload and other fields
    const formData = new FormData();
    formData.append('title', emailTitle);

    formData.append('status', String(emailStatus));
    console.log('formdata', formData);
    if (file) {
      formData.append('file', file);
    }

    console.log('FormData:', formData);

    const res = await fetchWithAuth(
      `admin/news/update/${id}`,
      {
        method: 'POST',
        body: formData,
      },
      true,
      true
    );

    console.log('Response:', res);

    setEmails((prev) =>
      prev.map((email) =>
        email.id === id
          ? {
              ...email,
              title: emailTitle,
              status: emailStatus,
            }
          : email
      )
    );
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this email?')) {
      await fetchWithAuth(`email/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmails((prev) => prev.filter((email) => email.id !== id));
    }
  };

  return (
    <div>
      <h1>Emails</h1>
      <p>Check the console for fetched emails.</p>
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
          {paginatedEmails.map((email) => (
            <tr key={email.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {editingId === email.id ? (
                  <input
                    value={emailTitle}
                    onChange={(e) => setEmailTitle(e.target.value)}
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
                    value={emailStatus ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setEmailStatus(e.target.value === 'active')
                    }
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
