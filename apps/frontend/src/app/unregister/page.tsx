'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseUnregisterUserDto } from '@shared/dtos';

const UnregisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleUnregister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res: ResponseUnregisterUserDto = await fetchWithAuth(
        'users/unregister',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      if (res.success) {
        setEmail('');
        setStatus('success');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setStatus('error');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
      <h1>Unregister</h1>
      <p>
        Enter your email address to unregister your account. This action cannot
        be undone.
      </p>
      <form onSubmit={handleUnregister}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px', width: '100%', marginBottom: 16 }}
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success' || !email}
          style={{ padding: '10px 24px', marginTop: 8, width: '100%' }}
        >
          {status === 'loading' ? 'Processing...' : 'Unregister'}
        </button>
      </form>
      {status === 'success' && (
        <p style={{ color: 'green', marginTop: 16 }}>
          Your account has been unregistered.
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: 'red', marginTop: 16 }}>{error}</p>
      )}
    </div>
  );
};

export default UnregisterPage;
