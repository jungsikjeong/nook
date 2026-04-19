import Image from 'next/image';
import Link from 'next/link';

const items = [
  {
    src: '/projects.png',
    alt: 'projects',
    href: '/projects',
    label: '프로젝트로 이동',
  },
  { src: '/folder.png', alt: 'folder', href: '/folder', label: '폴더로 이동' },
  { src: '/memo.png', alt: 'memo', href: '/memo', label: '메모로 이동' },
] as const;

export function BottomMenu() {
  return (
    <div className='absolute left-1/2 bottom-10 -translate-x-1/2 flex items-start gap-7'>
      {items.map((item) => (
        <MenuItem key={item.href} {...item} />
      ))}
    </div>
  );
}

interface MenuItemProps {
  src: string;
  alt: string;
  href: string;
  label: string;
}

function MenuItem({ src, alt, href, label }: MenuItemProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className='relative w-23 h-23 rounded-[24px] overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105'
    >
      <Image src={src} alt={alt} fill sizes='92px' className='object-cover' />
    </Link>
  );
}
