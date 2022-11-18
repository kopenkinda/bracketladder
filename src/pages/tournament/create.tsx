import {
  Button,
  Card,
  Center,
  Group,
  NumberInput,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Games, Tournament } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';
import { trpc } from '../../utils/trpc';

export default function CreateTournamentPage() {
  const user = useUser();

  const form = useForm<Omit<Tournament, 'region' | 'ownerId' | 'id'>>({
    initialValues: {
      name: '',
      description: '',
      type: 'Public',
      minPlayers: 4,
      maxPlayers: 8,
      allocatedServer: false,
      game: 'SmashBros',
    },
    transformValues: (values) => ({
      ...values,
      maxPlayers:
        values.maxPlayers > values.minPlayers
          ? values.maxPlayers
          : values.minPlayers,
    }),
    validate: {
      name: (value) => (value.trim().length < 3 ? 'Name is required' : null),
    },
  });

  const { mutateAsync: createTournament, isLoading } =
    trpc.tournament.create.useMutation();

  const router = useRouter();

  if (user === undefined) return null;

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          createTournament(values).then((createdTournament) => {
            router.push(`/tournament/${createdTournament.id}`);
          });
        })}
      >
        <Text size='sm' weight='normal'>
          Select a game
        </Text>
        <Group>
          <GameCard
            game='SmashBros'
            active={form.values.game === 'SmashBros'}
            onClick={() => {
              form.setFieldValue('game', 'SmashBros');
            }}
          />
          <GameCard
            game='StreetFighter'
            active={form.values.game === 'StreetFighter'}
            onClick={() => {
              form.setFieldValue('game', 'StreetFighter');
            }}
          />
          <GameCard
            game='Tekken'
            active={form.values.game === 'Tekken'}
            onClick={() => {
              form.setFieldValue('game', 'Tekken');
            }}
          />
        </Group>
        <TextInput
          label='Torunament name'
          {...form.getInputProps('name')}
          withAsterisk
        />
        <Textarea label='Description' {...form.getInputProps('description')} />
        <Group position='apart' className='[&>*]:grow'>
          <Select
            label='Type'
            withAsterisk
            data={['Public', 'Private']}
            {...form.getInputProps('type')}
          />
          <NumberInput
            label='Min players'
            withAsterisk
            min={4}
            {...form.getInputProps('minPlayers')}
          />
          <NumberInput
            label='Max players'
            withAsterisk
            min={form.values.minPlayers}
            {...form.getInputProps('maxPlayers')}
          />
          <Switch
            label='Allocated server'
            description="If you don't have a server, we'll allocate one for you (Requires premium)"
            disabled={user.status !== 'premium'}
            {...form.getInputProps('allocatedServer')}
          />
        </Group>
        <Group position='right'>
          <Button type='submit' loading={isLoading}>
            Create
          </Button>
        </Group>
      </form>
    </>
  );
}

const GameCard = ({
  game,
  active,
  onClick,
}: {
  game: Games;
  active: boolean;
  onClick: () => void;
}) => {
  const theme = useMantineColorScheme();
  const gameImg = (
    {
      SmashBros: '/ssbu.svg',
      StreetFighter: '/street-fighter.png',
      Tekken: '/tekken.png',
    } as const
  )[game];
  return (
    <UnstyledButton onClick={onClick} className='grow'>
      <Card
        withBorder
        bg={
          active ? (theme.colorScheme === 'dark' ? 'dark' : 'blue') : undefined
        }
      >
        <Center>
          <Image src={gameImg} alt={game} width={200} height={200} />
        </Center>
      </Card>
    </UnstyledButton>
  );
};
