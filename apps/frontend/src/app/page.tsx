"use client"
import { useState } from 'react';

const Home = () => {
  const [emails, setEmails] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const emailList = emails.split(',').map(email => email.trim());
    const payload = { emails: emailList, subject, message };

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('Emails sent successfully!');
        setEmails('');
        setSubject('');
        setMessage('');
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
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
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
  )
}

export default Home;
