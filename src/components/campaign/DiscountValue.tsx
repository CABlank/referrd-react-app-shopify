import React, { useState } from "react";
import ResourcePicker from "./ResourcePicker";

interface DiscountValueProps {
  discount: any;
  className?: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const DiscountValue: React.FC<DiscountValueProps> = ({
  discount,
  className,
  handleChange,
}) => {
  const [resourceType, setResourceType] = useState("product");
  const [selectedResources, setSelectedResources] = useState<any[]>([]);

  const handleResourceSelection = (selection: any[]) => {
    setSelectedResources(selection);
  };

  return (
    <div
      className={`bg-white p-4 shadow rounded-lg border border-gray-200 ${className}`}
    >
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-green-500">
          3. Discount Details
        </h2>

        <div className="grid grid-cols-2 ">
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
            <label className="block font-medium text-gray-700 inline-flex items-center"></label>
            <div className="flex items-center h-10 border border-gray-300 bg-white px-2.5">
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

        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Applies to <span className="ml-1 text-red-500">*</span>
          </label>
          <select
            name="appliesTo"
            value={discount.appliesTo || ""}
            className="w-full h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md"
            onChange={(e) => {
              handleChange(e);
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

        {["specific_collections", "specific_products"].includes(
          discount.appliesTo
        ) && (
          <div className="space-y-4">
            <ResourcePicker
              initialQuery=""
              resourceType={resourceType}
              onSelection={handleResourceSelection}
              selectedResources={selectedResources}
            />
          </div>
        )}

        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Minimum Purchase Requirements{" "}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="none"
                name="minimumRequirementType"
                value="none"
                checked={discount.minimumRequirementType === "none"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="none" className="text-base text-gray-700">
                No minimum requirements
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="amount"
                name="minimumRequirementType"
                value="amount"
                checked={discount.minimumRequirementType === "amount"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="amount" className="text-base text-gray-700">
                Minimum purchase amount ($)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="quantity"
                name="minimumRequirementType"
                value="quantity"
                checked={discount.minimumRequirementType === "quantity"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="quantity" className="text-base text-gray-700">
                Minimum quantity of items
              </label>
            </div>
          </div>
        </div>

        {discount.minimumRequirementType !== "none" && (
          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Minimum Requirement Value{" "}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              name="minimumRequirementValue"
              value={discount.minimumRequirementValue || ""}
              placeholder="Enter minimum requirement value"
              className="w-full h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md"
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountValue;
