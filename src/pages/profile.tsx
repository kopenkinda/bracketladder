import { Avatar } from '@mantine/core';
import { type NextPage } from 'next';
import TournamentCard from '../components/TournamentCard';
import TournamentGrid from '../components/TournamentGrid';
import useUser from '../hooks/useUser';
import { trpc } from '../utils/trpc';

const Profile: NextPage = () => {
	const user = useUser();
	if (user === undefined) return null;
	const ownedTournaments = trpc.tournament.getByOwner.useQuery(user?.id ?? '');
	const participatedTournaments = trpc.user.getTournaments.useQuery(user?.id ?? '');

	return (
		<div className="m-10 ">
			<h1>Profile</h1>
			<Avatar size="xl" color="blue" src={ user?.image }/>
			<h3>Pseudo : { user?.name }</h3>
			<h3>Email : { user?.email }</h3>
			<h3>Roles : { user?.role }</h3>
			<div className="mt-16">
				<h3>Mes tournois :</h3>
				{ !ownedTournaments.data?.length
					? <p className={ 'text-center' }>Vous n&apos;avez pas encore créé de tournois</p>
					: <TournamentGrid>
							{ ownedTournaments.data?.map((tournament, idx) => (
								<TournamentCard key={ idx } tournament={ tournament }/>),
							) }
					</TournamentGrid>
				}
			</div>
			<div className="mt-16">
				<h3>Mes Participations :</h3>
				{ !participatedTournaments.data?.length
					? <p className={ 'text-center' }>Vous n&apos;avez pas encore participé à de tournois</p>
					: <TournamentGrid>
						{ participatedTournaments.data?.map((tournament, idx) => (
							<TournamentCard key={ idx } tournament={ tournament }/>),
						) }
					</TournamentGrid>
				}
			</div>
		</div>
	);
};
export default Profile;
