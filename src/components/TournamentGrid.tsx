import { SimpleGrid, useMantineTheme } from '@mantine/core';
import React, { type FC, type PropsWithChildren } from 'react';

type TournamentGridProps = Record<string, unknown>

const TournamentGrid: FC<PropsWithChildren<TournamentGridProps>> = ({children}) => {
	const theme = useMantineTheme();

	return <SimpleGrid
		cols={3}
		spacing={'lg'}
		breakpoints={[
			{ maxWidth: theme.breakpoints.xs, cols: 1, spacing: 'xs' },
			{ maxWidth: theme.breakpoints.sm, cols: 1, spacing: 'sm' },
			{ maxWidth: theme.breakpoints.md, cols: 2, spacing: 'md' },
			{ maxWidth: theme.breakpoints.lg, cols: 3, spacing: 'lg' },
			{ minWidth: theme.breakpoints.lg, cols: 5, spacing: 'xl' },
		]}
		className={'p-4'}
	>
		{children}
	</SimpleGrid>
};

export default TournamentGrid;