import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { FC } from 'react';
import { trpc } from '../utils/trpc';
import { Center, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons';

type AcceptInviteProps = Record<string, never>;

const AcceptInvite: FC<AcceptInviteProps> = () => {
  const { token } = useRouter().query;
  const { mutateAsync: acceptInvite } =
    trpc.tournament.validateInviteToken.useMutation({
      onSuccess: (data) => {
        navigate.replace('/tournament/' + data.tournament.id);
        showNotification({
          id: 'accept-invite',
          color: 'green',
          title: 'Accept Invite',
          message: 'You have successfully joined the tournament',
        });
      },
      onError: (error) => {
        showNotification({
          id: 'accept-invite',
          color: 'red',
          title: 'Accept Invite',
          message: error.message,
          icon: <IconAlertCircle />,
        });
      },
    });

  const navigate = useRouter();

  useEffect(() => {
    acceptInvite({ token: token as string });
  }, [acceptInvite, token]);

  return (
    <Center>
      <Loader />
    </Center>
  );
};

export default AcceptInvite;
