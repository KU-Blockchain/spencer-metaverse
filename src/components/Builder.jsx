// pages/builder.jsx
import { Box, Center, Heading, useColorModeValue } from "@chakra-ui/react";

const Builder = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.50");

  return (
    <Box height="100vh" bg={bgColor} color={textColor}>
      <Center height="full">
        <Heading>Builder Page</Heading>
      </Center>
    </Box>
  );
};

export default Builder;
