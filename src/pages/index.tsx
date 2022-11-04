import { type NextPage } from "next";
import { signIn } from 'next-auth/react';
import { trpc } from "../utils/trpc";
import { Button } from "@mantine/core";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";

function Demo() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  );
}

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Demo />
      <Button variant="filled" color="grape" onClick={() => signIn()}>
        {hello.data?.greeting}
      </Button>
    </>
  );
};

export default Home;
