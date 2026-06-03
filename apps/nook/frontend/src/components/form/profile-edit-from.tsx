'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { generateRandomNickname } from '@/lib/utils/generate-random-nickname';
import { useRouter } from 'next/navigation';
import { AvatarInput } from './avatar-input';

const profileSchema = z.object({
  avatar: z.string().optional(),
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하여야 합니다.'),
  bio: z.string().max(160, '소개는 160자 이하여야 합니다.'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

type Props = {
  mode: 'onboarding' | 'edit';
};

export function ProfileEditForm({ mode = 'edit' }: Props) {
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // TODO: 기존 프로필 값으로 초기화
    defaultValues: {
      avatar: '',
      nickname: '',
      bio: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // TODO: 프로필 수정 API 호출
    toast('프로필이 저장되었습니다.', {
      description: `닉네임: ${data.nickname}`,
    });
  };

  const handleCancel = () => {
    if (mode === 'onboarding') {
      // 온보딩에서 취소 → 랜덤 닉네임으로 등록하고 진행
      const randomNickname = generateRandomNickname();
      onSubmit({ ...form.getValues(), nickname: randomNickname });
      return;
    }

    form.reset();
  };

  return (
    <Card className='w-full sm:max-w-md'>
      <CardHeader>
        <CardTitle>프로필 수정</CardTitle>
        <CardDescription>닉네임과 소개를 설정할 수 있어요.</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col gap-6'>
        <div className='flex justify-center'>
          <Controller
            name='avatar'
            control={form.control}
            render={({ field }) => <AvatarInput {...field} />}
          />
        </div>

        <form id='profile-edit-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='nickname'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='profile-edit-nickname'>
                    닉네임
                  </FieldLabel>
                  <Input
                    {...field}
                    id='profile-edit-nickname'
                    aria-invalid={fieldState.invalid}
                    placeholder='닉네임을 입력하세요'
                    autoComplete='off'
                  />
                  <FieldDescription>2~20자로 입력해주세요.</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='bio'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='profile-edit-bio'>소개</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id='profile-edit-bio'
                      placeholder='자신을 간단히 소개해보세요.'
                      rows={5}
                      className='min-h-24 resize-none'
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align='block-end'>
                      <InputGroupText className='tabular-nums'>
                        {field.value.length}/160
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation='horizontal'>
          <Button
            type='button'
            variant='outline'
            onClick={() => handleCancel()}
          >
            취소
          </Button>
          <Button type='submit' form='profile-edit-form'>
            저장
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
