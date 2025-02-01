"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { fetchWithAuth } from '@utils';
import { ResponseStatus, Status } from '../components/dtos';


const SendEmail = () => {
  const [subject, setSubject] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);


  const [status, setStatus] = useState<Status | string | null>(null);
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
      const response = await fetchWithAuth('admin/sendemail', {
        method: 'POST',
        body: formData,
      },
    true) as ResponseStatus;
      
      if (!response) {
        throw new Error('Failed to send emails');
      }
      console.log("asd", response)
      if(response.success) {
        setStatus({
          sentUsers: response.message.sentUsers ?? [],
          errorUsers: response.message.errorUsers ?? [],
          message: "Emails sent successfully"
        });
      }
      
     
      setSubject('');
      setFile(null);
      
    } catch (error) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
        if (error.message === 'Token is expired' || error.message === 'Unauthorized access') {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        setStatus('An error occurred while sending emails.');
      }
    }
  };

  const handleDownload = () => {
    if (status && typeof status !== 'string') {
      const data = `
        Sent Users: ${status.sentUsers && status.sentUsers.length > 0 ? status.sentUsers.join(', ') : 'None'}
        Error Users: ${status.errorUsers && status.errorUsers.length > 0 ? status.errorUsers.join(', ') : 'None'}
        Message: ${status.message}
      `;
      const blob = new Blob([data], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'response_message.doc';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold text-center">Send Email</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject:
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter the subject"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                HTML File:
                <input
                  type="file"
                  accept=".htm,.html"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Emails
            </button>
          </form>
          {status && (
            <div className="mt-4 text-center text-sm text-gray-600">
              {typeof status === 'string' ? (
                status
              ) : (
                <>
                  <p>Sent Users: {status.sentUsers && status.sentUsers.length > 0 ? status.sentUsers.join(', ') : 'None'}</p>
                  <p>Error Users: {status.errorUsers && status.errorUsers.length > 0 ? status.errorUsers.join(', ') : 'None'}</p>
                  <p>{status.message}</p>
                  <button
                    onClick={handleDownload}
                    className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Download Response
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SendEmail;