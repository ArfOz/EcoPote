// Centralized error handler
export function handleAuthError(
  error: any,
  setError: (msg: string) => void,
  router: { push: (path: string) => void }
) {
  if (error instanceof Error) {
    setError(error.message);
    if (
      error.message === 'Token is expired' ||
      error.message === 'Unauthorized access' ||
      error.message === 'No token found'
    ) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  } else {
    setError('An unknown error occurred');
  }
}
