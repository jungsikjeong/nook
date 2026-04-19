import Image from 'next/image';
import Link from 'next/link';

export function Character() {
  return (
    <div className='group absolute left-1/2 bottom-32 -translate-x-1/2 w-[65vw] max-w-115 aspect-1024/1536 transition-transform duration-300 hover:scale-[1.02] md:bottom-auto md:top-23 md:w-115'>
      <Link href='/about' className='absolute inset-0 block'>
        <Image
          src='/profile.png'
          alt='character'
          fill
          priority
          sizes='460px'
          className='object-contain transition-opacity duration-500 ease-out group-hover:opacity-0'
        />
        <Image
          src='/profile2.png'
          alt=''
          aria-hidden
          fill
          sizes='460px'
          className='object-contain opacity-0 mix-blend-multiply transition-opacity duration-500 ease-out delay-75 group-hover:opacity-100'
        />
      </Link>
    </div>
  );
}
