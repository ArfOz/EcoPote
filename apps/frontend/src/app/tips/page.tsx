'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import {
  ResponseTipNews,
  ResponseTips,
  ResponseTipsDetails,
  Tips,
} from '@shared/dtos';
import { TipsComponent } from './components';
import { SelectedTip } from './components/tipDetailModal';

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
    const fetchAllTips = async () => {
      try {
        const res: ResponseTips = await fetchWithAuth(`admin/tips`, {}, false); // Fetch all users

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
  };

  return (
    <div>
      <Navbar />
      <TipsComponent
        tips={tips}
        setSelectedTip={setSelectedTip}
        setError={setError}
        setSelectedTipNews={setSelectedTipNews}
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
