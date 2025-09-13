import { Container, Tabs } from "@chakra-ui/react";

import EndurLstStake from "./endurStake";
import EndurLstUnstake from "./endurUnstake";

export default function Endur() {
  return (
    <Container maxW="3xl" overflow="hidden">
      <Tabs.Root defaultValue="deposit">
        <Tabs.List>
          <Tabs.Trigger value="deposit">Stake</Tabs.Trigger>
          <Tabs.Trigger value="withdraw">Unstake</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="deposit">
          <EndurLstStake />
        </Tabs.Content>
        <Tabs.Content value="withdraw">
          <EndurLstUnstake />
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}
