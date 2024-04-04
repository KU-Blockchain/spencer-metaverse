// src/pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import RootLayout from "@/components/layout";
import theme from "@/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </ChakraProvider>
  );
}

export default MyApp;
