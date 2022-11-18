import Image from 'next/image';
import IconSSBU from 'public/ssbu.svg';
import IconStreetFighter from 'public/street-fighter.png';
import IconTekken from 'public/tekken.png';
import React from 'react';
import { type Tournament } from '@prisma/client';

export const getGameImage = (tournament: Tournament) => {
	switch (tournament.game) {
		case 'Tekken':
			return <Image src={IconTekken} alt={tournament.name} />;
		case 'StreetFighter':
			return <Image src={IconStreetFighter} alt={tournament.name} />;
		default:
			return <Image src={IconSSBU} alt={tournament.name} />;
	}
}

export const getGameImageUrl = (tournament: Tournament) => {
	switch (tournament.game) {
		case 'Tekken':
			return '/tekken.png';
		case 'StreetFighter':
			return '/street-fighter.png';
		default:
			return '/ssbu.svg';
	}
}