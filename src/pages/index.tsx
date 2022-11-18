import { Button, SimpleGrid, useMantineTheme } from '@mantine/core';

import { type NextPage } from 'next';
import { signIn } from 'next-auth/react';
import TournamentCard from '../components/TournamentCard';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
	const hello = trpc.example.hello.useQuery({ text: 'from tRPC' }, {});
	const tournaments = trpc.tournament.getAll.useQuery();
	const theme = useMantineTheme();

	return (
		<>
			<SimpleGrid
				cols={ 3 }
				spacing={ 'lg' }
				breakpoints={ [
					{ maxWidth: theme.breakpoints.xs, cols: 1, spacing: 'xs' },
					{ maxWidth: theme.breakpoints.sm, cols: 2, spacing: 'sm' },
					{ maxWidth: theme.breakpoints.md, cols: 3, spacing: 'md' },
					{ maxWidth: theme.breakpoints.lg, cols: 4, spacing: 'lg' },
					{ minWidth: theme.breakpoints.lg, cols: 5, spacing: 'xl' },
				] }
				className={ 'p-4' }
			>
				{ tournaments.data?.map((tournament, idx) => (<TournamentCard key={idx} tournament={ tournament }/>)) }
			</SimpleGrid>
			{/*<div className="grid grid-cols-3 gap-4">*/ }

			{/*</div>*/ }
			<Button variant="filled" color="grape" onClick={ () => signIn() }>
				{ hello.data?.greeting }
			</Button>
		</>
	);
};

export default Home;
