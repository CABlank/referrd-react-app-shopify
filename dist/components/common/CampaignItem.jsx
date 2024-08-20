import React from "react";
import SuitcaseIcon from "../Icons/SuitcaseIcon";
import MoneyIcon from "../Icons/MoneyIcon";
import CalendarIcon from "../Icons/CalendarIcon";
import CampaignItemIcon from "../Icons/CampaignItemIcon";
var getStatusStyles = function (status) {
    switch (status) {
        case "Ended":
            return {
                bgColor: "bg-red-100",
                textColor: "text-red-600",
                borderColor: "border-red-600",
            };
        case "Pending":
            return {
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-600",
                borderColor: "border-yellow-600",
            };
        case "Draft":
            return {
                bgColor: "bg-blue-100",
                textColor: "text-blue-600",
                borderColor: "border-blue-600",
            };
        case "Live":
            return {
                bgColor: "bg-green-100",
                textColor: "text-green-600",
                borderColor: "border-green-600",
            };
        default:
            return {
                bgColor: "bg-gray-100",
                textColor: "text-gray-600",
                borderColor: "border-gray-600",
            };
    }
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
var CampaignItem = function (_a) {
    var imageSrc = _a.imageSrc, title = _a.title, test = _a.test, price = _a.price, status = _a.status, endDate = _a.endDate, openTo = _a.openTo;
    var _b = getStatusStyles(status), bgColor = _b.bgColor, textColor = _b.textColor, borderColor = _b.borderColor;
    var capitalizedStatus = capitalize(status);
    return (<div className="flex justify-start items-center gap-8 bg-white w-full">
      <CampaignItemIcon />
      <div className="flex flex-col w-full gap-3">
        <div className="flex justify-between items-start w-full gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium text-black/80">{title}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <SuitcaseIcon />
                <p className="text-base text-black/50">{test}</p>
              </div>
              <div className="flex items-center gap-2">
                <MoneyIcon />
                <p className="text-base text-black/50">{price}</p>
              </div>
            </div>
          </div>
          <div className={"flex items-center gap-2 px-4 py-2 rounded-[32px] ".concat(bgColor, " border ").concat(borderColor)}>
            <p className={"text-base ".concat(textColor)}>{capitalizedStatus}</p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <p className="text-base text-black/50">{endDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-base text-black/75">Open to: </p>
            <p className="text-base text-black/50">{openTo}</p>
          </div>
        </div>
      </div>
    </div>);
};
export default CampaignItem;
