import { ProfileEditForm } from '@/components/form';

export default function Onboarding() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 p-4 md:min-h-0 md:py-12'>
      <ProfileEditForm mode='onboarding' />
    </div>
  );
}
