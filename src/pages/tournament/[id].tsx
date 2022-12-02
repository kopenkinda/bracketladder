import { BackgroundImage, Button } from '@mantine/core';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getGameImageUrl } from '../../utils/tournament';
import { trpc } from '../../utils/trpc';

type tournamentDetailsProps = null;

const TournamentDetails: NextPage<tournamentDetailsProps> = () => {
	const router = useRouter();
	const { id } = router.query;
	const { mutateAsync: sendInviteMail } = trpc.mail.sendInvite.useMutation();
	const tournament = trpc.tournament.getOne.useQuery(id as string);
	const isOwner = trpc.tournament.isOwner.useQuery({ tournamentId: (id as string) });
	const [inviteInput, setInviteInput] = useState<string>('');

	const sendInvite = async () => {
		const payload = { tournamentId: id as string, email: inviteInput };
		await sendInviteMail(payload);
		setInviteInput('');
	};

	return <div>
		{ tournament.isLoading && <div>Loading...</div> }
		{ tournament.data && <div className={ '[&_span]:font-bold text-xl' }>
      <BackgroundImage src={ getGameImageUrl(tournament.data) }
                       className={ 'w-full h-[20vh] flex flex-col justify-end relative' }>
        <div className={ 'absolute top-0 left-0 bg-black w-full h-[inherit] opacity-40 z-10' }/>
        <div className={ 'flex justify-between' }>
          <h2 className="mb-0 text-white z-20 relative mx-4 text-4xl">{ tournament.data.name }</h2>
					{isOwner?.data && <div className={ 'z-20 flex flex-col' }>
            <label className={ 'flex flex-col' }>Invite to tournament</label>
            <div className={ 'flex gap-4' }>
              <input type="text" className={ 'text-sm' } value={ inviteInput }
                     onChange={ (e: any) => setInviteInput(e.target.value) }/>
              <Button onClick={ sendInvite }>Invite</Button>
            </div>
          </div>}
        </div>
      </BackgroundImage>
      <p><span>Type :</span> { tournament.data.type } </p>
      <p><span>Players :</span> { tournament.data.minPlayers } - { tournament.data.maxPlayers }</p>
      <p><span>Region :</span> { tournament.data.region } </p>
      <p><span>Owner :</span> { tournament.data.owner.name }</p>
    </div> }
	</div>;
};

export default TournamentDetails;
