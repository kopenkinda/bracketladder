import { ActionIcon, Button, SimpleGrid, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import { type NextPage } from 'next';
import { signIn } from 'next-auth/react';
import TournamentCard from '../components/TournamentCard';
import { trpc } from '../utils/trpc';

function Demo() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';

	return (
		<ActionIcon
			variant="outline"
			color={ dark ? 'yellow' : 'blue' }
			onClick={ () => toggleColorScheme() }
			title="Toggle color scheme"
		>
			{ dark ? <IconSun size={ 18 }/> : <IconMoonStars size={ 18 }/> }
		</ActionIcon>
	);
}

const Home: NextPage = () => {
	const hello = trpc.example.hello.useQuery({ text: 'from tRPC' }, {});
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
			<Demo/>
			<SimpleGrid cols={ 3 } spacing={ 'lg' } breakpoints={ [
				{ maxWidth: theme.breakpoints.xs, cols: 1, spacing: 'xs' },
				{ maxWidth: theme.breakpoints.sm, cols: 2, spacing: 'sm' },
				{ maxWidth: theme.breakpoints.md, cols: 3, spacing: 'md' },
				{ maxWidth: theme.breakpoints.lg, cols: 4, spacing: 'lg' },
				{ minWidth: theme.breakpoints.lg, cols: 5, spacing: 'xl' },
			] } className={"p-4"}>
				<TournamentCard tournament={ testTournament }/>
				<TournamentCard tournament={ testTournament }/>
				<TournamentCard tournament={ testTournament }/>
				<TournamentCard tournament={ testTournament }/>
				<TournamentCard tournament={ testTournament }/>
				<TournamentCard tournament={ testTournament }/>
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
