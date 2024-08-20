import React from "react";
import Select from "react-select";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Settings as SettingsType } from "../../services/settings";
import countryList from "react-select-country-list";

interface BrandInformationFormProps {
  settings: SettingsType | null;
  error: string | null;
  handleChange: (field: keyof SettingsType, value: any) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const defaultSettings: SettingsType = {
  id: undefined,
  contactName: "",
  brandName: "",
  mobile: "",
  email: "",
  country: "",
  businessAddress: "",
  notify_referral_conversions: null,
  notify_payment_confirmation: null,
  notify_payment_notifications: null,
  no_payment_notifications: null,
};

const countryOptions = countryList().getData();
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="flex flex-col gap-4 w-full">
    <label className="text-base font-small text-black/80">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="h-14 px-4 py-2 rounded-lg border border-gray-300 w-full text-base text-black/80"
      placeholder={placeholder}
    />
  </div>
);

const BrandInformationForm: React.FC<BrandInformationFormProps> = ({
  settings = defaultSettings,
  error,
  handleChange,
}) => {
  return (
    <div className="flex flex-col justify-start items-start flex-grow gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
      <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
        <p className="text-xl font-medium text-[#10ad1b]">Brand Information</p>
        <p className="text-base text-black/50">
          Use a permanent address where you can receive mail.
        </p>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <InputField
        label="Brand Name"
        value={settings?.brandName || ""}
        onChange={(e) => handleChange("brandName", e.target.value)}
        placeholder="Brand Name"
      />
      <InputField
        label="Contact Name"
        value={settings?.contactName || ""}
        onChange={(e) => handleChange("contactName", e.target.value)}
        placeholder="Contact Name"
      />
      <InputField
        label="Mobile"
        value={settings?.mobile || ""}
        onChange={(e) => handleChange("mobile", e.target.value)}
        placeholder="Mobile"
      />
      <InputField
        label="Email"
        value={settings?.email || ""}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Email"
        type="email"
      />
      <div className="flex flex-col gap-4 w-full">
        <label className="text-base font-small text-black/80">Country</label>
        <Select
          options={countryOptions}
          value={
            countryOptions.find(
              (option) => option.label === (settings?.country || "")
            ) || undefined
          }
          onChange={(option) => handleChange("country", option?.label || "")}
          className="h-14"
          placeholder="Country"
          isDisabled={!settings}
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <label className="text-xl font-small text-black/80">
          Business Address
        </label>
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_MAPS_API_KEY}
          selectProps={{
            value: settings
              ? {
                  label: settings.businessAddress,
                  value: settings.businessAddress,
                }
              : undefined,
            onChange: (val) =>
              handleChange("businessAddress", val?.value.description || ""),
            placeholder: "Business address",
          }}
        />
      </div>
    </div>
  );
};

export default BrandInformationForm;
