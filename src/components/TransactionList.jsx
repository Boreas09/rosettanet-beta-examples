import { Box, Text, Card, Link, VStack } from "@chakra-ui/react";

export default function TransactionList({ transactions = [] }) {
  return (
    <>
      {transactions.length > 0 && (
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Recent Transactions
          </Text>
          <VStack gap={3}>
            {transactions.map((tx, index) => (
              <Card.Root key={tx} size="sm" w="full">
                <Card.Body>
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" fontWeight="bold">
                      Transaction #{index + 1}
                    </Text>
                    <Text fontSize="xs" color="gray.500" wordBreak="break-all">
                      {tx}
                    </Text>
                    <Link
                      fontSize="sm"
                      href={`https://sepolia.voyager.online/tx/${tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="orange.500"
                    >
                      View on Voyager →
                    </Link>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        </Box>
      )}
    </>
  );
}
