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

export async function getMe(): Promise<Me> {
  return api.get<Me>('/users/me');
}

export async function getMyProfile(): Promise<Profile | null> {
  const profile = await api.get<Profile | null>('/users/me/profile');

  return profile ?? null;
}
