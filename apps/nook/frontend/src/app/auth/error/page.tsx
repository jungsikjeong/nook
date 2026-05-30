'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  please_restart_the_process: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
  state_mismatch: '보안 검증에 실패했습니다. 다시 로그인해 주세요.',
  issuer_mismatch: '인증 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  issuer_missing: '인증 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  oauth_code_verification_failed: '인증 코드 검증에 실패했습니다. 다시 로그인해 주세요.',
  user_info_is_missing: '사용자 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') ?? 'unknown';
  const message =
    ERROR_MESSAGES[errorCode] ?? '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='w-full max-w-sm space-y-4 text-center'>
        <h1 className='text-xl font-semibold'>로그인 오류</h1>
        <p className='text-sm text-muted-foreground'>{message}</p>
        <Link
          href='/'
          className='inline-block text-sm underline hover:text-foreground text-muted-foreground'
        >
          처음으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
