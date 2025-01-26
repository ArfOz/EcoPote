"use client";
import { useRouter } from 'next/navigation';

const Navbar = () => {
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
            onClick={() => router.push('/send-email')}
            className="text-white hover:text-gray-300"
          >
            Send Email  
          </button>
          <button
            onClick={() => router.push('/add-user')}
            className="text-white hover:text-gray-300"
          >
            Add User
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

export default Navbar;
