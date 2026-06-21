'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

function getCurrentPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getAuthCallbackURL(): string {
  const callbackUrl = new URL('/auth/callback', window.location.origin);
  callbackUrl.searchParams.set('redirect_to', getCurrentPath());
  return callbackUrl.toString();
}

export function LoginButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isUser = Boolean(session?.user);

  if (pathname.startsWith('/onboarding')) {
    return null;
  }

  const handleLogin = async () => {
    if (!isUser) {
      const res = await authClient.signIn.oauth2({
        providerId: 'nook-auth',
        callbackURL: getAuthCallbackURL(),

        // prevent the built-in redirect
        fetchOptions: { onSuccess: () => {} },
      });

      if (res.data?.url) {
        window.location.replace(res.data.url);
      }

      if (res.error) {
        console.error('OAuth sign-in failed:', res.error);
        toast.error('로그인에 실패했어요. 다시 시도해주세요.');
      }
    } else {
      await authClient.signOut();
      router.refresh();
    }
  };

  const LoginButtonText = () => {
    if (isPending) {
      return <Spinner className='h-4 w-4' />;
    }

    if (isUser) return '로그아웃';

    if (!isUser) return '로그인';
  };

  return (
    <Button
      onClick={handleLogin}
      className='min-w-20 cursor-pointer'
      disabled={!!isPending}
      variant='outline'
    >
      {LoginButtonText()}
    </Button>
  );
}
