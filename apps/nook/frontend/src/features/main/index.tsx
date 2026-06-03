import { Character } from '@/components/character';
import { BottomMenu } from '@/components/shared/menu';

export function Main() {
  return (
    <>
      <p className='absolute top-5 left-5 -rotate-6 select-none text-center font-hand leading-none text-neutral-700/90'>
        <span className='text-2xl'>행복해지는</span>
        <br />
        <span className='text-3xl'>공간 :)</span>
      </p>

      <Character />
      <BottomMenu />
    </>
  );
}
