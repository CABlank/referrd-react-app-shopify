import React from "react";

// Import icons for use
import MouseClickIcon from "../Icons/MouseClickIcon";

// MetricCard component
const PerformanceSummary = ({
  metricName,
  value,
}: {
  metricName: string;
  value: string;
}) => {
  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[215px] relative gap-4 px-4 py-3 rounded-2xl bg-white">
      <div className="flex items-center gap-2">
        <MouseClickIcon />
        <p
          className="text-[1rem] font-bold text-left"
          style={{ color: "#10ad1b" }}
        >
          {metricName}
        </p>
      </div>
      <p
        className="text-[1.8rem] font-medium  text-left"
        style={{ color: "#851087" }}
      >
        {value}
      </p>
    </div>
  );
};

export default PerformanceSummary;
