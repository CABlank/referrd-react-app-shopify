import React from "react";

const DesktopCreativeHide = () => {
  return (
    <div className="flex flex-col justify-center items-center w-[361px] relative gap-8 p-4 rounded-2xl bg-white">
      <div className="flex flex-col justify-between items-start self-stretch flex-grow-0 flex-shrink-0 h-3.5">
        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
          <p className="flex-grow-0 flex-shrink-0 text-xl text-left text-[#10ad1b]">
            <span className="flex-grow-0 flex-shrink-0 text-xl text-left text-[#10ad1b]">
              Campaign
            </span>
            <span className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-[#10ad1b]">
              {" "}
              Creative
            </span>
          </p>
        </div>
      </div>
      <svg
        width={329}
        height={1}
        viewBox="0 0 329 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="self-stretch flex-grow-0 flex-shrink-0"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="0.25"
          y1="0.75"
          x2="328.75"
          y2="0.75"
          stroke="#B3B3B3"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
        <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-left text-[#851087]">
          Builder only available on desktop
        </p>
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4">
          <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 opacity-25 gap-4 p-4 rounded-lg border-[0.5px] border-black/30">
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[67.5px] w-[76.5px] relative gap-[2.5px] p-[5px] rounded bg-neutral-200">
              <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-[2.5px]">
                <div className="flex-grow-0 flex-shrink-0 w-[7px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
                <div className="flex-grow-0 flex-shrink-0 w-[57px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
              </div>
              <div className="flex-grow-0 flex-shrink-0 w-[66.5px] h-[49px] rounded-[1px] bg-[#b7b6b6] flex justify-center items-center">
                <div className="w-[56.5px] h-[28.5px] rounded-[1px] bg-[#5c5c5c]" />
              </div>
            </div>
            <div className="flex flex-col justify-end items-start flex-grow relative gap-4">
              <p className="self-stretch flex-grow-0 flex-shrink-0 w-[204.5px] text-xl font-medium text-left text-black/80">
                Popup
              </p>
              <p className="self-stretch flex-grow-0 flex-shrink-0 w-[204.5px] text-base text-left text-black/50">
                Grab your visitors’ attention with a striking popup.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 opacity-25 gap-4 p-4 rounded-lg border-[0.5px] border-black/30">
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[67.5px] w-[76.5px] relative gap-[2.5px] p-[5px] rounded bg-neutral-200">
              <div className="flex-grow-0 flex-shrink-0 w-[66.5px] h-1.5 rounded-[1px] bg-[#5c5c5c]" />
              <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-[2.5px]">
                <div className="flex-grow-0 flex-shrink-0 w-[7px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
                <div className="flex-grow-0 flex-shrink-0 w-[57px] h-1.5 rounded-[1px] bg-[#b7b6b6]" />
              </div>
              <div className="flex-grow-0 flex-shrink-0 w-[66.5px] h-[40.5px] rounded-[1px] bg-[#b7b6b6]" />
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative gap-4">
              <p className="self-stretch flex-grow-0 flex-shrink-0 w-[204.5px] text-xl font-medium text-left text-black/80">
                Bar
              </p>
              <p className="self-stretch flex-grow-0 flex-shrink-0 w-[204.5px] text-base text-left text-black/50">
                Display an unobtrusive message at the top or bottom of your
                site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopCreativeHide;
