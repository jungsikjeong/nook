import { Character } from '@/components/character';
import { AuthPowerButton } from '@/components/shared/auth-power-button';
import { BottomMenu } from '@/components/shared/menu';

export default function Home() {
  return (
    <>
      <AuthPowerButton />
      <Character />
      <BottomMenu />
    </>
  );
}
