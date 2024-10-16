import React from "react";
import { Settings as SettingsType } from "../../../services/settings";
import NotificationToggle from "./NotificationToggle";

interface NotificationsFormProps {
  settings: SettingsType | null;
  handleChange: (field: keyof SettingsType, value: any) => void;
}

// Component to handle the Notifications form fields
const NotificationsForm: React.FC<NotificationsFormProps> = ({ settings, handleChange }) => (
  <div className="flex flex-col justify-start items-start flex-grow gap-8 p-8 rounded-2xl bg-white shadow-lg w-full ">
    {/* Form header */}
    <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
      <p className="text-xl font-medium text-[#10ad1b]">Notifications</p>
      <p className="text-base text-black/50">
        Decide which communications you&apos;d like to receive and how.
      </p>
    </div>
    {/* Form fields */}
    <div className="flex flex-col items-start gap-4 w-full">
      <NotificationToggle
        label="Referral Conversions"
        value={settings?.notify_referral_conversions}
        onChange={() =>
          handleChange("notify_referral_conversions", !settings?.notify_referral_conversions)
        }
      />
      <NotificationToggle
        label="Payment Confirmation"
        value={settings?.notify_payment_confirmation}
        onChange={() =>
          handleChange("notify_payment_confirmation", !settings?.notify_payment_confirmation)
        }
      />
      <NotificationToggle
        label="Payment Notifications"
        value={settings?.notify_payment_notifications}
        onChange={() =>
          handleChange("notify_payment_notifications", !settings?.notify_payment_notifications)
        }
      />
      <NotificationToggle
        label="No Payment Notifications"
        value={settings?.no_payment_notifications}
        onChange={() =>
          handleChange("no_payment_notifications", !settings?.no_payment_notifications)
        }
      />
    </div>
  </div>
);

export default NotificationsForm;
