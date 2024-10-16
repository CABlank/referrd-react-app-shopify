// components/CompanyCard.tsx
import React from "react";
import CalendarIcon from "../../../../components/icons/CalendarIcon";
import EditIcon from "../../../../components/icons/EditIcon";
import LinkIcon from "../../../../components/icons/LinkIcon";
import FallbackLogo from "../../../../components/icons/FallbackLogo";
import Image from "next/image";
import { Company } from "../../../../services/company/company";
import { useRouter } from "next/router";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const router = useRouter();

  return (
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
          <p className="text-xl font-medium text-gray-800">{company.name}</p>
          <a
            href={`http://${company.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <LinkIcon />
            <p className="text-base text-gray-600">{company.domain}</p>
          </a>
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <p className="text-base text-gray-600">
              Created on {new Date(company.date_created).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={() => router.push(`/brand/company/edit?companyId=${company.id}`)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <EditIcon />
          <p className="text-sm font-semibold text-green-600">Edit</p>
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
