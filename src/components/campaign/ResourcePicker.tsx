import { BlockStack, Button, Text, TextField } from "@shopify/polaris";
import { useState } from "react";
import React from "react";

const ResourcePicker: React.FC<{
  initialQuery: string;
  resourceType: string;
  onSelection: (selection: any[]) => void;
  selectedResources: any[];
}> = ({ initialQuery, resourceType, onSelection, selectedResources }) => {
  const [query, setQuery] = useState(initialQuery);
  const [selection, setSelection] = useState<any[]>(selectedResources);

  async function openResourcePicker(initQuery: string) {
    const selected = await (window as any)?.shopify?.resourcePicker({
      type: resourceType,
      query: initQuery,
      filter: {
        hidden: false,
        variants: true,
      },
      action: "select",
      multiple: true,
      initialSelectionIds: selection.map((item: any) => ({ id: item.id })),
    });

    if (selected) {
      const newSelection = [
        ...selection,
        ...selected.filter(
          (item: any) =>
            !selection.some((selectedItem: any) => selectedItem.id === item.id)
        ),
      ];
      setSelection(newSelection);
      setQuery("");
      onSelection(newSelection);
    }
  }

  const removeSelection = (id: string) => {
    const newSelection = selection.filter((item: any) => item.id !== id);
    setSelection(newSelection);
    onSelection(newSelection);
  };

  return (
    <>
      <BlockStack gap="200">
        <Text variant="headingMd" as="dd">
          Start typing to search for a product or collection
        </Text>
        <TextField
          label=""
          autoComplete="off"
          value={query}
          onChange={(value) => {
            setQuery(value);
          }}
          connectedRight={
            <>
              <Button
                variant="primary"
                onClick={() => {
                  openResourcePicker(query);
                }}
              >
                Search
              </Button>
            </>
          }
        />
        <div className="space-y-4 mt-4">
          {selection.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 h-16 overflow-hidden border rounded">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].originalSrc}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    No Image
                  </div>
                )}
              </div>
              <span className="truncate w-40" title={item.title}>
                {item.title}
              </span>
              <Button onClick={() => removeSelection(item.id)}>Remove</Button>
            </div>
          ))}
          {selection.length > 3 && (
            <Text variant="bodyMd" as="p">
              <p className="text-center">And {selection.length - 3} more...</p>
            </Text>
          )}
        </div>
      </BlockStack>
    </>
  );
};

export default ResourcePicker;
