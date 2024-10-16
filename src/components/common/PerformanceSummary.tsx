import React from "react";

// Import icons for use
import MouseClickIcon from "../icons/icons-summary-section/MouseClickIcon";
import ConversionRate from "../icons/icons-summary-section/ConversionRate";
import Conversions from "../icons/icons-summary-section/Conversions";
import MouseClickedIcon from "../icons/icons-summary-section/MouseClickedIcon";
import TotalSpends from "../icons/icons-summary-section/TotalSpends";

// Define the icon mapping
const iconMapping: { [key: string]: React.FC } = {
  MouseClickIcon: MouseClickIcon,
  ConversionRate: ConversionRate,
  Conversions: Conversions,
  MouseClickedIcon: MouseClickedIcon,
  TotalSpends: TotalSpends,
};

// MetricCard component
interface PerformanceSummaryProps {
  metricName: string;
  value: string;
  iconName: keyof typeof iconMapping;
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ metricName, value, iconName }) => {
  const IconComponent = iconMapping[iconName];

  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[215px] relative gap-4 px-4 py-3 rounded-2xl bg-white">
      <div className="flex items-center gap-2 ">
        {IconComponent && <IconComponent />}
        <p
          className="text-[0.9rem] font-bold text-center items-center self-center"
          style={{ color: "#10ad1b" }}
        >
          {metricName}
        </p>
      </div>
      <p
        className="text-[1.8rem] font-medium text-center items-center self-center"
        style={{ color: "#851087" }}
      >
        {value}
      </p>
    </div>
  );
};

export default PerformanceSummary;
