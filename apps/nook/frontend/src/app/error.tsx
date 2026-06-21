'use client'; // 에러 바운더리는 클라이언트 컴포넌트여야 한다.

import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

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
    <div className='flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center md:min-h-full'>
      <WorriedBlob />

      <div className='space-y-2'>
        <p className='font-hand text-6xl leading-none text-clay'>이런…</p>
        <h1 className='text-lg font-semibold text-foreground'>
          문제가 생겼어요
        </h1>
        <p className='text-sm leading-relaxed text-foreground/60'>
          잠깐 길이 엉켰나 봐요.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      </div>

      <div className='flex flex-col items-center gap-3'>
        <Button
          variant='ink'
          onClick={() => unstable_retry()}
          className='h-11 px-7 text-sm'
        >
          다시 시도
        </Button>
        <Link
          href='/'
          className='text-sm text-foreground/60 underline-offset-4 hover:text-foreground hover:underline'
        >
          처음으로 돌아가기
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className='font-mono text-xs text-foreground/40'>
          digest: {error.digest}
        </p>
      )}
    </div>
  );
}

function WorriedBlob() {
  return (
    <svg
      viewBox='0 0 200 210'
      className='h-40 w-40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label='당황한 캐릭터'
    >
      {/* 몸통 */}
      <path
        d='M96 22 C 150 16, 190 56, 184 112 C 178 166, 152 196, 98 194 C 46 192, 22 152, 26 100 C 30 52, 54 28, 96 22 Z'
        className='fill-blob stroke-ink'
        strokeWidth='4'
        strokeLinejoin='round'
      />

      {/* 볼터치 */}
      <circle cx='66' cy='124' r='6' className='fill-white/35' />
      <circle cx='142' cy='124' r='6' className='fill-white/35' />

      {/* 걱정스러운 눈썹 (안쪽이 올라간 ハ 모양) */}
      <path
        d='M74 98 L 92 88'
        className='stroke-ink'
        strokeWidth='3'
        strokeLinecap='round'
      />
      <path
        d='M134 98 L 116 88'
        className='stroke-ink'
        strokeWidth='3'
        strokeLinecap='round'
      />

      {/* 눈 */}
      <circle cx='84' cy='108' r='5.5' className='fill-ink' />
      <circle cx='124' cy='108' r='5.5' className='fill-ink' />

      {/* 어쩔 줄 모르는 물결 입 */}
      <path
        d='M88 140 q 8 -9 16 0 q 8 9 16 0'
        className='stroke-ink'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      {/* 파란 땀방울 */}
      <path
        d='M158 66 C 152 76, 150 82, 158 85 C 166 82, 164 76, 158 66 Z'
        className='fill-drop stroke-ink'
        strokeWidth='2.5'
        strokeLinejoin='round'
      />
    </svg>
  );
}
