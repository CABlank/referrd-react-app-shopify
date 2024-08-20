import React, { useEffect, useRef } from "react";
import CampaignDetail from "./CampaignDetail";
import ReferralDetail from "./ReferralDetail";
import DiscountValue from "./DiscountValue";
import ArrowDropdownIcon from "../Icons/ArrowDropdownIcon";
var CampaignInformation = function (_a) {
    var isOpen = _a.isOpen, handleToggle = _a.handleToggle, campaignData = _a.campaignData, handleChange = _a.handleChange;
    var wrapperRef = useRef(null);
    // Check if the click is inside the vertical scrollbar or within the scrollable container
    var isClickInsideScrollbarOrScrollContainer = function (event) {
        var scrollContainer = document.getElementById("scroll");
        if (scrollContainer) {
            return (event.target === scrollContainer ||
                scrollContainer.contains(event.target));
        }
        return false;
    };
    // Hook to detect clicks outside of the component
    useEffect(function () {
        function handleClickOutside(event) {
            if (wrapperRef.current &&
                !wrapperRef.current.contains(event.target) &&
                !isClickInsideScrollbarOrScrollContainer(event)) {
                if (isOpen) {
                    handleToggle();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, handleToggle]);
    return (<div ref={wrapperRef} className="bg-white shadow rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={handleToggle}>
        <h2 className="text-xl font-semibold text-[#47B775]">
          Campaign Information
        </h2>
        <button className="focus:outline-none">
          <ArrowDropdownIcon isOpen={isOpen}/>
        </button>
      </div>
      <hr className="border-gray-200 mb-6"/>
      {isOpen ? (<div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <CampaignDetail campaign={campaignData} handleChange={handleChange} className="bg-white p-0 border-0 shadow-none"/>
          </div>
          <div className="w-full md:w-[1px] bg-gray-200"/>
          <div className="flex-1">
            <ReferralDetail campaign={campaignData} handleChange={handleChange} className="bg-white p-0 border-0 shadow-none"/>
          </div>
          <div className="w-full md:w-[1px] bg-gray-200"/>
          <div className="flex-1">
            <DiscountValue discount={{
                type: campaignData.discountType,
                value: campaignData.discountValue,
                appliesTo: campaignData.appliesTo,
            }} handleChange={handleChange} className="bg-white p-0 border-0 shadow-none"/>
          </div>
        </div>) : (<div className="text-sm text-gray-500 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <p className="mr-0 md:mr-10">
              <strong>Campaign ID:</strong> {campaignData.id}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Name:</strong> {campaignData.name}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Start Date:</strong> {campaignData.startDate}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Close Date:</strong> {campaignData.closeDate}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Company:</strong> {campaignData.company}
            </p>
          </div>
          <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0"/>
          <div className="flex-1">
            <p className="mr-0 md:mr-10">
              <strong>Commission Type:</strong> {campaignData.commissionType}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Commission:</strong> {campaignData.commission}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Campaign Terms:</strong> {campaignData.terms}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Campaign URL:</strong> {campaignData.url}
            </p>
          </div>
          <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0 hidden"/>

          <div className="flex-1 hidden">
            <p className="mr-0 md:mr-10">
              <strong>Discount Type:</strong> {campaignData.discountType}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Discount Value:</strong> {campaignData.discountValue}
            </p>
            <p className="mr-0 md:mr-10">
              <strong>Applies To:</strong> {campaignData.appliesTo}
            </p>
          </div>
        </div>)}
    </div>);
};
export default CampaignInformation;
