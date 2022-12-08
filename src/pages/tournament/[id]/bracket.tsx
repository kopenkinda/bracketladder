import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import { showNotification } from '@mantine/notifications';
import { Center, Code, Loader } from '@mantine/core';

export default function BracketPage() {
  const router = useRouter();
  const tournamentId = router.query.id as string;
  const { data: bracket, isLoading } = trpc.tournament.getBracket.useQuery(
    {
      tournamentId,
    },
    {
      onError(err) {
        if ('window' in globalThis) {
          showNotification({
            title: 'Error',
            message: err.message,
            color: 'red',
          });
          router.push(`/tournament/${tournamentId}`);
        }
      },
    }
  );
  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }
  if (!bracket) {
    if ('window' in globalThis) {
      router.push(`/tournament/${tournamentId}`);
    }
    return null;
  }
  return <Code block>{JSON.stringify(bracket, null, 2)}</Code>;
}
