import Image from 'next/image';
import IconSSBU from 'public/ssbu.svg';
import IconStreetFighter from 'public/street-fighter.png';
import IconTekken from 'public/tekken.png';
import React, { type FC } from 'react';
import { type Tournament } from '@prisma/client';

type TournamentCardProps = {
  tournament: Tournament;
};

const TournamentCard: FC<TournamentCardProps> = ({ tournament }) => {
  const image = () => {
    switch (tournament.game) {
      case 'Tekken':
        return <Image src={IconTekken} alt={tournament.name} />;
      case 'StreetFighter':
        return <Image src={IconStreetFighter} alt={tournament.name} />;
      default:
        return <Image src={IconSSBU} alt={tournament.name} />;
    }
  };
  return (
    <a
      className='flex flex-col rounded-xl border border-2 border-solid cursor-pointer
	 border-black p-4 shadow-xl no-underline text-black
	 [&>div]:flex-1 block' href={`tournament/${ tournament.id }`}
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
    </a>
  );
};

export default TournamentCard;
