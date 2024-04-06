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

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Viewer() {
  const [deeds, setDeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter();

  const navigateToBuilder = () => {
    router.push("/builder"); // Make sure the path is correct
  };

  const loadNFTs = async () => {
    setIsLoading(true);
    setHasLoaded(false);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Ensure connection and permission
      const signer = await provider.getSigner();
      const address = signer.address;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        provider
      );

      try {
        const balance = await contract.balanceOf(address);
        const deeds = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const tokenURI = await contract.tokenURI(tokenId);
          // Assuming tokenURI is a simple string combining lat and long, we split it to extract the values
          const [latitude, longitude] = tokenURI
            .replace("lat:", "")
            .replace("long:", "")
            .split(",");
          deeds.push({
            tokenId,
            latitude,
            longitude,
          });
        }
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
            onClick={navigateToBuilder}
          />
          <Button onClick={loadNFTs}>Fetch Deeds</Button>
          <Box width="48px" height="48px" /> {/* Placeholder */}
        </Flex>
        <Center flex="1" width="full">
          <Box width="full" maxW="container.xl">
            {isLoading ? (
              <Text>Loading...</Text>
            ) : hasLoaded && deeds.length === 0 ? (
              <Text>No Land Deed NFTs found.</Text>
            ) : (
              <SimpleGrid columns={3} spacing={10}>
                {deeds.map((deed, index) => (
                  <Box key={index} boxShadow="lg" p="6" rounded="md" bg="white">
                    {/* Placeholder Image or other identifier */}
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      mt="2"
                    >{`Deed ID: ${deed.tokenId}`}</Text>
                    <Text fontSize="md">{`Latitude: ${deed.latitude}`}</Text>
                    <Text fontSize="md">{`Longitude: ${deed.longitude}`}</Text>
                    {/* Additional metadata or actions could be displayed here */}
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
