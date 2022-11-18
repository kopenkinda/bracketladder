import { type NextPage } from 'next';
import TournamentCard from '../components/TournamentCard';
import TournamentGrid from '../components/TournamentGrid';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const tournaments = trpc.tournament.getAll.useQuery();

  return (
    <TournamentGrid>
      {tournaments.data?.map((tournament, idx) => (
        <TournamentCard key={idx} tournament={tournament} />
      ))}
    </TournamentGrid>
  );
};

export default Home;
