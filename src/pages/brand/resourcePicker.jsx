import {
  BlockStack,
  Button,
  Card,
  Layout,
  Page,
  Text,
  TextField,
  Select,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState } from "react";
import React from "react";

const ResourcePicker = () => {
  const router = useRouter();
  const [initialQuery, setInitialQuery] = useState("");
  const [resourcePickerSelection, setResourcePickerSelection] = useState("");
  const [resourceType, setResourceType] = useState("product"); // New state for resource type

  async function openResourcePicker(initQuery) {
    const selected = await window?.shopify?.resourcePicker({
      type: resourceType, // Use selected resource type
      query: initQuery,
      filter: {
        hidden: false,
        variants: true,
      },
      action: "select",
      multiple: true, // Allow multiple selections
    });

    if (selected) {
      setResourcePickerSelection(JSON.stringify(selected, null, 2));
      setInitialQuery("");
    }
  }

  return (
    <>
      <Page
        title="Resource Picker"
        subtitle="Use AppBridge CDN to pick products or collections"
        primaryAction={{
          content: "Docs",
          onAction: () => {
            open(
              "https://shopify.dev/docs/api/app-bridge-library/reference/resource-picker",
              "_blank"
            );
          },
        }}
        backAction={{
          onAction: () => {
            router.push("/brand");
          },
        }}
      >
        <Layout>
          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">
                  Start typing to search for a product or collection
                </Text>
                <Select
                  label="Select Resource Type"
                  options={[
                    { label: "Product", value: "product" },
                    { label: "Collection", value: "collection" },
                  ]}
                  value={resourceType}
                  onChange={(value) => setResourceType(value)}
                />
                <TextField
                  value={initialQuery}
                  onChange={(value) => {
                    setInitialQuery(value);
                    openResourcePicker(value);
                  }}
                  connectedRight={
                    <>
                      <Button
                        variant="primary"
                        onClick={() => {
                          openResourcePicker(initialQuery);
                        }}
                      >
                        Search
                      </Button>
                    </>
                  }
                />
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text fontWeight="bold">Selection JSON</Text>
                <pre>{resourcePickerSelection}</pre>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default ResourcePicker;
