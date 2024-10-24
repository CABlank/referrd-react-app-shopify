// External libraries
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// Context
import { useSession } from "../../../../context/SessionContext";

// Components
import BarBuilder from "./step-4/builder/bar-builder/main-bar-builder/BarBuilder";
import BottomNavigationBar from "./bottom-navigation-bar/BottomNavigationBar";
import CampaignCreativeSelector from "./step-4/CampaignCreativeSelector";
import CampaignHeader from "./components/CampaignHeader";
import CampaignInformation from "./components/CampaignInformation";
import DiscountInformation from "./step-3/DiscountInformation";
import CampaignPayment from "./step-5/CampaignPayment";
import DesktopCreativeHide from "./step-4/DesktopCreativeHide";
import LoadingOverlay from "../../../../components/common/LoadingOverlay";
import PopupBuilder from "./step-4/builder/popup-builder/main-popup-builder/PopupBuilder";
import PushCampaignLive from "./step-6/PushCampaignLive";
import Spinner from "../../../../components/common/Spinner";

// Services
import { fetchCampaign, updateCampaign, Campaign } from "../../../../services/campaign/campaign";
import { fetchCompanyUrl } from "../../../../services/company/company";

interface CampaignEditProps {
  accessToken?: string;
  refreshToken?: string;
  title: string;
  userId?: number;
}

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};

