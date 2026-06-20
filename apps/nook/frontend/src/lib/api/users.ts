import 'server-only';

import { api } from '@/lib/api/server';
import type {
  ProfileResDto,
  UpdateProfileDto,
  UserResDto,
} from '@/lib/api/generated';

// 백엔드 OpenAPI 스펙에서 생성된 타입을 그대로 공유한다.
// 스키마가 바뀌면 루트에서 `pnpm nook-gen:types` 로 재생성한다.
export type Me = UserResDto;
export type Profile = ProfileResDto;

export async function getMe(): Promise<Me> {
  return api.get<Me>('/users/me');
}

export async function getMyProfile(): Promise<Profile | null> {
  const profile = await api.get<Profile | null>('/users/me/profile');

  return profile ?? null;
}

export async function updateProfile(
  input: UpdateProfileDto & { file?: File },
): Promise<Profile | null> {
  const form = new FormData();

  if (input.nickname !== undefined) form.append('nickname', input.nickname);
  if (input.bio !== undefined) form.append('bio', input.bio);
  if (input.file) form.append('file', input.file);

  const res = await api.fetch('/users/me/update-profile', {
    method: 'PATCH',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`프로필 수정 실패: ${res.status}`);
  }

  const text = await res.text();

  return text ? (JSON.parse(text) as Profile | null) : null;
}
