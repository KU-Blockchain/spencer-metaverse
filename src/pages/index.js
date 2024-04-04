import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      height="100vh"
      bgGradient="linear(to-r, yellow.200, orange.400)"
      color="linear(to-r, yellow.200, orange.400)"
    >
      <Center flexDir="column" height="full">
        <Heading mb="4">Welcome to the Metaverse</Heading>
        <Link href="/builder" passHref>
          <Button colorScheme="teal" size="lg">
            Go to Builder
          </Button>
        </Link>
      </Center>
    </Box>
  );
}
