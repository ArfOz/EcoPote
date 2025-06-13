'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@utils';
import { handleAuthError } from '../error';

export function useFetchData<T>(url: string, deps: any[] = [], auth = true) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(url, {}, auth);
        setData(res.data);
      } catch (error) {
        handleAuthError(error, setError, router);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, setData, setError };
}
