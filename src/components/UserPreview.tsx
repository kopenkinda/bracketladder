import { Avatar, Card, Group, Text } from '@mantine/core';
import type { User } from '@prisma/client';

export default function UserPreview({ user }: { user: User }) {
  return (
    <Card withBorder>
      <Group>
        <Avatar src={user.image} alt={user.name ?? undefined} />
        <Text>{user.name}</Text>
      </Group>
    </Card>
  );
}
