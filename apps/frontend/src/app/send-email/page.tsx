"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SendEmail = () => {
  const [emails, setEmails] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
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

    const emailList = emails.split(',').map(email => email.trim());
    const payload = { to: emailList.join(','), subject, html: htmlContent };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3300/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('Emails sent successfully!');
        setEmails('');
        setSubject('');
        setHtmlContent('');
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
            Emails (comma-separated):
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="example1@gmail.com, example2@gmail.com"
              required
              rows={3}
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </label>
        </div>
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
            HTML Content:
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Enter your HTML content"
              required
              rows={5}
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