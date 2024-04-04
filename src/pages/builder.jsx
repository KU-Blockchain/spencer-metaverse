import React, { useState } from "react";
import Head from "next/head";
import { Box, Center, Heading, Input, VStack } from "@chakra-ui/react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";


export default function Builder() {
  const [address, setAddress] = useState("");

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log(latLng); // Here you can handle the lat/lng as needed
    setAddress(value);
  };

  return (
    <>
      <Box
        width="full"
        height="100vh"
        bgGradient="linear(to-t, white, blue.500)"
        // backgroundPosition="center"
        // backgroundRepeat="no-repeat"
        // backgroundSize="cover"
        // backgroundImage="url('/cloud.png')"
        position="relative"
      >
        <Center pt="20">
          <VStack spacing={4} align="center">
            <Heading textAlign="center">Claim Your Land</Heading>
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
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
                    fontSize={"16px"}
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
          </VStack>
        </Center>
      </Box>
    </>
  );
}
