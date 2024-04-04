// pages/builder.jsx
import React, { useState } from "react";
import Head from "next/head";
import { Box, Center, Heading, VStack } from "@chakra-ui/react";
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
      {" "}
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <Center height="100vh">
        <VStack spacing={4}>
          <Heading>Claim Your Land</Heading>
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
                <input
                  {...getInputProps({
                    placeholder: "Type address...",
                  })}
                  size="lg"
                />
                <div>
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const style = suggestion.active
                      ? { backgroundColor: "#a8dadc", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </Box>
            )}
          </PlacesAutocomplete>
        </VStack>
      </Center>
    </>
  );
}
