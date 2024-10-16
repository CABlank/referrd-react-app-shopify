// components/FetchCompanyData.tsx
import React, { useState } from "react";
import EditIcon from "../../../../components/icons/EditIcon";
import { useCompanyList } from "../hooks/useCompanyList";

const FetchCompanyData: React.FC = () => {
  const {
    company,
    logoPreview,
    loading,
    error,
    logoError,
    isEditingName,
    isEditingLogo,
    handleChange,
    handleFileChange,
    handleSave,
    handleFetchData,
    handleEditName,
    handleEditLogo,
  } = useCompanyList();

  const [url, setUrl] = useState("");

  return (
    <div>
      <h2 className="text-2xl mb-4">Register Company Data</h2>
      <div className="flex">
        <div
          id="websiteProtocolTxt"
          className="p-2 border border-gray-300 rounded-l-lg bg-gray-100"
        >
          <p>https://</p>
        </div>
        <input
          name="businessWebsiteTxt"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Business Website"
          maxLength={50}
          className="p-2 border border-gray-300 rounded-r-lg w-full"
        />
      </div>
      <button
        onClick={() => handleFetchData(url)}
        className="bg-blue-500 text-white p-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Data"}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {company.name && (
        <div className="mt-4">
          <h3 className="text-xl font-medium">Fetched Data:</h3>
          <div className="flex items-center">
            {isEditingName ? (
              <input
                type="text"
                value={company.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
            ) : (
              <p>
                <strong>Company Name:</strong> {company.name}
              </p>
            )}
            <button onClick={handleEditName} className="ml-2">
              <EditIcon />
            </button>
          </div>
          <div className="flex items-center mt-2">
            <strong>Company Logo:</strong>
            {isEditingLogo ? (
              <div className="ml-2">
                <input
                  data-testid="company-logo-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(file);
                    }
                  }}
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-24 h-24 mt-2 object-contain"
                  />
                )}
              </div>
            ) : (
              <>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-24 h-24 ml-2 object-contain"
                  />
                ) : (
                  <p className="ml-2">No logo found. Please upload a logo.</p>
                )}
                <button onClick={handleEditLogo} className="ml-2">
                  <EditIcon />
                </button>
              </>
            )}
          </div>
          {logoError && <p className="text-red-600 mt-2">{logoError}</p>}
          <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded mt-4">
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default FetchCompanyData;
