import { BackgroundImage, Button, Group } from '@mantine/core';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { getGameImageUrl } from '../../utils/tournament';
import { trpc } from '../../utils/trpc';

const TournamentDetails: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { id } = router.query;
  const tournament = trpc.tournament.getOne.useQuery(id as string);

  const { mutateAsync: joinTournament, isLoading } =
    trpc.tournament.joinTournament.useMutation();
  const { mutateAsync: leaveTournament, isLoading: isLeaving } =
    trpc.tournament.leaveTournament.useMutation();
  trpc.tournament.create.useMutation();

  return (
    <div>
      {tournament.isLoading && <div>Loading...</div>}
      {tournament.data && (
        <div className={'text-xl [&_span]:font-bold'}>
          <BackgroundImage
            src={getGameImageUrl(tournament.data)}
            className={'relative flex h-[20vh] w-full flex-col justify-end'}
          >
            <div
              className={
                'absolute top-0 left-0 z-10 h-[inherit] w-full bg-black opacity-40'
              }
            ></div>
            <h2 className='relative z-20 mx-4 mb-0 text-4xl text-white'>
              {tournament.data.name}
            </h2>
          </BackgroundImage>
          <p>
            <span>Type :</span> {tournament.data.type}{' '}
          </p>
          <p>
            <span>Players :</span> {tournament.data.minPlayers} -{' '}
            {tournament.data.maxPlayers}
          </p>
          <p>
            <span>Region :</span> {tournament.data.region}{' '}
          </p>
          <p>
            <span>Owner :</span> {tournament.data.owner.name}
          </p>
        </div>
      )}
      {status === 'authenticated' ? (
        <div className={'flex'}>
          <div className={'pr-6'}>
            {tournament.data && (
              <Button
                onClick={async () => {
                  await joinTournament({ tournamentId: id as string });
                  router.push(`/tournament/${id}`);
                }}
                disabled={isLoading}
              >
                Join Tournament
              </Button>
            )}
          </div>
          <div className={'pr-6'}>
            {tournament.data && (
              <Button
                onClick={async () => {
                  await leaveTournament({ tournamentId: id as string });
                  router.push(`/tournament/${id}`);
                }}
                disabled={isLeaving}
              >
                Leave Tournament
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TournamentDetails;
