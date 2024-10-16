import React from "react";
import NextImage from "next/image";
import { useEditCompany } from "./hooks/useEditCompany"; // Correct hook import
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import FallbackLogo from "../../../components/icons/FallbackLogo";

const EditCompany: React.FC = () => {
  const {
    company,
    logoPreview,
    loading,
    error,
    logoError,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useEditCompany(); // Correct hook usage

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col justify-start items-center max-w-full mx-auto gap-8 p-4">
        <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {company.UUID ? "Edit" : "Create"} Company
          </h2>
          {error && <p className="text-red-600">{error}</p>}
          {logoError && <p className="text-red-600">{logoError}</p>}
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="company-name" className="text-xl font-medium text-black/80">
              Company Name
            </label>
            <input
              id="company-name"
              type="text"
              value={company.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80"
              placeholder="Company Name"
            />
            <label htmlFor="company-domain" className="text-xl font-medium text-black/80">
              Domain
            </label>
            <input
              id="company-domain"
              type="text"
              value={company.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80"
              placeholder="Domain"
              disabled
            />
            <label htmlFor="company-logo" className="text-xl font-medium text-black/80">
              Logo
            </label>
            {logoPreview ? (
              <NextImage
                src={logoPreview}
                width={96}
                height={96}
                className="w-24 h-24 rounded-lg object-cover mb-4"
                alt="Company Logo"
              />
            ) : (
              <FallbackLogo />
            )}
            <input
              id="company-logo"
              type="file"
              onChange={handleFileChange}
              className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80"
            />
          </div>
          <div className="flex justify-between w-full">
            <button
              onClick={handleSubmit}
              className="h-12 w-1/6 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;
