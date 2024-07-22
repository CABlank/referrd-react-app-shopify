import { useState, useEffect, useRef } from "react";
import {
  fetchSettings,
  updateSettings,
  Settings as SettingsType,
} from "../services/settings";
import { useSession } from "../contexts/SessionContext";

// Custom hook to manage settings
const useSettings = () => {
  const { session, withTokenRefresh } = useSession();

  // State management using a single object to avoid multiple state updates
  const [settingsState, setSettingsState] = useState<{
    settings: SettingsType | null;
    loading: boolean;
    error: string | null;
  }>({
    settings: null,
    loading: true,
    error: null,
  });

  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (session?.token && !loadExecutedRef.current) {
        setSettingsState((prevState) => ({ ...prevState, loading: true }));
        loadExecutedRef.current = true;
        try {
          const data = await withTokenRefresh((token) => fetchSettings(token));
          setSettingsState({ settings: data, loading: false, error: null });
        } catch (err) {
          console.error("Error fetching settings:", err);
          setSettingsState({
            settings: null,
            loading: false,
            error: "Failed to fetch settings. Please try again.",
          });
        }
      }
    };

    if (session) {
      loadSettings();
    }
  }, [session, withTokenRefresh]);

  const handleChange = (field: keyof SettingsType, value: any) => {
    setSettingsState((prevState) => ({
      ...prevState,
      settings: prevState.settings
        ? { ...prevState.settings, [field]: value }
        : null,
    }));
  };

  const handleSave = async () => {
    if (session?.token && settingsState.settings) {
      setSettingsState((prevState) => ({ ...prevState, loading: true }));
      try {
        await withTokenRefresh((token) =>
          updateSettings(settingsState.settings!, token)
        );
      } catch (err) {
        console.error("Error updating settings:", err);
        setSettingsState((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to update settings. Please try again.",
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
