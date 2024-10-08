import { Button, Card, InlineStack, Layout, Page, Text, BlockStack, } from "@shopify/polaris";
import { useRouter } from "next/router";
import React from "react";
var DebugIndex = function () {
    var router = useRouter();
    return (<>
      <Page title="Debug Cards" subtitle="Interact and explore the current installation" backAction={{ onAction: function () { return router.push("/"); } }}>
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Webhooks
                </Text>
                <Text>Explored actively registered webhooks</Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/brand/webhooks");
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
                  Data Fetching
                </Text>
                <Text>
                  Send GET, POST and GraphQL queries to your app&apos;s backend.
                </Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/brand/data");
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
                  Resource Picker
                </Text>
                <Text>See how to use AppBridge CDN&apos;s Resource Picker</Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/brand/resourcePicker");
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
                  Another Custom Page
                </Text>
                <Text>See how to look another Referred</Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/brand/customPage");
        }}>
                    Explore
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>);
};
export default DebugIndex;
