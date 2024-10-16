import React from "react";

const EmailIcon = ({ color = "#F8F8F8" }) => {
  return (
    <svg
      width={15}
      height={12}
      viewBox="0 0 15 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M14.1673 1.99996C14.1673 1.26663 13.5673 0.666626 12.834 0.666626H2.16732C1.43398 0.666626 0.833984 1.26663 0.833984 1.99996V9.99996C0.833984 10.7333 1.43398 11.3333 2.16732 11.3333H12.834C13.5673 11.3333 14.1673 10.7333 14.1673 9.99996V1.99996ZM12.834 1.99996L7.50065 5.33329L2.16732 1.99996H12.834ZM12.834 9.99996H2.16732V3.33329L7.50065 6.66663L12.834 3.33329V9.99996Z"
        fill={color}
      />
    </svg>
  );
};

export default EmailIcon;
