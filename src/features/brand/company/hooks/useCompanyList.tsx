import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import {
  fetchCompaniesWithLogo,
  createCompany,
  uploadFile,
  Company,
} from "../../../../services/company/company";
import { useSession } from "../../../../context/SessionContext";

export const useCompanyList = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company>({
    name: "",
    domain: "",
    logo: null,
    date_created: "",
    UUID: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsReload, setNeedsReload] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const loadExecutedRef = useRef(false);

  // Fetch all companies
  const loadCompanies = useCallback(async () => {
    if (session?.accessToken && needsReload) {
      setLoading(true);
      loadExecutedRef.current = true;
      setNeedsReload(false);

      try {
        const companiesData = await withTokenRefresh((token) =>
          fetchCompaniesWithLogo(token)
        );
        setCompanies(companiesData);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [session?.accessToken, needsReload, withTokenRefresh]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Handle form field changes
  const handleChange = (field: keyof Company, value: any) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: value }));
  };

  // Handle logo file input change
  const handleFileChange = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setLogoFile(file);
    setLogoPreview(objectUrl);
  };

  // Enable editing the company name
  const handleEditName = () => {
    setIsEditingName(true);
  };

  // Enable editing the company logo
  const handleEditLogo = () => {
    setIsEditingLogo(true);
  };

  // Handle company save (create new company)
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
        logoId = await withTokenRefresh((token) => uploadFile(logoFile, token));
      }

      const updatedCompany: Company = { ...company, logo: logoId };

      if (session?.accessToken) {
        await withTokenRefresh((token) => createCompany(updatedCompany, token));
        setNeedsReload(true); // Trigger component reload
      }
    } catch (err) {
      console.error("Error saving company:", err);
      setError("Failed to save company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch company data from the provided URL
  const handleFetchData = async (url: string) => {
    const validateUrl = (url: string): boolean => {
      const urlPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return urlPattern.test(url);
    };

    if (!validateUrl(url)) {
      setError("Invalid URL. Please enter a valid website URL.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/fetch-company/fetch?url=${encodeURIComponent(url)}`
      );
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

  return {
    companies,
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
    setNeedsReload,
  };
};
