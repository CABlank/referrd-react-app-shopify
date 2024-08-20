import React from "react";
var DataTableRows = function (_a) {
    var rowData = _a.rowData, columns = _a.columns, selectable = _a.selectable, handleCheckboxChange = _a.handleCheckboxChange, selectedPayments = _a.selectedPayments;
    return (<div>
      {rowData.map(function (row, index) { return (<div key={index} className="flex items-center px-8 py-4 border-b border-gray-300 lg:w-full w-[1024px]">
          {selectable && handleCheckboxChange && (<div className="w-min mr-4">
              <input type="checkbox" checked={(selectedPayments === null || selectedPayments === void 0 ? void 0 : selectedPayments.includes(row.id)) || false} onChange={function (e) { return handleCheckboxChange(row.id, e.target.checked); }}/>
            </div>)}
          <div className="lg:w-full flex justify-between">
            {columns.map(function (column, colIndex) { return (<div key={colIndex} className={"w-[10rem] lg:max-w-[140px] lg:flex-1 ".concat(column.className || "")}>
                {column.customRender ? (column.customRender(row[column.dataIndex], row)) : (<p className={"w-full text-center text-".concat(column.align || "left")}>
                    {row[column.dataIndex]}
                  </p>)}
              </div>); })}
          </div>
        </div>); })}
    </div>);
};
export default DataTableRows;
