import { BackgroundImage, Button, Group } from '@mantine/core';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { getGameImageUrl } from '../../utils/tournament';
import { trpc } from '../../utils/trpc';

type tournamentDetailsProps = null;

const TournamentDetails: NextPage<tournamentDetailsProps> = () => {
	const router = useRouter();
	const { id } = router.query;
	const tournament = trpc.tournament.getOne.useQuery(id as string);

	const { mutateAsync: joinTournament, isLoading } = trpc.tournament.joinTournament.useMutation();
	const { mutateAsync: leaveTournament, isLoading: isLeaving } = trpc.tournament.leaveTournament.useMutation();
	trpc.tournament.create.useMutation();

	return <div>
		{tournament.isLoading && <div>Loading...</div>}
		{tournament.data && <div className={'[&_span]:font-bold text-xl'}>
			<BackgroundImage src={getGameImageUrl(tournament.data)} className={'w-full h-[20vh] flex flex-col justify-end relative'}>
				<div className={'absolute top-0 left-0 bg-black w-full h-[inherit] opacity-40 z-10'}></div>
				<h2 className='mb-0 text-white z-20 relative mx-4 text-4xl'>{tournament.data.name}</h2>
			</BackgroundImage>
			<p><span>Type :</span> {tournament.data.type} </p>
			<p><span>Players :</span> {tournament.data.minPlayers} - {tournament.data.maxPlayers}</p>
			<p><span>Region :</span> {tournament.data.region} </p>
			<p><span>Owner :</span> {tournament.data.owner.name}</p>
		</div>}

		<div className={'flex'}>
			<div className={'pr-6'}>
				{tournament.data && <Button onClick={async () => {
					await joinTournament({ tournamentId: id as string });
					router.push(`/tournament/${id}`)
				}} disabled={isLoading}>Join Tournament</Button>}
			</div>
			<div className={'pr-6'}>
				{tournament.data && <Button onClick={async () => {
					await leaveTournament({ tournamentId: id as string });
					router.push(`/tournament/${id}`)
				}} disabled={isLeaving}>Leave Tournament</Button>}

			</div>

		</div>
	</div>
};

		export default TournamentDetails;