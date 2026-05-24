import { Loading as LoadingIndicator } from '@/components/shared/loading';

export default function Loading() {
  return (
    <LoadingIndicator
      label='로그인 확인 중'
      className='absolute inset-0 bg-[#dbe7d8]'
    />
  );
}
