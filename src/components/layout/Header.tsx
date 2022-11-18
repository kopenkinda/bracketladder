import {
  ActionIcon,
  Avatar,
  Button,
  Header,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLogin, IconMoonStars, IconSun } from '@tabler/icons';
import { signIn, useSession } from 'next-auth/react';

function ColorThemeSwitcher({ className }: { className?: string }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant='outline'
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title='Toggle color scheme'
      className={className}
    >
      {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  );
}

export default function AppHeader() {
  const { data: session, status } = useSession();
  return (
    <Header height={60} className='z-50 flex items-center' p='md'>
      <ColorThemeSwitcher className='ml-auto' />
      {status !== 'authenticated' && (
        <Button
          className='ml-2'
          onClick={() => signIn()}
          rightIcon={<IconLogin size={18} />}
        >
          Log in
        </Button>
      )}
      {status === 'authenticated' ? (
        <Avatar src={session.user?.image} className='ml-2' />
      ) : null}
    </Header>
  );
}
