import {
  ActionIcon,
  Avatar,
  Button,
  Header,
  Image,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLogin, IconMoonStars, IconSun } from '@tabler/icons';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import logo from '../../assets/logo.gif';

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
      <Link href='/'>
        <Image src={logo.src} alt='Bracket Ladder Logo' width={220}/>
      </Link>
      <ColorThemeSwitcher className='ml-auto' />
      {status !== 'authenticated' && (
        <Button
          className='ml-2'
          onClick={() => signIn('discord')}
          rightIcon={<IconLogin size={18} />}
        >
          Log in
        </Button>
      )}
      {status === 'authenticated' ? (
        <Avatar
          component={Link}
          href='/profile'
          src={session.user?.image}
          className='ml-2'
        />
      ) : null}
    </Header>
  );
}
