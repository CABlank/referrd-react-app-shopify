import React from "react";
// Import icons for use
import MouseClickIcon from "../Icons/IconsSummarySection/MouseClickIcon";
import ConversionRate from "../Icons/IconsSummarySection/ConversionRate";
import Conversions from "../Icons/IconsSummarySection/Conversions";
import MouseClickedIcon from "../Icons/IconsSummarySection/MouseClickedIcon";
import TotalSpends from "../Icons/IconsSummarySection/TotalSpends";
// Define the icon mapping
var iconMapping = {
    MouseClickIcon: MouseClickIcon,
    ConversionRate: ConversionRate,
    Conversions: Conversions,
    MouseClickedIcon: MouseClickedIcon,
    TotalSpends: TotalSpends,
};
var PerformanceSummary = function (_a) {
    var metricName = _a.metricName, value = _a.value, iconName = _a.iconName;
    var IconComponent = iconMapping[iconName];
    return (<div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[215px] relative gap-4 px-4 py-3 rounded-2xl bg-white">
      <div className="flex items-center gap-2 ">
        {IconComponent && <IconComponent />}
        <p className="text-[1rem] font-bold text-center items-center self-center" style={{ color: "#10ad1b" }}>
          {metricName}
        </p>
      </div>
      <p className="text-[1.8rem] font-medium text-center items-center self-center" style={{ color: "#851087" }}>
        {value}
      </p>
    </div>);
};
export default PerformanceSummary;
