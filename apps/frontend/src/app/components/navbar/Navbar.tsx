'use client';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold">Admin Panel</div>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/users')}
            className="text-white hover:text-gray-300"
          >
            Show All Users
          </button>
          <button
            onClick={() => router.push('/send-news')}
            className="text-white hover:text-gray-300"
          >
            Send News
          </button>
          <button
            onClick={() => router.push('/add-user')}
            className="text-white hover:text-gray-300"
          >
            Add User
          </button>
          <button
            onClick={() => router.push('/tips')}
            className="text-white hover:text-gray-300"
          >
            Tips
          </button>
          <button
            onClick={() => router.push('/auto-news')}
            className="text-white hover:text-gray-300"
          >
            Auto-News
          </button>
          <button
            onClick={() => router.push('/cron-news-order')}
            className="text-white hover:text-gray-300"
          >
            Cron News Order
          </button>

          <button
            onClick={() => router.push('/news')}
            className="text-white hover:text-gray-300"
          >
            All News
          </button>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
