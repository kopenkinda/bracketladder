import {
  BackgroundImage,
  Button,
  Center,
  Group,
  Loader,
  Stack,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconTournament } from '@tabler/icons';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import UserPreview from '../../../components/UserPreview';
import { getGameImageUrl } from '../../../utils/tournament';
import { trpc } from '../../../utils/trpc';

const TournamentDetails: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { id } = router.query;
  const tournament = trpc.tournament.getOne.useQuery(id as string);

  const isOwner = tournament.data?.ownerId === session?.user?.id ?? false;
  const isMember =
    tournament.data?.users.some(
      (participant) => participant.id === session?.user?.id
    ) ?? false;

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
  if (!tournament.data) {
    return <div>Tournament not found</div>;
  }
  return (
    <div>
      {tournament.isLoading && <div>Loading...</div>}
      {tournament.data && (
        <div className='text-xl [&_span]:font-bold'>
          <BackgroundImage
            src={getGameImageUrl(tournament.data)}
            className='relative flex h-[20vh] w-full flex-col justify-end'
          >
            <div className='absolute top-0 left-0 z-10 h-[inherit] w-full bg-black opacity-40' />
            <div className='flex justify-between'>
              <h2 className='relative z-20 mx-4 mb-0 text-4xl text-white'>
                {tournament.data.name}
              </h2>
              {isOwner ? (
                <div className='z-20 flex flex-col'>
                  <label className='flex flex-col'>Invite to tournament</label>
                  <div className='flex gap-4'>
                    <input
                      type='text'
                      className='text-sm'
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
          {tournament.data.users.length > 0 ? <p>Participants:</p> : null}
          <Stack>
            {tournament.data.users.map((user) => (
              <UserPreview key={user.id} user={user} />
            ))}
          </Stack>
          <p></p>
        </div>
      )}
      {status === 'authenticated' && tournament.data != null ? (
        <Group spacing='md'>
          {tournament.data.bracket === null ? (
            <>
              {!isMember &&
              tournament.data.maxPlayers > tournament.data.users.length ? (
                <Button
                  onClick={async () => {
                    try {
                      await joinTournament({ tournamentId: id as string });
                      showNotification({
                        title: 'Join Tournament',
                        message: 'You have successfully joined the tournament',
                        icon: <IconCheck />,
                        color: 'green',
                      });
                    } catch (e) {
                    } finally {
                      await tournament.refetch();
                    }
                  }}
                  disabled={isLoading}
                >
                  Join Tournament
                </Button>
              ) : null}

              {isMember ? (
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
                  }}
                  disabled={isLeaving}
                >
                  Leave Tournament
                </Button>
              ) : null}

              {isOwner &&
              tournament.data.users.length >= tournament.data.minPlayers ? (
                <Button
                  onClick={async () => {
                    await createBracket({ tournamentId: id as string });
                    showNotification({
                      title: 'Bracket created',
                      message:
                        'You&quot;ve created a bracket for the tournament.',
                      icon: <IconCheck />,
                      color: 'green',
                    });
                  }}
                  color='green'
                  disabled={isCreatingBracket}
                  leftIcon={<IconTournament stroke={1.5} size={16} />}
                >
                  Create a bracket
                </Button>
              ) : null}
            </>
          ) : null}
          {tournament.data.bracket !== null ? (
            <Button<typeof Link>
              component={Link}
              href={`/tournament/${id}/bracket`}
              leftIcon={<IconTournament stroke={1.5} size={16} />}
            >
              See the bracket
            </Button>
          ) : null}
        </Group>
      ) : null}
    </div>
  );
};

export default TournamentDetails;
