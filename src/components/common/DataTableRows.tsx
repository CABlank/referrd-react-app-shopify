import React from "react";

const DataTableRows = ({
  rowData,
  columns,
  selectable,
  handleCheckboxChange,
  selectedPayments,
}: {
  rowData: any[];
  columns: any[];
  selectable?: boolean;
  handleCheckboxChange?: (id: number, checked: boolean) => void;
  selectedPayments?: number[];
}) => {
  return (
    <div>
      {rowData.map((row, index) => (
        <div
          key={index}
          className="flex items-center px-8 py-4 border-b border-gray-300 lg:w-full w-[1024px]"
        >
          {selectable && handleCheckboxChange && (
            <div className="w-min mr-4">
              <input
                type="checkbox"
                checked={selectedPayments?.includes(row.id) || false}
                onChange={(e) => handleCheckboxChange(row.id, e.target.checked)}
              />
            </div>
          )}
          <div className="lg:w-full flex justify-evenly">
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className={`w-[10rem] lg:max-w-[140px] lg:flex-1 ${column.className || ""}`}
              >
                {column.customRender ? (
                  column.customRender(row[column.dataIndex], row)
                ) : (
                  <p
                    className={`w-full text-center text-xs text-${column.align || "left"}`}
                  >
                    {row[column.dataIndex]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataTableRows;
