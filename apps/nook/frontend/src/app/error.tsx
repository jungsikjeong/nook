'use client'; // 에러 바운더리는 클라이언트 컴포넌트여야 한다.

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // 에러 리포팅 연동 지점 (Sentry 등). 지금은 콘솔로만 남긴다.
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-dvh flex-col items-center justify-center p-4 md:min-h-full'>
      <div className='w-full max-w-sm space-y-6 text-center'>
        <div className='space-y-2'>
          <h1 className='text-xl font-semibold'>문제가 발생했어요</h1>
          <p className='text-sm text-muted-foreground'>
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>

        <div className='flex flex-col items-center gap-2'>
          <Button onClick={() => unstable_retry()}>다시 시도</Button>
          <Link
            href='/'
            className='text-sm text-muted-foreground underline hover:text-foreground'
          >
            처음으로 돌아가기
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className='text-xs text-muted-foreground'>
            digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
