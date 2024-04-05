import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Head from "next/head";
import {
  Box,
  Center,
  Heading,
  Input,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

export default function Builder() {
  // location stuff
  const [address, setAddress] = useState("");
  // blockchain stuff
  const [locationSelected, setLocationSelected] = useState(false); // New state to track if a location is selected
  const [userAddress, setUserAddress] = useState("");

  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Polygon Amoy Testnet Chain ID
  const targetNetworkId = "80002";

  useEffect(() => {
    checkMetaMask();
  }, []);
  const checkMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        // Checking if connected to Polygon Amoy Testnet
        if (network.chainId.toString() === targetNetworkId) {
          setIsCorrectNetwork(true);
          const [account] = await provider.send("eth_requestAccounts", []);
          setUserAddress(account);
        } else {
          setIsCorrectNetwork(false);
        }
      } catch (error) {
        console.error(error);
        alert(
          "An error occurred. Please make sure MetaMask is installed and you're logged in."
        );
      }
    } else {
      alert(
        "MetaMask is not installed. Please install MetaMask to interact with the blockchain."
      );
    }
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log(latLng); // Here you can handle the lat/lng as needed
    setAddress(value);
    setLocationSelected(true); // Set to true when a location is selected
  };
  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Request to switch to the Polygon Amoy Testnet
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + parseInt(targetNetworkId).toString(16), // Hexadecimal chainId
              chainName: "Polygon Amoy Testnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC", // 2-6 characters long
                decimals: 18,
              },
              rpcUrls: ["https://rpc-amoy.polygon.technology/"],
              blockExplorerUrls: ["https://www.oklink.com/amoy"],
            },
          ],
        });
        // If the request was successful, check the network again
        checkMetaMask();
      } catch (switchError) {
        console.error(switchError);
        alert("Failed to switch network. Please try manually in MetaMask.");
      }
    }
  };

  return (
    <>
      <Box
        width="full"
        height="100vh"
        bgGradient="linear(to-t, white, blue.500)"
        position="relative"
      >
        <Center pt="20">
          <VStack spacing={4} align="center">
            <Heading textAlign="center">Claim Your Land</Heading>
            <PlacesAutocomplete
              value={address}
              onChange={(address) => {
                setAddress(address);
                setLocationSelected(false); // Reset to false when changing the address
              }}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <Box width="100%" maxW="md">
                  <Input
                    {...getInputProps({ placeholder: "Type address..." })}
                    size="lg"
                    fontSize="16px"
                  />
                  <VStack align="start" spacing={2}>
                    {loading && <Box>Loading...</Box>}
                    {suggestions.map((suggestion) => {
                      const style = {
                        background: suggestion.active ? "#a8dadc" : "#ffffff",
                        cursor: "pointer",
                        color: "black",
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                      };
                      return (
                        <Box
                          {...getSuggestionItemProps(suggestion, { style })}
                          key={suggestion.placeId}
                        >
                          {suggestion.description}
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              )}
            </PlacesAutocomplete>
            <Button
              colorScheme="blue"
              isDisabled={!locationSelected}
              onClick={() => {
                if (!isCorrectNetwork) {
                  switchNetwork();
                } else {
                  // Proceed with claiming land
                  console.log("Proceed with transaction...");
                }
              }}
            >
              Claim
            </Button>
          </VStack>
        </Center>
      </Box>
    </>
  );
}
