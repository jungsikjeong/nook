import { getMyProfile } from '@/api/users';
import { getSafeRedirectPath } from '@/lib/utils/get-safe-redirect-path';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{
    redirect_to?: string | string[];
  }>;
};

export default async function CallbackPage({ searchParams }: Props) {
  const { redirect_to } = await searchParams;
  const redirectTo = getSafeRedirectPath(redirect_to, '/', '/auth/callback');

  const myProfile = await getMyProfile();

  if (!myProfile) {
    redirect(`/onboarding?redirect_to=${encodeURIComponent(redirectTo)}`);
  }

  redirect(redirectTo);
}
