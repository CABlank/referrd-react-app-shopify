import React from "react";
var DataTableRows = function (_a) {
    var rowData = _a.rowData, columns = _a.columns;
    return (<div>
      {rowData.map(function (row, index) { return (<div key={index} className="flex justify-between items-center px-8 py-4 border-b border-gray-300 lg:w-full w-[1024px]">
          {columns.map(function (column, colIndex) { return (<div key={colIndex} className={"w-[10rem] lg:max-w-[135px] lg:flex-1 ".concat(column.className || "")}>
              {column.customRender ? (column.customRender(row[column.dataIndex], row)) : (<p className={"w-full text-center text-".concat(column.align || "left")}>
                  {row[column.dataIndex]}
                </p>)}
            </div>); })}
        </div>); })}
    </div>);
};
export default DataTableRows;
