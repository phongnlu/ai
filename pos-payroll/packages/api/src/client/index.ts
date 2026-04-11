import axios from 'axios';

const apiClient = axios.create({
  baseURL: typeof window !== 'undefined'
    ? (process.env['EXPO_PUBLIC_API_URL'] ?? process.env['NEXT_PUBLIC_API_URL'] ?? '')
    : '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // redirect to sign-in on auth failure
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
