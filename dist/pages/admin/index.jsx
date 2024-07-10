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
            router.push("/admin/webhooks");
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
                  Send GET, POST and GraphQL queries to your app's backend.
                </Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/admin/data");
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
                <Text>See how to use AppBridge CDN's Resource Picker</Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/admin/resourcePicker");
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
                <Text>See how to look another Referrd</Text>
                <InlineStack wrap={false} align="end">
                  <Button variant="primary" onClick={function () {
            router.push("/admin/customPage");
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
