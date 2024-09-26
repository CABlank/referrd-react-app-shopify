import React, { useEffect, useState, useRef } from "react";
import { fetchCampaigns, Campaign } from "../../../services/campaign/campaign";
import { useSession } from "../../../context/SessionContext";

const BudgetLeft: React.FC = () => {
  const { session, withTokenRefresh } = useSession();
  const [totalBudgetLeft, setTotalBudgetLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadExecutedRef = useRef(false);

  useEffect(() => {
    const calculateTotalBudgetLeft = async () => {
      if (session?.accessToken && !loadExecutedRef.current) {
        setLoading(true);
        loadExecutedRef.current = true;
        try {
          const campaigns: Campaign[] = await withTokenRefresh((token) =>
            fetchCampaigns(token)
          );

          const totalAmountFunded = campaigns.reduce(
            (total, campaign) => total + (campaign.amountFunded || 0),
            0
          );

          setTotalBudgetLeft(totalAmountFunded);
        } catch (error) {
          console.error("Failed to fetch campaigns", error);
          setError("Failed to fetch campaigns. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    calculateTotalBudgetLeft();
  }, [session, withTokenRefresh]);

  if (loading) {
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className=" flex flex-wrap items-center gap-2 md:gap-4 px-2 md:px-4 py-2 rounded-[32px] bg-[#851087]/5 border border-[#851087]/25">
      <p className="text-xs lg:text-base md:text-sm font-medium text-[#851087]">
        Total Budget Available
      </p>
      <p className="text-xs md:text-sm font-bold text-[#851087]">
        ${totalBudgetLeft.toFixed(2)}
      </p>
    </div>
  );
};

export default BudgetLeft;
