import { BackgroundImage, Button, Center, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useUser from '../../hooks/useUser';
import { getGameImageUrl } from '../../utils/tournament';
import { trpc } from '../../utils/trpc';

const TournamentDetails: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { id } = router.query;
  const user = useUser();
  const tournament = trpc.tournament.getOne.useQuery(id as string);
  const tournamentParticipation =
    trpc.tournament.tournamentParticipation.useQuery();

  const { mutateAsync: joinTournament, isLoading } =
    trpc.tournament.joinTournament.useMutation({
      onError(error) {
        showNotification({
          title: 'Join Tournament',
          message: error.message,
          icon: <IconAlertCircle />,
          color: 'red',
        });
      },
    });
  const { mutateAsync: leaveTournament, isLoading: isLeaving } =
    trpc.tournament.leaveTournament.useMutation();
  const { mutateAsync: createBracket, isLoading: isCreatingBracket } =
    trpc.tournament.createBracket.useMutation();
  const { mutateAsync: startTournament, isLoading: isStarting } =
    trpc.tournament.startTournament.useMutation();
  const { mutateAsync: sendInviteMail } = trpc.mail.sendInvite.useMutation();

  const [inviteInput, setInviteInput] = useState<string>('');

  const sendInvite = async () => {
    const payload = { tournamentId: id as string, email: inviteInput };
    await sendInviteMail(payload);
    setInviteInput('');
  };

  if (tournament.isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }
  if (!tournament) {
    return <div>Tournament not found</div>;
  }
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
      {status === 'authenticated' ? (
        <div className={'flex'}>
          <div className={'pr-6'}>
            {tournament.data &&
              !tournamentParticipation.data
                ?.map((t) => t.id)
                .includes(tournament.data?.id ?? '') &&
              tournament.data?.maxPlayers >
                (tournament.data?.users?.length ?? 0) && (
                <div className={'pr-6'}>
                  {
                    <Button
                      onClick={async () => {
                        try {
                          await joinTournament({ tournamentId: id as string });
                          showNotification({
                            title: 'Join Tournament',
                            message:
                              'You have successfully joined the tournament',
                            icon: <IconCheck />,
                            color: 'green',
                          });
                        } catch (e) {
                        } finally {
                          await tournament.refetch();
                          await tournamentParticipation.refetch();
                        }
                      }}
                      disabled={isLoading}
                    >
                      Join Tournament
                    </Button>
                  }
                </div>
              )}
          </div>
          <div className={'pr-6'}>
            {tournament.data &&
              tournamentParticipation.data
                ?.map((t) => t.id)
                .includes(tournament.data?.id ?? '') && (
                <div className={'pr-6'}>
                  {
                    <Button
                      onClick={async () => {
                        await leaveTournament({ tournamentId: id as string });
                        showNotification({
                          title: 'Leave Tournament',
                          message: 'You have leave the tournament',
                          icon: <IconCheck />,
                          color: 'green',
                        });
                        await tournament.refetch();
                        await tournamentParticipation.refetch();
                      }}
                      disabled={isLeaving}
                    >
                      Leave Tournament
                    </Button>
                  }
                </div>
              )}
          </div>
          {tournament.data && tournament.data.owner.id === user?.id && (
            <div className={'pr-6'}>
              {tournament.data && (
                <Button
                  onClick={async () => {
                    await startTournament({ tournamentId: id as string });
                    showNotification({
                      title: 'Tournament started',
                      message: 'The tournament has started',
                      icon: <IconCheck />,
                      color: 'green',
                    });
                  }}
                  color='green'
                  disabled={isStarting}
                >
                  Start Tournament
                </Button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TournamentDetails;
