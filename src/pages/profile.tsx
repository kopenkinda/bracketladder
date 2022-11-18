import { type NextPage } from 'next';
import { Avatar } from '@mantine/core';
import useUser from '../hooks/useUser';
import {trpc} from "../utils/trpc";
import TournamentCard from "../components/TournamentCard";

const Profile: NextPage = () => {
  const user = useUser();
  if (user === undefined) return null;
  const tournaments = trpc.tournament.getTournamentByOwner.useQuery(user.id as string);

    return (
    <div className='m-10 '>
      <h1>Profile</h1>
      <Avatar size='xl' color='blue' src={user?.image} />
      <h3>Pseudo : {user?.name}</h3>
      <h3>Email : {user?.email}</h3>
      <h3>Roles : {user?.role}</h3>
      <div className='mt-32'>
        <h3>Mes tournois :</h3>
        <div className='grid grid-cols-6 gap-4 overflow-x-auto'>
            {tournaments.data?.map((tournament, idx) => (
                <TournamentCard key={idx} tournament={tournament} />
            ))}
        </div>
      </div>
      <div className='mt-16'>
        <h3>Mes Participations :</h3>
        <div className='grid grid-cols-6 gap-4 overflow-x-auto'></div>
      </div>
    </div>
  );
};
export default Profile;
