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
  useToast,
} from "@chakra-ui/react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import contractABI from "../contract/LandDeedABI.json";
const contractAddress = "0xf6b5739bc5014684768aa9e78ec8d94ae447040c";

export default function Builder() {
  // location stuff
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // blockchain stuff
  const [locationSelected, setLocationSelected] = useState(false); // New state to track if a location is selected
  const [userAddress, setUserAddress] = useState("");

  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const toast = useToast();

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
    console.log("lat, lng: ", latLng.lat, latLng.lng);
    setLatitude(latLng.lat);
    setLongitude(latLng.lng);
    setAddress(value);
    console.log("lat, lng: ", latitude, longitude);
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

  const mintLandDeed = async () => {
    console.log("when needed lat, lng: ", latitude, longitude);
    if (
      !isCorrectNetwork ||
      !locationSelected ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      toast({
        title: "An error occurred",
        description: "Sorry.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Convert the coordinates to a string representation of an integer
    const latInt = Math.round(latitude * 1e6).toString();
    const lngInt = Math.round(longitude * 1e6).toString();

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const landDeedContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );
      // Convert strings to BigInt
      const latBigInt = BigInt(latInt);
      const lngBigInt = BigInt(lngInt);

      const address = await signer.address;
      const tx = await landDeedContract.mintLandDeed(
        address,
        latBigInt,
        lngBigInt
      );

      await tx.wait();

      toast({
        title: "Transaction completed",
        description: "Land Deed NFT minted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Minting failed:", error);
      toast({
        title: "Minting failed",
        description: "There was an error minting the Land Deed NFT.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
                  mintLandDeed();
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
