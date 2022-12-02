import { BackgroundImage, Button } from '@mantine/core';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getGameImageUrl } from '../../utils/tournament';
import { trpc } from '../../utils/trpc';

type tournamentDetailsProps = null;

const TournamentDetails: NextPage<tournamentDetailsProps> = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  const { mutateAsync: sendInviteMail } = trpc.mail.sendInvite.useMutation();
  const tournament = trpc.tournament.getOne.useQuery(id as string);
  const [inviteInput, setInviteInput] = useState<string>('');

  const sendInvite = async () => {
    const payload = { tournamentId: id as string, email: inviteInput };
    await sendInviteMail(payload);
    setInviteInput('');
  };

  return (
    <div>
      {tournament.isLoading && <div>Loading...</div>}
      {tournament.data && (
        <div className={'text-xl [&_span]:font-bold'}>
          <BackgroundImage
            src={getGameImageUrl(tournament.data)}
            className={'relative flex h-[20vh] w-full flex-col justify-end'}
          >
            <div
              className={
                'absolute top-0 left-0 z-10 h-[inherit] w-full bg-black opacity-40'
              }
            />
            <div className={'flex justify-between'}>
              <h2 className='relative z-20 mx-4 mb-0 text-4xl text-white'>
                {tournament.data.name}
              </h2>
              {tournament.data.ownerId === session?.user?.id ? (
                <div className={'z-20 flex flex-col'}>
                  <label className={'flex flex-col'}>
                    Invite to tournament
                  </label>
                  <div className={'flex gap-4'}>
                    <input
                      type='text'
                      className={'text-sm'}
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                    />
                    <Button onClick={sendInvite}>Invite</Button>
                  </div>
                </div>
              ) : null}
            </div>
          </BackgroundImage>
          <p>
            <span>Type :</span> {tournament.data.type}
          </p>
          <p>
            <span>Players :</span> {tournament.data.minPlayers} -{' '}
            {tournament.data.maxPlayers}
          </p>
          <p>
            <span>Region :</span> {tournament.data.region}
          </p>
          <p>
            <span>Owner :</span> {tournament.data.owner.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
