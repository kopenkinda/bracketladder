import { Center, Loader } from '@mantine/core';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import useUser from '../../hooks/useUser';
const CreateTournamentForm = dynamic(
  () => import('../../components/CreateTournamentForm')
);
export default function CreateTournamentPage() {
  const user = useUser();

  if (user === undefined) return null;

  return (
    <Suspense
      fallback={
        <Center>
          <Loader />
        </Center>
      }
    >
      <CreateTournamentForm user={user} />
    </Suspense>
  );
}
