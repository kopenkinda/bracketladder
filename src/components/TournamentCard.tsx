import React, { type FC } from 'react';
import { type Tournament } from '@prisma/client';
import { getGameImage } from '../utils/tournament';

type TournamentCardProps = {
  tournament: Tournament;
};

const TournamentCard: FC<TournamentCardProps> = ({ tournament }) => {
  return (
    <a
      className='flex flex-col rounded-xl border border-2 border-solid cursor-pointer
	 border-black p-4 shadow-xl no-underline text-black
	 [&>div]:flex-1 block' href={`tournament/${ tournament.id }`}
    >
      <div className='[&>img]:mx-auto [&>img]:h-40 [&>img]:w-full [&>img]:object-contain'>
        { getGameImage(tournament) }
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
