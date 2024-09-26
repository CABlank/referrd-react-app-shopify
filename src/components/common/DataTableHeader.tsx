import React from "react";

interface Header {
  title: string | JSX.Element;
  align?: string;
  className?: string;
}

interface DataTableHeaderProps {
  headers: {
    selectAll?: boolean;
    handleSelectAll?: () => void;
    columns: Header[];
  };
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({ headers }) => {
  return (
    <div className="lg:w-full flex items-center px-8 py-4 bg-white border-b border-gray-300 text-[#10ad1b] text-base w-[1024px]">
      {headers.selectAll !== undefined &&
        headers.handleSelectAll !== undefined && (
          <div className="w-min mr-4">
            <input
              type="checkbox"
              checked={headers.selectAll}
              onChange={headers.handleSelectAll}
            />
          </div>
        )}
      <div className="lg:w-full flex justify-evenly ">
        {headers.columns.map((header, index) => (
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
    </div>
  );
};

export default DataTableHeader;
