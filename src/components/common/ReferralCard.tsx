import React from "react";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter for query params
import ArrowSeeMoreIcon from "../icons/ArrowSeeMoreIcon";
import MoneyIconReferrals from "../icons/MoneyIconReferrals";

interface ReferralItemProps {
  name: string;
  location: string;
  email: string;
  date: string;
}

interface ReferralCardProps {
  data: ReferralItemProps[];
}

const ReferralCard: React.FC<ReferralCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col overflow-hidden gap-2 rounded-2xl bg-white w-full">
      <Header />
      <div className="1">
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <ReferralItem {...item} />
            {index < data.length - 1 && <hr className="w-full border-t border-black/15 my-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const router = useRouter(); // Use useRouter to access query parameters
  const { shop, host, id_token } = router.query; // Extract existing query parameters

  // Determine if we are in a Shopify environment
  const isShopifyStore = Boolean(shop || host || id_token);

  return (
    <>
      <div className="flex justify-between items-center w-full mb-2">
        <p className="text-2xl font-medium text-[#10ad1b]">Referrals</p>

        {/* Conditionally hide the 'See More' button if on Shopify */}
        {!isShopifyStore && (
          <Link href="/brand/referrals" passHref>
            <div className="flex items-center gap-1 cursor-pointer">
              <p className="text-base font-medium text-[#851087]/80">See More</p>
              <ArrowSeeMoreIcon />
            </div>
          </Link>
        )}
      </div>
      <hr className="w-full border-t border-black/15 mb-4" />
    </>
  );
};

const ReferralItem: React.FC<ReferralItemProps> = ({ name, location, email, date }) => (
  <div className="flex justify-between items-start w-full">
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
  </div>
);

const Avatar: React.FC = () => (
  <div className="flex items-center justify-center h-12 w-12 bg-[#851087]/[0.15] rounded-full">
    <MoneyIconReferrals />
  </div>
);

export default ReferralCard;
