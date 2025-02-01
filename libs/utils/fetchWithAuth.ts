export async function fetchWithAuth(
  url: string,
  options: RequestInit,
  includeToken = true
) {
  try {
    const token = localStorage.getItem('token');
    if (!token && includeToken) {
      throw new Error('No token found');
    }

    const headers = {
      ...options.headers,
      ...(includeToken && { Authorization: `Bearer ${token}` }),
    };

    url = `${process.env.BACKEND_URL}${url}`;

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error');
    }
  }
}
