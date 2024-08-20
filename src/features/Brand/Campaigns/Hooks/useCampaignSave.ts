import { useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  updateCampaign,
  Campaign,
} from "../../../../services/campaign/campaign";
import { useSession } from "../../../../context/SessionContext";

export const useCampaignSave = (
  campaignData: Campaign | null,
  setError: (error: string | null) => void
) => {
  const { session, withTokenRefresh } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const barBuilderRef = useRef<any>(null);
  const popupBuilderRef = useRef<any>(null);
  const [showFundPopup, setShowFundPopup] = useState(false);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaving(true); // Indicate that saving is in progress

    if (campaignData) {
      try {
        if (session?.token) {
          if (barBuilderRef.current) {
            const serializedTopbarState =
              barBuilderRef.current.serializeRealTopBar();
            const settingsTopbarState =
              barBuilderRef.current.serializeTopbarSettings();
            campaignData.serializedTopbarState = JSON.stringify(
              serializedTopbarState
            );
            campaignData.settingsTopbarState =
              JSON.stringify(settingsTopbarState);

            // Get and set the compiled HTML from BarBuilder
            const compiledHtml = barBuilderRef.current.getCompiledHtml();
            campaignData.compiledHtml = JSON.stringify(compiledHtml); // Update this to save compiledHtml from BarBuilder
          }

          if (popupBuilderRef.current) {
            const serializedPopupState =
              popupBuilderRef.current.serializeRealPopUp();
            const settingsPopupState =
              popupBuilderRef.current.serializePopupSettings();
            campaignData.serializedPopupState =
              JSON.stringify(serializedPopupState);
            campaignData.settingsPopupState =
              JSON.stringify(settingsPopupState);

            const compiledHtml = popupBuilderRef.current.getCompiledHtml();
            campaignData.compiledHtml = JSON.stringify(compiledHtml); // If you're storing compiled HTML for Popup separately
          }

          await withTokenRefresh(async (token) => {
            await updateCampaign(campaignData, token);
          });

          // Show the funding popup after saving changes
          setShowFundPopup(true);
        }
      } catch (error) {
        console.error("Failed to save data", error);
        setError("Failed to save data. Please communicate with support.");
      } finally {
        setLoading(false);
        setSaving(false); // Indicate that saving is complete
      }
    }
  };

  return {
    loading,
    saving,
    handleSaveChanges,
    showFundPopup,
    setShowFundPopup,
    barBuilderRef,
    popupBuilderRef,
  };
};
