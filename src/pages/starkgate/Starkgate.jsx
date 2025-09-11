import { Container, Tabs } from "@chakra-ui/react";

import StarkgateDeposit from "./StarkgateDeposit";
import StarkgateWithdraw from "./StarkgateWithdraw";

export default function Starkgate() {
  return (
    <Container maxW="3xl" overflow="hidden">
      <Tabs.Root defaultValue="deposit">
        <Tabs.List>
          <Tabs.Trigger value="deposit">Deposit</Tabs.Trigger>
          <Tabs.Trigger value="withdraw">Withdraw</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="deposit">
          <StarkgateDeposit />
        </Tabs.Content>
        <Tabs.Content value="withdraw">
          <StarkgateWithdraw />
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}
