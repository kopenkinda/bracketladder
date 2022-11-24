import { SimpleGrid, Tabs, Text, useMantineTheme } from '@mantine/core';
import type { Games } from '@prisma/client';
import {
  IconAccessible,
  IconBuildingCarousel,
  IconGlobe,
  IconKarate,
} from '@tabler/icons';
import { type NextPage } from 'next';
import TournamentCard from '../components/TournamentCard';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  return (
    <>
      <Text size='xl' weight='bold'>
        Street fighter
      </Text>
      <TabContent game='StreetFighter' />
      <Text size='xl' weight='bold'>
        Tekken
      </Text>
      <TabContent game='Tekken' />
      <Text size='xl' weight='bold'>
        Super Smash Bros. Ultimate
      </Text>
      <TabContent game='SmashBros' />
      {/* <Tabs keepMounted defaultValue='all' variant='outline'>
        <Tabs.List>
          <Tabs.Tab value='all' icon={<IconGlobe size={16} />}>
            All
          </Tabs.Tab>
          <Tabs.Tab value='sf' icon={<IconKarate size={16} />}>
            Street fighter
          </Tabs.Tab>
          <Tabs.Tab value='tekken' icon={<IconBuildingCarousel size={16} />}>
            Tekken
          </Tabs.Tab>
          <Tabs.Tab value='ssb' icon={<IconAccessible size={16} />}>
            Super Smash Bros.
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='all'>
          <TabContent />
        </Tabs.Panel>
        <Tabs.Panel value='sf'>
          <TabContent game='StreetFighter' />
        </Tabs.Panel>
        <Tabs.Panel value='tekken'>
          <TabContent game='Tekken' />
        </Tabs.Panel>
        <Tabs.Panel value='ssb'>
          <TabContent game='SmashBros' />
        </Tabs.Panel>
      </Tabs> */}
    </>
  );
};

export default Home;

function TabContent({ game }: { game?: Games }) {
  const { data: tournaments } = trpc.tournament.getAllPublic.useQuery(game);
  const theme = useMantineTheme();

  return (
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
      {tournaments?.map((tournament, idx) => (
        <TournamentCard key={idx} tournament={tournament} />
      ))}
      {tournaments?.length === 0 ? (
        <Text size='xl' weight='bold'>
          No tournaments found
        </Text>
      ) : null}
    </SimpleGrid>
  );
}