const EditCampaign: React.FC<CampaignEditProps> = ({ accessToken, refreshToken, userId }) => {
  const { session, loading: sessionLoading, withTokenRefresh } = useSession();
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };
  const [isOpen, setIsOpen] = useState(true);
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const [companyUrl, setCompanyUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCampaignDataValid, setIsCampaignDataValid] = useState<boolean>(false); // New state to track validation
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);
  const barBuilderRef = useRef<any>(null);
  const popupBuilderRef = useRef<any>(null);
  const isDesktop = useIsDesktop();
  // Track current step and popup sub-step
  const [currentStep, setCurrentStep] = useState(1); // Track current step
  const totalSteps = 6; // Total number of steps for the campaign creation process

  // Refs for scrolling to the correct section
  const campaignInformationRef = useRef<HTMLDivElement>(null);
  const campaignDiscountRef = useRef<HTMLDivElement>(null);
  const campaignCreativeRef = useRef<HTMLDivElement>(null);
  const pushCampaignLiveRef = useRef<HTMLDivElement>(null); // Ref for PushCampaignLive section
  const pushCampaignPaymentRef = useRef<HTMLDivElement>(null);

  // Handle moving to the next step
  const handleNextStep = () => {
    // Move forward in the main steps
    setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  // Handle moving to the previous step
  const handlePreviousStep = () => {
    // Move backward in the main steps
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  // Scroll into view based on current step
  useEffect(() => {
    const scrollToCurrentStep = () => {
      let element: HTMLElement | null = null;

      switch (currentStep) {
        case 1:
        case 2:
        case 3:
          element = campaignInformationRef.current;
          break;
        case 4:
          element = campaignCreativeRef.current;
          break;
        case 5: // Step 5 is where we scroll to the "PushCampaignPayment" section
          element = pushCampaignPaymentRef.current;
          break;
        case 6: // Step 6 is where we scroll to the "PushCampaignLive" section
          element = pushCampaignLiveRef.current;
          break;
        default:
          break;
      }

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    scrollToCurrentStep();
  }, [currentStep]);

  // Add the missing state for selectedSubFormat
  const [selectedSubFormat, setSelectedSubFormat] = useState<"Popup" | "Bar">("Popup");

  // Total popup sub-steps will be determined based on the selected format (Popup or Both)
  const totalPopupSubSteps = selectedSubFormat === "Popup" ? 4 : 8;
  const hasErrorMessage = () => {
    const errorMessageArea = document.getElementById("error-message-area");
    return errorMessageArea && errorMessageArea.innerHTML.trim() !== "";
  };

  useEffect(() => {
    const fetchData = async () => {
      if ((session?.accessToken || accessToken) && campaignId && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;
        try {
          const data = await withTokenRefresh(
            (token) => fetchCampaign(Number(campaignId), token),
            refreshToken,
            userId
          );

          const url = await withTokenRefresh(
            (token) => fetchCompanyUrl(token),
            refreshToken,
            userId
          );
          setCompanyUrl(url);

          setCampaignData({
            ...data,
            startDate: data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : "",
            closeDate: data.closeDate ? new Date(data.closeDate).toISOString().split("T")[0] : "",
            company: url,
          });

          if (data.serializedTopbarState && data.settingsTopbarState && barBuilderRef.current) {
            barBuilderRef.current.deserializeRealTopBar(JSON.parse(data.serializedTopbarState));
            barBuilderRef.current.deserializeTopbarSettings(JSON.parse(data.settingsTopbarState));
          }

          if (data.serializedPopupState && data.settingsPopupState && popupBuilderRef.current) {
            popupBuilderRef.current.deserializeRealPopUp(JSON.parse(data.serializedPopupState));
            popupBuilderRef.current.deserializePopupSettings(JSON.parse(data.settingsPopupState));
          }
        } catch (error) {
          console.error("Failed to fetch campaign data", error);
          setError("Failed to fetch campaign data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (!sessionLoading) {
      fetchData();
    }
  }, [session, accessToken, refreshToken, campaignId, sessionLoading, withTokenRefresh, userId]);

  const handleValidationStatus = (isValid: boolean) => {
    setIsCampaignDataValid(isValid);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handlePaymentSuccess = async () => {
    try {
      // Re-fetch the updated campaign data after the payment is successful
      const updatedCampaignData = await withTokenRefresh(
        (token) => fetchCampaign(Number(campaignId), token),
        refreshToken,
        userId
      );

      // Update the state with the new campaign data
      setCampaignData({
        ...updatedCampaignData,
        startDate: updatedCampaignData.startDate
          ? new Date(updatedCampaignData.startDate).toISOString().split("T")[0]
          : "",
        closeDate: updatedCampaignData.closeDate
          ? new Date(updatedCampaignData.closeDate).toISOString().split("T")[0]
          : "",
        company: companyUrl,
      });

      const { shop, host, id_token } = router.query; // Extract existing query parameters

      let url = `/brand/campaigns/edit?campaignId=${campaignId}`;

      // Check if any query parameter exists
      if (shop || host || id_token) {
        const urlObj = new URL(window.location.origin + url);

        // Append the required query parameters if they exist
        if (shop) urlObj.searchParams.set("shop", shop as string);
        if (host) urlObj.searchParams.set("host", host as string);
        if (id_token) urlObj.searchParams.set("id_token", id_token as string);

        // Generate the final URL string with parameters
        url = urlObj.toString().replace(window.location.origin, "");
      }

      // Optionally, you might want to show a success message or notification
    } catch (error) {
      console.error("Failed to refresh campaign data after payment", error);
      setError("Failed to refresh campaign data. Please try again.");
    }
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    if (campaignData) {
      setCampaignData((prevData) => ({
        ...prevData!,
        [name]: value,
      }));
    }
  };

  const handleFormatSelect = (format: string) => {
    if (campaignData && (format === "Popup" || format === "Both")) {
      setCampaignData((prevData) => ({
        ...prevData!,
        format: format as "Popup" | "Both",
      }));

      // Set default sub-format when "Both" is selected
      if (format === "Both") {
        setSelectedSubFormat("Popup");
      }
    }
  };

  // Function to handle saving as Draft
  const handleSaveAsDraft = async (e?: React.FormEvent) => {
    if (campaignData) {
      campaignData.status = "Draft"; // Set the status to Draft
    }
    await handleSaveChanges(e); // Call the existing handleSaveChanges
  };

  // Function to handle publishing (save as Live)
  const handlePublish = async (e?: React.FormEvent) => {
    if (campaignData) {
      campaignData.status = "Live"; // Set the status to Live
    }
    await handleSaveChanges(e); // Call the existing handleSaveChanges
  };

  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaving(true);

    if (campaignData && isCampaignDataValid) {
      // Only save if data is valid
      try {
        if (session?.accessToken || accessToken) {
          // Always save TopBar data, even if Popup is selected
          // Save TopBar data
          if (barBuilderRef.current) {
            const serializedTopbarState = barBuilderRef.current.serializeRealTopBar();
            const settingsTopbarState = barBuilderRef.current.serializeTopbarSettings();
            campaignData.serializedTopbarState = JSON.stringify(serializedTopbarState);
            campaignData.settingsTopbarState = JSON.stringify(settingsTopbarState);

            const compiledHtmlTopBar = barBuilderRef.current.getCompiledHtml();
            campaignData.compiledHtmlTopBar = JSON.stringify(compiledHtmlTopBar);
          }

          // Save Popup data
          if (popupBuilderRef.current) {
            const serializedPopupState = popupBuilderRef.current.serializeRealPopUp();
            const settingsPopupState = popupBuilderRef.current.serializePopupSettings();
            campaignData.serializedPopupState = JSON.stringify(serializedPopupState);
            campaignData.settingsPopupState = JSON.stringify(settingsPopupState);

            const compiledHtmlPopup = popupBuilderRef.current.getCompiledHtml();
            campaignData.compiledHtml = JSON.stringify(compiledHtmlPopup);
          }

          // Save the campaign data
          await withTokenRefresh(
            async (token) => {
              await updateCampaign(campaignData, token);
            },
            refreshToken,
            userId
          );
        }
      } catch (error) {
        console.error("Failed to save data", error);
        setError("Failed to save data. Please communicate with support.");
      } finally {
        setLoading(false);
        setSaving(false);
        // Extract existing query parameters
        const { shop, host, id_token } = router.query;

        // Set the base URL for the campaigns page
        let campaignsUrl = "/brand/campaigns";

        // If the environment is a Shopify store, append the required query parameters
        if (shop || host || id_token) {
          const urlObj = new URL(window.location.origin + campaignsUrl);
          if (shop) urlObj.searchParams.set("shop", shop as string);
          if (host) urlObj.searchParams.set("host", host as string);
          if (id_token) urlObj.searchParams.set("id_token", id_token as string);

          campaignsUrl = urlObj.toString().replace(window.location.origin, "");
        }

        // Navigate to the updated URL with the necessary query parameters
        router.push(campaignsUrl);
      }
    }
  };

  if (loading || saving) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Adjust the isSaveDisabled check
  const isSaveDisabled = !isCampaignDataValid || !!hasErrorMessage();

  if (!campaignData) {
    return <div>{error || "Loading..."}</div>;
  }

  const campaignDataWithNonNullableUrl = {
    ...campaignData,
    url: campaignData.company || "",
    startDate: campaignData.startDate || "",
    closeDate: campaignData.closeDate || "",
    company: campaignData.company || "",
  };

  return (
    <div
      className={`relative ${
        loading || saving ? "blur-sm" : ""
      } flex-1 overflow-y-auto overflow-x-hidden`}
    >
      {loading && <LoadingOverlay />}
      <main className="">
        <div className="max-w mx-auto mb-10 space-y-6">
          <CampaignHeader
            saving={saving}
            handleSaveChanges={handleSaveChanges}
            isSaveDisabled={isSaveDisabled} // Disable save button if data is invalid or there's an error
          />

          {error && <div className="text-red-600">{error}</div>}
          <div ref={campaignInformationRef}>
            <CampaignInformation
              isOpen={isOpen}
              handleToggle={handleToggle}
              campaignData={campaignDataWithNonNullableUrl}
              handleChange={handleChange}
              onValidationStatus={handleValidationStatus} // Pass validation status callback
              currentStep={currentStep}
            />
          </div>

          <div ref={campaignDiscountRef}>
            <DiscountInformation
              campaignData={campaignDataWithNonNullableUrl}
              handleChange={handleChange}
              accessToken={session?.accessToken ?? accessToken ?? ""}
              onValidationStatus={handleValidationStatus} // Pass validation status callback
            />
          </div>
        </div>
        {isDesktop ? (
          <>
            <div ref={campaignCreativeRef}>
              <CampaignCreativeSelector
                className="w-full mb-10 bg-white shadow rounded-lg border border-gray-200"
                selectedFormat={campaignData.format}
                onSelect={handleFormatSelect}
                selectedSubFormat={selectedSubFormat} // Pass selectedSubFormat as a prop
                onSubFormatSelect={(subFormat: "Popup" | "Bar") => {
                  if (subFormat === "Popup" || subFormat === "Bar") {
                    setSelectedSubFormat(subFormat);
                  }
                }} // Pass the updater function
              >
                {campaignData.format === "Both" ? (
                  selectedSubFormat === "Popup" ? (
                    <>
                      <PopupBuilder
                        ref={popupBuilderRef}
                        campaign={campaignDataWithNonNullableUrl}
                        className="w-full bg-white shadow rounded-lg border border-gray-200"
                      />
                      {/* Initialize barBuilderRef even if it's not rendered */}
                      <div style={{ display: "none" }}>
                        <BarBuilder ref={barBuilderRef} campaign={campaignDataWithNonNullableUrl} />
                      </div>
                    </>
                  ) : (
                    <>
                      <BarBuilder
                        ref={barBuilderRef}
                        campaign={campaignDataWithNonNullableUrl}
                        className="w-full bg-white shadow rounded-lg border border-gray-200"
                      />
                      {/* Initialize popupBuilderRef even if it's not rendered */}
                      <div style={{ display: "none" }}>
                        <PopupBuilder
                          ref={popupBuilderRef}
                          campaign={campaignDataWithNonNullableUrl}
                        />
                      </div>
                    </>
                  )
                ) : (
                  <PopupBuilder
                    ref={popupBuilderRef}
                    campaign={campaignDataWithNonNullableUrl}
                    className="w-full bg-white shadow rounded-lg border border-gray-200"
                  />
                )}
              </CampaignCreativeSelector>
            </div>
          </>
        ) : (
          <DesktopCreativeHide />
        )}

        <div ref={pushCampaignPaymentRef}>
          <CampaignPayment
            campaignId={Number(campaignId)}
            token={session?.accessToken ?? ""}
            amountFunded={campaignData.amountFunded || 0}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>

        {/* Step 6 - Push Campaign Live */}
        <div ref={pushCampaignLiveRef}>
          <PushCampaignLive
            campaignId={campaignData.id!}
            token={session?.accessToken!}
            currentStatus={campaignData.status as "Live" | "Draft"}
            handleSaveChanges={handleSaveChanges}
            isSaveDisabled={isSaveDisabled}
          />
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNavigationBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          onSaveDraft={handleSaveAsDraft} // Save as Draft
          onPublish={handlePublish} // Publish Live
          isNextDisabled={isSaveDisabled && currentStep >= 3}
          onClose={() => console.log("Close clicked")}
          isPreviousDisabled={currentStep === 1}
          isVerifying={false}
        />
      </main>
    </div>
  );
};

export default EditCampaign;
