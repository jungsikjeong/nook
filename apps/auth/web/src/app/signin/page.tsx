'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useCurrentSearch } from '@/lib/use-current-search';

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentSearch = useCurrentSearch();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // oauthProviderClient 플러그인이 URL 의 서명된 oauth_query 를 자동으로
    // 요청 body 에 첨부한다. 서버 측 before/after hook 이 그걸 받아
    // 로그인 + authorize 이어주기를 처리하고, 응답에 redirect URL 을 돌려준다.
    const { data, error: signInError } = await authClient.signIn.email({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message ?? '로그인에 실패했습니다');
      return;
    }

    // OIDC 흐름에서 들어왔으면 응답에 redirect URL 이 있고, 그쪽으로 보낸다.
    // 일반 방문이면 redirect 가 없으므로 홈으로.
    const redirectUrl = (data as { url?: string; redirect?: boolean } | null)
      ?.url;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      router.push('/');
    }
  }

  return (
    <div className='w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 space-y-6'>
      <div>
        <h1 className='text-xl font-semibold'>로그인</h1>
        <p className='text-sm text-gray-500 mt-1'>계정에 로그인하세요</p>
      </div>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <label htmlFor='email' className='block text-sm font-medium'>
            이메일
          </label>
          <input
            id='email'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black'
            autoComplete='email'
          />
        </div>
        <div className='space-y-1.5'>
          <label htmlFor='password' className='block text-sm font-medium'>
            비밀번호
          </label>
          <input
            id='password'
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black'
            autoComplete='current-password'
          />
        </div>
        {error && <p className='text-sm text-red-600'>{error}</p>}
        <button
          type='submit'
          disabled={loading}
          className='w-full py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50'
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className='text-sm text-gray-600 text-center'>
        계정이 없으신가요?{' '}
        <Link
          href={`/signup${currentSearch}`}
          className='underline hover:text-black'
        >
          가입하기
        </Link>
      </p>
    </div>
  );
}
