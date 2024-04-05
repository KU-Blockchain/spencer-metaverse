import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { ArrowBackIcon } from "@chakra-ui/icons";
import contractABI from "../contract/LandDeedABI.json";
import { Spinner } from "@chakra-ui/react";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Viewer() {
  const [deeds, setDeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter();

  // Function to navigate back to the Builder page
  const navigateToBuilder = () => {
    router.push("/builder"); // Make sure the path is correct
  };

  // Function to load the user's Land Deed NFTs
  const loadNFTs = async () => {
    setIsLoading(true);
    setHasLoaded(false);
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log("Contract Address:", contractAddress);
        const contract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          provider
        );
        const signer = await provider.getSigner();
        const address = signer.address;
        console.log("Address:", address);
        const balance = await contract.balanceOf(address);

        const deedPromises = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const tokenURI = await contract.tokenURI(tokenId);
          // Fetch metadata from tokenURI if needed, here we assume tokenURI is direct URL to the metadata
          deedPromises.push(
            fetch(tokenURI).then((response) => response.json())
          );
        }

        const deeds = await Promise.all(deedPromises);
        setDeeds(deeds);
      } catch (error) {
        console.error("Failed to load NFTs:", error);
      }
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  return (
    <Box
      width="full"
      height="100vh"
      bgGradient="linear(to-t, green.100, blue.500)"
      position="relative"
    >
      <Flex direction="column" align="center" justify="start" height="100vh">
        <Flex width="full" justify="space-between" p="4">
          <IconButton
            aria-label="Back to Builder"
            icon={<ArrowBackIcon />}
            onClick={() => router.push("/builder")}
          />
          {/* Fetch Deeds Button */}
          <Button onClick={loadNFTs}>Fetch Deeds</Button>
          {/* Could add a placeholder for future additional top right buttons or information */}
          <Box width="48px" height="48px"></Box>
        </Flex>
        {/* Container for the NFTs */}
        <Center flex="1" width="full">
          <Box width="full" maxW="container.xl">
            {isLoading ? (
              <Text>Searching...</Text> // This could also be a Spinner instead of text
            ) : hasLoaded && deeds.length === 0 ? (
              <Text>There are no NFTs.</Text>
            ) : (
              <SimpleGrid columns={3} spacing={10}>
                {deeds.map((deed, index) => (
                  <Box key={index} boxShadow="lg" p="6" rounded="md" bg="white">
                    <Image
                      src={deed.image}
                      alt={`Land Deed ${index}`}
                      boxSize="200px"
                      objectFit="cover"
                    />
                    <Text fontSize="lg" fontWeight="bold" mt="2">
                      {deed.name}
                    </Text>
                    <Text fontSize="md">{`Latitude: ${deed.properties.lat}`}</Text>
                    <Text fontSize="md">{`Longitude: ${deed.properties.lng}`}</Text>
                    {/* Other metadata details can be displayed here */}
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Center>
      </Flex>
    </Box>
  );
}
