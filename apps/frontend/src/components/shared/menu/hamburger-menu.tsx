'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const navItems = [
  { href: '/projects', label: '프로젝트' },
  { href: '/folder', label: '폴더' },
  { href: '/memo', label: '메모' },
] as const;

export function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label='메뉴 열기'
        className='absolute right-10 top-10 text-white/90 hover:text-white transition-colors cursor-pointer'
      >
        <Menu size={40} strokeWidth={2.5} />
      </SheetTrigger>

      <SheetContent side='right' className='sm:max-w-sm'>
        <SheetHeader>
          <SheetTitle>nook</SheetTitle>
          <SheetDescription>아늑한 나의 작업 공간</SheetDescription>
        </SheetHeader>

        <nav className='flex flex-col gap-1 px-2'>
          {navItems.map((item) => (
            <SheetClose
              key={item.href}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  className='rounded-md px-3 py-2 text-base text-foreground hover:bg-accent transition-colors'
                >
                  {item.label}
                </Link>
              }
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
