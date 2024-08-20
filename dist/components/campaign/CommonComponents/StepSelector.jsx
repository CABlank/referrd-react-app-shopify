import React from "react";
var StepSelector = function (_a) {
    var step = _a.step, setStep = _a.setStep;
    return (<div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 p-4">
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2">
        <div onClick={function () { return setStep(1); }} className={"flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 rounded-[100px] px-0 py-0 cursor-pointer ".concat(step === 1 ? "bg-[#10ad1b]/[0.15]" : "bg-[#a8a8a8]/[0.15]")}>
          <p className={"flex-grow-0 flex-shrink-0 w-[66px] h-6 text-sm font-medium content-center text-center ".concat(step === 1 ? "text-[#10ad1b]" : "text-[#a8a8a8]")}>
            Step 1
          </p>
        </div>
        <div className="flex-grow-0 flex-shrink-0 w-[89px] h-[2px] bg-[#a8a8a8]"/>
        <div onClick={function () { return setStep(2); }} className={"flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 rounded-[100px] px-0 py-0 cursor-pointer ".concat(step === 2 ? "bg-[#10ad1b]/[0.15]" : "bg-[#a8a8a8]/[0.15]")}>
          <p className={"flex-grow-0 flex-shrink-0 w-[66px] h-6 text-sm font-medium content-center text-center ".concat(step === 2 ? "text-[#10ad1b]" : "text-[#a8a8a8]")}>
            Step 2
          </p>
        </div>
      </div>
    </div>);
};
export default StepSelector;
