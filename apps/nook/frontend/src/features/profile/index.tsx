import { ProfileEditForm } from '@/components/form';
import { getMyProfile } from '@/lib/api/users';

export async function Profile() {
  const profile = await getMyProfile();

  return <ProfileEditForm mode='edit' profile={profile} />;
}
