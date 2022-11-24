import { type NextPage } from 'next';
import { Avatar } from '@mantine/core';
import useUser from '../hooks/useUser';
import { trpc } from '../utils/trpc';
import TournamentCard from '../components/TournamentCard';

const Profile: NextPage = () => {

  const { data: participatingTournaments } = trpc.tournament.tournamentParticipation.useQuery();

  const user = useUser();

  const { data: ownedTournaments } = trpc.tournament.getTournamentByOwner.useQuery(
    user?.id as string,
  );

  if (user === undefined) return null;

  return (
    <div className='m-10'>
      <h1>Profile</h1>
      <Avatar size='xl' color='blue' src={user?.image} />
      <h3>Pseudo : {user?.name}</h3>
      <h3>Email : {user?.email}</h3>
      <h3>Roles : {user?.role}</h3>
      <div className='mt-32'>
        <h3>Mes tournois :</h3>
        <div className='grid grid-cols-6 gap-4 overflow-x-auto'>
          {ownedTournaments?.map((tournament, idx) => (
            <TournamentCard key={idx} tournament={tournament} />
          ))}
        </div>
      </div>
      <div className='mt-16'>
        <h3>Mes Participations :</h3>
        <div className='grid grid-cols-6 gap-4 overflow-x-auto'>
          {participatingTournaments?.map((tournament, idx) => (
            <TournamentCard key={idx} tournament={tournament} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Profile;
