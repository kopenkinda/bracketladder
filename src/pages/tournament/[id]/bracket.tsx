import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import { showNotification } from '@mantine/notifications';
import { Center, Loader } from '@mantine/core';
import BracketView from '../../../components/BracketView';

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
  return (
    <>
      <BracketView bracket={bracket} />
    </>
  );
}
