import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import type { ControllerRenderProps } from 'react-hook-form';

import type { ProfileFormValues } from './profile-edit-from';

type AvatarInputProps = ControllerRenderProps<ProfileFormValues, 'avatar'>;

export function AvatarInput({
  value,
  onChange,
  onBlur,
  name,
  disabled,
}: AvatarInputProps) {
  const hasImage = Boolean(value);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: 실제 업로드 후 받은 URL을 onChange로 전달
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className='relative flex items-center gap-4'>
      <Avatar className='size-16'>
        <AvatarImage src={value} />
        <AvatarFallback className='relative'>
          <Image
            src='/fullback.png'
            alt='기본 아바타'
            fill
            sizes='64px'
            className='rounded-full object-cover'
          />
        </AvatarFallback>
      </Avatar>

      <Tooltip>
        <TooltipTrigger
          render={
            <label
              htmlFor={name}
              className='absolute top-0 left-0 block size-16 cursor-pointer rounded-full border-2 border-green-200 transition-colors hover:border-green-300'
            />
          }
        />
        {!hasImage && (
          <TooltipContent>기본 이미지입니다. 수정해주세요</TooltipContent>
        )}
      </Tooltip>

      <input
        id={name}
        type='file'
        accept='image/*'
        className='hidden'
        disabled={disabled}
        onBlur={onBlur}
        onChange={onSelect}
      />
    </div>
  );
}
