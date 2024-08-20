import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import BarBuilder from "../../../components/campaign/BarBuilder/MainBarBuilder/BarBuilder";
import PopupBuilder from "../../../components/campaign/PopupBuilder/MainPopupBuilder/PopupBuilder";
import CampaignCreativeSelector from "../../../components/campaign/CampaignCreativeSelector";
import {
  fetchCampaign,
  updateCampaign,
  Campaign,
} from "../../../services/campaign/campaign";
import { fetchCompanyUrl } from "../../../services/company/company";
import { useSession } from "../../../context/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import Spinner from "../../../components/common/Spinner";
import DesktopCreativeHide from "@/components/campaign/DesktopCreativeHide";
import initialLoadChecker from "../../../utils/middleware/initialLoadChecker";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import FundCampaignModal from "../../../components/campaign/FundCampaignModal";
import CampaignInformation from "../../../components/campaign/CampaignInformation";
import CampaignHeader from "../../../components/campaign/CampaignHeader";
import CampaignPayment from "../../../components/campaign/CampaignPayment";
import PushCampaignLive from "../../../components/campaign/PushCampaignLive";

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

const EditCampaign: React.FC<CampaignEditProps> = ({
  accessToken,
  refreshToken,
  userId,
}) => {
  const { session, loading: sessionLoading, withTokenRefresh } = useSession();
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };
  const [isOpen, setIsOpen] = useState(true);
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const [companyUrl, setCompanyUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);
  const barBuilderRef = useRef<any>(null);
  const popupBuilderRef = useRef<any>(null);
  const isDesktop = useIsDesktop();

  const [showFundPopup, setShowFundPopup] = useState(false);
  const [amountFunded, setFundAmount] = useState<number>(1000);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (
        (session?.token || accessToken) &&
        campaignId &&
        !loadExecutedRef.current
      ) {
        setLoading(true);
        loadExecutedRef.current = true;
        try {
          const data = await withTokenRefresh(
            (token) => fetchCampaign(Number(campaignId), token),
            refreshToken
          );

          const url = await withTokenRefresh(
            (token) => fetchCompanyUrl(token),
            refreshToken
          );
          setCompanyUrl(url);

          setCampaignData({
            ...data,
            startDate: data.startDate
              ? new Date(data.startDate).toISOString().split("T")[0]
              : "",
            closeDate: data.closeDate
              ? new Date(data.closeDate).toISOString().split("T")[0]
              : "",
            company: url,
          });

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
  }, [
    session,
    accessToken,
    refreshToken,
    campaignId,
    sessionLoading,
    withTokenRefresh,
  ]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handlePaymentSuccess = () => {
    router.push(`/brand/campaigns/edit?campaignId=${campaignId}`);
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
    setSaving(true);

    if (campaignData) {
      try {
        if (session?.token || accessToken) {
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

            const compiledHtml = barBuilderRef.current.getCompiledHtml();
            campaignData.compiledHtml = JSON.stringify(compiledHtml);
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
            campaignData.compiledHtml = JSON.stringify(compiledHtml);
          }

          await withTokenRefresh(async (token) => {
            await updateCampaign(campaignData, token);
          }, refreshToken);

          setShowFundPopup(true);
        }
      } catch (error) {
        console.error("Failed to save data", error);
        setError("Failed to save data. Please communicate with support.");
      } finally {
        setLoading(false);
        setSaving(false);
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
          />

          {error && <div className="text-red-600">{error}</div>}

          <CampaignInformation
            isOpen={isOpen}
            handleToggle={handleToggle}
            campaignData={campaignDataWithNonNullableUrl}
            handleChange={handleChange}
          />
        </div>
        {isDesktop ? (
          <>
            <CampaignCreativeSelector
              className="w-full mb-10 bg-white shadow rounded-lg border border-gray-200"
              selectedFormat={campaignData.format}
              onSelect={handleFormatSelect}
            >
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
            </CampaignCreativeSelector>
          </>
        ) : (
          <DesktopCreativeHide />
        )}
        {showFundPopup && (
          <FundCampaignModal
            token={session?.token ?? ""}
            amountFunded={amountFunded}
            setFundAmount={setFundAmount}
            setShowFundPopup={setShowFundPopup}
            saving={saving}
            campaignId={campaignId}
            oldAmountFunded={campaignData.amountFunded || 0}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        <CampaignPayment
          campaignId={Number(campaignId)}
          token={session?.token ?? ""}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <PushCampaignLive
          campaignId={campaignData.id!}
          token={session?.token!}
          currentStatus={campaignData.status as "Live" | "Draft" | "Ended"}
        />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CampaignEditProps> = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CampaignEditProps>> => {
  const result = await initialLoadChecker(context);

  if ("redirect" in result || "notFound" in result) {
    return result;
  }

  if (!("props" in result)) {
    return {
      props: {
        title: "Edit Campaign",
      },
    };
  }

  return {
    props: {
      ...result.props,
      title: "Edit Campaign",
    },
  };
};

export default EditCampaign;
