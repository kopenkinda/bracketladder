import { useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import React, { type FC } from 'react';
import { type Tournament } from '@prisma/client';

type TournamentCardProps = {
  tournament: Tournament;
};

const TournamentCard: FC<TournamentCardProps> = ({ tournament }) => {
  const image = () => {
    switch (tournament.game) {
      case 'Tekken':
        return (
          <Image
            src='/tekken.png'
            width={200}
            height={200}
            alt={tournament.name}
          />
        );
      case 'StreetFighter':
        return (
          <Image
            src='/street-fighter.png'
            width={200}
            height={200}
            alt={tournament.name}
          />
        );
      default:
        return (
          <Image
            src='/ssbu.svg'
            width={200}
            height={200}
            alt={tournament.name}
          />
        );
    }
  };
  const theme = useMantineTheme()
  return (
    <Link
      className={ `flex cursor-pointer flex-col rounded-xl border-2
        border-solid border-black p-4 no-underline
        shadow-xl [&>div]:flex-1 ${theme.colorScheme === 'dark' ? 'text-white' : 'text-black'}` }
      href={`tournament/${tournament.id}`}
    >
      <div className='[&>img]:mx-auto [&>img]:h-40 [&>img]:w-full [&>img]:object-contain'>
        {image()}
      </div>
      <div className='[&>p]:my-0'>
        <p className={'font-bold'}>{tournament.name}</p>
        <p className={'text-sm opacity-70'}>Region : {tournament.region}</p>
        <p className={'text-md'}>
          Players : {tournament.minPlayers} - {tournament.maxPlayers}
        </p>
      </div>
    </Link>
  );
};

export default TournamentCard;
