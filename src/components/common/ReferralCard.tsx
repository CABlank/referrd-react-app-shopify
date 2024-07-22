import React from "react";
import ArrowSeeMoreIcon from "../Icons/ArrowSeeMoreIcon";
import MoneyIconReferrals from "../Icons/MoneyIconReferrals";

interface ReferralItemProps {
  name: string;
  test: string;
  code: string;
  date: string;
}

interface ReferralCardProps {
  data: ReferralItemProps[];
}

const ReferralCard: React.FC<ReferralCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col overflow-hidden gap-4 rounded-2xl bg-white w-full">
      <div className="flex justify-between items-start w-full">
        <p className="text-2xl font-medium text-[#10ad1b]">Referrals</p>
        <div className="flex items-center gap-2">
          <p className="text-base font-medium text-[#851087]/80">See More</p>
          <ArrowSeeMoreIcon />
        </div>
      </div>
      <hr className="w-full border-t border-black/15" />
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <ReferralItem {...item} />
          {index < data.length - 1 && (
            <hr className="w-full border-t border-black/15" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ReferralItem: React.FC<ReferralItemProps> = ({
  name,
  test,
  code,
  date,
}) => (
  <div className="flex justify-between items-start w-full">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center h-12 w-12 bg-[#851087]/[0.15] rounded-full">
        <MoneyIconReferrals />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-base font-medium text-black/80">{name}</p>
        <div className="flex items-center gap-4">
          <p className="text-base text-black/80">{test}</p>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1  w-[150px]">
      <p className="text-sm text-[#851087] text-right">{code}</p>
      <p className="text-sm text-black/50">{date}</p>
    </div>
  </div>
);

export default ReferralCard;
