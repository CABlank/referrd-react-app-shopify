import React from "react";
var ReferralDetail = function (_a) {
    var campaign = _a.campaign, className = _a.className, handleChange = _a.handleChange;
    return (<div className={"bg-white p-4 shadow rounded-lg border border-gray-200 ".concat(className)}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-green-500">
          2. Referral Details
        </h2>

        <div className="grid grid-cols-2">
          <div className="space-y-4 ">
            <label className="block font-medium text-gray-700 inline-flex items-center">
              Commission type <span className="ml-1 text-red-500">*</span>
            </label>
            <select name="commissionType" value={campaign.commissionType || ""} className="w-full h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 " onChange={handleChange}>
              <option value="">Select one</option>
              <option value="Dollar">Dollar</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-gray-700 inline-flex items-center"></label>
            <div className="flex items-center h-10 border border-gray-300 bg-white px-2.5">
              <span className="text-gray-700">
                {campaign.commissionType === "Percentage" ? "%" : "$"}
              </span>
              <input type="text" name="commission" value={campaign.commission || ""} placeholder="Commission" className="flex-1 px-2 py-2 bg-transparent text-gray-700 border-0 focus:outline-none" onChange={handleChange}/>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Campaign terms <span className="ml-1 text-red-500">*</span>
          </label>
          <textarea name="terms" value={campaign.terms || ""} placeholder="Write terms" className="w-full h-[142px] px-4 py-4 rounded-lg bg-white border border-gray-300" onChange={handleChange}></textarea>
        </div>

        <div className="space-y-4 mt-4">
          <label className="block font-medium text-gray-700 inline-flex">
            Campaign URL <span className="ml-1 text-red-500">*</span>
          </label>
          <input type="text" name="url" value={campaign.url || ""} placeholder="https://example.com" className="w-full form-input px-4 py-2 border border-gray-300 rounded-md" onChange={handleChange}/>
        </div>
      </div>
    </div>);
};
export default ReferralDetail;
