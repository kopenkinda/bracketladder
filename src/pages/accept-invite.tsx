import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { FC } from 'react';
import { trpc } from '../utils/trpc';

type AcceptInviteProps = Record<string, never>;

const AcceptInvite: FC<AcceptInviteProps> = () => {
  const { token } = useRouter().query;
  const { mutateAsync: acceptInvite } =
    trpc.tournament.validateInviteToken.useMutation();

  const navigate = useRouter();

  useEffect(() => {
    acceptInvite({ token: token as string }).then((data) =>
      navigate.replace('/tournament/' + data.tournament.id)
    );
  }, [acceptInvite, navigate, token]);

  return <div>token: {token}</div>;
};

export default AcceptInvite;
