import { useState, useEffect, useRef } from "react";
import {
  fetchSettings,
  updateSettings,
  createSettings,
  Settings as SettingsType,
} from "../../../services/settings";
import { useSession } from "../../../context/SessionContext";

interface UseSettingsArgs {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const useSettings = ({
  accessToken,
  refreshToken,
  userId,
}: UseSettingsArgs) => {
  const { session, withTokenRefresh } = useSession();


  const initialSettings: SettingsType = {
    id: undefined,
    contactName: "",
    brandName: "",
    mobile: "",
    email: "",
    country: "",
    businessAddress: "",
    notify_referral_conversions: null,
    notify_payment_confirmation: null,
    notify_payment_notifications: null,
    no_payment_notifications: null,
    dateOfBirth: "", // Add the date of birth field
    wiseEmail: "", // Add wiseEmail

  };

  const [settingsState, setSettingsState] = useState<{
    settings: SettingsType | null;
    loading: boolean;
    error: string | null;
  }>({
    settings: initialSettings,
    loading: true,
    error: null,
  });

  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadSettings = async () => {
      if ((session?.accessToken || accessToken) && !loadExecutedRef.current) {

        setSettingsState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          const data = await withTokenRefresh(
            (token) => fetchSettings(token),
            refreshToken,
            userId
          );
          setSettingsState({ settings: data, loading: false, error: null });
        } catch (err) {
          console.error("Error fetching settings:", err);
          setSettingsState({
            settings: initialSettings,
            loading: false,
            error: "Failed to fetch settings. Please try again.",
          });
        }
      }
    };

    loadSettings();
  }, [session, accessToken, refreshToken, userId, withTokenRefresh]);

  const handleChange = (field: keyof SettingsType, value: any) => {
    setSettingsState((prevState) => ({
      ...prevState,
      settings: prevState.settings
        ? { ...prevState.settings, [field]: value }
        : { ...initialSettings, [field]: value },
    }));
  };

  const handleSave = async () => {
    if ((session?.accessToken || accessToken) && settingsState.settings) {
      setSettingsState((prevState) => ({ ...prevState, loading: true }));
      try {
        if (settingsState.settings.id) {
          await withTokenRefresh(
            (token) => updateSettings(settingsState.settings!, token),
            refreshToken,
            userId
          );
        } else {
          const newSettings = await withTokenRefresh(
            (token) => createSettings(settingsState.settings!, token),
            refreshToken,
            userId
          );
          setSettingsState((prevState) => ({
            ...prevState,
            settings: newSettings,
          }));
        }
      } catch (err) {
        console.error("Error saving settings:", err);
        setSettingsState((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to save settings. Please try again.",
        }));
      } finally {
        setSettingsState((prevState) => ({ ...prevState, loading: false }));
      }
    }
  };

  return {
    settings: settingsState.settings,
    loading: settingsState.loading,
    error: settingsState.error,
    handleChange,
    handleSave,
  };
};

export default useSettings;
