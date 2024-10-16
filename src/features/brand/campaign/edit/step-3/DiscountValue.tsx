import React, { useState, useEffect, useRef } from "react";
import ResourcePicker from "./ResourcePicker"; // Assuming ResourcePicker is correctly implemented

interface DiscountValueProps {
  discount: any;
  className?: string;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => void;
  accessToken: string;
}

const DiscountValue: React.FC<DiscountValueProps> = ({
  discount,
  className,
  handleChange,
  accessToken,
}) => {
  const [resourceType, setResourceType] = useState<string>("product");
  const [selectedResources, setSelectedResources] = useState<any[]>([]);

  // Ref to store previous appliesTo and selectedResources
  const prevAppliesToRef = useRef(discount.appliesTo);

  const prevSelectedResourcesRef = useRef(selectedResources);

  // Helper function to check if a string is valid JSON
  const isJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Initialize state when discount.appliesTo changes
  useEffect(() => {
    if (discount.appliesTo && isJSON(discount.appliesTo)) {
      const parsedData = JSON.parse(discount.appliesTo);
      const appliesToValue = parsedData.appliesTo;
      const selectedItems = parsedData.selectedItems || [];

      // Set appliesTo and selectedResources from parsed JSON
      setSelectedResources(selectedItems); // Update selected resources
      setResourceType(appliesToValue === "specific_collections" ? "collection" : "product");
    }
  }, [discount.appliesTo]);

  // Ensure that the Applies To select element shows the correct value
  const appliesToValue =
    discount.appliesTo && isJSON(discount.appliesTo)
      ? JSON.parse(discount.appliesTo).appliesTo
      : "all_products"; // Default to "all_products" if null or not JSON

  // Handle resource selection from ResourcePicker
  const handleResourceSelection = (selection: any[]) => {
    setSelectedResources(selection);
  };

  // Effect to handle saving the JSON into `discount.appliesTo`
  useEffect(() => {
    const prevAppliesTo = prevAppliesToRef.current;
    const prevSelectedResources = prevSelectedResourcesRef.current;

    // Only trigger the effect if `appliesTo` or `selectedResources` has changed
    if (prevAppliesTo !== discount.appliesTo || prevSelectedResources !== selectedResources) {
      // Update refs with the current values
      prevAppliesToRef.current = discount.appliesTo;
      prevSelectedResourcesRef.current = selectedResources;

      // Ensure that `discount.appliesTo` is not already stringified JSON
      let appliesToValue = discount.appliesTo;

      // If discount.appliesTo is already a stringified JSON, parse it first
      if (discount.appliesTo && isJSON(discount.appliesTo)) {
        appliesToValue = JSON.parse(discount.appliesTo).appliesTo;
      }

      // Build the JSON object to save
      const jsonPayload = {
        appliesTo: appliesToValue, // Use the correct appliesTo value (string)
        selectedItems: selectedResources, // The selected resources (products/collections)
      };

      // Save the JSON object into `discount.appliesTo` field
      handleChange({
        target: {
          name: "appliesTo", // Save into the appliesTo field itself
          value: JSON.stringify(jsonPayload), // Save the JSON object
        },
      });
    }
  }, [selectedResources, discount.appliesTo, handleChange]);

  return (
    <div className={`relative bg-white p-4 shadow rounded-lg border border-gray-200 ${className}`}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-green-500">3. Discount Details</h2>

        {/* Toggle to Allow Discounts */}
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex items-center">
            <input
              type="checkbox"
              name="allowDiscounts"
              checked={discount.allow || false}
              className="form-checkbox h-3 w- text-green-600"
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "allowDiscounts",
                    value: e.target.checked,
                  },
                });
              }}
            />
            <span className="ml-2">Allow Discounts</span>
          </label>
        </div>

        {/* If discounts are allowed, show the discount configuration options */}
        {discount.allow && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {/* Discount Type */}
              <div className="space-y-4">
                <label className="block font-medium text-gray-700 inline-flex">
                  Discount Type <span className="ml-1 text-red-500">*</span>
                </label>
                <select
                  name="discountType"
                  value={discount.type || ""}
                  className="w-full h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700"
                  onChange={handleChange}
                >
                  <option value="fixed">Fixed amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              {/* Discount Value */}
              <div className="space-y-4">
                <label className="block font-medium text-gray-700 inline-flex items-center">
                  Discount Value
                </label>
                <div className="flex items-center h-10 border border-gray-300 bg-white px-2.5 overflow-hidden">
                  <span className="text-gray-700">
                    {discount.type === "percentage" ? "%" : "$"}
                  </span>
                  <input
                    type="text"
                    name="discountValue"
                    value={discount.value || ""}
                    placeholder="Enter discount value"
                    className="flex-1 px-2 py-2 bg-transparent text-gray-700 border-0 focus:outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Applies To Section */}
            <div className="space-y-4">
              <label className="block font-medium text-gray-700 inline-flex">
                Applies to <span className="ml-1 text-red-500">*</span>
              </label>
              <select
                name="appliesTo"
                value={appliesToValue}
                className="w-full h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md"
                onChange={(e) => {
                  handleChange(e); // Update the discount.appliesTo value in parent
                  setResourceType(
                    e.target.value === "specific_collections" ||
                      e.target.value === "specific_products"
                      ? e.target.value === "specific_collections"
                        ? "collection"
                        : "product"
                      : ""
                  );
                }}
              >
                <option value="all_products">All products</option>
                <option value="specific_collections">Specific collections</option>
                <option value="specific_products">Specific products</option>
              </select>
            </div>

            {/* Resource Picker for Products/Collections */}
            {/* We keep the picker mounted and just change its content */}
            <div className="space-y-4">
              <ResourcePicker
                initialQuery={""}
                resourceType={resourceType}
                onSelection={handleResourceSelection}
                selectedResources={selectedResources} // Passing selectedResources to the picker
                accessToken={accessToken}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscountValue;
