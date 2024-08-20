import React from "react";
import Select from "react-select";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import countryList from "react-select-country-list";
var GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
var defaultSettings = {
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
var countryOptions = countryList().getData();
var InputField = function (_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, _b = _a.type, type = _b === void 0 ? "text" : _b;
    return (<div className="flex flex-col gap-4 w-full">
    <label className="text-base font-small text-black/80">{label}</label>
    <input type={type} value={value} onChange={onChange} className="h-14 px-4 py-2 rounded-lg border border-gray-300 w-full text-base text-black/80" placeholder={placeholder}/>
  </div>);
};
var BrandInformationForm = function (_a) {
    var _b = _a.settings, settings = _b === void 0 ? defaultSettings : _b, error = _a.error, handleChange = _a.handleChange;
    return (<div className="flex flex-col justify-start items-start flex-grow gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
      <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
        <p className="text-xl font-medium text-[#10ad1b]">Brand Information</p>
        <p className="text-base text-black/50">
          Use a permanent address where you can receive mail.
        </p>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <InputField label="Brand Name" value={(settings === null || settings === void 0 ? void 0 : settings.brandName) || ""} onChange={function (e) { return handleChange("brandName", e.target.value); }} placeholder="Brand Name"/>
      <InputField label="Contact Name" value={(settings === null || settings === void 0 ? void 0 : settings.contactName) || ""} onChange={function (e) { return handleChange("contactName", e.target.value); }} placeholder="Contact Name"/>
      <InputField label="Mobile" value={(settings === null || settings === void 0 ? void 0 : settings.mobile) || ""} onChange={function (e) { return handleChange("mobile", e.target.value); }} placeholder="Mobile"/>
      <InputField label="Email" value={(settings === null || settings === void 0 ? void 0 : settings.email) || ""} onChange={function (e) { return handleChange("email", e.target.value); }} placeholder="Email" type="email"/>
      <div className="flex flex-col gap-4 w-full">
        <label className="text-base font-small text-black/80">Country</label>
        <Select options={countryOptions} value={countryOptions.find(function (option) { return option.label === ((settings === null || settings === void 0 ? void 0 : settings.country) || ""); }) || undefined} onChange={function (option) { return handleChange("country", (option === null || option === void 0 ? void 0 : option.label) || ""); }} className="h-14" placeholder="Country" isDisabled={!settings}/>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <label className="text-xl font-small text-black/80">
          Business Address
        </label>
        <GooglePlacesAutocomplete apiKey={GOOGLE_MAPS_API_KEY} selectProps={{
            value: settings
                ? {
                    label: settings.businessAddress,
                    value: settings.businessAddress,
                }
                : undefined,
            onChange: function (val) {
                return handleChange("businessAddress", (val === null || val === void 0 ? void 0 : val.value.description) || "");
            },
            placeholder: "Business address",
        }}/>
      </div>
    </div>);
};
export default BrandInformationForm;
