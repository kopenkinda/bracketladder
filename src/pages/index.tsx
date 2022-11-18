import { SimpleGrid, useMantineTheme } from '@mantine/core';

import { type NextPage } from 'next';
import TournamentCard from '../components/TournamentCard';

const Home: NextPage = () => {
  const theme = useMantineTheme();

  const testTournament = {
    name: 'Test Tournament',
    region: 'NA',
    minPlayers: 4,
    maxPlayers: 8,
    game: 2,
    owner: {
      name: 'Robin',
      nickname: 'RoTour',
      region: 'NA',
      stats: undefined,
    },
    whiteList: undefined,
    bracket: undefined,
  };

  return (
    <>
      <SimpleGrid
        cols={3}
        spacing={'lg'}
        breakpoints={[
          { maxWidth: theme.breakpoints.xs, cols: 1, spacing: 'xs' },
          { maxWidth: theme.breakpoints.sm, cols: 2, spacing: 'sm' },
          { maxWidth: theme.breakpoints.md, cols: 3, spacing: 'md' },
          { maxWidth: theme.breakpoints.lg, cols: 4, spacing: 'lg' },
          { minWidth: theme.breakpoints.lg, cols: 5, spacing: 'xl' },
        ]}
        className={'p-4'}
      >
        <TournamentCard tournament={testTournament} />
        <TournamentCard tournament={testTournament} />
        <TournamentCard tournament={testTournament} />
        <TournamentCard tournament={testTournament} />
        <TournamentCard tournament={testTournament} />
        <TournamentCard tournament={testTournament} />
      </SimpleGrid>
    </>
  );
};

export default Home;
