"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SendEmail = () => {
  const [subject, setSubject] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const formData = new FormData();
    formData.append('subject', subject);
    if (file) {
      formData.append('file', file);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3300/api/admin/sendemail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setStatus('Emails sent successfully!');
        setSubject('');
        setFile(null);
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setStatus('An error occurred while sending emails.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Send Bulk Emails</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Subject:
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the subject"
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </label>
        </div>
        <div>
          <label>
            HTML File:
            <input
              type="file"
              accept=".htm,.html"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </label>
        </div>
        <button type="submit">Send Emails</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendEmail;