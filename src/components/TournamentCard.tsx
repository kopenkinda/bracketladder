import Image from 'next/image';
import IconSSBU from 'public/ssbu.svg';
import IconStreetFighter from 'public/street-fighter.png';
import IconTekken from 'public/tekken.png';
import React, { type FC } from 'react';

type TournamentCardProps = {
  tournament: Tournament;
};

// TODO: Use prisma type instead of this
export type Tournament = {
  name: string;
  region: string;
  minPlayers: number;
  maxPlayers: number;
  game: number;
  owner: {
    name: string;
    nickname: string;
    region: string;
    stats: undefined;
  };
  whiteList: undefined;
  bracket: undefined;
};

const TournamentCard: FC<TournamentCardProps> = ({ tournament }) => {
  const image = () => {
    switch (tournament.game) {
      case 1:
        return <Image src={IconTekken} alt={tournament.name} />;
      case 2:
        return <Image src={IconStreetFighter} alt={tournament.name} />;
      default:
        return <Image src={IconSSBU} alt={tournament.name} />;
    }
  };
  return (
    <div
      className='flex flex-col rounded-xl border border-2 border-solid
	 border-black p-4 shadow-xl [&>div]:flex-1'
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
    </div>
  );
};

export default TournamentCard;
