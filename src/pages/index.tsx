import { SimpleGrid, Text, useMantineTheme } from '@mantine/core';
import type { Games } from '@prisma/client';
import { type NextPage } from 'next';
import TournamentCard from '../components/TournamentCard';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  return (
    <>
      <Text size='xl' weight='bold'>
        Street fighter
      </Text>
      <TabContent game='StreetFighter' />
      <Text size='xl' weight='bold'>
        Tekken
      </Text>
      <TabContent game='Tekken' />
      <Text size='xl' weight='bold'>
        Super Smash Bros. Ultimate
      </Text>
      <TabContent game='SmashBros' />
    </>
  );
};

export default Home;

function TabContent({ game }: { game?: Games }) {
  const { data: tournaments } = trpc.tournament.getAllPublic.useQuery(game);
  const theme = useMantineTheme();

  return (
    <SimpleGrid
      spacing={'lg'}
      breakpoints={[
        { maxWidth: theme.breakpoints.xs, cols: 1, spacing: 'xs' },
        { maxWidth: theme.breakpoints.sm, cols: 1, spacing: 'sm' },
        { maxWidth: theme.breakpoints.md, cols: 2, spacing: 'md' },
        { maxWidth: theme.breakpoints.lg, cols: 3, spacing: 'lg' },
        { minWidth: theme.breakpoints.lg, cols: 4, spacing: 'xl' },
      ]}
      className={'p-4'}
    >
      {tournaments?.map((tournament, idx) => (
        <TournamentCard key={idx} tournament={tournament} />
      ))}
      {tournaments?.length === 0 ? (
        <Text size='xl' weight='bold'>
          No tournaments found
        </Text>
      ) : null}
    </SimpleGrid>
  );
}
