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

    const headers = new Headers(options.headers);

    if (includeToken && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    url = `${process.env.BACKEND_URL}${url}`;
    options = {
      ...options,
      headers,
      mode: 'cors',
    };
    console.log("fetchWithAuth' request:", {
      url,
      headers,
      options,
    });

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error('Request failed:', {
        url,
        headers,
        body: options.body,
        status: response.status,
        statusText: response.statusText,
      });
    }

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
