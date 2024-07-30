import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import CalendarIcon from "../../../components/Icons/CalendarIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";
import EditIcon from "../../../components/Icons/EditIcon";
import LinkIcon from "../../../components/Icons/LinkIcon";
import FallbackLogo from "../../../components/Icons/FallbackLogo";
import Image from "next/image";
import {
  fetchCompaniesWithLogo,
  deleteCompany,
  Company,
} from "../../../services/company/company";
import { useSession } from "../../../contexts/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

const CompanyIndex: React.FC = () => {
  const router = useRouter();
  const { session, withTokenRefresh } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(true);
  const loadExecutedRef = useRef(false);

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

  const handleDelete = async (id: number) => {
    if (session?.token) {
      setLoading(true);
      try {
        await withTokenRefresh((token) => deleteCompany(id, token));
        setCompanies(companies.filter((company) => company.id !== id));
      } catch (err) {
        console.error("Error deleting company:", err);
      } finally {
        setLoading(false);
        setNeedsReload(true); // Trigger reload after delete operation
      }
    }
  };

  return (
    <div className={`relative ${loading ? "blur" : ""}`}>
      {loading && <LoadingOverlay />}

      {error && <p className="text-red-600">{error}</p>}
      {companies.length === 0 ? (
        <button
          onClick={() => router.push("/brand/company/edit")}
          className="h-12 px-6 py-2 rounded-lg bg-[#47B775] text-white font-medium hover:bg-green-700 mb-4"
        >
          Create Company
        </button>
      ) : (
        <div className="flex flex-col justify-start gap-8">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex flex-col items-start p-8 gap-4 w-full rounded-2xl bg-white shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start w-full">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="sm:h-[164px] md:h-fit">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        width={96} // Set the desired width
                        height={96} // Set the desired height
                        className="w-24 h-24 rounded-lg object-cover"
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
                        {new Date(company.date_created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() =>
                      router.push(`/brand/company/edit?companyId=${company.id}`)
                    }
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <EditIcon />
                    <p className="text-sm font-semibold text-green-600">Edit</p>
                  </button>
                  <button
                    onClick={() => handleDelete(company.id!)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <DeleteIcon />
                    <p className="text-sm font-semibold text-red-600">Delete</p>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      title: "Company",
    },
  };
};
export default CompanyIndex;
