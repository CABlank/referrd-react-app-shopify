/**
 * This file defines the HomePage component for a Shopify app using Next.js and Polaris.
 * It includes a server-side props function to handle initial load checks and renders the home page with various sections and buttons.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required components from Polaris, hooks from React and Next.js, and the initial load checker.
 * 2. Defines Server-Side Props Function: It defines a function to fetch server-side props using the initial load checker.
 * 3. Defines the HomePage Component: It defines the HomePage component to render the home page.
 * 4. Renders Sections with Conditional Debug Section: It renders various sections with cards, including a conditional debug section in development mode.
 * 5. Exports the HomePage Component: Finally, it exports the HomePage component for use in the application.
 */

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"; // Import Next.js API types
import initialLoadChecker from "../utils/middleware/initialLoadChecker"; // Import the initial load checker
import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris"; // Import required components from Polaris
import { ExternalIcon } from "@shopify/polaris-icons"; // Import Polaris icon
import { useRouter } from "next/router"; // Import Next.js router hook
import React from "react"; // Import React

type HomePageProps = {
  // Define any props your component might use
  data?: string;
  serverError?: boolean;
};

/**
 * Fetches server-side props for the HomePage component.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<GetServerSidePropsResult<HomePageProps>>} The server-side props.
 */
export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomePageProps>> => {
  // DO NOT REMOVE THIS.
  return await initialLoadChecker(context);
};

/**
 * HomePage component for the Shopify app.
 *
 * @function HomePage
 * @returns {JSX.Element} The rendered component.
 */
const HomePage: React.FC<HomePageProps> = () => {
  const router = useRouter(); // Initialize the router
  const isDev = process.env.NODE_ENV === "development"; // Check if the app is in development mode

  return (
    <Page title="Home">
      <Layout>
        {isDev ? (
          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Debug Cards
                </Text>
                <Text as="p">
                  Explore how the repository handles data fetching from the
                  backend, App Proxy, making GraphQL requests, Billing API and
                  more.
                </Text>
                <InlineStack wrap={false} align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/brand");
                    }}
                  >
                    Debug Cards
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        ) : null}
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                App Bridge CDN
              </Text>
              <Text as="p">AppBridge has moved from an npm package to CDN</Text>
              <InlineStack wrap={false} align="end">
                <Button
                  variant="primary"
                  external
                  icon={ExternalIcon}
                  onClick={() => {
                    window.open(
                      "https://shopify.dev/docs/api/app-bridge-library/reference",
                      "_blank"
                    );
                  }}
                >
                  Explore
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Course
              </Text>
              <Text as="p">
                [BETA] I'm building course as a live service on How To Build
                Shopify Apps
              </Text>
              <InlineStack wrap={false} align="end">
                <Button
                  external
                  variant="primary"
                  icon={ExternalIcon}
                  onClick={() => {
                    window.open(
                      "https://kinngh.gumroad.com/l/how-to-make-shopify-apps?utm_source=boilerplate&utm_medium=nextjs",
                      "_blank"
                    );
                  }}
                >
                  Buy
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneHalf" />
      </Layout>
    </Page>
  );
};

export default HomePage; // Export the HomePage component
