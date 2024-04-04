// pages/builder.jsx
import React from "react";
import { Box, Center, Heading, Input, VStack } from "@chakra-ui/react";

export default function Builder() {
  return (
    <Center height="100vh" bgGradient="linear(to-tl, blue.100, blue.600)">
      <VStack spacing={4}>
        <Heading>where are you claiming?</Heading>
        <Box width="100%" maxW="md">
          <Input placeholder="Type something..." size="lg" />
        </Box>
      </VStack>
    </Center>
  );
}
