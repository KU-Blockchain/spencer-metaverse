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
        let balance = await contract.balanceOf(address);
        // Safely handle the balance as a BigNumber
        balance =
          typeof balance.toNumber === "function" ? balance.toNumber() : balance;

        const deeds = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          // Assuming getDeedInfo returns latitude and longitude as strings in an array
          const [latitude, longitude] = await contract.getDeedInfo(tokenId);
          deeds.push({
            tokenId: tokenId.toString(), // Convert BigNumber to string
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
              <SimpleGrid columns={3} p={8} spacing={8}>
                {deeds.map((deed, index) => (
                  <Box key={index} boxShadow="lg" p="6" rounded="md" bg="white">
                    {/* Placeholder Image or other identifier */}
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      mt="2"
                      textColor={"black"}
                    >{`Deed ID: ${deed.tokenId}`}</Text>
                    <Text
                      fontSize="sm"
                      textColor={"black"}
                    >{`Latitude: ${deed.latitude}`}</Text>
                    <Text
                      fontSize="sm"
                      textColor={"black"}
                    >{`Longitude: ${deed.longitude}`}</Text>
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
