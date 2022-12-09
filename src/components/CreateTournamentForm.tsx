import {
  Button,
  Card,
  Center,
  Group,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import type { Games, Tournament } from '@prisma/client';
import { IconClock } from '@tabler/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { SessionUser } from '../hooks/useUser';
import { trpc } from '../utils/trpc';

const GameCard = ({
  game,
  active,
  onClick,
}: {
  game: Games;
  active: boolean;
  onClick: () => void;
}) => {
  const colorScheme = useMantineColorScheme();
  const theme = useMantineTheme();
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
        sx={{
          backgroundColor: active
            ? colorScheme.colorScheme === 'dark'
              ? theme.colors.dark[9]
              : theme.colors.blue[6]
            : undefined,
        }}
      >
        <Center>
          <Image src={gameImg} alt={game} width={200} height={200} />
        </Center>
      </Card>
    </UnstyledButton>
  );
};

export default function CreateTournamentForm({ user }: { user: SessionUser }) {
  const form = useForm<Omit<Tournament, 'region' | 'ownerId' | 'id' | 'state'>>(
    {
      initialValues: {
        name: '',
        description: '',
        type: 'Public',
        minPlayers: 4,
        maxPlayers: 8,
        allocatedServer: false,
        game: 'SmashBros',
        startDate: new Date(),
        startHour: new Date(),
      },
      transformValues: (values) => ({
        ...values,
        maxPlayers: values.minPlayers,
      }),
      validate: {
        name: (value) => (value.trim().length < 3 ? 'Name is required' : null),
      },
    }
  );

  const { mutateAsync: createTournament, isLoading } =
    trpc.tournament.create.useMutation();

  const router = useRouter();

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          createTournament(values).then((createdTournament) => {
            router.push(`/tournament/${createdTournament.id}`);
            showNotification({
              title: 'Tournament created',
              message: `Tournament ${createdTournament.name} created`,
            });
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
          <Select
            label='Amount of players'
            withAsterisk
            data={[
              { value: 4, label: '4' },
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 32, label: '32' },
            ]}
            {...form.getInputProps('minPlayers')}
          />

          <DatePicker
            label='Start date'
            withAsterisk
            inputFormat='YYYY-MM-DD'
            labelFormat='YYYY-MM'
            minDate={new Date()}
            {...form.getInputProps('startDate')}
          ></DatePicker>
          <TimeInput
            label='Start time'
            placeholder='Start time'
            withAsterisk
            icon={<IconClock size={16} />}
            defaultValue={new Date()}
            {...form.getInputProps('startHour')}
          />
          <Switch
            label='Allocated server'
            description="If you don't have a server, we'll allocate one for you (Requires premium)"
            disabled={user.status !== 'premium'}
            {...form.getInputProps('allocatedServer')}
          />
        </Group>
        <Group position='right' mt="sm">
          <Button type='submit' loading={isLoading}>
            Create
          </Button>
        </Group>
      </form>
    </>
  );
}
