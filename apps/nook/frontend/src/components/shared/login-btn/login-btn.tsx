'use client';

import { authClient } from '@/lib/auth-client';
import { Power } from 'lucide-react';
import { useState } from 'react';

const BASE_SHADOW =
  '0 2px 4px rgba(0,0,0,.08), inset 0 1px 2px #fff, inset 0 -3px 5px rgba(0,0,0,.06), 22px 22px 36px rgba(80,95,85,.28)';
const GLOW_SHADOW = `${BASE_SHADOW}, 0 0 28px rgba(16,185,129,.6)`;

export function LoginBtn() {
  const [poweredOn, setPoweredOn] = useState(false);

  async function handlePower() {
    if (poweredOn) return;
    // 불이 켜지는 모습을 잠깐 보여준 뒤 로그인 페이지로 이동
    setPoweredOn(true);

    setTimeout(() => 900);

    authClient.signIn.oauth2({
      providerId: 'nook-auth',
      callbackURL: '/', // 로그인 후 돌아올 nook 프론트 경로
    });
  }

  return (
    <>
      {/* 전원 버튼 + 손글씨 낙서 */}
      <div className='absolute left-2 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-3 md:left-4'>
        <p className='-rotate-6 select-none text-center font-hand leading-none text-neutral-700/90'>
          <span className='text-2xl'>행복해지는</span>
          <br />
          <span className='text-3xl'>공간 :)</span>
        </p>

        {/* 흰색 전원 버튼 */}
        <button
          type='button'
          onClick={handlePower}
          aria-label='로그인'
          aria-pressed={poweredOn}
          className='group grid size-22 cursor-pointer place-items-center rounded-full transition-transform duration-150 outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50 active:scale-95 md:size-27'
          style={{
            background:
              'radial-gradient(circle at 50% 34%,#ffffff 0%,#eef0f2 68%,#dde1e4 100%)',
            boxShadow: poweredOn ? GLOW_SHADOW : BASE_SHADOW,
          }}
        >
          <Power
            strokeWidth={2.5}
            className={`size-10 transition-all duration-500 md:size-12 ${
              poweredOn
                ? 'text-emerald-500'
                : 'text-neutral-500 group-hover:text-neutral-600'
            }`}
            style={
              poweredOn
                ? {
                    filter:
                      'drop-shadow(0 0 10px rgba(16,185,129,.95)) drop-shadow(0 0 22px rgba(16,185,129,.6))',
                  }
                : undefined
            }
          />
        </button>
      </div>
    </>
  );
}
