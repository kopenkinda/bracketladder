import { useRef } from 'react';
import { IconBrandAmongus } from '@tabler/icons';

export default function Mogus() {
  const canPlay = useRef(false);
  const play = () => {
    if (canPlay.current) {
      return;
    }
    const audio = new Audio('/rr.webm');
    audio.volume = 0.25;
    audio.play().then(() => {
      canPlay.current = true;
      setTimeout(() => {
        canPlay.current = false;
      }, 4000);
    });
  };
  return (
    <div
      className='group fixed -bottom-6 -right-6 cursor-pointer p-4 transition-all hover:-translate-y-2 hover:-translate-x-2'
      onClick={play}
    >
      <IconBrandAmongus className='text-red-500/20 group-hover:text-red-500' />
    </div>
  );
}
