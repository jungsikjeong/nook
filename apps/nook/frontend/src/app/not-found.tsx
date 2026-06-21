import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center md:min-h-full'>
      <LostBlob />

      <div className='space-y-2'>
        <p className='font-hand text-7xl leading-none text-leaf'>404</p>
        <h1 className='text-lg font-semibold text-foreground'>
          길을 잃었나 봐요
        </h1>
        <p className='text-sm leading-relaxed text-foreground/60'>
          찾으시는 발자취가 여기엔 없네요.
          <br />
          주소가 바뀌었거나 사라진 페이지일 수 있어요.
        </p>
      </div>

      <Link
        href='/'
        className={cn(buttonVariants({ variant: 'ink' }), 'h-11 px-7 text-sm')}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

function LostBlob() {
  return (
    <svg
      viewBox='0 0 200 210'
      className='h-40 w-40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label='길을 잃은 캐릭터'
    >
      {/* 발자취 — 다가오다 끊기는 점선과 발자국 */}
      <path
        d='M14 192 C 44 184, 60 198, 90 184'
        className='stroke-ink/30'
        strokeWidth='3'
        strokeLinecap='round'
        strokeDasharray='1 12'
      />
      <ellipse
        cx='18'
        cy='192'
        rx='4.5'
        ry='7'
        transform='rotate(-22 18 192)'
        className='fill-ink/20'
      />
      <ellipse
        cx='40'
        cy='187'
        rx='4.5'
        ry='7'
        transform='rotate(-14 40 187)'
        className='fill-ink/15'
      />
      <ellipse
        cx='62'
        cy='189'
        rx='4.5'
        ry='7'
        transform='rotate(-18 62 189)'
        className='fill-ink/10'
      />

      {/* 몸통 */}
      <path
        d='M96 22 C 150 16, 190 56, 184 112 C 178 166, 152 196, 98 194 C 46 192, 22 152, 26 100 C 30 52, 54 28, 96 22 Z'
        className='fill-blob stroke-ink'
        strokeWidth='4'
        strokeLinejoin='round'
      />

      {/* 볼터치 */}
      <circle cx='66' cy='122' r='6' className='fill-white/35' />
      <circle cx='142' cy='122' r='6' className='fill-white/35' />

      {/* 당황한 눈썹 */}
      <path
        d='M72 90 q 10 -7 20 -2'
        className='stroke-ink'
        strokeWidth='3'
        strokeLinecap='round'
      />
      <path
        d='M116 88 q 10 -5 20 1'
        className='stroke-ink'
        strokeWidth='3'
        strokeLinecap='round'
      />

      {/* 눈 */}
      <circle cx='82' cy='104' r='5.5' className='fill-ink' />
      <circle cx='126' cy='104' r='5.5' className='fill-ink' />

      {/* 작게 벌어진 입 */}
      <ellipse cx='104' cy='136' rx='7' ry='9' className='fill-ink' />
    </svg>
  );
}
