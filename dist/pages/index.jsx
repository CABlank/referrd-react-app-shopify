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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import initialLoadChecker from "../utils/middleware/initialLoadChecker"; // Import the initial load checker
import { BlockStack, Button, Card, InlineStack, Layout, Page, Text, } from "@shopify/polaris"; // Import required components from Polaris
import { ExternalIcon } from "@shopify/polaris-icons"; // Import Polaris icon
import { useRouter } from "next/router"; // Import Next.js router hook
import React from "react"; // Import React
/**
 * Fetches server-side props for the HomePage component.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<GetServerSidePropsResult<HomePageProps>>} The server-side props.
 */
export var getServerSideProps = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initialLoadChecker(context)];
            case 1: 
            // DO NOT REMOVE THIS.
            return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * HomePage component for the Shopify app.
 *
 * @function HomePage
 * @returns {JSX.Element} The rendered component.
 */
var HomePage = function () {
    var router = useRouter(); // Initialize the router
    var isDev = process.env.NODE_ENV === "development"; // Check if the app is in development mode
    return (<Page title="Home">
      <Layout>
        {isDev ? (<Layout.Section variant="fullWidth">
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
                  <Button variant="primary" onClick={function () {
                router.push("/brand");
            }}>
                    Debug Cards
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>) : null}
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                App Bridge CDN
              </Text>
              <Text as="p">AppBridge has moved from an npm package to CDN</Text>
              <InlineStack wrap={false} align="end">
                <Button variant="primary" external icon={ExternalIcon} onClick={function () {
            window.open("https://shopify.dev/docs/api/app-bridge-library/reference", "_blank");
        }}>
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
                <Button external variant="primary" icon={ExternalIcon} onClick={function () {
            window.open("https://kinngh.gumroad.com/l/how-to-make-shopify-apps?utm_source=boilerplate&utm_medium=nextjs", "_blank");
        }}>
                  Buy
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneHalf"/>
      </Layout>
    </Page>);
};
export default HomePage; // Export the HomePage component
