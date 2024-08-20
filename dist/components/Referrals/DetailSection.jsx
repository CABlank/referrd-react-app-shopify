import React from "react";
var parseLocation = function (location) {
    try {
        var parsedLocation = JSON.parse(location);
        return "".concat(parsedLocation.city, ", ").concat(parsedLocation.country);
    }
    catch (_a) {
        return "Unknown";
    }
};
var DetailSection = function (_a) {
    var customer = _a.customer, referralCode = _a.referralCode, campaign = _a.campaign;
    var details = [
        { label: "Name", value: (customer === null || customer === void 0 ? void 0 : customer.name) || "N/A" },
        { label: "Email", value: (customer === null || customer === void 0 ? void 0 : customer.email) || "N/A" },
        {
            label: "Date",
            value: customer
                ? new Date(customer.date_created).toLocaleString()
                : "N/A",
        },
        {
            label: "Location",
            value: customer ? parseLocation(customer.location) : "N/A",
        },
        { label: "Mobile", value: (customer === null || customer === void 0 ? void 0 : customer.mobile) || "N/A" },
    ];
    return (<div className="flex flex-col gap-4 p-8 rounded-2xl bg-white">
      <div className="flex flex-col gap-3">
        <p className="text-xl font-medium text-[#10ad1b]">Details</p>
        <p className="w-full text-base text-black/50">
          Please find the details of your referral and how users engaged with it
          below.
        </p>
      </div>
      {details.map(function (detail, index) { return (<div key={index} className={"flex justify-between items-center px-8 py-4 border-b border-gray-300 last:border-b-0"}>
          <p className="flex-1 text-base text-left text-black/50">
            {detail.label}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-base text-center text-black/50">
              {detail.value}
            </p>
          </div>
        </div>); })}
    </div>);
};
export default DetailSection;
