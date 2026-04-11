export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: string;
}

export interface Session {
  user: User;
  expires: string;
}
