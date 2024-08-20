import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import NextImage from "next/image";
import {
  createCompany,
  updateCompany,
  fetchCompany,
  deleteCompany,
  uploadFile,
  Company,
} from "../../../services/company/company";
import { useSession } from "../../../context/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import FallbackLogo from "../../../components/Icons/FallbackLogo";

const EditCompany: React.FC = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const { companyId } = router.query;
  const [company, setCompany] = useState<Company>({
    name: "",
    domain: "",
    logo: null,
    date_created: "",
    UUID: "", // Add the UUID property with an empty string value
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadCompany = async () => {
      if (session?.token && companyId && !loadExecutedRef.current) {
        try {
          setLoading(true);
          loadExecutedRef.current = true;
          const data = await withTokenRefresh((token) =>
            fetchCompany(parseInt(companyId as string), token)
          );
          setCompany(data);
          if (data.logoUrl) {
            setLogoPreview(data.logoUrl);
          }
        } catch (err) {
          console.error("Error fetching company:", err);
          setError("Failed to fetch company. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (companyId) {
      loadCompany();
    }
  }, [session, companyId, withTokenRefresh]);

  const handleChange = (field: keyof Company, value: any) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = objectUrl;
      img.onload = () => {
        setLogoPreview(objectUrl);
        setCompany((prevCompany) => ({
          ...prevCompany,
          logo: file,
        }));
        setLogoError(null); // Clear the error if a file is selected
      };
    }
  };

  const handleSubmit = async () => {
    // Validate if logo is provided before making any API call
    if (!company.logo) {
      setLogoError("Logo is required.");
      return; // Stop execution if no logo is provided
    }

    // If logo is provided, proceed with API call
    if (session?.token) {
      setLoading(true);
      setError(null); // Clear any previous error
      try {
        let logoId = company.logo;
        if (typeof company.logo !== "string") {
          logoId = await withTokenRefresh((token) =>
            uploadFile(company.logo as File, token)
          );
        }

        const updatedCompany = { ...company, logo: logoId };

        if (companyId) {
          await withTokenRefresh((token) =>
            updateCompany(updatedCompany, token)
          );
        } else {
          await withTokenRefresh((token) =>
            createCompany(updatedCompany, token)
          );
        }
        router.push("/brand/company");
      } catch (err) {
        console.error("Error saving company:", err);
        setError("Failed to save company. Please fill all fields.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (session?.token && companyId) {
      setLoading(true);
      try {
        await withTokenRefresh((token) =>
          deleteCompany(parseInt(companyId as string), token)
        );
        router.push("/brand/company");
      } catch (err) {
        router.push("/brand/company");

        console.error("Error deleting company:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col justify-start items-center max-w-full mx-auto gap-8 p-4">
        <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {companyId ? "Edit" : "Create"} Company
          </h2>
          {error && <p className="text-red-600">{error}</p>}
          {logoError && <p className="text-red-600">{logoError}</p>}
          <div className="flex flex-col gap-4 w-full">
            <label className="text-xl font-medium text-black/80">
              Company Name
            </label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80"
              placeholder="Company Name"
            />
            <label className="text-xl font-medium text-black/80">Domain</label>
            <input
              type="text"
              value={company.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              className="h-14 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 w-full text-base text-black/80"
              placeholder="Domain"
            />
            <label className="text-xl font-medium text-black/80">Logo</label>
            {logoPreview ? (
              <NextImage
                src={logoPreview}
                width={96} // Set the desired width
                height={96} // Set the desired height
                className="w-24 h-24 rounded-lg object-cover mb-4"
                alt="Company Logo"
              />
            ) : (
              <FallbackLogo />
            )}
            <input
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
