import { SimpleGrid, useMantineTheme } from '@mantine/core';
import { type NextPage } from 'next';
import TournamentCard from '../components/TournamentCard';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const tournaments = trpc.tournament.getAll.useQuery();
  const theme = useMantineTheme();

  return (
    <>
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
        {tournaments.data?.map((tournament, idx) => (
          <TournamentCard key={idx} tournament={tournament} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Home;
