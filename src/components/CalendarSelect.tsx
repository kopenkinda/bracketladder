import { Button, Menu, Text } from '@mantine/core';
import type { Tournament } from '@prisma/client';
import {
  IconBrandApple,
  IconBrandGoogle,
  IconBrandOffice,
  IconCalendar,
} from '@tabler/icons';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useState } from 'react';

type TournamentProps = {
  tournament: Tournament;
};

const CalendarSelect: FC<TournamentProps> = ({ tournament }) => {
  const [device, setDevice] = useState('');

  if (!tournament) {
    return <div>Tournament not found</div>;
  }
  const date_and_time_for_api = new Date(
    dayjs(tournament.startDate).format('YYYY-MM-DD') +
      ' ' +
      dayjs(tournament.startHour).format('HH:mm')
  );
  const link = `https://calndr.link/d/event/?service=${device}&start=${date_and_time_for_api.toISOString()}&end=&title=${
    tournament.name
  }&duration=180&timezone=Europe/Paris&location=Bracket Ladder`;

  return (
    <Menu>
      <Menu.Target>
        <Button leftIcon={<IconCalendar stroke={1.5} size={16} />}>
          Add to calendar
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconBrandGoogle stroke={1.5} size={16} />}
          onClick={() => setDevice('google')}
          component='a'
          href={link}
        >
          <Text>Google</Text>
        </Menu.Item>
        <Menu.Item
          icon={<IconBrandApple stroke={1.5} size={16} />}
          onClick={() => setDevice('apple')}
          component='a'
          href={link}
        >
          <Text>Apple</Text>
        </Menu.Item>
        <Menu.Item
          icon={<IconBrandOffice stroke={1.5} size={16} />}
          onClick={() => setDevice('outlook')}
          component='a'
          href={link}
        >
          <Text>Outlook</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export default CalendarSelect;
