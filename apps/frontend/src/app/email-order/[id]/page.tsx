'use client';
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@utils';
import Link from 'next/link';

export default function EmailDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [email, setEmail] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetchWithAuth(`email/emailsorder/${id}`, {}, true);
        setEmail(res.data);
      } catch (error) {
        console.error('Error fetching email detail:', error);
      }
    };
    fetchEmail();
  }, [id]);

  if (!email) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Link href="/email-order" className="text-blue-600 hover:underline">
        ← Back to list
      </Link>
      <h1 className="text-2xl font-bold mt-4">{email.title}</h1>
      <div className="mt-6 prose">
        <p>{email.content}</p>
      </div>
    </div>
  );
}
