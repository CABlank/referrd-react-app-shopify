import React from "react";
import CheckFilledIcon from "../../../components/icons/CheckFilledIcon";
import CheckUnfilledIcon from "../../../components/icons/CheckUnfilledIcon";

interface NotificationToggleProps {
  label: string;
  value: boolean | null | undefined;
  onChange: () => void;
}

// Reusable component for each notification toggle
const NotificationToggle: React.FC<NotificationToggleProps> = ({ label, value, onChange }) => (
  <div className="flex items-center gap-4">
    <p className="text-sm font-small text-black/80">{label}</p>
    <button onClick={onChange} className="flex items-center gap-2">
      {value ? <CheckFilledIcon /> : <CheckUnfilledIcon />}
    </button>
  </div>
);

export default NotificationToggle;
