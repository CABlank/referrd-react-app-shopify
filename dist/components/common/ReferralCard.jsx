import React from "react";
import Link from "next/link";
import ArrowSeeMoreIcon from "../Icons/ArrowSeeMoreIcon";
import MoneyIconReferrals from "../Icons/MoneyIconReferrals";
var ReferralCard = function (_a) {
    var data = _a.data;
    return (<div className="flex flex-col overflow-hidden gap-2 rounded-2xl bg-white w-full">
      <Header />
      <div className="1">
        {data.map(function (item, index) { return (<React.Fragment key={index}>
            <ReferralItem {...item}/>
            {index < data.length - 1 && (<hr className="w-full border-t border-black/15 my-4"/>)}
          </React.Fragment>); })}
      </div>
    </div>);
};
var Header = function () { return (<>
    <div className="flex justify-between items-center w-full mb-2">
      <p className="text-2xl font-medium text-[#10ad1b]">Referrals</p>
      <Link href="/brand/referrals" passHref>
        <div className="flex items-center gap-1 cursor-pointer">
          <p className="text-base font-medium text-[#851087]/80">See More</p>
          <ArrowSeeMoreIcon />
        </div>
      </Link>
    </div>
    <hr className="w-full border-t border-black/15 mb-4"/>
  </>); };
var ReferralItem = function (_a) {
    var name = _a.name, location = _a.location, email = _a.email, date = _a.date;
    return (<div className="flex justify-between items-start w-full">
    <div className="flex items-center gap-4">
      <Avatar />
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-black">{name}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1 w-[150px]">
      <p className="text-sm text-black/50">{date}</p>
    </div>
  </div>);
};
var Avatar = function () { return (<div className="flex items-center justify-center h-12 w-12 bg-[#851087]/[0.15] rounded-full">
    <MoneyIconReferrals />
  </div>); };
export default ReferralCard;
