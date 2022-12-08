import { BackgroundImage, Button, Center, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getGameImageUrl } from '../../utils/tournament';
import { trpc } from '../../utils/trpc';

const TournamentDetails: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { id } = router.query;
  const { data: tournament, isLoading: isTournamentLoading } =
    trpc.tournament.getOne.useQuery(id as string);

  const { mutateAsync: joinTournament, isLoading } =
    trpc.tournament.joinTournament.useMutation({
      onError(error, variables, context) {
        showNotification({
          message: error.message,
          title: 'Error',
          color: 'red',
          icon: <IconAlertTriangle />,
        });
      },
    });
  const { mutateAsync: leaveTournament, isLoading: isLeaving } =
    trpc.tournament.leaveTournament.useMutation();
  const { mutateAsync: createBracket, isLoading: isCreatingBracket } =
    trpc.tournament.createBracket.useMutation();

  if (isTournamentLoading) {
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
      <div className={'text-xl [&_span]:font-bold'}>
        <BackgroundImage
          src={getGameImageUrl(tournament)}
          className={'relative flex h-[20vh] w-full flex-col justify-end'}
        >
          <div className='absolute top-0 left-0 z-10 h-[inherit] w-full bg-black opacity-40' />
          <h2 className='relative z-20 mx-4 mb-0 text-4xl text-white'>
            {tournament.name}
          </h2>
        </BackgroundImage>
        <p>
          <span>Type :</span> {tournament.type}{' '}
        </p>
        <p>
          <span>Players :</span> {tournament.minPlayers} -{' '}
          {tournament.maxPlayers}
        </p>
        <p>
          <span>Region :</span> {tournament.region}{' '}
        </p>
        <p>
          <span>Owner :</span> {tournament.owner.name}
        </p>
        {status === 'authenticated' ? (
          <div className={'flex'}>
            <div className={'pr-6'}>
              <Button
                onClick={async () => {
                  try {
                    await joinTournament({ tournamentId: tournament.id });
                  } catch (e) {}
                }}
                disabled={isLoading}
              >
                Join Tournament
              </Button>
            </div>
            <div className={'pr-6'}>
              <Button
                onClick={async () => {
                  await leaveTournament({ tournamentId: tournament.id });
                }}
                disabled={isLeaving}
              >
                Leave Tournament
              </Button>
            </div>
            {tournament.owner.id === session.user?.id ? (
              <div className={'pr-6'}>
                <Button
                  onClick={async () => {
                    const created = await createBracket({
                      tournamentId: tournament.id,
                    });
                    console.log({ created });
                    // router.push(`/tournament-bracket/${id}`);
                  }}
                >
                  Create bracket
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TournamentDetails;
