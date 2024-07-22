import React, { useState } from "react";
import ResourcePicker from "./ResourcePicker"; // Adjust the import path accordingly
var DiscountValue = function (_a) {
    var discount = _a.discount, className = _a.className, handleChange = _a.handleChange;
    var _b = useState("product"), resourceType = _b[0], setResourceType = _b[1];
    var _c = useState([]), selectedResources = _c[0], setSelectedResources = _c[1];
    var handleResourceSelection = function (selection) {
        setSelectedResources(selection);
    };
    return (<div className={"bg-white p-4 shadow rounded-lg border border-gray-200 ".concat(className)}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-green-500">
          3. Discount Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Discount Type <span className="ml-1 text-red-500">*</span>
            </label>
            <select name="discountType" value={discount.type} className="w-full px-4 py-2 border border-gray-300 rounded-md" onChange={handleChange}>
              <option value="fixed">Fixed amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Discount Value <span className="ml-1 text-red-500">*</span>
            </label>
            <input type="text" name="discountValue" value={discount.value} placeholder="Enter discount value" className="w-full px-4 py-2 border border-gray-300 rounded-md" onChange={handleChange}/>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Applies to <span className="ml-1 text-red-500">*</span>
          </label>
          <select name="appliesTo" value={discount.appliesTo} className="w-full px-4 py-2 border border-gray-300 rounded-md" onChange={function (e) {
            handleChange(e);
            setResourceType(e.target.value === "specific_collections" ||
                e.target.value === "specific_products"
                ? e.target.value === "specific_collections"
                    ? "collection"
                    : "product"
                : "");
        }}>
            <option value="all_products">All products</option>
            <option value="specific_collections">Specific collections</option>
            <option value="specific_products">Specific products</option>
          </select>
        </div>
        {["specific_collections", "specific_products"].includes(discount.appliesTo) && (<div className="space-y-4">
            <ResourcePicker initialQuery="" resourceType={resourceType} onSelection={handleResourceSelection} selectedResources={selectedResources}/>
          </div>)}
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Minimum Purchase Requirements{" "}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="radio" id="none" name="minimumRequirementType" value="none" checked={discount.minimumRequirementType === "none"} onChange={handleChange} className="mr-2"/>
              <label htmlFor="none" className="text-base text-gray-700">
                No minimum requirements
              </label>
            </div>
            <div className="flex items-center">
              <input type="radio" id="amount" name="minimumRequirementType" value="amount" checked={discount.minimumRequirementType === "amount"} onChange={handleChange} className="mr-2"/>
              <label htmlFor="amount" className="text-base text-gray-700">
                Minimum purchase amount ($)
              </label>
            </div>
            <div className="flex items-center">
              <input type="radio" id="quantity" name="minimumRequirementType" value="quantity" checked={discount.minimumRequirementType === "quantity"} onChange={handleChange} className="mr-2"/>
              <label htmlFor="quantity" className="text-base text-gray-700">
                Minimum quantity of items
              </label>
            </div>
          </div>
        </div>
        {discount.minimumRequirementType !== "none" && (<div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex">
              Minimum Requirement Value{" "}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input type="text" name="minimumRequirementValue" value={discount.minimumRequirementValue} placeholder="Enter minimum requirement value" className="w-full px-4 py-2 border border-gray-300 rounded-md" onChange={handleChange}/>
          </div>)}
      </div>
    </div>);
};
export default DiscountValue;
