import React, { useEffect, useState, useRef } from "react";
import { useSession } from "../../../context/SessionContext";
import { usePayments } from "@/features/customer/payments/hooks/usePayments";
import { useRouter } from "next/router";
import Spinner from "@/components/common/Spinner";

const BudgetLeft: React.FC = () => {
  const { session } = useSession();
  const [totalPending, setTotalPending] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const { payments, loading, error } = usePayments(session?.accessToken);
  const loadExecutedRef = useRef(false);
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    const calculatePayments = () => {
      const pendingPaymentsTotal = payments
        .filter((payment) => payment.status === "Pending")
        .reduce((total, payment) => total + (payment.referralCashback || 0), 0);

      const paidPaymentsTotal = payments
        .filter((payment) => payment.status === "Approved")
        .reduce((total, payment) => total + (payment.referralCashback || 0), 0);

      setTotalPending(pendingPaymentsTotal);
      setTotalPaid(paidPaymentsTotal);
    };

    if (!loading && !loadExecutedRef.current) {
      calculatePayments();
      loadExecutedRef.current = true;
    }
  }, [payments, loading]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Function to handle redirection
  const handleRedirect = () => {
    router.push("/customer/payments");
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-4 px-4 py-2 rounded-[32px] bg-[#851087]/5 border border-[#851087]/25">
      {/* Paid Total (Clickable) */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={handleRedirect}>
        <div className="flex items-center justify-center px-6 py-1 bg-[#10AD0B] text-white rounded-full">
          {/* Non-circle (pill-shaped) */}
          <p className="text-base font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        <p className="text-sm md:text-base font-medium text-green-600 whitespace-nowrap">Paid</p>
      </div>

      {/* Pending Total (Clickable) */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={handleRedirect}>
        <div className="flex items-center justify-center px-6 py-1 bg-yellow-500 text-white rounded-full">
          {/* Non-circle (pill-shaped) */}
          <p className="text-base font-bold">${totalPending.toFixed(2)}</p>
        </div>
        <p className="text-sm md:text-base font-medium text-yellow-600 whitespace-nowrap">
          Pending
        </p>
      </div>
    </div>
  );
};

export default BudgetLeft;
