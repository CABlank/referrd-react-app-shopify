import React from "react";

interface ExpandableInputProps {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isExpanded: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const ExpandableInput: React.FC<ExpandableInputProps> = ({
  type,
  value,
  placeholder,
  onChange,
  isExpanded,
  onFocus,
  onBlur,
}) => {
  return (
    <div
      className={`flex items-center h-10 relative gap-2.5 p-2 rounded-lg bg-white border-[0.5px] w-full ${
        isExpanded ? "border-blue-500" : "border-black/30"
      } transition-all duration-200`}
    >
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex-grow text-sm text-left text-black placeholder-black/50 p-2 outline-none"
      />
    </div>
  );
};

export default ExpandableInput;
