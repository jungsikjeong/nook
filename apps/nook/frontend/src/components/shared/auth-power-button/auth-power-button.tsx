'use client';

import { authClient } from '@/lib/auth-client';
import { delay } from '@/lib/utils/delay';
import { Power } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const BASE_SHADOW =
  '0 2px 4px rgba(0,0,0,.08), inset 0 1px 2px #fff, inset 0 -3px 5px rgba(0,0,0,.06), 22px 22px 36px rgba(80,95,85,.28)';
const GLOW_SHADOW = `${BASE_SHADOW}, 0 0 28px rgba(16,185,129,.6)`;
const LOGOUT_SHADOW =
  '0 4px 10px rgba(127,29,29,.24), inset 0 1px 2px rgba(255,255,255,.5), inset 0 -4px 7px rgba(127,29,29,.28), 22px 22px 36px rgba(80,95,85,.22)';
const OFF_SHADOW = `${LOGOUT_SHADOW}, 0 0 28px rgba(239,68,68,.6)`;

const BASE_BACKGROUND =
  'radial-gradient(circle at 50% 34%,#ffffff 0%,#eef0f2 68%,#dde1e4 100%)';
const LOGOUT_BACKGROUND =
  'radial-gradient(circle at 50% 34%,#fb7185 0%,#ef4444 62%,#dc2626 100%)';

function getCurrentPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getAuthCallbackURL(): string {
  const callbackUrl = new URL('/auth/callback', window.location.origin);
  callbackUrl.searchParams.set('redirect_to', getCurrentPath());
  return callbackUrl.toString();
}

export function AuthPowerButton() {
  const { data: session, isPending } = authClient.useSession();

  const [poweredOn, setPoweredOn] = useState(false);
  const [poweredOff, setPoweredOff] = useState(false);

  const isUser = Boolean(session?.user);
  const isLogoutState: boolean = isUser || poweredOff;

  async function handlePower() {
    if (poweredOn || poweredOff || isPending) return;

    if (!isUser) {
      setPoweredOn(true);
      await delay(900);

      const { error } = await authClient.signIn.oauth2({
        providerId: 'nook-auth',
        callbackURL: getAuthCallbackURL(),
      });

      if (error) {
        console.error('OAuth sign-in failed:', error);
        setPoweredOn(false);
        toast.error('로그인에 실패했어요. 다시 시도해주세요.');
      }
    } else {
      setPoweredOff(true);
      await delay(900);
      setPoweredOff(false);

      await authClient.signOut();
    }
  }

  let boxShadow = BASE_SHADOW;
  if (poweredOn) {
    boxShadow = GLOW_SHADOW;
  } else if (isLogoutState) {
    boxShadow = OFF_SHADOW;
  }

  const buttonBackground = isLogoutState ? LOGOUT_BACKGROUND : BASE_BACKGROUND;
  const focusRingClassName = isLogoutState
    ? 'focus-visible:ring-red-400/50'
    : 'focus-visible:ring-emerald-400/50';

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
          disabled={isPending}
          aria-label={isUser ? '로그아웃' : '로그인'}
          aria-pressed={isUser || poweredOn}
          aria-busy={isPending}
          className={`group grid size-22 cursor-pointer place-items-center rounded-full transition-transform duration-150 outline-none focus-visible:ring-4 ${focusRingClassName} active:scale-95 disabled:cursor-wait disabled:opacity-80 md:size-27`}
          style={{
            background: buttonBackground,
            boxShadow,
          }}
        >
          <Power
            strokeWidth={2.5}
            className={`size-10 transition-all duration-500 md:size-12 ${
              poweredOn
                ? 'text-emerald-500'
                : isLogoutState
                  ? 'text-white'
                  : 'text-neutral-500 group-hover:text-neutral-600'
            }`}
            style={
              poweredOn
                ? {
                    filter:
                      'drop-shadow(0 0 10px rgba(16,185,129,.95)) drop-shadow(0 0 22px rgba(16,185,129,.6))',
                  }
                : isLogoutState
                  ? {
                      filter:
                        'drop-shadow(0 1px 3px rgba(127,29,29,.45)) drop-shadow(0 0 16px rgba(255,255,255,.35))',
                    }
                  : undefined
            }
          />
        </button>
      </div>
    </>
  );
}
