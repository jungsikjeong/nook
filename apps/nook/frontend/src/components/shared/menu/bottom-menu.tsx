import Image from 'next/image';
import Link from 'next/link';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const items = [
  { src: '/projects.png', alt: 'projects', href: '/projects', label: '프로젝트' },
  { src: '/folder.png', alt: 'folder', href: '/folder', label: '폴더' },
  { src: '/memo.png', alt: 'memo', href: '/memo', label: '메모' },
] as const;

export function BottomMenu() {
  return (
    <div className='absolute left-1/2 bottom-8 -translate-x-1/2 flex items-start gap-5 md:bottom-10 md:gap-7'>
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
            className='relative w-18 h-18 rounded-[18px] overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 md:w-23 md:h-23 md:rounded-[24px]'
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
