// src/pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import RootLayout from "@/components/layout";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      {/* Layout is optional; only include it if you have a common layout for all pages */}
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </ChakraProvider>
  );
}

export default MyApp;
