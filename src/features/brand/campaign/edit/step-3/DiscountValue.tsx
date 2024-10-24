import React, { useState, useEffect, useRef } from "react";
import ResourcePicker from "./ResourcePicker";

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

  const prevAppliesToRef = useRef(discount.appliesTo);
  const prevSelectedResourcesRef = useRef(selectedResources);

  const isJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (discount.appliesTo && isJSON(discount.appliesTo)) {
      const parsedData = JSON.parse(discount.appliesTo);
      const appliesToValue = parsedData.appliesTo;
      const selectedItems = parsedData.selectedItems || [];

      setSelectedResources(selectedItems);
      setResourceType(appliesToValue === "specific_collections" ? "collection" : "product");
    }
  }, [discount.appliesTo]);

  const appliesToValue =
    discount.appliesTo && isJSON(discount.appliesTo)
      ? JSON.parse(discount.appliesTo).appliesTo
      : "all_products";

  const handleResourceSelection = (selection: any[]) => {
    setSelectedResources(selection);
  };

  useEffect(() => {
    const prevAppliesTo = prevAppliesToRef.current;
    const prevSelectedResources = prevSelectedResourcesRef.current;

    if (prevAppliesTo !== discount.appliesTo || prevSelectedResources !== selectedResources) {
      prevAppliesToRef.current = discount.appliesTo;
      prevSelectedResourcesRef.current = selectedResources;

      let appliesToValue = discount.appliesTo;

      if (discount.appliesTo && isJSON(discount.appliesTo)) {
        appliesToValue = JSON.parse(discount.appliesTo).appliesTo;
      }

      const jsonPayload = {
        appliesTo: appliesToValue,
        selectedItems: selectedResources,
      };

      handleChange({
        target: {
          name: "appliesTo",
          value: JSON.stringify(jsonPayload),
        },
      });
    }
  }, [selectedResources, discount.appliesTo, handleChange]);

  return (
    <div className={`relative bg-white p-4 shadow rounded-lg border border-gray-200 ${className}`}>
      <div className="space-y-6">
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

        <>
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-4">
              <label className="block font-medium text-gray-700 inline-flex items-center">
                Discount Value
              </label>
              <div className="flex items-center h-10 border border-gray-300 bg-white px-2.5 overflow-hidden">
                <span className="text-gray-700">{discount.type === "percentage" ? "%" : "$"}</span>
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

          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Applies to <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              name="appliesTo"
              value={appliesToValue}
              className="w-full h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md"
              onChange={(e) => {
                handleChange(e);
                setResourceType(
                  e.target.value === "specific_collections"
                    ? "collection"
                    : e.target.value === "specific_products"
                      ? "product"
                      : ""
                );
              }}
            >
              <option value="all_products">All products</option>
              <option value="specific_collections">Specific collections</option>
              <option value="specific_products">Specific products</option>
            </select>
          </div>

          {/* Show columns if appliesTo is not "all_products" */}
          {(appliesToValue === "specific_products" ||
            appliesToValue === "specific_collections") && (
            <div className="">
              {/* Column 1: Resource Picker */}
              <div className="space-y-4">
                <ResourcePicker
                  initialQuery={""}
                  resourceType={resourceType}
                  onSelection={handleResourceSelection}
                  selectedResources={selectedResources}
                  accessToken={accessToken}
                  appliesTo={appliesToValue}
                />
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default DiscountValue;
