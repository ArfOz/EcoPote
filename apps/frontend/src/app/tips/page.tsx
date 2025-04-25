'use client';
import React, { useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import {
  ResponseTipNews,
  ResponseTips,
  ResponseTipsDetails,
  Tips,
} from '@shared/dtos';
import { TipsComponent } from '../components/tips';
import { SelectedTip } from '../components/tips/tipDetailModal';

const TipsPage: React.FC = () => {
  const [tips, setTips] = React.useState<Tips[]>([]);

  const [error, setError] = React.useState<string | null>(null);
  const [selectedTip, setSelectedTip] = React.useState<
    ResponseTipsDetails['data'] | null
  >(null);
  const [selectedTipNews, setSelectedTipNews] = React.useState<
    ResponseTipNews['data'] | null
  >(null);
  const [showNewsForm, setShowNewsForm] = React.useState<boolean>(false);
  const [newsTitle, setNewsTitle] = React.useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    const fetchAllTips = async () => {
      try {
        const res: ResponseTips = await fetchWithAuth(`admin/tips`, {}, true); // Fetch all users

        const data = res.data;
        if (data && Array.isArray(data.tips)) {
          setTips(data.tips);
          // setTotal(data.total);
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

    fetchAllTips();
  }, [router]);

  const closeModal = () => {
    setSelectedTip(null);
    setShowNewsForm(false);
  };

  return (
    <div>
      <Navbar />
      <TipsComponent
        tips={tips}
        setSelectedTip={setSelectedTip}
        setError={setError}
      />
      {error && <p>{error}</p>}
      {selectedTip && (
        <SelectedTip
          selectedTip={selectedTip}
          closeModal={closeModal}
          selectedTipNews={selectedTipNews}
          setSelectedTipNews={setSelectedTipNews}
          setSelectedTip={setSelectedTip}
          showNewsForm={showNewsForm}
          setShowNewsForm={setShowNewsForm}
          newsTitle={newsTitle}
          setNewsTitle={setNewsTitle}
          setError={setError}
        />
      )}
    </div>
  );
};

export default TipsPage;
