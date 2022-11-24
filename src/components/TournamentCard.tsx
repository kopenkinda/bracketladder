import { Badge, Card, Center, Text } from '@mantine/core';
import { type Tournament } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';

type TournamentCardProps = {
  tournament: Tournament;
};

const TournamentCard: FC<TournamentCardProps> = ({ tournament }) => {
  const image = (() => {
    switch (tournament.game) {
      case 'Tekken':
        return '/tekken.png';
      case 'StreetFighter':
        return '/street-fighter.png';
      default:
        return '/ssbu.svg';
    }
  })();

  return (
    <Card withBorder component={Link} href={`/tournament/${tournament.id}`}>
      <Card.Section>
        <Center>
          <Image src={image} alt={tournament.name} width={300} height={200} />
        </Center>
      </Card.Section>
      <Text size='xl' weight='bold'>
        {tournament.name}
      </Text>
      <Badge
        color={tournament.type === 'Official' ? 'yellow' : 'blue'}
        radius='xs'
        variant='outline'
      >
        {tournament.type}
      </Badge>
      <Text size='sm'>Region: {tournament.region}</Text>
      <Text size='sm'>
        Players:{' '}
        <Text component='span' weight='bold'>
          {tournament.minPlayers}
        </Text>
        {tournament.maxPlayers > tournament.minPlayers ? (
          <>
            {' - '}
            <Text component='span' weight='bold'>
              {tournament.maxPlayers}
            </Text>
          </>
        ) : null}
      </Text>
    </Card>
  );
};

export default TournamentCard;
