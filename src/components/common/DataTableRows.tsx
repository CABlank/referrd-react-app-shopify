import React from "react";

const DataTableRows = ({
  rowData,
  columns,
}: {
  rowData: any[];
  columns: any[];
}) => {
  return (
    <div>
      {rowData.map((row, index) => (
        <div
          key={index}
          className="flex justify-between items-center px-8 py-4 border-b border-gray-300 lg:w-full w-[1024px]"
        >
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`w-[10rem] lg:max-w-[140px] lg:flex-1 ${column.className || ""}`}
            >
              {column.customRender ? (
                column.customRender(row[column.dataIndex], row)
              ) : (
                <p
                  className={`w-full text-center text-${column.align || "left"}`}
                >
                  {row[column.dataIndex]}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataTableRows;
