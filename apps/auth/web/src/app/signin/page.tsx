'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useCurrentSearch } from '@/lib/use-current-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const currentSearch = useCurrentSearch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? '로그인에 실패했습니다');
      return;
    }

    const redirectUrl = (data as { url?: string } | null)?.url;
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      router.push('/');
    }
  }

  return (
    <div className='w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 space-y-6'>
      <div>
        <h1 className='text-xl font-semibold'>로그인</h1>
        <p className='text-sm text-muted-foreground mt-1'>계정에 로그인하세요</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>이메일</Label>
          <Input
            id='email'
            type='email'
            autoComplete='email'
            {...register('email')}
          />
          {errors.email && (
            <p className='text-xs text-destructive'>{errors.email.message}</p>
          )}
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>비밀번호</Label>
          <Input
            id='password'
            type='password'
            autoComplete='current-password'
            {...register('password')}
          />
          {errors.password && (
            <p className='text-xs text-destructive'>{errors.password.message}</p>
          )}
        </div>
        <Button type='submit' disabled={loading} className='w-full'>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>
      <p className='text-sm text-muted-foreground text-center'>
        계정이 없으신가요?{' '}
        <Link
          href={`/signup${currentSearch}`}
          className='underline hover:text-foreground'
        >
          가입하기
        </Link>
      </p>
    </div>
  );
}
