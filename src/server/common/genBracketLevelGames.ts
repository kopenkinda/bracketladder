import type { PrismaClient, Round } from '@prisma/client';
import shuffle from 'lodash.shuffle';

export default async function generateBracketLevelGames({
  prisma,
  bestOf,
  rounds,
  userIds,
}: {
  prisma: PrismaClient;
  rounds: Round[];
  bestOf: number;
  userIds: string[];
}) {
  const shuffledUserIds = shuffle(userIds);

  for (const [index, round] of rounds.entries()) {
    for (let i = 0; i < bestOf; i++) {
      await prisma.match.create({
        data: {
          round: { connect: { id: round.id } },
          player1: { connect: { id: shuffledUserIds[index * 2] } },
          player2: { connect: { id: shuffledUserIds[index * 2 + 1] } },
        },
      });
    }
  }
}
