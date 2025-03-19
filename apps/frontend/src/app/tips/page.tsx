'use client';
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { ResponseTips, Tips } from '@shared/dtos';

const TipsPage: React.FC = () => {
  const [tips, setTips] = React.useState<string[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [filteredUsers, setFilteredUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res: ResponseTips = await fetchWithAuth(`admin/tips`, {}, false); // Fetch all users
        console.log('res filter', res);
        const data = res.data;
        if (data && Array.isArray(data.tips)) {
          setTips(data.tips.map((tip: Tips) => tip.toString()));
          setTotal(data.total);
          const filtered = data.tips.filter((tip) =>
            tip.title.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredUsers(filtered);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          if (
            error.message === 'Token is expired' ||
            error.message === 'Unauthorized access'
          ) {
            localStorage.removeItem('token');
            router.push('/login');
          }
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchAllUsers();
  }, [search]);

  return (
    <div>
      <Navbar />
      <h1>Tips</h1>
      <ul>
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
      {error && <p>{error}</p>}
    </div>
  );
};

export default TipsPage;
