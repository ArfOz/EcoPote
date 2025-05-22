// Client Component for conditional sidebar
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/login' || pathname === '/unregister';

  if (hideSidebar) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Side Navbar */}
      <nav
        style={{
          width: '220px',
          background: '#222',
          color: '#fff',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <a
          href="/"
          style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Home
        </a>
        <a href="/users" style={{ color: '#fff', textDecoration: 'none' }}>
          Users
        </a>
        <a href="/add-user" style={{ color: '#fff', textDecoration: 'none' }}>
          Add User
        </a>
        <a href="/news" style={{ color: '#fff', textDecoration: 'none' }}>
          All News
        </a>
        <a href="/send-news" style={{ color: '#fff', textDecoration: 'none' }}>
          Send News
        </a>
        <a href="/tips" style={{ color: '#fff', textDecoration: 'none' }}>
          Tips
        </a>
        <a
          href="/cron-news-order"
          style={{ color: '#fff', textDecoration: 'none' }}
        >
          Automated News Order
        </a>
        <a href="/auto-news" style={{ color: '#fff', textDecoration: 'none' }}>
          Automated News Planner
        </a>
        <a href="/tips" style={{ color: '#fff', textDecoration: 'none' }}>
          <button onClick={() => handleLogout()}>Logout</button>
        </a>
        {/* Add more links as needed */}
      </nav>
      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
}
