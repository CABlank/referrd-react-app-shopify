import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import {
  createCompany,
  updateCompany,
  fetchCompany,
  uploadFile,
  Company,
} from "../../../../services/company/company";
import { useSession } from "../../../../context/SessionContext";

export const useEditCompany = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const companyId = router.query.companyId as string;

  const [company, setCompany] = useState<Company>({
    name: "",
    domain: "",
    logo: null,
    date_created: "",
    UUID: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);

  const loadCompany = useCallback(async () => {
    if (session?.accessToken && companyId && !loadExecutedRef.current) {
      setLoading(true);
      loadExecutedRef.current = true;
      try {
        const data = await withTokenRefresh((token) =>
          fetchCompany(parseInt(companyId), token)
        );
        setCompany(data);
        setLogoPreview(data.logoUrl || null);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to fetch company. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [companyId, session?.accessToken, withTokenRefresh]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  const handleChange = (field: keyof Company, value: any) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      setCompany((prev) => ({ ...prev, logo: file }));
      setLogoError(null);
    }
  };

  const handleSubmit = async () => {
    if (!company.logo) {
      setLogoError("Logo is required.");
      return;
    }
    if (session?.accessToken) {
      setLoading(true);
      setError(null);
      try {
        const logoId =
          typeof company.logo === "string"
            ? company.logo
            : await withTokenRefresh((token) =>
                uploadFile(company.logo as File, token)
              );
        const updatedCompany = { ...company, logo: logoId };
        const action = companyId ? updateCompany : createCompany;
        await withTokenRefresh((token) => action(updatedCompany, token));
        router.push("/brand/company");
      } catch (err) {
        console.error("Error saving company:", err);
        setError("Failed to save company. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    company,
    logoPreview,
    loading,
    error,
    logoError,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};
