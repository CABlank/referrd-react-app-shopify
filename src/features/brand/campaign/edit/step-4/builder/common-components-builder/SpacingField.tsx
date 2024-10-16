import React, { useState } from "react";

interface SpacingFieldProps {
  label: string;
  name: string;
  type: "margin" | "padding";
  value: { [key: string]: string };
  onChange: (updatedValues: { [key: string]: string }) => void;
}

const spacingValues = {
  margin: {
    S: {
      marginTop: "0px",
      marginRight: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
    },
    M: {
      marginTop: "8px",
      marginRight: "8px",
      marginBottom: "8px",
      marginLeft: "8px",
    },
    L: {
      marginTop: "12px",
      marginRight: "16px",
      marginBottom: "12px",
      marginLeft: "16px",
    },
  },
  padding: {
    S: {
      paddingTop: "4px",
      paddingRight: "16px",
      paddingBottom: "4px",
      paddingLeft: "16px",
    },
    M: {
      paddingTop: "8px",
      paddingRight: "24px",
      paddingBottom: "8px",
      paddingLeft: "24px",
    },
    L: {
      paddingTop: "9px",
      paddingRight: "24px",
      paddingBottom: "9px",
      paddingLeft: "24px",
    },
  },
};

const SpacingField: React.FC<SpacingFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
}) => {
  const [selectedSize, setSelectedSize] =
    useState<keyof typeof spacingValues.margin>("L");

  const handleSizeChange = (size: keyof typeof spacingValues.margin) => {
    setSelectedSize(size);
    const newValue = spacingValues[type][size];
    onChange(newValue);
  };

  const currentSpacingValues = spacingValues[type][selectedSize];

  return (
    <div className="flex justify-between items-start self-stretch flex-grow-0 flex-shrink-0 relative">
      <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-black/50">
        {label}
      </p>
      <div className="flex flex-col justify-start items-end flex-grow-0 flex-shrink-0 w-[139px] gap-4">
        <div className="flex justify-end items-center self-stretch flex-grow-0 flex-shrink-0 gap-2">
          {(["S", "M", "L"] as const).map((size) => (
            <div
              key={size}
              className={`flex flex-col justify-center items-center flex-grow h-9 relative overflow-hidden gap-2.5 px-0.5 py-[3px] rounded-lg border-[0.5px] cursor-pointer ${
                selectedSize === size
                  ? "bg-[#10ad1b]/5 border-[#10ad1b]"
                  : "border-black/30"
              }`}
              onClick={() => handleSizeChange(size)}
            >
              <p
                className={`flex-grow-0 flex-shrink-0 text-base text-left ${
                  selectedSize === size ? "text-[#10ad1b]" : "text-black/50"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="hidden relative flex justify-center items-center w-full h-[69px] gap-2 rounded-lg border-[0.5px] border-black/30">
          {Object.keys(currentSpacingValues).map((key) => (
            <p
              key={key}
              className={`absolute ${
                key.includes("Top")
                  ? "top-0"
                  : key.includes("Bottom")
                    ? "bottom-0"
                    : key.includes("Left")
                      ? "left-0"
                      : "right-0"
              } ${
                key.includes("Top") || key.includes("Bottom")
                  ? "left-1/2 transform -translate-x-1/2 mt-1 mb-1"
                  : "top-1/2 transform -translate-y-1/2 ml-1 mr-1"
              } text-xs font-medium text-black/50`}
            >
              {parseInt(
                value[key as keyof typeof currentSpacingValues] ||
                  currentSpacingValues[key as keyof typeof currentSpacingValues]
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpacingField;
