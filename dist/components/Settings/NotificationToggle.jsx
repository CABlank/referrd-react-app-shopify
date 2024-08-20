import React from "react";
import CheckFilledIcon from "@/components/Icons/CheckFilledIcon";
import CheckUnfilledIcon from "@/components/Icons/CheckUnfilledIcon";
// Reusable component for each notification toggle
var NotificationToggle = function (_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange;
    return (<div className="flex items-center gap-4">
    <p className="text-sm font-small text-black/80">{label}</p>
    <button onClick={onChange} className="flex items-center gap-2">
      {value ? <CheckFilledIcon /> : <CheckUnfilledIcon />}
    </button>
  </div>);
};
export default NotificationToggle;
