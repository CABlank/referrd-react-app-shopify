import React, { useState, useRef, useEffect } from "react";
import CampaignDetail from "../step-1/CampaignDetail";
import ReferralDetail from "../step-2/ReferralDetail";
import ArrowDropdownIcon from "../../../../../components/icons/ArrowDropdownIcon";

interface CampaignInformationProps {
  isOpen: boolean;
  handleToggle: () => void;
  campaignData: any;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => void; // Allow custom event type along with regular ChangeEvent
  currentStep: number;
  onValidationStatus: (isValid: boolean) => void;
}

const CampaignInformation: React.FC<CampaignInformationProps> = ({
  isOpen,
  handleToggle,
  campaignData,
  handleChange,
  currentStep, // Track the current step
  onValidationStatus,
}) => {
  // Create refs for each section
  const campaignDetailRef = useRef<HTMLDivElement>(null);
  const referralDetailRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation function to check if required fields are filled and meet the correct format
  const validateCampaignData = () => {
    const requiredFields = [
      { field: "name", label: "Name" },
      { field: "startDate", label: "Start Date" },
      { field: "closeDate", label: "Close Date" },
      { field: "company", label: "Company" },
      { field: "commissionType", label: "Commission Type" },
      { field: "commission", label: "Commission" },
      { field: "url", label: "Campaign URL" },
    ];

    let newErrors: { [key: string]: string } = {};

    requiredFields.forEach((item) => {
      const value = campaignData[item.field];
      const trimmedValue = typeof value === "string" ? value.trim() : String(value || "");

      if (!trimmedValue) {
        newErrors[item.field] = `${item.label} is required.`;
      } else {
        switch (item.field) {
          case "commission":
            if (!/^\d+$/.test(trimmedValue)) {
              newErrors[item.field] = `${item.label} must be a number.`;
            }
            break;
          case "commissionType":
            if (trimmedValue === "Select one" || trimmedValue === "") {
              newErrors[item.field] = `Please select a valid ${item.label}.`;
            }
            break;
          case "startDate":
          case "closeDate":
            if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
              newErrors[item.field] = `${item.label} must be in YYYY-MM-DD format.`;
            }
            break;
          default:
            break;
        }
      }
    });

    setErrors(newErrors);
    onValidationStatus(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateCampaignData();
  }, [campaignData]);

  // Function to scroll to a specific step when the step changes
  useEffect(() => {
    const scrollToStep = () => {
      let element: HTMLElement | null = null;
      switch (currentStep) {
        case 1:
          element = campaignDetailRef.current;
          break;
        case 2:
          element = referralDetailRef.current;
          break;
        default:
          break;
      }

      // Ensure the element exists before scrolling
      if (element) {
        // Add top margin or padding to scroll smoothly and center the section
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    scrollToStep();
  }, [currentStep]); // Trigger scrolling when the current step changes

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={handleToggle}>
        <h2 className="text-xl font-semibold text-[#47B775]">Campaign Information</h2>
        <button className="focus:outline-none">
          <ArrowDropdownIcon isOpen={isOpen} />
        </button>
      </div>
      <hr className="border-gray-200 mb-6" />

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 text-red-600">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {isOpen ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campaign Detail (Step 1) */}
          <div className="flex-1" ref={campaignDetailRef}>
            <CampaignDetail
              campaign={campaignData}
              handleChange={handleChange}
              className="bg-white p-0 border-0 shadow-none"
            />
          </div>
          <div className="w-full md:w-[1px] bg-gray-200" />
          {/* Referral Detail (Step 2) */}
          <div className="flex-1" ref={referralDetailRef}>
            <ReferralDetail
              campaign={campaignData}
              handleChange={handleChange}
              className="bg-white p-0 border-0 shadow-none"
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 flex flex-col md:flex-row gap-4">
          {/* Summary when collapsed */}
          <div className="flex-1">
            <p className="mr-0 md:mr-10">
              <strong>Amount Available: </strong>${campaignData.amountFunded}
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
          <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0" />
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
        </div>
      )}
    </div>
  );
};

export default CampaignInformation;
