import React from "react";
import CountryInput from "../../components/common/CountryInput";
import EmailInput from "@/components/common/EmailInput";
import MobileInput from "@/components/common/MobileInput";
import { Settings as SettingsType } from "../../services/settings";

interface BrandInformationFormProps {
  settings: SettingsType | null;
  error: string | null;
  handleChange: (field: keyof SettingsType, value: any) => void;
}

const BrandInformationForm: React.FC<BrandInformationFormProps> = ({
  settings,
  error,
  handleChange,
}) => (
  <div className="flex flex-col justify-start items-start flex-grow gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
    <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
      <p className="text-xl font-medium text-[#10ad1b]">Brand Information</p>
      <p className="text-base text-black/50">
        Use a permanent address where you can receive mail.
      </p>
    </div>
    {error && <p className="text-red-600">{error}</p>}
    <div className="flex flex-col gap-4 w-full">
      <label className="text-base font-small text-black/80">Brand Name</label>
      <input
        type="text"
        value={settings?.brandName || ""}
        onChange={(e) => handleChange("brandName", e.target.value)}
        className="h-14 px-4 py-2 rounded-lg border border-gray-300 w-full text-base text-black/80"
        placeholder="Brand Name"
      />
    </div>
    <MobileInput
      mobile={settings?.mobile || ""}
      setMobile={(value) => handleChange("mobile", value)}
    />
    <EmailInput
      email={settings?.email || ""}
      setEmail={(value) => handleChange("email", value)}
    />
    <CountryInput
      country={settings?.country || ""}
      setCountry={(value) => handleChange("country", value)}
    />
    <div className="flex flex-col gap-4 w-full">
      <label className="text-xl font-small text-black/80">
        Business Address
      </label>
      <textarea
        value={settings?.businessAddress || ""}
        onChange={(e) => handleChange("businessAddress", e.target.value)}
        className="h-32 px-4 py-2 rounded-lg border border-gray-300 w-full text-base text-black/80"
        placeholder="Business address"
      />
    </div>
  </div>
);

export default BrandInformationForm;
