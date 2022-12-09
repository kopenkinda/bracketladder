import type { DefaultMantineColor } from '@mantine/core';
import { Group, Navbar, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { IconLogout, IconTournament } from '@tabler/icons';
import { signOut, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';

export default function AppNavbar() {
  const { status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Navbar width={{ base: 300 }} p='xs' className='hidden sm:block'>
      <Navbar.Section grow>
        <NavbarItem
          icon={<IconTournament size={18} />}
          label='Create a tournament'
          href='/tournament/create'
          color='blue'
        />
      </Navbar.Section>
      <Navbar.Section>
        <NavbarItem
          icon={<IconLogout size={18} />}
          color='red'
          onClick={() => signOut()}
          label='Log out'
        />
      </Navbar.Section>
    </Navbar>
  );
}

function NavbarItem({
  href,
  icon,
  label,
  color,
  onClick,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  color: DefaultMantineColor;
}) {
  if (href) {
    return (
      <UnstyledButton
        component={Link}
        href={href}
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant='light'>
            {icon}
          </ThemeIcon>

          <Text size='sm'>{label}</Text>
        </Group>
      </UnstyledButton>
    );
  }
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={onClick}
    >
      <Group>
        <ThemeIcon color={color} variant='light'>
          {icon}
        </ThemeIcon>

        <Text size='sm' color={color}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}
