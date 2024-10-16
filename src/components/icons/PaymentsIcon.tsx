import React from "react";
const PaymentsIcon = ({ fillColor = "black" }) => {
  const isWhite = fillColor === "white";
  return (
    <div>
      {isWhite ? (
        <svg
          width="25"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 4.25C3.27065 4.25 2.57118 4.53973 2.05546 5.05546C1.53973 5.57118 1.25 6.27065 1.25 7V17C1.25 17.7293 1.53973 18.4288 2.05546 18.9445C2.57118 19.4603 3.27065 19.75 4 19.75H20C20.7293 19.75 21.4288 19.4603 21.9445 18.9445C22.4603 18.4288 22.75 17.7293 22.75 17V9.75H6C5.80109 9.75 5.61032 9.67098 5.46967 9.53033C5.32902 9.38968 5.25 9.19891 5.25 9C5.25 8.80109 5.32902 8.61032 5.46967 8.46967C5.61032 8.32902 5.80109 8.25 6 8.25H22.75V7C22.75 6.27065 22.4603 5.57118 21.9445 5.05546C21.4288 4.53973 20.7293 4.25 20 4.25H4Z"
            fill="white"
          />
        </svg>
      ) : (
        <svg
          width="25"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
        >
          <path
            d="M22 9V17C22 17.5304 21.7893 18.0391 21.4142 18.4142C21.0391 18.7893 20.5304 19 20 19H4C3.46957 19 2.96086 18.7893 2.58579 18.4142C2.21071 18.0391 2 17.5304 2 17V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V9ZM22 9H6"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default PaymentsIcon;
