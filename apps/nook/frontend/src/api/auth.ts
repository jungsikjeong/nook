import 'server-only';

import { api } from '@/lib/api/server';

type Profile = {
  userId: string;
  nickname: string | null;
  profileImageUrls: string[];
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Me = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  nickname: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
};

export async function getMe(): Promise<Me | null> {
  const res = await api.fetch('/users/me');

  if (res.status === 401 || res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.status}`);
  }

  return (await res.json()) as Me;
}
