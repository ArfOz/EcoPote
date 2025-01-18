export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const errorData = await response.json();
    if (errorData.message === 'Token is expired') {
      throw new Error('Token is expired');
    } else {
      throw new Error('Unauthorized access');
    }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};
