// components/CompanyIndex.tsx
import React from "react";
import Spinner from "../../../components/common/Spinner";
import FetchCompanyData from "./components/FetchCompanyData";
import CompanyCard from "./components/CompanyCard";
import { useCompanyList } from "./hooks/useCompanyList";

const CompanyIndex: React.FC = () => {
  const { companies, loading, error } = useCompanyList();

  return (
    <div className="flex flex-col justify-start items-center max-w-full mx-auto gap-8 p-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {error && <p className="text-red-600">{error}</p>}
          {companies.length === 0 ? (
            <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
              <FetchCompanyData />
            </div>
          ) : (
            <div className="flex flex-col gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
              <div className="flex flex-col justify-start gap-8">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyIndex;
