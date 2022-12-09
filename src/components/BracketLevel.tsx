import {
  Avatar,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import type { User } from '@prisma/client';
import type { MouseEventHandler, PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';
import type { RouterOutputTypes } from '../utils/trpc';
import { trpc } from '../utils/trpc';

type Round = NonNullable<
  RouterOutputTypes['tournament']['getBracket']
>['levels'][number]['rounds'][number];

function MatchResultsModal(
  props: PropsWithChildren<{
    matches: Round['matches'];
    player1: User;
    player2: User;
    tournamentId: string;
  }>
) {
  const [matchesResults, setMatchesResults] = useState<
    Round['matches'][number]['player1'][]
  >(new Array(props.matches.length).fill(null, 0, props.matches.length));
  const finishedUpdatingScores = useMemo(
    () => matchesResults.every((result) => result !== null),
    [matchesResults]
  );
  const { mutateAsync: assignScoreToMatch, isIdle: notAssigning } =
    trpc.tournament.assignScoreToMatch.useMutation();
  const { refetch: refetchTournamentData } =
    trpc.tournament.getBracket.useQuery(
      {
        tournamentId: props.tournamentId,
      },
      { enabled: false }
    );
  return (
    <Stack spacing='md'>
      {props.matches.map((match, idx) => (
        <Stack key={match.id}>
          <Text>
            Match #{idx + 1}{' '}
            <Text size='xs' color='dark'>
              (#{match.id})
            </Text>
          </Text>
          <Select
            data={[
              {
                value: props.player1.id,
                label: props.player1.name ?? '',
              },
              {
                value: props.player2.id,
                label: props.player2.name ?? '',
              },
            ]}
            value={matchesResults[idx]?.id ?? null}
            onChange={(value) =>
              setMatchesResults((prev) => {
                const newMatchesResults = [...prev];
                newMatchesResults[idx] =
                  props.player1.id === value ? props.player1 : props.player2;
                return newMatchesResults;
              })
            }
            placeholder='Select winner'
          />
        </Stack>
      ))}
      <Button
        fullWidth
        disabled={!finishedUpdatingScores}
        loading={!notAssigning}
        onClick={async () => {
          for (const [idx, result] of matchesResults.entries()) {
            await assignScoreToMatch({
              matchId: props.matches[idx]?.id ?? '',
              winnerId: result?.id ?? '',
            });
          }
          await refetchTournamentData();
          closeAllModals();
        }}
      >
        Finish matches
      </Button>
    </Stack>
  );
}

export default function BracketLevel({
  round,
  bestOf,
  isAdmin = false,
  tournamentId,
}: {
  round: Round;
  bestOf: number;
  isAdmin?: boolean;
  tournamentId: string;
}) {
  const started = round.matches.length > 0;
  const player1 = round.matches[0]?.player1;
  const player2 = round.matches[0]?.player2;
  const p1Score = round.matches.reduce(
    (acc, match) => (match.winnerId === player1?.id ? acc + 1 : acc),
    0
  );
  const p2Score = round.matches.reduce(
    (acc, match) => (match.winnerId === player2?.id ? acc + 1 : acc),
    0
  );
  const done = p1Score + p2Score === bestOf;

  if (!started || !player1 || !player2) {
    return (
      <Card withBorder>
        <Group position='apart'>
          <Group>
            <Avatar />
            <Text>TBDA</Text>
          </Group>
          <Text>vs</Text>
          <Group>
            <Text>TBDB</Text>
            <Avatar />
          </Group>
        </Group>
      </Card>
    );
  }
  return (
    <Wrapper
      done={done}
      isAdmin={isAdmin}
      onClick={() => {
        openModal({
          title: 'Match between ' + player1?.name + ' and ' + player2?.name,
          children: (
            <MatchResultsModal
              matches={round.matches}
              player1={player1}
              player2={player2}
              tournamentId={tournamentId}
            />
          ),
        });
      }}
    >
      <Group position='apart'>
        <Group>
          <Avatar src={player1?.image} />
          <Text>{player1?.name ?? 'Empty'}</Text>
        </Group>
        <Text>
          {p1Score} {done && p1Score > p2Score ? '(WIN)' : ''}
          {'-'}
          {done && p2Score > p1Score ? '(WIN)' : ''} {p2Score}
        </Text>
        <Group>
          <Text>{player2?.name ?? 'Empty'}</Text>
          <Avatar src={player2?.image} />
        </Group>
      </Group>
    </Wrapper>
  );
}

function Wrapper({
  children,
  isAdmin = false,
  done = true,
  onClick,
}: PropsWithChildren<{
  isAdmin: boolean;
  done: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}>) {
  if (!isAdmin || done) {
    return <Card withBorder>{children}</Card>;
  }
  return (
    <Card<'button'>
      withBorder
      component='button'
      className='cursor-pointer hover:outline hover:outline-1'
      onClick={onClick}
    >
      {children}
    </Card>
  );
}
