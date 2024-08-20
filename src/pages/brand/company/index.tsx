import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CalendarIcon from "../../../components/Icons/CalendarIcon";
import EditIcon from "../../../components/Icons/EditIcon";
import LinkIcon from "../../../components/Icons/LinkIcon";
import FallbackLogo from "../../../components/Icons/FallbackLogo";
import Image from "next/image";
import {
  fetchCompaniesWithLogo,
  createCompany,
  uploadFile,
  Company,
} from "../../../services/company/company";
import { useSession } from "../../../context/SessionContext";
import { NextApiRequest, NextApiResponse } from "next";

// Spinner component for loading state
const Spinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="loader"></div>
  </div>
);

// URL validation function to ensure the entered URL is valid
const validateUrl = (url: string): boolean => {
  const urlPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return urlPattern.test(url);
};

// FetchCompanyData component for fetching and registering new company data
const FetchCompanyData: React.FC<{
  setNeedsReload: (value: boolean) => void;
}> = ({ setNeedsReload }) => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState<Company>({
    name: "",
    domain: "",
    logo: null,
    date_created: "",
    UUID: "", // Add a value for the UUID property
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);

  // Fetch company data from the provided URL
  const handleFetchData = async () => {
    if (!validateUrl(url)) {
      setError("Invalid URL. Please enter a valid website URL.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const { name, logo } = await response.json();

      setCompany((prevCompany) => ({
        ...prevCompany,
        name: name || "",
        domain: url,
      }));
      setLogoPreview(logo ? logo.replace("http://", "https://") : "");
      setLogoFile(null); // Reset file input if URL fetching is successful

      if (!name && !logo) {
        setError(
          "No recognizable data found at the provided URL. Please upload the logo manually."
        );
      }
    } catch (err) {
      setError("Failed to fetch data. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change for the company logo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setLogoFile(file);
      setLogoPreview(objectUrl); // Reset URL if file is selected
    }
  };

  // Enable editing the company name
  const handleEditName = () => {
    setIsEditingName(true);
  };

  // Enable editing the company logo
  const handleEditLogo = () => {
    setIsEditingLogo(true);
  };

  // Handle input changes for the company object
  const handleChange = (field: keyof Company, value: any) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: value }));
  };

  // Handle saving the company data
  const handleSave = async () => {
    if (!logoPreview && !logoFile) {
      setLogoError("Logo is required. Please upload a logo.");
      return;
    }

    setIsEditingName(false);
    setIsEditingLogo(false);
    setLoading(true);
    setError(null); // Clear any previous error

    try {
      let logoId: string | null = company.logo as string | null;

      // Upload the logo file if it's not already uploaded
      if (logoFile) {
        const uploadedLogo = await withTokenRefresh((token) =>
          uploadFile(logoFile, token)
        );
        logoId = uploadedLogo; // Use the ID from the uploadFile response
      } else if (logoPreview) {
        // Convert logoPreview (HTTPS URL) to a file
        const response = await fetch(logoPreview);
        const blob = await response.blob();
        const file = new File([blob], "logo.jpg", { type: "image/jpeg" });

        const uploadedLogo = await withTokenRefresh((token) =>
          uploadFile(file, token)
        );
        logoId = uploadedLogo; // Use the ID from the uploadFile response
      }

      const updatedCompany: Company = { ...company, logo: logoId };

      if (session?.token) {
        await withTokenRefresh((token) => createCompany(updatedCompany, token));
        setNeedsReload(true); // Trigger component reload
      }
    } catch (err) {
      console.error("Error saving company:", err);
      setError("Failed to save company. Please fill all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
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
        onClick={handleFetchData}
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
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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
          <button
            onClick={handleSave}
            className="bg-green-500 text-white p-2 rounded mt-4"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

// Main component for displaying and managing companies
const CompanyIndex: React.FC = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(true);
  const loadExecutedRef = useRef(false);

  // Fetch companies when the component mounts or when needsReload changes
  useEffect(() => {
    const loadCompanies = async () => {
      if (session?.token && needsReload) {
        setLoading(true);
        loadExecutedRef.current = true;
        setNeedsReload(false); // Reset reload flag

        try {
          const companiesData = await withTokenRefresh((token) =>
            fetchCompaniesWithLogo(token)
          );
          setCompanies(companiesData);
        } catch (err) {
          console.error("Error fetching companies:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCompanies();
  }, [session, withTokenRefresh, needsReload]);

  return (
    <div className="flex flex-col justify-start items-center max-w-full mx-auto gap-8 p-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {error && <p className="text-red-600">{error}</p>}
          {companies.length === 0 ? (
            // Show the form to register a new company if no companies exist
            <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
              <FetchCompanyData setNeedsReload={setNeedsReload} />
            </div>
          ) : (
            // Display list of companies if they exist
            <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
              <div className="flex flex-col justify-start gap-8">
                {companies.map((company) => (
                  <div key={company.id} className="">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="sm:h-[164px] md:h-fit">
                          {company.logoUrl ? (
                            <Image
                              src={company.logoUrl}
                              width={150}
                              height={150}
                              className="rounded-lg object-cover"
                              alt="Company Logo"
                            />
                          ) : (
                            <FallbackLogo />
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <p className="text-xl font-medium text-gray-800">
                            {company.name}
                          </p>
                          <a
                            href={`http://${company.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <LinkIcon />
                            <p className="text-base text-gray-600">
                              {company.domain}
                            </p>
                          </a>
                          <div className="flex items-center gap-2">
                            <CalendarIcon />
                            <p className="text-base text-gray-600">
                              Created on{" "}
                              {new Date(
                                company.date_created
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <button
                          onClick={() =>
                            router.push(
                              `/brand/company/edit?companyId=${company.id}`
                            )
                          }
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <EditIcon />
                          <p className="text-sm font-semibold text-green-600">
                            Edit
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// API route for data fetching
export async function apiFetch(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await fetch(`https://${url}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const name =
      doc
        .querySelector("meta[property='og:site_name']")
        ?.getAttribute("content") || doc.querySelector("title")?.text;
    const logo =
      doc.querySelector("meta[property='og:image']")?.getAttribute("content") ||
      doc.querySelector("img[alt*='logo']")?.getAttribute("src");

    res.status(200).json({ name, logo });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Static props for the page
export const getStaticProps = async () => {
  return {
    props: {
      title: "Company",
    },
  };
};

export default CompanyIndex;
