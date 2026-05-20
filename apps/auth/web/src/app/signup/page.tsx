'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // oauthProviderClient 플러그인이 OIDC 흐름의 oauth_query 를 자동 첨부.
    // 가입 시 autoSignIn=true(기본) → 세션 쿠키 발급 → after hook 이 authorize 이어주기.
    const { data, error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? '가입에 실패했습니다');
      return;
    }

    const redirectUrl = (data as { url?: string; redirect?: boolean } | null)?.url;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      // 일반 가입: 로그인 화면으로 (autoSignIn 이 꺼져있는 경우 대비)
      router.push('/signin');
    }
  }

  return (
    <div className='w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 space-y-6'>
      <div>
        <h1 className='text-xl font-semibold'>회원가입</h1>
        <p className='text-sm text-gray-500 mt-1'>새 계정을 만들어보세요</p>
      </div>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <label htmlFor='name' className='block text-sm font-medium'>
            이름
          </label>
          <input
            id='name'
            type='text'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black'
            autoComplete='name'
          />
        </div>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black'
            autoComplete='new-password'
          />
          <p className='text-xs text-gray-500'>최소 8자 이상</p>
        </div>
        {error && <p className='text-sm text-red-600'>{error}</p>}
        <button
          type='submit'
          disabled={loading}
          className='w-full py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50'
        >
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>
      <p className='text-sm text-gray-600 text-center'>
        이미 계정이 있으신가요?{' '}
        <Link href='/signin' className='underline hover:text-black'>
          로그인
        </Link>
      </p>
    </div>
  );
}
