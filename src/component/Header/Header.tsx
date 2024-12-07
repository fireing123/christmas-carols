"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import {
    Button, 
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
} from '@mantine/core';

import classes from './HeaderTabs.module.css';

export default function Header() {
    const { data: session } = useSession();

    return (
      <div className={classes.header}>
        <Container className={classes.mainSection} size="md">
            <Group justify="space-between">
                <Menu
                  width={260}
                  position="bottom-end"
                  transitionProps={{ transition: 'pop-top-right' }}
                  withinPortal
                >
                {session && <Menu.Target>
                  <UnstyledButton onClick={() => signOut()}>
                    <Group gap={7}>
                      <Avatar src={session.user?.image} alt={session.user?.name || "username"} radius='xl' size={20} />
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        {session.user?.name}
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                }
                {!session && <Group>
                    <Button onClick={() => signIn()}>Login</Button>
                </Group>}
                </Menu>
                <Text>hello</Text>
            </Group>
        </Container>

    </div>
  )
}