import { Menu } from 'lucide-react';

export function HamburgerMenu() {
  return (
    <button
      type='button'
      aria-label='메뉴 열기'
      className='absolute right-10 top-10 text-white/90 hover:text-white transition-colors cursor-pointer'
    >
      <Menu size={40} strokeWidth={2.5} />
    </button>
  );
}
