'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
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
  const { data: session, isPending } = authClient.useSession();

  const isUser = Boolean(session?.user);

  const handleLogin = async () => {
    if (!isUser) {
      // const { error } = await authClient.signIn.oauth2({
      //   providerId: 'nook-auth',
      //   callbackURL: getAuthCallbackURL(),
      // });

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
    }
  };

  return (
    <div className='flex justify-end p-4'>
      <Button onClick={handleLogin} className='cursor-pointer'>
        {isUser ? '로그아웃' : '로그인'}
      </Button>
    </div>
  );
}
