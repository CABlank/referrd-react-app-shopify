// pages/campaign/[id].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RealTopBar from "../../components/campaign/BarBuilder/Preview/RealTopBar";
import RealPopup from "../../components/campaign/PopupBuilder/Preview/RealPopup";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BOT_TOKEN = process.env.BOT_TOKEN;

const CampaignPage: React.FC & { noLayout?: boolean } = () => {
  const router = useRouter();
  const { id } = router.query; // Get the campaign ID from the URL
  const [serializedTopbarState, setSerializedTopbarState] = useState<
    string | null
  >(null);
  const [settingsTopbarState, setSettingsTopbarState] = useState<string | null>(
    null
  );
  const [serializedPopupState, setSerializedPopupState] = useState<
    string | null
  >(null);
  const [settingsPopupState, setSettingsPopupState] = useState<string | null>(
    null
  );
  const [format, setFormat] = useState<"Topbar" | "Popup" | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isComponentLoaded, setIsComponentLoaded] = useState<boolean>(false); // New state to track component loading

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        // Only fetch if the ID is available
        try {
          console.log("API URL:", API_URL); // Add logging for debugging
          console.log("BOT TOKEN:", BOT_TOKEN); // Add logging for debugging

          const response = await fetch(
            `${API_URL}/items/campaign_public_page/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${BOT_TOKEN}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch campaign data");
          }
          const data = await response.json();
          console.log("Fetched data:", data);

          setFormat(data.data.format);

          if (data.data.format === "Topbar") {
            setSerializedTopbarState(data.data.serializedTopbarState);
            setSettingsTopbarState(data.data.settingsTopbarState);
          } else if (data.data.format === "Popup") {
            setSerializedPopupState(data.data.serializedPopupState);
            setSettingsPopupState(data.data.settingsPopupState);
          }
        } catch (error) {
          console.error("Error fetching campaign data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id]); // Fetch data when the ID changes

  useEffect(() => {
    if (settingsTopbarState) {
      const settings = JSON.parse(settingsTopbarState);

      const sendHeight = () => {
        const isDesktop = window.innerWidth >= 768;
        const height = isDesktop
          ? settings.desktopStep1.height
          : settings.mobileStep1.height;

        if (height) {
          console.log("Sent height:", height);
          window.parent.postMessage({ height }, "*");
        }
      };

      sendHeight();

      // Send height on resize
      const handleResize = () => {
        sendHeight();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [settingsTopbarState]);

  useEffect(() => {
    if (settingsTopbarState) {
      const settings = JSON.parse(settingsTopbarState);
      const observer = new MutationObserver(() => {
        const isDesktop = window.innerWidth >= 768;
        const height = isDesktop
          ? settings.desktopStep1.height
          : settings.mobileStep1.height;

        if (height) {
          console.log("Sent height on mutation:", height);
          window.parent.postMessage({ height }, "*");
        }
      });

      const topBarElement = document.querySelector(".top-bar-preview");
      if (topBarElement) {
        observer.observe(topBarElement, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
      }

      return () => observer.disconnect();
    }
  }, [settingsTopbarState]);

  useEffect(() => {
    if (!isLoading && format) {
      window.parent.postMessage("componentLoaded", "*"); // Notify parent window that the component has loaded
      setIsComponentLoaded(true); // Set the component as loaded when the format is determined and not loading
    }
  }, [isLoading, format]);

  if (isLoading || !format) {
    return null;
  }

  if (format === "Topbar" && serializedTopbarState && settingsTopbarState) {
    return (
      <div className="top-bar-preview">
        <RealTopBar
          serializedState={serializedTopbarState}
          settingsState={settingsTopbarState}
          enableDragAndDrop={false}
          view={"desktop"}
          onLoad={() => setIsComponentLoaded(true)} // Set the component as loaded when RealTopBar has loaded
        />
      </div>
    );
  } else if (format === "Popup" && serializedPopupState && settingsPopupState) {
    return (
      <RealPopup
        serializedState={serializedPopupState}
        settingsState={settingsPopupState}
        enableDragAndDrop={false}
        view={"desktop"}
        onLoad={() => setIsComponentLoaded(true)} // Set the component as loaded when RealPopup has loaded
      />
    );
  }

  return null;
};

CampaignPage.noLayout = true; // Set the custom property

export default CampaignPage;
