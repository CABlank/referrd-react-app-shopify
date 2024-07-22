import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import CampaignDetail from "../../../components/campaign/CampaignDetail";
import ReferralDetail from "../../../components/campaign/ReferralDetail";
import DiscountValue from "../../../components/campaign/DiscountValue";
import BarBuilder from "../../../components/campaign/BarBuilder/MainBarBuilder/BarBuilder";
import PopupBuilder from "../../../components/campaign/PopupBuilder/MainPopupBuilder/PopupBuilder";
import CampaignCreativeSelector from "../../../components/campaign/CampaignCreativeSelector";
import ArrowDropdownIcon from "../../../components/Icons/ArrowDropdownIcon";
import {
  fetchCampaign,
  updateCampaign,
  Campaign,
} from "../../../services/campaign/campaign";
import { useSession } from "../../../contexts/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import DesktopCreativeHide from "@/components/campaign/DesktopCreativeHide";
import StripeWrapper from "../../../components/campaign/StripeWrapper";
import PaymentForm from "../../../components/campaign/PaymentForm";

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

const EditCampaign: React.FC = () => {
  const { session, loading: sessionLoading, withTokenRefresh } = useSession();
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };
  const [isOpen, setIsOpen] = useState(true);
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Added state to track saving status
  const [error, setError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);
  const barBuilderRef = useRef<any>(null);
  const popupBuilderRef = useRef<any>(null);
  const isDesktop = useIsDesktop();

  const [showFundPopup, setShowFundPopup] = useState(false);
  const [amountFunded, setFundAmount] = useState<number>(10000); // Default fund amount

  useEffect(() => {
    const fetchData = async () => {
      if (session?.token && campaignId && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;
        try {
          const data = await withTokenRefresh((token) =>
            fetchCampaign(Number(campaignId), token)
          );
          setCampaignData({
            ...data,
            startDate: data.startDate
              ? new Date(data.startDate).toISOString().split("T")[0]
              : "",
            closeDate: data.closeDate
              ? new Date(data.closeDate).toISOString().split("T")[0]
              : "",
            company: data.company || "", // Ensure company is a string
          });

          // Deserialize state if available
          if (
            data.serializedTopbarState &&
            data.settingsTopbarState &&
            barBuilderRef.current
          ) {
            barBuilderRef.current.deserializeRealTopBar(
              JSON.parse(data.serializedTopbarState)
            );
            barBuilderRef.current.deserializeTopbarSettings(
              JSON.parse(data.settingsTopbarState)
            );
          }

          if (
            data.serializedPopupState &&
            data.settingsPopupState &&
            popupBuilderRef.current
          ) {
            popupBuilderRef.current.deserializeRealPopUp(
              JSON.parse(data.serializedPopupState)
            );
            popupBuilderRef.current.deserializePopupSettings(
              JSON.parse(data.settingsPopupState)
            );
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
  }, [session, campaignId, sessionLoading, withTokenRefresh]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
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
    if (campaignData && (format === "Popup" || format === "Topbar")) {
      setCampaignData((prevData) => ({
        ...prevData!,
        format: format as "Popup" | "Topbar",
      }));
    }
  };

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
          }

          console.log("Campaign data before save:", campaignData);

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

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!campaignData) {
    return <div>{error || "Loading..."}</div>;
  }

  // Ensure that the URL is always a string before passing it to the components
  const campaignDataWithNonNullableUrl = {
    ...campaignData,
    url: campaignData.url || "", // Ensure url is a string
    startDate: campaignData.startDate || "", // Ensure startDate is a string
    closeDate: campaignData.closeDate || "", // Ensure closeDate is a string
    company: campaignData.company || "", // Ensure company is a string
  };

  return (
    <div
      className={`relative ${
        loading ? "blur-sm" : ""
      } flex-1 overflow-y-auto overflow-x-hidden`}
    >
      {loading && <LoadingOverlay />}
      <main className="p-4">
        <div className="max-w-7xl mx-auto mb-10 space-y-6">
          <p className="text-[40px] font-semibold text-left text-[#10ad1b]">
            Edit Campaign
          </p>
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center relative gap-2">
              <Link
                href="/brand/campaigns"
                className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50"
              >
                Campaigns
              </Link>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M5.75 3.5L10.25 8L5.75 12.5"
                  stroke="black"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-black/50">
                Edit Campaign
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={handleSaveChanges}
                disabled={saving} // Disable save button if saving is in progress
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600">{error}</div>}
          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <div
              className="flex justify-between items-center mb-6 cursor-pointer"
              onClick={handleToggle}
            >
              <h2 className="text-xl font-semibold text-green-500">
                Campaign Information
              </h2>
              <button className="focus:outline-none">
                <ArrowDropdownIcon isOpen={isOpen} />
              </button>
            </div>
            <hr className="border-gray-200 mb-6" />
            {isOpen ? (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <CampaignDetail
                    campaign={campaignDataWithNonNullableUrl}
                    handleChange={handleChange}
                    className="bg-white p-0 border-0 shadow-none"
                  />
                </div>
                <div className="w-full md:w-[1px] bg-gray-200" />
                <div className="flex-1">
                  <ReferralDetail
                    campaign={campaignDataWithNonNullableUrl}
                    handleChange={handleChange}
                    className="bg-white p-0 border-0 shadow-none"
                  />
                </div>
                <div className="w-full md:w-[1px] bg-gray-200" />
                <div className="flex-1">
                  <DiscountValue
                    discount={{
                      type: campaignData.discountType,
                      value: campaignData.discountValue,
                      appliesTo: campaignData.appliesTo,
                    }}
                    handleChange={handleChange}
                    className="bg-white p-0 border-0 shadow-none"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="mr-0 md:mr-10">
                    <strong>Campaign ID:</strong> {campaignData.id}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Name:</strong> {campaignData.name}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Start Date:</strong> {campaignData.startDate}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Close Date:</strong> {campaignData.closeDate}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Company:</strong> {campaignData.company}
                  </p>
                </div>
                <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0" />
                <div className="flex-1">
                  <p className="mr-0 md:mr-10">
                    <strong>Commission Type:</strong>{" "}
                    {campaignData.commissionType}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Commission:</strong> {campaignData.commission}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Campaign Terms:</strong> {campaignData.terms}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Campaign URL:</strong> {campaignData.url}
                  </p>
                </div>
                <div className="w-full md:w-[1px] bg-gray-200 my-2 md:my-0" />
                <div className="flex-1">
                  <p className="mr-0 md:mr-10">
                    <strong>Discount Type:</strong> {campaignData.discountType}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Discount Value:</strong>{" "}
                    {campaignData.discountValue}
                  </p>
                  <p className="mr-0 md:mr-10">
                    <strong>Applies To:</strong> {campaignData.appliesTo}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {isDesktop ? (
          <>
            <CampaignCreativeSelector
              className="w-full mb-10 bg-white shadow rounded-lg border border-gray-200"
              selectedFormat={campaignData.format}
              onSelect={handleFormatSelect}
            />
            {campaignData.format === "Topbar" ? (
              <BarBuilder
                ref={barBuilderRef}
                campaign={campaignDataWithNonNullableUrl}
                className="w-full bg-white shadow rounded-lg border border-gray-200"
              />
            ) : (
              <PopupBuilder
                ref={popupBuilderRef}
                campaign={campaignDataWithNonNullableUrl}
                className="w-full bg-white shadow rounded-lg border border-gray-200"
              />
            )}
          </>
        ) : (
          <DesktopCreativeHide />
        )}
        {showFundPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col gap-4">
                <p className="text-xl font-medium text-left text-[#10ad1b]">
                  4. Boost this Campaign
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">Fund Amount</label>
                    <input
                      type="number"
                      value={amountFunded}
                      onChange={(e) => setFundAmount(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded mb-4 w-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-left text-black/75">
                  Left Campaign Budget: {campaignData.amountFunded}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowFundPopup(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <StripeWrapper>
                    <PaymentForm
                      campaignId={Number(campaignId)}
                      amountFunded={amountFunded || 0}
                      oldAmount={campaignData.amountFunded || 0}
                      disabled={saving}
                    />
                  </StripeWrapper>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditCampaign;
