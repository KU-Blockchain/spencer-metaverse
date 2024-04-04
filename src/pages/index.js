import React from "react";
import { Box, Button, Center, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Box height="100vh" bgGradient="linear(to-tr, blue.100, purple.600)">
      <Center flexDir="column" height="full">
        <Heading mb="4" color="white">
          your metaverse awaits
        </Heading>
        <Link href="/builder" passHref>
          <Button colorScheme="teal" size="lg">
            claim land
          </Button>
        </Link>
      </Center>
    </Box>
  );
}
