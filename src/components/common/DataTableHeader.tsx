import React from "react";

const DataTableHeader = ({ headers }: { headers: any[] }) => {
  return (
    <div className="lg:w-full flex justify-between px-8 py-4 bg-white border-b border-gray-300 text-[#10ad1b] text-base w-[1024px]">
      {headers.map((header, index) => (
        <div
          key={index}
          className={`w-[10rem] lg:max-w-[125px] lg:flex-1 ${header.className || ""}`}
        >
          <p
            className={`w-full text-base font-bold text-${header.align || "left"}`}
          >
            {header.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DataTableHeader;
