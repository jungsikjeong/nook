import { getMe } from '@/api/auth';
import { redirect } from 'next/navigation';

type Props = { searchParams: Promise<{ redirect_to?: string | string[] }> };

export default async function CallbackPage({ searchParams }: Props) {
  const { redirect_to } = await searchParams;

  const me = await getMe();

  if (!me || !me.profile?.nickname) {
    redirect(`/onboarding/${redirect_to}`);
  }

  redirect((redirect_to as string) ?? '/');
}
