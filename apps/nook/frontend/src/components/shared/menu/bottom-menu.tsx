import Image from 'next/image';
import Link from 'next/link';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const items = [
  {
    src: '/projects.png',
    alt: 'projects',
    href: '/projects',
    label: '프로젝트',
  },
  { src: '/folder.png', alt: 'folder', href: '/folder', label: '폴더' },
  { src: '/memo.png', alt: 'guestbook', href: '/guestbook', label: '발자취' },
] as const;

export function BottomMenu() {
  return (
    <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 items-start gap-5 md:bottom-10 md:gap-7'>
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
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            aria-label={label}
            className='relative h-18 w-18 cursor-pointer overflow-hidden rounded-[18px] transition-transform duration-200 hover:scale-105 md:h-23 md:w-23 md:rounded-[24px]'
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes='(min-width: 768px) 92px, 72px'
              className='object-cover'
            />
          </Link>
        }
      />
      <TooltipContent
        side='top'
        sideOffset={8}
        className='rounded-lg px-3.5 py-2 text-sm font-medium'
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
