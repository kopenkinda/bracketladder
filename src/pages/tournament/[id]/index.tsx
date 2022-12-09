import {
  BackgroundImage,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconAt,
  IconCheck,
  IconMail,
  IconTournament,
} from '@tabler/icons';
import dayjs from 'dayjs';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import UserPreview from '../../../components/UserPreview';
import { getGameImageUrl } from '../../../utils/tournament';
import { trpc } from '../../../utils/trpc';
const CalendarSelect = dynamic(
  () => import('../../../components/CalendarSelect'),
  { ssr: false }
);

const statusMap = {
  Open: 'Not started',
  Running: 'In progress',
  Closed: 'Finished',
} as const;

const TournamentDetails: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { id } = router.query;
  const tournament = trpc.tournament.getOne.useQuery(id as string);

  const openModal = () =>
    openConfirmModal({
      title: 'Confirm delete tournament',
      children: 'Are you sure you want to delete this tournament?',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: async () => {
        await deleteTournament({
          tournamentId: tournament.data?.id ?? '',
        });
        showNotification({
          title: 'Delete Tournament',
          message: 'You have successfully deleted the tournament',
          icon: <IconCheck />,
          color: 'red',
        });
        router.push('/');
      },
      onCancel: () => {
        return undefined;
      },
    });

  const isOwner = tournament.data?.ownerId === session?.user?.id ?? false;
  const isMember =
    tournament.data?.users.some(
      (participant) => participant.id === session?.user?.id
    ) ?? false;

  const { mutateAsync: deleteTournament } =
    trpc.tournament.deleteTournament.useMutation({
      onError(error) {
        showNotification({
          title: 'Delete Tournament',
          message: error.message,
          icon: <IconAlertCircle />,
          color: 'red',
        });
      },
    });

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
  const { mutateAsync: sendInviteMail, isLoading: isMailSending } =
    trpc.mail.sendInvite.useMutation();

  const [inviteInput, setInviteInput] = useState<string>('');

  const sendInvite = async () => {
    const payload = { tournamentId: id as string, email: inviteInput };
    await sendInviteMail(payload);
    setInviteInput('');
  };
  const { data: bracket, refetch: fetchBracket } =
    trpc.tournament.getBracket.useQuery(
      {
        tournamentId: id as string,
      },
      {
        enabled: false,
      }
    );

  const winner = bracket?.levels[bracket.levels.length - 1]?.rounds[0]?.winner;

  useEffect(() => {
    if (tournament.data?.state === 'Closed') {
      fetchBracket();
    }
  }, [fetchBracket, tournament.data?.state]);

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

  const date_and_time =
    dayjs(tournament.data?.startDate).format('DD/MM/YYYY') +
    ' ' +
    dayjs(tournament.data?.startHour).format('HH:mm');

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
                <Card withBorder className='z-20' mb='xs' mr='xs'>
                  <Card.Section<'form'>
                    p='xs'
                    component='form'
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendInvite();
                    }}
                  >
                    <Stack spacing='xs'>
                      <TextInput
                        label='Invite to tournament'
                        type='email'
                        value={inviteInput}
                        required
                        icon={<IconAt size={14} />}
                        onChange={(e) => setInviteInput(e.target.value)}
                      />
                      <Button
                        type='submit'
                        loading={isMailSending}
                        leftIcon={<IconMail stroke={1.5} size={18} />}
                      >
                        Invite
                      </Button>
                    </Stack>
                  </Card.Section>
                </Card>
              ) : null}
            </div>
          </BackgroundImage>
          <p></p>
          <div>
            <span>Status:</span>{' '}
            <Badge>{statusMap[tournament.data.state]}</Badge>
          </div>
          <p>
            <span>Type :</span> {tournament.data.type}
          </p>
          <p>
            <span>Players :</span> {tournament.data.minPlayers}
          </p>
          <p>
            <span>Region :</span> {tournament.data.region}
          </p>
          <p>
            <span>Owner :</span> {tournament.data.owner.name}
          </p>
          <p>
            <span>Start Date :</span> {date_and_time}
          </p>
          {tournament.data.state === 'Closed' && winner != null ? (
            <>
              <Text>Winner:</Text>
              <UserPreview user={winner} />
            </>
          ) : null}
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
        <Group spacing='md' align='end'>
          {tournament.data.startDate ? (
            <Stack>
              <CalendarSelect tournament={tournament.data} />
            </Stack>
          ) : null}
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

              {tournament.data.id &&
              tournament.data.state === 'Open' &&
              isOwner ? (
                <Button onClick={openModal}>Delete Tournament</Button>
              ) : null}

              {isOwner &&
              tournament.data.users.length >= tournament.data.minPlayers ? (
                <Button
                  onClick={async () => {
                    await createBracket({ tournamentId: id as string });
                    showNotification({
                      title: 'Bracket created',
                      message: "You've created a bracket for the tournament.",
                      icon: <IconCheck />,
                      color: 'green',
                    });
                    router.push(`/tournament/${id}/bracket`);
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
