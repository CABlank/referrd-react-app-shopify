import React from "react";
import CountryInput from "../../components/common/CountryInput";
import EmailInput from "@/components/common/EmailInput";
import MobileInput from "@/components/common/MobileInput";
var BrandInformationForm = function (_a) {
    var settings = _a.settings, error = _a.error, handleChange = _a.handleChange;
    return (<div className="flex flex-col justify-start items-start flex-grow gap-8 p-8 rounded-2xl bg-white shadow-lg w-full lg:w-1/2">
    <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
      <p className="text-xl font-medium text-[#10ad1b]">Brand Information</p>
      <p className="text-base text-black/50">
        Use a permanent address where you can receive mail.
      </p>
    </div>
    {error && <p className="text-red-600">{error}</p>}
    <div className="flex flex-col gap-4 w-full">
      <label className="text-base font-small text-black/80">Brand Name</label>
      <input type="text" value={(settings === null || settings === void 0 ? void 0 : settings.brandName) || ""} onChange={function (e) { return handleChange("brandName", e.target.value); }} className="h-14 px-4 py-2 rounded-lg border border-gray-300 w-full text-base text-black/80" placeholder="Brand Name"/>
    </div>
    <MobileInput mobile={(settings === null || settings === void 0 ? void 0 : settings.mobile) || ""} setMobile={function (value) { return handleChange("mobile", value); }}/>
    <EmailInput email={(settings === null || settings === void 0 ? void 0 : settings.email) || ""} setEmail={function (value) { return handleChange("email", value); }}/>
    <CountryInput country={(settings === null || settings === void 0 ? void 0 : settings.country) || ""} setCountry={function (value) { return handleChange("country", value); }}/>
    <div className="flex flex-col gap-4 w-full">
      <label className="text-xl font-small text-black/80">
        Business Address
      </label>
      <textarea value={(settings === null || settings === void 0 ? void 0 : settings.businessAddress) || ""} onChange={function (e) { return handleChange("businessAddress", e.target.value); }} className="h-32 px-4 py-2 rounded-lg border border-gray-300 w-full text-base text-black/80" placeholder="Business address"/>
    </div>
  </div>);
};
export default BrandInformationForm;
