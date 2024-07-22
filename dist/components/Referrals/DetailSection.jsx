import React from "react";
var DetailSection = function (_a) {
    var referral = _a.referral, customer = _a.customer, referralCode = _a.referralCode, campaign = _a.campaign;
    // If data is not available, display placeholder
    var details = [
        {
            label: "Payment",
            value: referral
                ? referral.conversion === "true"
                    ? "Completed"
                    : "Pending"
                : "N/A",
            additionalStyles: "bg-[#d6b713]/5 rounded-[40px] px-4 py-0.5 border border-[#b59a0b] text-[#b59a0b]",
        },
        {
            label: "Date",
            value: referral
                ? new Date(referral.date_created).toLocaleString()
                : "N/A",
        },
        { label: "Referral Code", value: referralCode ? referralCode.code : "N/A" },
        { label: "Campaign", value: campaign ? campaign.name : "N/A" },
        {
            label: "Commission",
            value: referral ? "$".concat(referral.spend.toFixed(2)) : "N/A",
        },
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
            <p className={"text-base text-left text-black/50 ".concat(detail.additionalStyles || "")}>
              {detail.value}
            </p>
          </div>
        </div>); })}
    </div>);
};
export default DetailSection;
