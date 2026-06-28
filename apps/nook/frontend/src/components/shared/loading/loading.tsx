import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type LoadingProps = ComponentProps<'div'> & {
  label?: string;
};

export function Loading({
  className,
  label = '불러오는 중',
  ...props
}: LoadingProps) {
  return (
    <div
      className={cn(
        'flex min-h-full w-full items-center justify-center',
        className,
      )}
      {...props}
    >
      <div className='flex flex-col items-center gap-3 text-neutral-700'>
        <LoaderCircle className='size-8 animate-spin' aria-hidden='true' />
        <p className='text-sm font-medium'>{label}</p>
      </div>
    </div>
  );
}
