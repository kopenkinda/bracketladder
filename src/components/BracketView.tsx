import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Stepper,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconChevronRight } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import type { RouterOutputTypes } from '../utils/trpc';
import { trpc } from '../utils/trpc';
import BracketLevel from './BracketLevel';

type Bracket = RouterOutputTypes['tournament']['getBracket'];

export default function BracketView({
  bracket,
}: {
  bracket: NonNullable<Bracket>;
}) {
  const [step, setStep] = useState(0);
  const nextStep = () =>
    setStep((current) =>
      current < bracket.levels.length ? current + 1 : current
    );
  const prevStep = () =>
    setStep((current) => (current > 0 ? current - 1 : current));

  const { data: session } = useSession();
  const { mutateAsync: startTournament } =
    trpc.tournament.startTournament.useMutation();
  const { refetch: refetchTournamentData } =
    trpc.tournament.getBracket.useQuery(
      {
        tournamentId: bracket.tournament.id,
      },
      { enabled: false }
    );
  const isAdmin = session?.user?.id === bracket.tournament.ownerId;
  return (
    <Card withBorder>
      <Group mb='md'>
        {session?.user?.id === bracket.tournament.ownerId &&
        bracket.tournament.state === 'Open' ? (
          <Button
            rightIcon={<IconChevronRight stroke={1.5} />}
            onClick={async () => {
              await startTournament({ tournamentId: bracket.tournament.id });
              await refetchTournamentData();
            }}
          >
            Start the tournament
          </Button>
        ) : null}
      </Group>
      <Stepper active={step} onStepClick={setStep} breakpoint='sm' radius='xs'>
        {bracket.levels.map((level) => (
          <Stepper.Step key={level.id}>
            <Stack>
              <Center>Best of: {level.bestOf}</Center>
              {level.rounds.map((round) => (
                <BracketLevel
                  round={round}
                  bestOf={level.bestOf}
                  key={round.id}
                  isAdmin={isAdmin}
                  tournamentId={bracket.tournament.id}
                />
              ))}
            </Stack>
          </Stepper.Step>
        ))}
      </Stepper>
      <Group position='apart' mt='md'>
        <ActionIcon
          onClick={prevStep}
          disabled={step === 0}
          color='blue'
          variant='outline'
        >
          <IconArrowLeft />
        </ActionIcon>
        <ActionIcon
          onClick={nextStep}
          disabled={step === bracket.levels.length - 1}
          color='blue'
          variant='outline'
        >
          <IconArrowRight />
        </ActionIcon>
      </Group>
    </Card>
  );
}
