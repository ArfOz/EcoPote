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
          </tr>
        </thead>
        <tbody>
          {paginatedEmails.map((email) => (
            <tr key={email.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {email.title}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {new Date(email.createdAt).toLocaleString()}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {new Date(email.updatedAt).toLocaleString()}
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                <span
                  style={{
                    color: email.status ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {email.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {email.sendTime
                  ? new Date(email.sendTime).toLocaleString()
                  : ''}
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
